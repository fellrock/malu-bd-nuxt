import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  // Only allow GET requests
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Fetch all guests with new schema fields
    const guests = await prisma.guest.findMany({
      where: {
        cancelledAt: null // Only show active guests
      },
      select: {
        id: true,
        name: true,
        email: true,
        inviteCode: true,
        status: true,
        dietary: true,
        category: true,
        referenceCode: true,
        kidAge: true,
        maleKid: true,
        cancelledAt: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary stats by referenceCode groups
    const referenceGroups = new Map()
    guests.forEach(guest => {
      if (!referenceGroups.has(guest.referenceCode)) {
        referenceGroups.set(guest.referenceCode, {
          referenceCode: guest.referenceCode,
          category: guest.category,
          inviteCode: guest.inviteCode,
          guests: []
        })
      }
      referenceGroups.get(guest.referenceCode).guests.push(guest)
    })

    const groupedGuests = Array.from(referenceGroups.values())
    const totalGuests = guests.length
    const totalGroups = groupedGuests.length
    const confirmedGuests = guests.filter(guest => guest.status === 'CONFIRMED').length

    return {
      success: true,
      guests,
      groupedGuests,
      stats: {
        totalGuests,
        totalGroups,
        confirmedGuests
      }
    }

  } catch (error) {
    console.error('Error fetching guests:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
