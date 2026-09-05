import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createToken, createSession, setAuthCookie, UserRole } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError, validationErrorResponse } from '@/lib/api-response'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, password, confirmPassword, role, organizationName, organizationType, 
      address, city, state, country, pincode, contactPerson, phone, registrationNumber, website,
      drugLicense, orgRegistration, authRepDetails, requiredAgreement, otherDocs
    } = body

    // Validation
    const errors: Record<string, string> = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required'
    if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (!role || !['DONOR', 'RECIPIENT'].includes(role)) errors.role = 'Please select Donor or Recipient'
    if (!organizationName) errors.organizationName = 'Organization name is required'
    if (!organizationType) errors.organizationType = 'Organization type is required'
    if (!address) errors.address = 'Address is required'
    if (!city) errors.city = 'City is required'
    if (!state) errors.state = 'State is required'
    if (!country) errors.country = 'Country is required'
    if (!pincode) errors.pincode = 'PIN/ZIP code is required'
    if (!contactPerson) errors.contactPerson = 'Contact person name is required'
    if (!phone) errors.phone = 'Phone number is required'
    if (!registrationNumber) errors.registrationNumber = 'Registration number is required'

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(errors)
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return errorResponse('An account with this email already exists', 409)
    }

    // Create user and organization
    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role as UserRole,
        organization: {
          create: {
            name: organizationName,
            type: organizationType,
            role: role as UserRole,
            address,
            city,
            state,
            country,
            pincode,
            contactPerson,
            phone,
            website: website || null,
            registrationNumber,
          },
        },
      },
      include: { organization: true },
    })
    
    // Create documents
    const orgId = user.organization!.id
    const docsToCreate = []
    
    if (drugLicense) docsToCreate.push({ organizationId: orgId, name: drugLicense, type: 'Drug License', fileUrl: 'simulated://' + drugLicense, fileName: drugLicense, fileSize: 1024 })
    if (orgRegistration) docsToCreate.push({ organizationId: orgId, name: orgRegistration, type: 'Organization Registration', fileUrl: 'simulated://' + orgRegistration, fileName: orgRegistration, fileSize: 1024 })
    if (authRepDetails) docsToCreate.push({ organizationId: orgId, name: authRepDetails, type: 'Authorized Rep Details', fileUrl: 'simulated://' + authRepDetails, fileName: authRepDetails, fileSize: 1024 })
    if (requiredAgreement) docsToCreate.push({ organizationId: orgId, name: requiredAgreement, type: 'Required Agreement', fileUrl: 'simulated://' + requiredAgreement, fileName: requiredAgreement, fileSize: 1024 })
    if (otherDocs) docsToCreate.push({ organizationId: orgId, name: otherDocs, type: 'Other', fileUrl: 'simulated://' + otherDocs, fileName: otherDocs, fileSize: 1024 })

    if (docsToCreate.length > 0) {
      await prisma.organizationDocument.createMany({ data: docsToCreate })
    }

    await createAuditLog({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      metadata: { role, organizationName },
    })

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'GENERAL',
          title: 'New Organization Registration',
          message: `${organizationName} has registered as a ${role.toLowerCase()} and requires verification.`,
          entityType: 'Organization',
          entityId: user.organization?.id,
          actionUrl: '/admin/organizations',
        },
      })
    }

    return successResponse({ message: 'Registration successful. Your organization is pending verification.' }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
