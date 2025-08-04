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
    // Fetch all active guests
    const guests = await prisma.guest.findMany({
      where: {
        cancelledAt: null
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
      orderBy: [
        { referenceCode: 'asc' },
        { name: 'asc' }
      ]
    })

    // Convert to CSV format
    const headers = [
      'id',
      'name',
      'email',
      'inviteCode',
      'status',
      'category',
      'referenceCode',
      'dietary',
      'kidAge',
      'maleKid',
      'notes',
      'createdAt',
      'updatedAt'
    ]

    const csvRows = [
      headers.join(','), // Header row
      ...guests.map(guest => 
        headers.map(header => {
          const value = guest[header as keyof typeof guest]
          if (value === null || value === undefined) return ''
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]

    const csvContent = csvRows.join('\n')
    
    // Set headers for file download with datetime including hours, minutes, and seconds
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19) // YYYY-MM-DDTHH-MM-SS format
    setHeader(event, 'Content-Type', 'text/csv')
    setHeader(event, 'Content-Disposition', `attachment; filename="convidados-${timestamp}.csv"`)
    
    return csvContent

  } catch (error: any) {
    console.error('Export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
