import ExcelJS from 'exceljs';
import { format as formatCsv } from 'fast-csv';
import { PassThrough } from 'stream';
import { maskAccountNumber } from '@utils/mask';
import { buildPagination } from '@utils/apiResponse';
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

    await reportsRepository.createReportRecord({
      type: 'transaction-summary',
      filters: input.filters,
      format: input.format,
      generatedBy: userId,
    });

    await auditService.record({
      userId,
      action: 'GENERATE_REPORT',
      description: `Generated ${input.format} report with ${rows.length} records`,
    });

    return {
      buffer,
      contentType,
      filename: `transight-report-${Date.now()}.${fileExtension}`,
    };
  },

  async getHistory(page: number, limit: number) {
    const { items, total } = await reportsRepository.findHistory(page, limit);
    return { items, pagination: buildPagination(page, limit, total) };
  },
};