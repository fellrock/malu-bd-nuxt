import { z } from 'zod'
import { prisma } from '../utils/prisma'
import * as XLSX from 'xlsx'

// Validation schema for imported guest data
const importedGuestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.enum(['Amigos', 'Creche', 'Familia', 'Padrinhos']),
  referenceCode: z.string().min(1, 'Código de referência é obrigatório'),
  email: z.string().email().optional().or(z.literal('')),
  dietary: z.string().optional(),
  kidAge: z.number().optional(),
  maleKid: z.boolean().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Parse multipart form data
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nenhum arquivo foi enviado'
      })
    }

    const fileData = formData[0]
    if (!fileData || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Arquivo inválido'
      })
    }

    // Parse Excel file
    let guestsData: any[] = []

    if (fileData.filename?.endsWith('.xlsx')) {
      const workbook = XLSX.read(fileData.data, {
        type: 'buffer',
        codepage: 28591
      })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      guestsData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    } else {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Formato de arquivo não suportado. Apenas arquivos Excel são aceitos.'
      })
    }

    // Validate and create guests
    const createdGuests = []
    const errors = []

    for (let i = 0; i < guestsData.length; i++) {
      try {
        const guest = guestsData[i]
        
        // Convert string values to proper types
        if (guest.kidAge) guest.kidAge = parseInt(guest.kidAge)
        if (guest.maleKid) guest.maleKid = guest.maleKid.toLowerCase() === 'true' || guest.maleKid === '1'
        
        const validatedGuest = importedGuestSchema.parse(guest)
        
        // Generate invite code for the reference group
        let inviteCode = ''
        const existingGuest = await prisma.guest.findFirst({
          where: { referenceCode: validatedGuest.referenceCode }
        })
        
        if (existingGuest) {
          inviteCode = existingGuest.inviteCode
        } else {
          // Generate new invite code
          const generateInviteCode = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase()
          }
          
          inviteCode = generateInviteCode()
          let codeExists = await prisma.guest.findFirst({
            where: { inviteCode }
          })
          
          while (codeExists) {
            inviteCode = generateInviteCode()
            codeExists = await prisma.guest.findFirst({
              where: { inviteCode }
            })
          }
        }

        const newGuest = await prisma.guest.create({
          data: {
            name: validatedGuest.name,
            email: validatedGuest.email || null,
            inviteCode,
            category: validatedGuest.category,
            referenceCode: validatedGuest.referenceCode,
            dietary: validatedGuest.dietary || null,
            kidAge: validatedGuest.kidAge || null,
            maleKid: validatedGuest.maleKid || false,
            notes: validatedGuest.notes || null,
            status: 'REGISTERED'
          }
        })
        
        createdGuests.push(newGuest)
        
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          errors.push(`Linha ${i + 2}: ${error.issues.map(issue => issue.message).join(', ')}`)
        } else if (error?.code === 'P2002') {
          errors.push(`Linha ${i + 2}: Nome "${guestsData[i].name}" já existe`)
        } else {
          errors.push(`Linha ${i + 2}: Erro desconhecido`)
        }
      }
    }

    return {
      success: true,
      message: `${createdGuests.length} convidado(s) importado(s) com sucesso!`,
      imported: createdGuests.length,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Import error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})
