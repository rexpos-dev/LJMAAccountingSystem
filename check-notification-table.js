const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('localhost', '127.0.0.1') : '';

const pool = mysql.createPool({
    uri: connectionString,
    idleTimeout: 1000,
});
const adapter = new PrismaMariaDb(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        console.log('Connecting...');
        console.log('DB URL Length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);

        // Try to create a notification
        const notification = await prisma.notification.create({
            data: {
                type: 'test',
                title: 'Test Notification',
                message: 'This is a test',
                entityId: 'test-id',
            },
        });
        console.log('Created Notification:', notification);

        // Try to fetch it
        const fetched = await prisma.notification.findMany();
        console.log('Fetched Notifications:', fetched);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
