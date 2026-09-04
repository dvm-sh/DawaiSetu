/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient, $Enums } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dawaisetu',
})

async function main() {
  console.log('Seeding database...')

  // 1. Admin User
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@dawaisetu.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@dawaisetu.com',
      passwordHash: adminPassword,
      role: $Enums.UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
    },
  })
  console.log('Admin user created:', admin.email)

  // 2. Donor User & Organization
  const donorPassword = await bcrypt.hash('Password@123', 12)
  const donorUser = await prisma.user.upsert({
    where: { email: 'donor@citypharma.com' },
    update: {},
    create: {
      email: 'donor@citypharma.com',
      passwordHash: donorPassword,
      role: $Enums.UserRole.DONOR,
      isActive: true,
      emailVerified: true,
      organization: {
        create: {
          name: 'City Pharmacy',
          type: $Enums.OrganizationType.PHARMACY,
          role: $Enums.UserRole.DONOR,
          status: $Enums.OrganizationStatus.APPROVED,
          address: '123 Health St',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001',
          contactPerson: 'Rahul Sharma',
          phone: '+91 98765 43210',
          registrationNumber: 'REG-PHARM-2024-001',
        },
      },
    },
  })
  console.log('Donor user created:', donorUser.email)

  // 3. Recipient User & Organization
  const recipientPassword = await bcrypt.hash('Password@123', 12)
  const recipientUser = await prisma.user.upsert({
    where: { email: 'recipient@cityhospital.com' },
    update: {},
    create: {
      email: 'recipient@cityhospital.com',
      passwordHash: recipientPassword,
      role: $Enums.UserRole.RECIPIENT,
      isActive: true,
      emailVerified: true,
      organization: {
        create: {
          name: 'City Care Hospital',
          type: $Enums.OrganizationType.HOSPITAL,
          role: $Enums.UserRole.RECIPIENT,
          status: $Enums.OrganizationStatus.APPROVED,
          address: '456 Care Ave',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400002',
          contactPerson: 'Dr. Priya Patel',
          phone: '+91 98765 43211',
          registrationNumber: 'REG-HOSP-2024-002',
        },
      },
    },
  })
  console.log('Recipient user created:', recipientUser.email)

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
