import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Only allow GET requests
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Get invite code from URL parameters
    const inviteCode = getRouterParam(event, 'code')
    
    if (!inviteCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Código de convite é obrigatório'
      })
    }

    // Find all guests with this invite code (group)
    const guests = await prisma.guest.findMany({
      where: {
        inviteCode: inviteCode.toUpperCase(),
        cancelledAt: null // Only active guests
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
        notes: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    if (guests.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Convite não encontrado'
      })
    }

    // Get reference info from first guest (all should have same reference)
    const referenceInfo = guests[0] ? {
      referenceCode: guests[0].referenceCode,
      category: guests[0].category,
      inviteCode: guests[0].inviteCode
    } : null

    return {
      success: true,
      guests,
      referenceInfo,
      totalGuests: guests.length
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching guests by invite code:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
