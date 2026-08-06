import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding roles...');

  const roleNames = ['Administrator', 'Operations User', 'Report Viewer'];
  const roles: Record<string, string> = {};

  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles[name] = role.id;
  }

  console.log('Seeding transaction statuses...');
  const statusNames = ['Successful', 'Failed', 'Pending', 'Processing'];
  for (const name of statusNames) {
    await prisma.transactionStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seeding sample banks...');
  const banks = [
    { code: 'GTB', name: 'Guaranty Trust Bank' },
    { code: 'ZEN', name: 'Zenith Bank' },
    { code: 'ACC', name: 'Access Bank' },
    { code: 'UBA', name: 'United Bank for Africa' },
  ];
  for (const bank of banks) {
    await prisma.bank.upsert({
      where: { code: bank.code },
      update: {},
      create: bank,
    });
  }

  console.log('Seeding default administrator account...');
  const adminEmail = 'admin@transight.local';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Administrator',
        email: adminEmail,
        passwordHash,
        roleId: roles['Administrator'],
      },
    });
    console.log(`Default administrator created: ${adminEmail} / ChangeMe123! (change immediately)`);
  } else {
    console.log('Administrator account already exists, skipping.');
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });