const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
    const connectionString = process.env.DATABASE_URL;
    const pool = mysql.createPool(connectionString);
    const adapter = new PrismaMariaDb(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const users = await prisma.userPermission.findMany({
            select: {
                username: true,
                accountType: true,
            },
        });
        console.log('User Permissions:', users);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
