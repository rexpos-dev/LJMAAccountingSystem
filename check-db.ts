
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    try {
        const requestCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM request`;
        const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM user_permission`;
        const samples = await prisma.$queryRaw`SELECT * FROM user_permission LIMIT 5`;

        console.log('--- DATABASE STATUS ---');
        console.log('Total Requests:', Number((requestCount as any)[0].count));
        console.log('Total Users:', Number((userCount as any)[0].count));
        console.log('User Samples:', JSON.stringify(samples, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2));

    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
