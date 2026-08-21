import { describe, it, expect } from 'vitest';
import { csvRowSchema, parseTransactionDate } from '../uploads.validation';

describe('parseTransactionDate', () => {
  it('parses ISO format YYYY-MM-DD', () => {
    const date = parseTransactionDate('2026-08-01');
    expect(date).toBeInstanceOf(Date);
    expect(date?.getUTCFullYear()).toBe(2026);
    expect(date?.getUTCMonth()).toBe(7); // August = index 7
    expect(date?.getUTCDate()).toBe(1);
  });

  it('parses British DD/MM/YYYY correctly, not as American MM/DD/YYYY', () => {
    // 05/01/2026 must be 5 January, never 1 May
    const date = parseTransactionDate('05/01/2026');
    expect(date?.getUTCMonth()).toBe(0);
    expect(date?.getUTCDate()).toBe(5);
  });

  it('parses British DD-MM-YYYY with dashes', () => {
    const date = parseTransactionDate('31-01-2026');
    expect(date?.getUTCMonth()).toBe(0);
    expect(date?.getUTCDate()).toBe(31);
  });

  it('rejects a day that does not exist in the given month (no silent rollover)', () => {
    // April has only 30 days — this must NOT roll over into May
    const date = parseTransactionDate('31/04/2026');
    expect(date).toBeUndefined();
  });

  it('rejects an invalid month number', () => {
    expect(parseTransactionDate('15/13/2026')).toBeUndefined();
  });

  it('returns undefined for empty, undefined, or non-string input', () => {
    expect(parseTransactionDate('')).toBeUndefined();
    expect(parseTransactionDate(undefined)).toBeUndefined();
    expect(parseTransactionDate(123)).toBeUndefined();
  });

  it('returns undefined for unparseable strings', () => {
    expect(parseTransactionDate('not-a-date')).toBeUndefined();
  });
});

describe('csvRowSchema', () => {
  const validRow = {
    reference: 'TXN-001',
    transactionDate: '31/01/2026',
    amount: '1500.50',
    currency: 'NGN',
    customerAccount: '0123456789',
    bankCode: 'GTB',
    transactionType: 'Transfer',
    responseCode: '00',
    responseDescription: 'Approved',
    status: 'Successful',
  };

  it('accepts a fully valid row', () => {
    expect(csvRowSchema.safeParse(validRow).success).toBe(true);
  });

  it('rejects a row missing a reference', () => {
    expect(csvRowSchema.safeParse({ ...validRow, reference: '' }).success).toBe(false);
  });

  it('rejects a row with a negative amount', () => {
    expect(csvRowSchema.safeParse({ ...validRow, amount: '-50' }).success).toBe(false);
  });

  it('rejects a row with an invalid currency length', () => {
    expect(csvRowSchema.safeParse({ ...validRow, currency: 'NAIRA' }).success).toBe(false);
  });

  it('defaults responseDescription to an empty string when omitted', () => {
    const { responseDescription, ...rest } = validRow;
    const result = csvRowSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.responseDescription).toBe('');
    }
  });
});