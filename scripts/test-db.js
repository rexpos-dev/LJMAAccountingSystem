const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.account.count();
        console.log(`Total accounts in database: ${count}`);
        const latest = await prisma.account.findMany({
            orderBy: { last_updated_at: 'desc' },
            take: 5
        });
        console.log('Latest 5 accounts:', JSON.stringify(latest, null, 2));
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
