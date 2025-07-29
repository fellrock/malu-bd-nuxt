import { PrismaClient } from '../../app/generated/prisma'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Only allow GET requests
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Fetch all guests with basic info
    const guests = await prisma.guest.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        inviteCode: true,
        status: true,
        dietary: true,
        plusOnes: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary stats
    const totalGuests = guests.length
    const totalPeople = guests.reduce((sum, guest) => sum + guest.plusOnes + 1, 0)
    const confirmedGuests = guests.filter(guest => guest.status === 'CONFIRMED').length

    return {
      success: true,
      guests,
      stats: {
        totalGuests,
        totalPeople,
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
