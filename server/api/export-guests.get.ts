import { prisma } from '../utils/prisma'
import * as XLSX from 'xlsx'

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
        status: { not: 'CANCELLED' as any }
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

    // Build Excel workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(guests)
    XLSX.utils.book_append_sheet(wb, ws, 'Guests')
    const buffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'buffer',
      codepage: 28591
    })

    // Set headers for file download with datetime including hours, minutes, and seconds
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19) // YYYY-MM-DDTHH-MM-SS format
    setHeader(
      event,
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    setHeader(
      event,
      'Content-Disposition',
      `attachment; filename="convidados-${timestamp}.xlsx"`
    )

    return buffer

  } catch (error: any) {
    console.error('Export error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
