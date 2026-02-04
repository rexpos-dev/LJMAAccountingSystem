
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function debug() {
    console.log('Connecting to:', connectionString);
    const prisma = new PrismaClient({
        adapter: new PrismaMariaDb(connectionString),
    });

    try {
        console.log('Testing connection...');
        await prisma.$connect();
        console.log('Connected.');

        console.log('Fetching requests via $queryRaw...');
        const requests = await prisma.$queryRaw`SELECT * FROM request ORDER BY createdAt DESC LIMIT 5`;
        console.log('Type of requests:', typeof requests);
        console.log('Is array:', Array.isArray(requests));
        console.log('Requests data:', JSON.stringify(requests, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
            , 2));

        console.log('Fetching userPermissions for admin...');
        const user = await prisma.userPermission.findFirst();
        console.log('User:', JSON.stringify(user, null, 2));

    } catch (error) {
        console.error('Debug failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
