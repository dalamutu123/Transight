import { describe, it, expect } from 'vitest';
import { normalizeHeaderKey, normalizeRow } from '../uploads.service';

describe('normalizeHeaderKey', () => {
  it('lowercases and strips spaces, underscores, and dashes', () => {
    expect(normalizeHeaderKey('Transaction Reference')).toBe('transactionreference');
    expect(normalizeHeaderKey('transaction_reference')).toBe('transactionreference');
    expect(normalizeHeaderKey('TRANSACTION-REFERENCE')).toBe('transactionreference');
    expect(normalizeHeaderKey('TransactionReference')).toBe('transactionreference');
  });
});

describe('normalizeRow', () => {
  it('maps varied header conventions (spaced, Title Case) to canonical field names', () => {
    const row = {
      'Transaction Reference': 'TXN-001',
      'Transaction Date': '31/01/2026',
      Amount: '1000',
      Currency: 'NGN',
      'Customer Account': '0123456789',
      'Bank Code': 'GTB',
      'Transaction Type': 'Transfer',
      'Response Code': '00',
      'Response Description': 'Approved',
      Status: 'Successful',
    };

    const normalized = normalizeRow(row);

    expect(normalized.reference).toBe('TXN-001');
    expect(normalized.transactionDate).toBe('31/01/2026');
    expect(normalized.amount).toBe('1000');
    expect(normalized.bankCode).toBe('GTB');
    expect(normalized.status).toBe('Successful');
  });

  it('maps lowercase/no-space header variants identically', () => {
    const row = {
      reference: 'TXN-002',
      transactiondate: '01/02/2026',
      amount: '500',
      currency: 'USD',
      customeraccount: '9876543210',
      bankcode: 'ZEN',
      transactiontype: 'Deposit',
      responsecode: '00',
      status: 'Successful',
    };

    const normalized = normalizeRow(row);

    expect(normalized.reference).toBe('TXN-002');
    expect(normalized.bankCode).toBe('ZEN');
    expect(normalized.customerAccount).toBe('9876543210');
  });

  it('leaves a field undefined when no known alias matches', () => {
    const row = { SomeUnrelatedColumn: 'value' };
    const normalized = normalizeRow(row);
    expect(normalized.reference).toBeUndefined();
    expect(normalized.amount).toBeUndefined();
  });
});