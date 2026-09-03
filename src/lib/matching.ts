import { prisma } from './db'
import { Medicine, MedicineRequirement, Organization } from '@prisma/client'

interface MatchResult {
  recipientOrg: Organization & { requirements?: MedicineRequirement[] }
  requirement?: MedicineRequirement
  matchScore: number
  scoreBreakdown: {
    medicineCompatibility: number
    quantityCompatibility: number
    locationScore: number
    urgencyScore: number
    expirySuitability: number
    recipientPriority: number
  }
  matchReasons: string[]
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function getDaysRemaining(expiryDate: Date): number {
  const now = new Date()
  const diff = expiryDate.getTime() - now.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export async function findMatchesForMedicine(medicine: Medicine & { organization: Organization }): Promise<MatchResult[]> {
  // Don't match expired medicines
  const daysRemaining = getDaysRemaining(medicine.expiryDate)
  if (daysRemaining <= 0) return []
  if (medicine.status !== 'AVAILABLE') return []

  // Find approved recipient organizations with active requirements
  const recipientOrgs = await prisma.organization.findMany({
    where: {
      role: 'RECIPIENT',
      status: 'APPROVED',
    },
    include: {
      requirements: {
        where: {
          status: { in: ['ACTIVE', 'PARTIALLY_FULFILLED'] },
        },
      },
    },
  })

  const matches: MatchResult[] = []

  for (const recipientOrg of recipientOrgs) {
    // Check each requirement for compatibility
    for (const req of recipientOrg.requirements) {
      const result = calculateMatchScore(medicine, recipientOrg, req, daysRemaining)
      if (result.matchScore >= 30) {
        matches.push(result)
      }
    }

    // Also consider general match if org has no specific requirements but is in same city
    if (recipientOrg.requirements.length === 0) {
      const result = calculateGeneralMatch(medicine, recipientOrg, daysRemaining)
      if (result.matchScore >= 30) {
        matches.push(result)
      }
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.matchScore - a.matchScore)

  return matches.slice(0, 20) // Top 20 matches
}

function calculateMatchScore(
  medicine: Medicine & { organization: Organization },
  recipientOrg: Organization & { requirements?: MedicineRequirement[] },
  requirement: MedicineRequirement,
  daysRemaining: number
): MatchResult {
  const breakdown = {
    medicineCompatibility: 0,
    quantityCompatibility: 0,
    locationScore: 0,
    urgencyScore: 0,
    expirySuitability: 0,
    recipientPriority: 0,
  }
  const reasons: string[] = []

  // 1. Medicine Compatibility (max 30 points)
  const medNameLower = medicine.name.toLowerCase()
  const medGenericLower = (medicine.genericName || '').toLowerCase()
  const reqNameLower = requirement.medicineName.toLowerCase()
  const reqGenericLower = (requirement.genericName || '').toLowerCase()

  if (medNameLower === reqNameLower || medGenericLower === reqGenericLower) {
    breakdown.medicineCompatibility = 30
    reasons.push(`Exact medicine match: ${medicine.name}`)
  } else if (
    medNameLower.includes(reqNameLower) || reqNameLower.includes(medNameLower) ||
    medGenericLower.includes(reqGenericLower) || reqGenericLower.includes(medGenericLower)
  ) {
    breakdown.medicineCompatibility = 22
    reasons.push(`Partial medicine name match`)
  } else if (requirement.category && medicine.category === requirement.category) {
    breakdown.medicineCompatibility = 12
    reasons.push(`Same medicine category: ${medicine.category}`)
  }

  // Check dosage form match
  if (requirement.dosageForm && medicine.dosageForm === requirement.dosageForm) {
    breakdown.medicineCompatibility = Math.min(30, breakdown.medicineCompatibility + 5)
    reasons.push(`Dosage form matches: ${medicine.dosageForm}`)
  }

  // 2. Quantity Compatibility (max 20 points)
  const quantityNeeded = requirement.quantityNeeded - requirement.quantityFulfilled
  if (quantityNeeded <= 0) {
    return {
      recipientOrg,
      requirement,
      matchScore: 0,
      scoreBreakdown: breakdown,
      matchReasons: ['Requirement already fulfilled'],
    }
  }

  const fulfillmentRatio = Math.min(medicine.quantity / quantityNeeded, 1)
  breakdown.quantityCompatibility = Math.round(fulfillmentRatio * 20)
  reasons.push(`${medicine.quantity} units available / ${quantityNeeded} needed`)

  // 3. Location Score (max 15 points)
  if (medicine.organization.latitude && medicine.organization.longitude &&
      recipientOrg.latitude && recipientOrg.longitude) {
    const distance = calculateDistance(
      medicine.organization.latitude, medicine.organization.longitude,
      recipientOrg.latitude, recipientOrg.longitude
    )
    if (distance <= 10) {
      breakdown.locationScore = 15
      reasons.push(`Very close: ${Math.round(distance)} km away`)
    } else if (distance <= 50) {
      breakdown.locationScore = 12
      reasons.push(`Nearby: ${Math.round(distance)} km away`)
    } else if (distance <= 200) {
      breakdown.locationScore = 8
      reasons.push(`Moderate distance: ${Math.round(distance)} km away`)
    } else if (distance <= 500) {
      breakdown.locationScore = 4
      reasons.push(`Far: ${Math.round(distance)} km away`)
    } else {
      breakdown.locationScore = 1
      reasons.push(`Very far: ${Math.round(distance)} km away`)
    }
  } else if (medicine.organization.city.toLowerCase() === recipientOrg.city.toLowerCase()) {
    breakdown.locationScore = 13
    reasons.push(`Same city: ${recipientOrg.city}`)
  } else if (medicine.organization.state.toLowerCase() === recipientOrg.state.toLowerCase()) {
    breakdown.locationScore = 8
    reasons.push(`Same state: ${recipientOrg.state}`)
  } else {
    breakdown.locationScore = 3
    reasons.push(`Different region`)
  }

  // 4. Urgency Score (max 15 points)
  switch (requirement.urgency) {
    case 'CRITICAL':
      breakdown.urgencyScore = 15
      reasons.push('Critical urgency')
      break
    case 'HIGH':
      breakdown.urgencyScore = 12
      reasons.push('High urgency')
      break
    case 'MEDIUM':
      breakdown.urgencyScore = 8
      reasons.push('Medium urgency')
      break
    case 'LOW':
      breakdown.urgencyScore = 4
      reasons.push('Low urgency')
      break
  }

  // 5. Expiry Suitability (max 10 points)
  if (daysRemaining > 180) {
    breakdown.expirySuitability = 10
    reasons.push(`Healthy stock: ${daysRemaining} days remaining`)
  } else if (daysRemaining > 90) {
    breakdown.expirySuitability = 7
    reasons.push(`Needs attention: ${daysRemaining} days remaining`)
  } else if (daysRemaining > 30) {
    breakdown.expirySuitability = 4
    reasons.push(`High expiry risk: ${daysRemaining} days remaining`)
  } else {
    breakdown.expirySuitability = 1
    reasons.push(`Critical expiry: ${daysRemaining} days remaining`)
  }

  // 6. Recipient Priority (max 10 points)
  // Based on organization type and verification
  switch (recipientOrg.type) {
    case 'HOSPITAL':
      breakdown.recipientPriority = 10
      reasons.push('Hospital priority: High')
      break
    case 'CLINIC':
      breakdown.recipientPriority = 8
      reasons.push('Clinic priority: High')
      break
    case 'NGO':
      breakdown.recipientPriority = 7
      reasons.push('NGO priority: Medium-High')
      break
    case 'HEALTH_ORGANIZATION':
      breakdown.recipientPriority = 6
      reasons.push('Health organization priority: Medium')
      break
    default:
      breakdown.recipientPriority = 5
      reasons.push('Standard priority')
  }

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return {
    recipientOrg,
    requirement,
    matchScore: totalScore,
    scoreBreakdown: breakdown,
    matchReasons: reasons,
  }
}

function calculateGeneralMatch(
  medicine: Medicine & { organization: Organization },
  recipientOrg: Organization,
  daysRemaining: number
): MatchResult {
  const breakdown = {
    medicineCompatibility: 0,
    quantityCompatibility: 10,
    locationScore: 0,
    urgencyScore: 5,
    expirySuitability: 0,
    recipientPriority: 0,
  }
  const reasons: string[] = []

  // General availability match
  breakdown.medicineCompatibility = 10
  reasons.push(`Medicine available: ${medicine.name}`)
  reasons.push(`${medicine.quantity} ${medicine.unit} available`)

  // Location
  if (medicine.organization.city.toLowerCase() === recipientOrg.city.toLowerCase()) {
    breakdown.locationScore = 13
    reasons.push(`Same city: ${recipientOrg.city}`)
  } else if (medicine.organization.state.toLowerCase() === recipientOrg.state.toLowerCase()) {
    breakdown.locationScore = 8
    reasons.push(`Same state: ${recipientOrg.state}`)
  } else {
    breakdown.locationScore = 3
  }

  // Expiry
  if (daysRemaining > 180) {
    breakdown.expirySuitability = 10
    reasons.push(`${daysRemaining} days remaining`)
  } else if (daysRemaining > 90) {
    breakdown.expirySuitability = 7
    reasons.push(`${daysRemaining} days remaining`)
  } else if (daysRemaining > 30) {
    breakdown.expirySuitability = 4
    reasons.push(`${daysRemaining} days remaining`)
  } else {
    breakdown.expirySuitability = 1
  }

  // Priority
  switch (recipientOrg.type) {
    case 'HOSPITAL': breakdown.recipientPriority = 10; break
    case 'CLINIC': breakdown.recipientPriority = 8; break
    case 'NGO': breakdown.recipientPriority = 7; break
    default: breakdown.recipientPriority = 5; break
  }

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return {
    recipientOrg,
    matchScore: totalScore,
    scoreBreakdown: breakdown,
    matchReasons: reasons,
  }
}

export async function runMatchingForMedicine(medicineId: string) {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: { organization: true },
  })

  if (!medicine || medicine.status !== 'AVAILABLE') return []

  const matchResults = await findMatchesForMedicine(medicine)

  // Store matches in database
  const storedMatches = []
  for (const result of matchResults) {
    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        medicineId: medicine.id,
        recipientOrgId: result.recipientOrg.id,
        requirementId: result.requirement?.id || undefined,
        isActive: true,
      },
    })

    if (!existingMatch) {
      const match = await prisma.match.create({
        data: {
          medicineId: medicine.id,
          requirementId: result.requirement?.id,
          donorOrgId: medicine.organizationId,
          recipientOrgId: result.recipientOrg.id,
          matchScore: result.matchScore,
          scoreBreakdown: result.scoreBreakdown as Record<string, number>,
          matchReasons: result.matchReasons,
        },
        include: {
          recipientOrg: true,
          requirement: true,
          medicine: true,
        },
      })
      storedMatches.push(match)
    }
  }

  return storedMatches
}

export async function runMatchingForRequirement(requirementId: string) {
  const requirement = await prisma.medicineRequirement.findUnique({
    where: { id: requirementId },
    include: { organization: true },
  })

  if (!requirement || !['ACTIVE', 'PARTIALLY_FULFILLED'].includes(requirement.status)) return []

  // Find available medicines that could match
  const medicines = await prisma.medicine.findMany({
    where: {
      status: 'AVAILABLE',
      isPaused: false,
      expiryDate: { gt: new Date() },
      organization: { status: 'APPROVED' },
    },
    include: { organization: true },
  })

  const matches: MatchResult[] = []

  for (const medicine of medicines) {
    const daysRemaining = getDaysRemaining(medicine.expiryDate)
    if (daysRemaining <= 0) continue

    const result = calculateMatchScore(medicine, requirement.organization as Organization & { requirements?: MedicineRequirement[] }, requirement, daysRemaining)
    if (result.matchScore >= 30) {
      matches.push({ ...result, recipientOrg: requirement.organization as Organization & { requirements?: MedicineRequirement[] } })
    }
  }

  matches.sort((a, b) => b.matchScore - a.matchScore)

  // Store matches
  const storedMatches = []
  for (const result of matches.slice(0, 20)) {
    const existingMatch = await prisma.match.findFirst({
      where: {
        requirementId: requirement.id,
        recipientOrgId: requirement.organizationId,
        isActive: true,
      },
    })

    if (!existingMatch) {
      // We need to find the medicine for this match
      const medicine = medicines.find(m => {
        const medNameLower = m.name.toLowerCase()
        const medGenericLower = (m.genericName || '').toLowerCase()
        const reqNameLower = requirement.medicineName.toLowerCase()
        const reqGenericLower = (requirement.genericName || '').toLowerCase()
        return medNameLower === reqNameLower || medGenericLower === reqGenericLower ||
          medNameLower.includes(reqNameLower) || reqNameLower.includes(medNameLower)
      })

      if (medicine) {
        const match = await prisma.match.create({
          data: {
            medicineId: medicine.id,
            requirementId: requirement.id,
            donorOrgId: medicine.organizationId,
            recipientOrgId: requirement.organizationId,
            matchScore: result.matchScore,
            scoreBreakdown: result.scoreBreakdown as Record<string, number>,
            matchReasons: result.matchReasons,
          },
          include: {
            recipientOrg: true,
            requirement: true,
            medicine: true,
            donorOrg: true,
          },
        })
        storedMatches.push(match)
      }
    }
  }

  return storedMatches
}
