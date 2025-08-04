#!/usr/bin/env node

/**
 * Script to seed test data for Maria Luiza's birthday party
 * Creates sample guests with different statuses for testing
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate a random 6-character invite code
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const sampleGuests = [
  // Family 1 - CONFIRMED (can access event page)
  {
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    inviteCode: 'FAMIL1',
    status: 'CONFIRMED',
    category: 'Familia',
    referenceCode: 'REF001',
    dietary: null,
    notes: 'Tia da Maria Luiza'
  },
  {
    name: 'Pedro Silva',
    email: 'pedro.silva@email.com',
    inviteCode: 'FAMIL1',
    status: 'CONFIRMED',
    category: 'Familia',
    referenceCode: 'REF001',
    dietary: null,
    notes: 'Tio da Maria Luiza'
  },
  {
    name: 'Lucas Silva',
    email: null,
    inviteCode: 'FAMIL1',
    status: 'CONFIRMED',
    category: 'Familia',
    referenceCode: 'REF001',
    kidAge: 6,
    maleKid: true,
    dietary: 'Não gosta de verduras',
    notes: 'Primo da Maria Luiza'
  },

  // Family 2 - REGISTERED (will see invitation page)
  {
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    inviteCode: 'AMIG01',
    status: 'REGISTERED',
    category: 'Amigos',
    referenceCode: 'REF002',
    dietary: null,
    notes: 'Amiga da família'
  },
  {
    name: 'João Santos',
    email: 'joao.santos@email.com',
    inviteCode: 'AMIG01',
    status: 'REGISTERED',
    category: 'Amigos',
    referenceCode: 'REF002',
    dietary: null,
    notes: 'Marido da Maria Santos'
  },
  {
    name: 'Sofia Santos',
    email: null,
    inviteCode: 'AMIG01',
    status: 'REGISTERED',
    category: 'Amigos',
    referenceCode: 'REF002',
    kidAge: 4,
    maleKid: false,
    dietary: 'Alergia a amendoim',
    notes: 'Amiguinha da Maria Luiza'
  },

  // Godparents - CONFIRMED
  {
    name: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    inviteCode: 'PADRI1',
    status: 'CONFIRMED',
    category: 'Padrinhos',
    referenceCode: 'REF003',
    dietary: null,
    notes: 'Padrinho da Maria Luiza'
  },
  {
    name: 'Carla Lima',
    email: 'carla.lima@email.com',
    inviteCode: 'PADRI1',
    status: 'CONFIRMED',
    category: 'Padrinhos',
    referenceCode: 'REF003',
    dietary: 'Vegetariana',
    notes: 'Madrinha da Maria Luiza'
  },

  // Daycare friends - REGISTERED
  {
    name: 'Elena Ferreira',
    email: 'elena.ferreira@email.com',
    inviteCode: 'CRECH1',
    status: 'REGISTERED',
    category: 'Creche',
    referenceCode: 'REF004',
    dietary: null,
    notes: 'Mãe da amiguinha da creche'
  },
  {
    name: 'Beatriz Ferreira',
    email: null,
    inviteCode: 'CRECH1',
    status: 'REGISTERED',
    category: 'Creche',
    referenceCode: 'REF004',
    kidAge: 4,
    maleKid: false,
    dietary: null,
    notes: 'Amiguinha da creche'
  },

  // Single guest - CONFIRMED
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    inviteCode: 'INDIV1',
    status: 'CONFIRMED',
    category: 'Amigos',
    referenceCode: 'REF005',
    dietary: 'Diabético',
    notes: 'Amigo de longa data'
  },

  // Family with mixed status - one ATTENDED to test the full flow
  {
    name: 'Patricia Costa',
    email: 'patricia.costa@email.com',
    inviteCode: 'FAMIL2',
    status: 'ATTENDED',
    category: 'Familia',
    referenceCode: 'REF006',
    dietary: null,
    notes: 'Prima que já participou'
  }
]

async function seedTestData() {
  try {
    console.log('🌱 Starting to seed test data...')
    
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await prisma.guest.deleteMany()
    
    console.log('👥 Creating sample guests...')
    
    for (const guest of sampleGuests) {
      await prisma.guest.create({
        data: guest
      })
      console.log(`   ✅ Created: ${guest.name} (${guest.status})`)
    }
    
    // Get statistics
    const stats = await prisma.guest.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })
    
    console.log('\n📊 Database Statistics:')
    for (const stat of stats) {
      console.log(`   ${stat.status}: ${stat._count.id} guests`)
    }
    
    const totalGuests = await prisma.guest.count()
    const totalGroups = await prisma.guest.groupBy({
      by: ['referenceCode']
    })
    
    console.log(`   Total Guests: ${totalGuests}`)
    console.log(`   Total Groups: ${totalGroups.length}`)
    
    console.log('\n🎯 Test Scenarios Created:')
    console.log('   FAMIL1, PADRI1, INDIV1 - Access evento page (CONFIRMED)')
    console.log('   AMIG01, CRECH1 - Access convite page (REGISTERED)')
    console.log('   FAMIL2 - Shows ATTENDED status (ATTENDED)')
    console.log('   INVALID - Will show access denied page')
    
    console.log('\n🚀 Test URLs:')
    console.log('   http://localhost:3000/FAMIL1 → Event page (confirmed)')
    console.log('   http://localhost:3000/AMIG01 → Invitation page (registered)')
    console.log('   http://localhost:3000/INVALID → Access denied page')
    console.log('   http://localhost:3000/admin → Admin dashboard')
    
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedTestData()
  .then(() => {
    console.log('\n🎉 Test data seeded successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
