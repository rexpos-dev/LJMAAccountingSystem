const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test customer query
    const customers = await prisma.customer.findMany();
    console.log(`✅ Found ${customers.length} customers`);

    // Test loyalty points query
    const loyaltyPoints = await prisma.loyaltyPoint.findMany();
    console.log(`✅ Found ${loyaltyPoints.length} loyalty points`);

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
