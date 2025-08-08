import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createCancelledTest() {
  try {
    // First, delete any existing TESTE guests
    await prisma.guest.deleteMany({
      where: { referenceCode: 'TESTE' }
    })
    
    console.log('Deleted existing TESTE guests')

    // Create a new guest with CANCELLED status
    const guest = await prisma.guest.create({
      data: {
        name: 'João Cancelado',
        referenceCode: 'TESTE',
        inviteCode: 'TESTE',
        status: 'CANCELLED',
        category: 'Amigos',
        email: 'joao@test.com',
        notes: 'Test guest for cancellation flow'
      }
    })

    console.log('Created cancelled test guest:', guest)
    
    // Verify the guest was created
    const foundGuest = await prisma.guest.findMany({
      where: { referenceCode: 'TESTE' }
    })
    
    console.log('Found guests with TESTE code:', foundGuest)
    
  } catch (error) {
    console.error('Error creating cancelled test guest:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createCancelledTest()
