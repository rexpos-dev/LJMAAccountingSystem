require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2/promise');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found in .env');
        process.exit(1);
    }

    // Create a pool using mysql2
    const pool = mysql.createPool(connectionString);
    const adapter = new PrismaMariaDb(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const count = await prisma.account.count();
        console.log(`Total Accounts found: ${count}`);
        if (count > 0) {
            const accounts = await prisma.account.findMany({ take: 5 });
            console.log('Sample accounts:', accounts);
        } else {
            console.log('No accounts found. The chart of accounts table is empty.');
        }
    } catch (e) {
        console.error('Error querying database:', e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
