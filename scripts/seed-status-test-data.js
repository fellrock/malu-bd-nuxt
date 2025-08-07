#!/usr/bin/env node

/**
 * Script to seed test data with different guest statuses
 * Usage: node scripts/seed-status-test-data.js
 * 
 * This script creates guests with various statuses to test the page routing system:
 * - REGISTERED guests (for main page testing)
 * - CANCELLED guests (for main page testing)
 * - PENDING guests (for invitation page testing)
 * - CONFIRMED guests (for event page testing)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample data for generating realistic guests
const firstNames = [
  'Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Pedro', 'Juliana', 'Rafael',
  'Camila', 'Lucas', 'Beatriz', 'Gabriel', 'Larissa', 'Matheus', 'Carolina',
  'Diego', 'Amanda', 'Thiago', 'Isabela', 'Ricardo', 'Letícia', 'André',
  'Mariana', 'Felipe', 'Natália', 'Bruno', 'Priscila', 'Rodrigo', 'Vanessa'
]

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
  'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha',
  'Dias', 'Monteiro', 'Cardoso', 'Reis', 'Araújo', 'Castro', 'Andrade'
]

const emailDomains = [
  'gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'uol.com.br'
]

const dietaryRestrictions = [
  'Vegetariano',
  'Vegano', 
  'Sem glúten',
  'Sem lactose',
  'Sem amendoim',
  'Diabético',
  null, // No restrictions
  null,
  null // Most people don't have restrictions
]

const sampleNotes = [
  'Confirmo presença!',
  'Estarei lá com certeza!',
  'Ansiosa para a festa!',
  'Obrigada pelo convite!',
  'Mal posso esperar!',
  null,
  null,
  null // Most don't have notes
]

function generateRandomGuest(status = 'REGISTERED', inviteCode, referenceCode) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)]
  
  const name = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`
  
  // 30% chance of having a kid
  const hasKid = Math.random() < 0.3
  const kidAge = hasKid ? Math.floor(Math.random() * 12) + 1 : null
  const maleKid = hasKid ? Math.random() < 0.5 : null
  
  const dietary = dietaryRestrictions[Math.floor(Math.random() * dietaryRestrictions.length)]
  const notes = sampleNotes[Math.floor(Math.random() * sampleNotes.length)]
  
  // Categories for guest classification
  const categories = ['Amigos', 'Creche', 'Familia', 'Padrinhos']
  const category = categories[Math.floor(Math.random() * categories.length)]
  
  return {
    name,
    email,
    status,
    inviteCode,
    referenceCode,
    category,
    kidAge,
    maleKid,
    dietary,
    notes
  }
}

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function createTestInvitations() {
  console.log('🎉 Creating test invitations for status testing...\n')
  
  const invitations = []
  
  // 1. REGISTERED guests invitation (main page test)
  const registeredCode = generateInviteCode()
  const registeredRefCode = `REG-${registeredCode}`
  
  // Add 2-3 REGISTERED guests
  const registeredGuestCount = Math.floor(Math.random() * 2) + 2 // 2-3 guests
  for (let i = 0; i < registeredGuestCount; i++) {
    await prisma.guest.create({
      data: generateRandomGuest('REGISTERED', registeredCode, registeredRefCode)
    })
  }
  
  invitations.push({
    type: 'REGISTERED',
    code: registeredCode,
    guests: registeredGuestCount,
    description: 'Guests who received invitation but haven\'t responded yet'
  })
  
  // 2. CANCELLED guests invitation (main page test)
  const cancelledCode = generateInviteCode()
  const cancelledRefCode = `CAN-${cancelledCode}`
  
  // Add 1-2 CANCELLED guests
  const cancelledGuestCount = Math.floor(Math.random() * 2) + 1 // 1-2 guests
  for (let i = 0; i < cancelledGuestCount; i++) {
    await prisma.guest.create({
      data: generateRandomGuest('CANCELLED', cancelledCode, cancelledRefCode)
    })
  }
  
  invitations.push({
    type: 'CANCELLED',
    code: cancelledCode,
    guests: cancelledGuestCount,
    description: 'Guests who declined the invitation'
  })
  
  // 3. PENDING guests invitation (invitation page test)
  const pendingCode = generateInviteCode()
  const pendingRefCode = `PEN-${pendingCode}`
  
  // Add 2-4 PENDING guests
  const pendingGuestCount = Math.floor(Math.random() * 3) + 2 // 2-4 guests
  for (let i = 0; i < pendingGuestCount; i++) {
    await prisma.guest.create({
      data: generateRandomGuest('PENDING', pendingCode, pendingRefCode)
    })
  }
  
  invitations.push({
    type: 'PENDING',
    code: pendingCode,
    guests: pendingGuestCount,
    description: 'Guests who accepted but need to complete their data'
  })
  
  // 4. CONFIRMED guests invitation (event page test)
  const confirmedCode = generateInviteCode()
  const confirmedRefCode = `CON-${confirmedCode}`
  
  // Add 2-3 CONFIRMED guests
  const confirmedGuestCount = Math.floor(Math.random() * 2) + 2 // 2-3 guests
  for (let i = 0; i < confirmedGuestCount; i++) {
    await prisma.guest.create({
      data: generateRandomGuest('CONFIRMED', confirmedCode, confirmedRefCode)
    })
  }
  
  invitations.push({
    type: 'CONFIRMED',
    code: confirmedCode,
    guests: confirmedGuestCount,
    description: 'Guests who confirmed and completed their data'
  })
  
  // 5. MIXED STATUS invitation (complex routing test)
  const mixedCode = generateInviteCode()
  const mixedRefCode = `MIX-${mixedCode}`
  
  // Add guests with different statuses
  const mixedStatuses = ['REGISTERED', 'PENDING', 'CONFIRMED']
  for (let i = 0; i < 3; i++) {
    await prisma.guest.create({
      data: generateRandomGuest(mixedStatuses[i], mixedCode, mixedRefCode)
    })
  }
  
  invitations.push({
    type: 'MIXED',
    code: mixedCode,
    guests: 3,
    description: 'Mixed statuses - should route to event page (has CONFIRMED)'
  })
  
  return invitations
}

async function main() {
  try {
    console.log('🚀 Starting test data generation...\n')
    
    const invitations = await createTestInvitations()
    
    console.log('✅ Test invitations created successfully!\n')
    console.log('📋 Generated Invitations:\n')
    
    invitations.forEach((inv, index) => {
      console.log(`${index + 1}. ${inv.type} Status`)
      console.log(`   Code: ${inv.code}`)
      console.log(`   Guests: ${inv.guests}`)
      console.log(`   Description: ${inv.description}`)
      console.log(`   URL: http://localhost:3000/${inv.code}`)
      console.log('')
    })
    
    console.log('🧪 Test Scenarios:')
    console.log('• REGISTERED guests → Should stay on main page with decision buttons')
    console.log('• CANCELLED guests → Should stay on main page with cancellation message')
    console.log('• PENDING guests → Should redirect to /convite/[code] for data completion')
    console.log('• CONFIRMED guests → Should redirect to /evento/[code] for event details')
    console.log('• MIXED statuses → Should follow priority: CONFIRMED > PENDING > REGISTERED')
    console.log('')
    console.log('🎯 Use these URLs to test the strict page routing system!')
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
