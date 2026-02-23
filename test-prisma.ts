require('dotenv').config();
const { prisma } = require('./src/lib/prisma');

async function test() {
    try {
        const suppliers = await prisma.supplier.findMany({ select: { id: true }, take: 1 });
        console.log('✅ Connection successful. Found', suppliers.length, 'suppliers.');

        const salesUsers = await prisma.salesUser.findMany({ select: { id: true }, take: 1 });
        console.log('✅ Found', salesUsers.length, 'sales users.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    }
}

test();
