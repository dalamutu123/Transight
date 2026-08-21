import { parse } from 'fast-csv';
import { Readable } from 'stream';
import { Prisma } from '../../../generated/prisma/client';
import { AppError } from '@utils/AppError';
import { buildPagination } from '@utils/apiResponse';
import { uploadsRepository } from './uploads.repository';
import { auditService } from '@modules/audit/audit.service';
import { csvRowSchema } from './uploads.validation';
import type { AdminAllUploadsQuery } from './uploads.validation';

interface ParsedCsvResult {
  rawRows: Record<string, string>[];
}

function parseCsvBuffer(buffer: Buffer): Promise<ParsedCsvResult> {
  return new Promise((resolve, reject) => {
    const rawRows: Record<string, string>[] = [];

    Readable.from(buffer)
      .pipe(parse({ headers: true, trim: true, ignoreEmpty: true }))
      .on('data', (row) => rawRows.push(row))
      .on('error', reject)
      .on('end', () => resolve({ rawRows }));
  });
}

// Collapses a header to a comparable key: lowercase, no spaces/underscores/dashes.
export function normalizeHeaderKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s_-]+/g, '');
}

const FIELD_ALIASES: Record<string, string[]> = {
  reference: ['reference', 'transactionreference', 'txnreference', 'ref'],
  transactionDate: ['transactiondate', 'date', 'txndate'],
  amount: ['amount'],
  currency: ['currency'],
  customerAccount: ['customeraccount', 'account', 'accountnumber', 'customeraccountnumber'],
  bankCode: ['bankcode', 'bank'],
  transactionType: ['transactiontype', 'type', 'txntype'],
  responseCode: ['responsecode', 'code'],
  responseDescription: ['responsedescription', 'description', 'responsedesc'],
  status: ['status', 'transactionstatus'],
};

export function normalizeRow(row: Record<string, string>): Record<string, string | undefined> {
  const normalizedEntries = new Map<string, string>();
  for (const [key, value] of Object.entries(row)) {
    normalizedEntries.set(normalizeHeaderKey(key), value);
  }

  const result: Record<string, string | undefined> = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const matchedAlias = aliases.find((alias) => normalizedEntries.has(alias));
    result[field] = matchedAlias ? normalizedEntries.get(matchedAlias) : undefined;
  }

  return result;
}

export const uploadsService = {
  async processCsv(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw AppError.badRequest('No file was uploaded');
    }

    const { rawRows } = await parseCsvBuffer(file.buffer);

    if (rawRows.length === 0) {
      throw AppError.badRequest('The uploaded CSV file is empty');
    }

    const upload = await uploadsRepository.createUpload({
      filename: file.originalname,
      uploadedBy: userId,
    });

    const [banks, statuses] = await Promise.all([
      uploadsRepository.getAllBanks(),
      uploadsRepository.getAllStatuses(),
    ]);
    const bankCodeMap = new Map(banks.map((b) => [b.code, b.id]));
    const statusNameMap = new Map(statuses.map((s) => [s.name, s.id]));

    const validTransactions: Prisma.TransactionUncheckedCreateInput[] = [];
    const rejectedRows: Prisma.RejectedTransactionUncheckedCreateInput[] = [];
    const seenReferencesInFile = new Set<string>();

    const candidateRefs = rawRows
      .map((r) => normalizeRow(r).reference)
      .filter((ref): ref is string => Boolean(ref));
    const existing = await uploadsRepository.findExistingReferences(candidateRefs);
    const existingRefSet = new Set(existing.map((e) => e.reference));

    rawRows.forEach((row, index) => {
      const rowNumber = index + 2;

      const normalized = normalizeRow(row);
      const parsedRow = csvRowSchema.safeParse(normalized);

      if (!parsedRow.success) {
        rejectedRows.push({
          uploadId: upload.id,
          rawRowNumber: rowNumber,
          rawData: row,
          reason: parsedRow.error.issues.map((e) => e.message).join('; '),
        });
        return;
      }

      const data = parsedRow.data;

      if (existingRefSet.has(data.reference) || seenReferencesInFile.has(data.reference)) {
        rejectedRows.push({
          uploadId: upload.id,
          rawRowNumber: rowNumber,
          rawData: row,
          reason: `Duplicate transaction reference: ${data.reference}`,
        });
        return;
      }

      const bankId = bankCodeMap.get(data.bankCode);
      if (!bankId) {
        rejectedRows.push({
          uploadId: upload.id,
          rawRowNumber: rowNumber,
          rawData: row,
          reason: `Unknown bank code: ${data.bankCode}`,
        });
        return;
      }

      const statusId = statusNameMap.get(data.status);
      if (!statusId) {
        rejectedRows.push({
          uploadId: upload.id,
          rawRowNumber: rowNumber,
          rawData: row,
          reason: `Unknown transaction status: ${data.status}`,
        });
        return;
      }

      seenReferencesInFile.add(data.reference);

      validTransactions.push({
        reference: data.reference,
        transactionDate: data.transactionDate,
        amount: data.amount,
        currency: data.currency.toUpperCase(),
        customerAccount: data.customerAccount,
        bankId,
        transactionType: data.transactionType,
        responseCode: data.responseCode,
        responseDescription: data.responseDescription,
        statusId,
        uploadId: upload.id,
      });
    });

    await uploadsRepository.createTransactionsAndRejections(validTransactions, rejectedRows);

    const updatedUpload = await uploadsRepository.updateUploadSummary(upload.id, {
      totalRecords: rawRows.length,
      successfulRecords: validTransactions.length,
      rejectedRecords: rejectedRows.length,
      status: 'Completed',
    });

    await auditService.record({
      userId,
      action: 'UPLOAD_CSV',
      description: `Uploaded ${file.originalname}: ${validTransactions.length} accepted, ${rejectedRows.length} rejected`,
    });

    return {
      upload: updatedUpload,
      summary: {
        totalRecords: rawRows.length,
        successfulRecords: validTransactions.length,
        rejectedRecords: rejectedRows.length,
      },
      rejected: rejectedRows.map((r) => ({ row: r.rawRowNumber, reason: r.reason })),
    };
  },

  async getHistory(page: number, limit: number, userId?: string) {
    const { items, total } = await uploadsRepository.findHistory(page, limit, userId);
    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getById(id: string) {
    const upload = await uploadsRepository.findById(id);
    if (!upload) {
      throw AppError.notFound('Upload not found');
    }
    return upload;
  },

  async getRejectedRecords(uploadId: string) {
    await this.getById(uploadId);
    return uploadsRepository.findRejectedByUploadId(uploadId);
  },

  async getUploaders() {
    return uploadsRepository.getUploaders();
  },

  async getAdminDirectory(search?: string) {
    const users = await uploadsRepository.getUserDirectoryWithUploadCounts(search);
    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role.name,
      isActive: u.isActive,
      uploadCount: u._count.uploads,
    }));
  },

  async getUserUploadHistory(userId: string, page: number, limit: number) {
    const { items, total } = await uploadsRepository.findByUserId(userId, page, limit);
    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getAllForAdmin(filters: AdminAllUploadsQuery) {
    const { items, total } = await uploadsRepository.findAllForAdmin(filters);
    return { items, pagination: buildPagination(filters.page, filters.limit, total) };
  },
};