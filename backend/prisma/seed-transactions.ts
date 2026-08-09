import "dotenv/config";
import { PrismaClient, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TRANSACTION_TYPES = ['Transfer', 'Deposit', 'Withdrawal', 'Bill Payment', 'POS Payment'];
const CURRENCIES = ['NGN', 'USD'];

// Response codes: '00' means success, everything else represents a failure/decline reason
const RESPONSE_CODES: Record<string, string> = {
  '00': 'Approved or completed successfully',
  '05': 'Do not honor',
  '51': 'Insufficient funds',
  '91': 'Issuer or switch inoperative',
  '96': 'System malfunction',
  '12': 'Invalid transaction',
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomAccountNumber(): string {
  let acc = '';
  for (let i = 0; i < 10; i++) acc += Math.floor(Math.random() * 10);
  return acc;
}

function randomAmount(): number {
  return Math.round((Math.random() * 500000 + 100) * 100) / 100;
}

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(past);
}

function pickStatusName(): string {
  const roll = Math.random();
  if (roll < 0.7) return 'Successful';
  if (roll < 0.85) return 'Failed';
  if (roll < 0.95) return 'Pending';
  return 'Processing';
}

async function generateUploadBatch(
  batchNumber: number,
  recordCount: number,
  adminId: string,
  banks: { id: string; code: string }[],
  statuses: { id: string; name: string }[]
) {
  const statusMap = new Map(statuses.map((s) => [s.name, s.id]));

  const upload = await prisma.upload.create({
    data: {
      filename: `sample-transactions-batch-${batchNumber}.csv`,
      uploadedBy: adminId,
      status: 'Completed',
    },
  });

  const transactions: Prisma.TransactionCreateManyInput[] = [];

  for (let i = 0; i < recordCount; i++) {
    const statusName = pickStatusName();
    const statusId = statusMap.get(statusName)!;
    const isSuccess = statusName === 'Successful';
    const responseCode = isSuccess ? '00' : randomItem(Object.keys(RESPONSE_CODES).filter((c) => c !== '00'));

    transactions.push({
      reference: `TXN-B${batchNumber}-${String(i + 1).padStart(6, '0')}`,
      transactionDate: randomDateWithinDays(60),
      amount: randomAmount(),
      currency: randomItem(CURRENCIES),
      customerAccount: randomAccountNumber(),
      bankId: randomItem(banks).id,
      transactionType: randomItem(TRANSACTION_TYPES),
      responseCode,
      responseDescription: RESPONSE_CODES[responseCode],
      statusId,
      uploadId: upload.id,
    });
  }

  await prisma.transaction.createMany({ data: transactions, skipDuplicates: true });

  await prisma.upload.update({
    where: { id: upload.id },
    data: {
      totalRecords: recordCount,
      successfulRecords: recordCount,
      rejectedRecords: 0,
    },
  });

  console.log(`Batch ${batchNumber}: created upload "${upload.filename}" with ${recordCount} transactions.`);
}

async function main() {
  console.log('Generating sample transaction data...');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@transight.local' } });
  if (!admin) {
    throw new Error('Default admin not found. Run `npm run seed` first.');
  }

  const banks = await prisma.bank.findMany();
  const statuses = await prisma.transactionStatus.findMany();

  if (banks.length === 0 || statuses.length === 0) {
    throw new Error('Banks or statuses not found. Run `npm run seed` first.');
  }

  await generateUploadBatch(1, 400, admin.id, banks, statuses);
  await generateUploadBatch(2, 350, admin.id, banks, statuses);
  await generateUploadBatch(3, 250, admin.id, banks, statuses);

  const total = await prisma.transaction.count();
  console.log(`Done. Total transactions in database: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });