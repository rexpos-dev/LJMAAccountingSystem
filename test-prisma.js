const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const connectionString = (process.env.DATABASE_URL || '').replace(/^mysql:\/\//, 'mariadb://');

async function main() {
    const adapter = new PrismaMariaDb(connectionString);
    const prisma = new PrismaClient({ adapter });

    try {
        const salesCount = await prisma.posSale.count();
        console.log('Total PosSale records:', salesCount);

        const latestSales = await prisma.posSale.findMany({
            orderBy: { date: 'desc' },
            take: 5
        });
        console.log('Latest 5 PosSales:', latestSales);

        const syncLogs = await prisma.posSyncLog.findMany();
        console.log('Sync Logs:', syncLogs);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
