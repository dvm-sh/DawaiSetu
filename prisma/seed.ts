import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.feedback.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.transferItem.deleteMany()
  await prisma.transfer.deleteMany()
  await prisma.match.deleteMany()
  await prisma.medicineRequirement.deleteMany()
  await prisma.medicine.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.session.deleteMany()
  await prisma.document.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('Admin@123456', 12)
  const userPasswordHash = await bcrypt.hash('Password@123', 12)

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dawaisetu.com',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created: admin@dawaisetu.com / Admin@123456')

  // Create Donor Organization
  const donorUser = await prisma.user.create({
    data: {
      email: 'donor@citypharma.com',
      passwordHash: userPasswordHash,
      role: 'DONOR',
      organization: {
        create: {
          name: 'City Pharma Distributors',
          type: 'PHARMACY',
          role: 'DONOR',
          address: '42 MG Road, Sector 12',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001',
          contactPerson: 'Dr. Rajesh Kumar',
          phone: '+91 9876543210',
          registrationNumber: 'MH-PHARMA-2024-1234',
          website: 'https://citypharma.example.com',
          status: 'APPROVED',
        },
      },
    },
    include: { organization: true },
  })
  console.log('✅ Donor created: donor@citypharma.com / Password@123')

  // Create second Donor
  const donorUser2 = await prisma.user.create({
    data: {
      email: 'donor@wellnesshub.com',
      passwordHash: userPasswordHash,
      role: 'DONOR',
      organization: {
        create: {
          name: 'Wellness Hub Hospital',
          type: 'HOSPITAL',
          role: 'DONOR',
          address: '88 Health Avenue',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          pincode: '110001',
          contactPerson: 'Dr. Anita Sharma',
          phone: '+91 9876543211',
          registrationNumber: 'DL-HOSP-2024-5678',
          status: 'APPROVED',
        },
      },
    },
    include: { organization: true },
  })

  // Create Recipient Organization
  const recipientUser = await prisma.user.create({
    data: {
      email: 'recipient@cityhospital.com',
      passwordHash: userPasswordHash,
      role: 'RECIPIENT',
      organization: {
        create: {
          name: 'City Community Hospital',
          type: 'HOSPITAL',
          role: 'RECIPIENT',
          address: '15 Hospital Lane, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400069',
          contactPerson: 'Dr. Priya Patel',
          phone: '+91 9123456789',
          registrationNumber: 'MH-HOSP-2024-9876',
          status: 'APPROVED',
        },
      },
    },
    include: { organization: true },
  })
  console.log('✅ Recipient created: recipient@cityhospital.com / Password@123')

  // Create second Recipient
  const recipientUser2 = await prisma.user.create({
    data: {
      email: 'recipient@ruralclinic.com',
      passwordHash: userPasswordHash,
      role: 'RECIPIENT',
      organization: {
        create: {
          name: 'Rural Health Clinic',
          type: 'CLINIC',
          role: 'RECIPIENT',
          address: '5 Village Road',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          pincode: '411001',
          contactPerson: 'Dr. Sunil Deshmukh',
          phone: '+91 9123456780',
          registrationNumber: 'MH-CLINIC-2024-4321',
          status: 'APPROVED',
        },
      },
    },
    include: { organization: true },
  })

  // Create Pending Organization
  await prisma.user.create({
    data: {
      email: 'pending@newpharmacy.com',
      passwordHash: userPasswordHash,
      role: 'DONOR',
      organization: {
        create: {
          name: 'New Age Pharmacy',
          type: 'PHARMACY',
          role: 'DONOR',
          address: '22 Market Street',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001',
          contactPerson: 'Mr. Ravi Shankar',
          phone: '+91 9988776655',
          registrationNumber: 'KA-PHARMA-2024-8888',
          status: 'PENDING',
        },
      },
    },
  })
  console.log('✅ Pending org created: pending@newpharmacy.com / Password@123')

  // Create Medicines for Donor 1
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        organizationId: donorUser.organization!.id,
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        brandName: 'Crocin',
        category: 'ANALGESIC',
        strength: '500mg',
        dosageForm: 'TABLET',
        batchNumber: 'BT-2024-001',
        manufacturer: 'GSK Pharma',
        quantity: 500,
        unit: 'tablets',
        originalQuantity: 500,
        manufacturingDate: new Date('2024-06-01'),
        expiryDate: new Date('2027-06-01'),
        daysRemaining: 635,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'ROOM_TEMPERATURE',
        prescriptionRequired: false,
        location: 'Mumbai',
        estimatedValue: 2.5,
        status: 'AVAILABLE',
      },
    }),
    prisma.medicine.create({
      data: {
        organizationId: donorUser.organization!.id,
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        brandName: 'Mox',
        category: 'ANTIBIOTIC',
        strength: '250mg',
        dosageForm: 'CAPSULE',
        batchNumber: 'BT-2024-002',
        manufacturer: 'Cipla',
        quantity: 200,
        unit: 'capsules',
        originalQuantity: 200,
        manufacturingDate: new Date('2024-03-15'),
        expiryDate: new Date('2026-12-15'),
        daysRemaining: 467,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'COOL_DRY_PLACE',
        prescriptionRequired: true,
        location: 'Mumbai',
        estimatedValue: 8.0,
        status: 'AVAILABLE',
      },
    }),
    prisma.medicine.create({
      data: {
        organizationId: donorUser.organization!.id,
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        brandName: 'Omez',
        category: 'GASTROINTESTINAL',
        strength: '20mg',
        dosageForm: 'CAPSULE',
        batchNumber: 'BT-2024-003',
        manufacturer: 'Dr. Reddy\'s',
        quantity: 150,
        unit: 'capsules',
        originalQuantity: 150,
        manufacturingDate: new Date('2024-01-01'),
        expiryDate: new Date('2026-11-01'),
        daysRemaining: 423,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'ROOM_TEMPERATURE',
        prescriptionRequired: false,
        location: 'Mumbai',
        estimatedValue: 5.0,
        status: 'AVAILABLE',
      },
    }),
    prisma.medicine.create({
      data: {
        organizationId: donorUser.organization!.id,
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride',
        brandName: 'Alerid',
        category: 'IMMUNOLOGICAL',
        strength: '10mg',
        dosageForm: 'TABLET',
        batchNumber: 'BT-2024-004',
        manufacturer: 'Sun Pharma',
        quantity: 300,
        unit: 'tablets',
        originalQuantity: 300,
        manufacturingDate: new Date('2025-01-01'),
        expiryDate: new Date('2026-10-20'),
        daysRemaining: 411,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'ROOM_TEMPERATURE',
        prescriptionRequired: false,
        location: 'Mumbai',
        estimatedValue: 1.5,
        status: 'AVAILABLE',
      },
    }),
    prisma.medicine.create({
      data: {
        organizationId: donorUser.organization!.id,
        name: 'Metformin 500mg',
        genericName: 'Metformin',
        brandName: 'Glycomet',
        category: 'ENDOCRINE',
        strength: '500mg',
        dosageForm: 'TABLET',
        batchNumber: 'BT-2024-005',
        manufacturer: 'USV Pharma',
        quantity: 100,
        unit: 'tablets',
        originalQuantity: 100,
        manufacturingDate: new Date('2025-03-01'),
        expiryDate: new Date('2026-11-15'),
        daysRemaining: 437,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'COOL_DRY_PLACE',
        prescriptionRequired: true,
        location: 'Mumbai',
        estimatedValue: 3.0,
        status: 'AVAILABLE',
      },
    }),
  ])
  console.log(`✅ ${medicines.length} medicines created for City Pharma`)

  // Create medicines for Donor 2
  const medicines2 = await Promise.all([
    prisma.medicine.create({
      data: {
        organizationId: donorUser2.organization!.id,
        name: 'Ibuprofen 400mg',
        genericName: 'Ibuprofen',
        brandName: 'Brufen',
        category: 'ANALGESIC',
        strength: '400mg',
        dosageForm: 'TABLET',
        batchNumber: 'BT-2024-W01',
        manufacturer: 'Abbott',
        quantity: 250,
        unit: 'tablets',
        originalQuantity: 250,
        manufacturingDate: new Date('2024-08-01'),
        expiryDate: new Date('2027-02-01'),
        daysRemaining: 515,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'ROOM_TEMPERATURE',
        prescriptionRequired: false,
        location: 'Delhi',
        estimatedValue: 3.5,
        status: 'AVAILABLE',
      },
    }),
    prisma.medicine.create({
      data: {
        organizationId: donorUser2.organization!.id,
        name: 'Vitamin D3 60000 IU',
        genericName: 'Cholecalciferol',
        brandName: 'D-Rise',
        category: 'VITAMIN_SUPPLEMENT',
        strength: '60000 IU',
        dosageForm: 'CAPSULE',
        batchNumber: 'BT-2024-W02',
        manufacturer: 'USV',
        quantity: 80,
        unit: 'sachets',
        originalQuantity: 80,
        manufacturingDate: new Date('2025-01-01'),
        expiryDate: new Date('2027-01-01'),
        daysRemaining: 484,
        expiryCategory: 'HEALTHY',
        storageRequirement: 'ROOM_TEMPERATURE',
        prescriptionRequired: false,
        location: 'Delhi',
        estimatedValue: 40.0,
        status: 'AVAILABLE',
      },
    }),
  ])
  console.log(`✅ ${medicines2.length} medicines created for Wellness Hub`)

  // Create Medicine Requirements for Recipient 1
  const req1 = await prisma.medicineRequirement.create({
    data: {
      organizationId: recipientUser.organization!.id,
      medicineName: 'Paracetamol',
      genericName: 'Acetaminophen',
      category: 'ANALGESIC',
      dosageForm: 'TABLET',
      quantityNeeded: 200,
      urgency: 'HIGH',
      notes: 'Needed urgently for outpatient department',
    },
  })

  const req2 = await prisma.medicineRequirement.create({
    data: {
      organizationId: recipientUser.organization!.id,
      medicineName: 'Amoxicillin',
      genericName: 'Amoxicillin',
      category: 'ANTIBIOTIC',
      dosageForm: 'CAPSULE',
      quantityNeeded: 100,
      urgency: 'MEDIUM',
    },
  })
  console.log('✅ Medicine requirements created')

  // Create Matches
  const match1 = await prisma.match.create({
    data: {
      medicineId: medicines[0].id, // Paracetamol
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser.organization!.id,
      requirementId: req1.id,
      matchScore: 92.5,
      matchReasons: ['Same category', 'Same city', 'High urgency requirement', 'Good expiry date'],
      isActive: true,
    },
  })

  const match2 = await prisma.match.create({
    data: {
      medicineId: medicines[1].id, // Amoxicillin
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser.organization!.id,
      requirementId: req2.id,
      matchScore: 85.0,
      matchReasons: ['Exact generic match', 'Same city', 'Medium urgency'],
      isActive: true,
    },
  })

  // Additional matches for other recipients
  await prisma.match.create({
    data: {
      medicineId: medicines[2].id, // Omeprazole
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser2.organization!.id,
      matchScore: 72.0,
      matchReasons: ['Category match', 'Same state', 'Good quantity'],
      isActive: true,
    },
  })

  await prisma.match.create({
    data: {
      medicineId: medicines[4].id, // Metformin
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser2.organization!.id,
      matchScore: 68.0,
      matchReasons: ['Endocrine category', 'Same state'],
      isActive: true,
    },
  })
  console.log('✅ Matches created')

  // Create a Transfer (completed flow demo)
  const transfer = await prisma.transfer.create({
    data: {
      matchId: match1.id,
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser.organization!.id,
      status: 'COMPLETED',
      totalValue: 500.0,
      approvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      confirmedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      readyAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      inTransitAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      inspectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: {
          medicineId: medicines[0].id,
          quantity: 200,
        },
      },
      shipment: {
        create: {
          method: 'PICKUP',
          pickupAddress: '42 MG Road, Mumbai',
          deliveryAddress: '15 Hospital Lane, Mumbai',
          pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          expectedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          actualDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
      inspection: {
        create: {
          packagingCondition: 'Good',
          temperatureOk: true,
          quantityVerified: true,
          expiryVerified: true,
          isAccepted: true,
          notes: 'All medicines in good condition',
        },
      },
    },
  })

  // Update the first medicine to reflect partial distribution
  await prisma.medicine.update({
    where: { id: medicines[0].id },
    data: { quantity: 300, status: 'AVAILABLE' }, // 500 - 200 = 300 remaining
  })

  // Feedback for completed transfer
  await prisma.feedback.create({
    data: {
      transferId: transfer.id,
      organizationId: recipientUser.organization!.id,
      rating: 5,
      deliveryExperience: 5,
      medicineCondition: 5,
      comments: 'Excellent experience! Medicines were well-packaged and delivered promptly.',
    },
  })
  console.log('✅ Completed transfer with feedback created')

  // Create a pending transfer
  await prisma.transfer.create({
    data: {
      matchId: match2.id,
      donorOrgId: donorUser.organization!.id,
      recipientOrgId: recipientUser.organization!.id,
      status: 'REQUESTED',
      totalValue: 800.0,
      items: {
        create: {
          medicineId: medicines[1].id,
          quantity: 100,
        },
      },
    },
  })

  // Update Amoxicillin status
  await prisma.medicine.update({
    where: { id: medicines[1].id },
    data: { status: 'RESERVED' },
  })
  console.log('✅ Pending transfer created')

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        type: 'GENERAL',
        title: 'New Organization Registration',
        message: 'New Age Pharmacy has registered and requires verification.',
        entityType: 'Organization',
        actionUrl: '/admin/organizations',
      },
      {
        userId: donorUser.id,
        type: 'MEDICINE_REQUEST_RECEIVED',
        title: 'New Medicine Request',
        message: 'City Community Hospital has requested Amoxicillin 250mg',
        entityType: 'Transfer',
        actionUrl: '/donor/requests',
      },
      {
        userId: recipientUser.id,
        type: 'TRANSFER_COMPLETED',
        title: 'Transfer Completed!',
        message: 'Your medicine transfer from City Pharma Distributors has been completed.',
        entityType: 'Transfer',
        actionUrl: '/recipient/transfers',
        isRead: true,
      },
      {
        userId: recipientUser.id,
        type: 'GENERAL',
        title: 'New Match Found',
        message: 'A new medicine match has been found for your Paracetamol requirement!',
        entityType: 'Match',
        actionUrl: '/recipient/requirements',
      },
    ],
  })
  console.log('✅ Notifications created')

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actorId: admin.id, action: 'ORGANIZATION_APPROVED', entityType: 'Organization', entityId: donorUser.organization!.id },
      { actorId: admin.id, action: 'ORGANIZATION_APPROVED', entityType: 'Organization', entityId: recipientUser.organization!.id },
      { actorId: donorUser.id, action: 'MEDICINE_CREATED', entityType: 'Medicine', entityId: medicines[0].id },
      { actorId: donorUser.id, action: 'MEDICINE_CREATED', entityType: 'Medicine', entityId: medicines[1].id },
      { actorId: recipientUser.id, action: 'REQUIREMENT_CREATED', entityType: 'MedicineRequirement', entityId: req1.id },
      { actorId: recipientUser.id, action: 'TRANSFER_CREATED', entityType: 'Transfer', entityId: transfer.id },
      { actorId: donorUser.id, action: 'TRANSFER_APPROVED', entityType: 'Transfer', entityId: transfer.id },
      { actorId: donorUser.id, action: 'TRANSFER_COMPLETED', entityType: 'Transfer', entityId: transfer.id },
    ],
  })
  console.log('✅ Audit logs created')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📋 Demo Accounts:')
  console.log('  Admin:     admin@dawaisetu.com     / Admin@123456')
  console.log('  Donor:     donor@citypharma.com     / Password@123')
  console.log('  Donor 2:   donor@wellnesshub.com    / Password@123')
  console.log('  Recipient: recipient@cityhospital.com / Password@123')
  console.log('  Recipient: recipient@ruralclinic.com / Password@123')
  console.log('  Pending:   pending@newpharmacy.com   / Password@123')
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
