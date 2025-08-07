import { PrismaClient } from '@prisma/client';

async function checkGuests() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== All guests for TEST01 ===');
    const guests = await prisma.guest.findMany({
      where: { inviteCode: 'TEST01' },
      select: { id: true, name: true, status: true, email: true }
    });
    console.log(JSON.stringify(guests, null, 2));
    
    console.log('\n=== Only CONFIRMED guests for TEST01 ===');
    const confirmedGuests = await prisma.guest.findMany({
      where: { 
        inviteCode: 'TEST01',
        status: 'CONFIRMED'
      },
      select: { id: true, name: true, status: true, email: true }
    });
    console.log(JSON.stringify(confirmedGuests, null, 2));
    
    console.log('\n=== Checking specific ID: cme0q49n20000pj2knnintn16 ===');
    const specificGuest = await prisma.guest.findUnique({
      where: { id: 'cme0q49n20000pj2knnintn16' },
      select: { id: true, name: true, status: true, email: true, inviteCode: true }
    });
    console.log(JSON.stringify(specificGuest, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGuests();
