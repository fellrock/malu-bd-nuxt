#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkGuest() {
  try {
    const guest = await prisma.guest.findFirst({ 
      where: { inviteCode: 'TEST01' }
    })
    
    console.log('Guest found:', guest)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkGuest().catch(console.error)
