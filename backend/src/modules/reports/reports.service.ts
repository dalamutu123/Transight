import ExcelJS from 'exceljs';
import { format as formatCsv, parse } from 'fast-csv';
import { PassThrough, Readable } from 'stream';
import { maskAccountNumber } from '@utils/mask';
import { buildPagination } from '@utils/apiResponse';
import { AppError } from '@utils/AppError';
import { reportsRepository } from './reports.repository';
import { auditService } from '@modules/audit/audit.service';
import type { GenerateReportInput } from './reports.validation';

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function parseCsvBufferToRows(buffer: Buffer): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const rows: Record<string, string>[] = [];
    Readable.from(buffer)
      .pipe(parse({ headers: true, trim: true, ignoreEmpty: true }))
      .on('data', (row) => rows.push(row))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

interface ReportRecord {
  id: string;
  type: string;
  format: string;
  filters: unknown;
  fileName: string | null;
  createdAt: Date;
  generatedByUser: { firstName: string; lastName: string; email: string };
}

function serializeReport(report: ReportRecord) {
  return {
    id: report.id,
    type: report.type,
    format: report.format,
    filters: report.filters,
    fileName: report.fileName ?? `transight-report.${report.format === 'CSV' ? 'csv' : 'xlsx'}`,
    createdAt: report.createdAt,
    generatedByUser: report.generatedByUser,
  };
}

export const reportsService = {
  async generate(input: GenerateReportInput, userId: string) {
    const transactions = await reportsRepository.findTransactionsForReport(input.filters);

    const rows = transactions.map((tx) => ({
      Reference: tx.reference,
      Date: tx.transactionDate.toISOString().split('T')[0],
      Amount: tx.amount.toString(),
      Currency: tx.currency,
      CustomerAccount: maskAccountNumber(tx.customerAccount),
      Bank: tx.bank.code,
      Type: tx.transactionType,
      ResponseCode: tx.responseCode,
      Status: tx.status.name,
    }));

    let buffer: Buffer;
    let contentType: string;
    let fileExtension: string;

    if (input.format === 'CSV') {
      const csvStream = formatCsv({ headers: true });
      const pass = new PassThrough();
      csvStream.pipe(pass);
      rows.forEach((row) => csvStream.write(row));
      csvStream.end();
      buffer = await streamToBuffer(pass);
      contentType = 'text/csv';
      fileExtension = 'csv';
    } else {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Transactions');

      if (rows.length > 0) {
        sheet.columns = Object.keys(rows[0]).map((key) => ({ header: key, key, width: 20 }));
        sheet.addRows(rows);
      } else {
        sheet.addRow(['No records match the selected filters']);
      }

      buffer = Buffer.from(await workbook.xlsx.writeBuffer());
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileExtension = 'xlsx';
    }

    const fileName = `transight-report-${Date.now()}.${fileExtension}`;

    const report = await reportsRepository.createReportRecord({
      type: 'transaction-summary',
      filters: input.filters,
      format: input.format,
      generatedBy: userId,
      fileName,
      contentType,
      fileContent: new Uint8Array(buffer),
    });

    await auditService.record({
      userId,
      action: 'GENERATE_REPORT',
      description: `Generated ${input.format} report with ${rows.length} records`,
    });

    return {
      report: serializeReport(report),
      rows: input.format === 'CSV' ? rows : [],
      previewAvailable: input.format === 'CSV',
    };
  },

  async getPreview(id: string) {
    const report = await reportsRepository.findById(id);
    if (!report || !report.fileContent) {
      throw AppError.notFound('Report not found');
    }

    const previewAvailable = report.contentType === 'text/csv';
    const rows = previewAvailable ? await parseCsvBufferToRows(Buffer.from(report.fileContent)) : [];

    return {
      report: serializeReport(report),
      rows,
      previewAvailable,
    };
  },

  async download(id: string) {
    const report = await reportsRepository.findById(id);
    if (!report || !report.fileContent) {
      throw AppError.notFound('Report not found');
    }

    return {
      buffer: Buffer.from(report.fileContent),
      contentType: report.contentType ?? 'application/octet-stream',
      filename: report.fileName ?? `transight-report.${report.format === 'CSV' ? 'csv' : 'xlsx'}`,
    };
  },

  async getHistory(page: number, limit: number, userId?: string) {
    const { items, total } = await reportsRepository.findHistory(page, limit, userId);
    return { items: items.map(serializeReport), pagination: buildPagination(page, limit, total) };
  },

  async getGenerators() {
    return reportsRepository.getGenerators();
  },
};