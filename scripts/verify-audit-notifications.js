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

async function checkNotifications() {
    console.log('Checking recent AUDIT_ASSIGNMENT notifications...');
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                type: 'AUDIT_ASSIGNMENT'
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        if (notifications.length === 0) {
            console.log('No AUDIT_ASSIGNMENT notifications found.');
        } else {
            console.table(notifications.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                userId: n.userId,
                createdAt: n.createdAt.toLocaleString()
            })));
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

checkNotifications();
