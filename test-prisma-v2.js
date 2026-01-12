const { PrismaClient } = require('./src/generated/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

async function test() {
    console.log('Using connection string:', connectionString.replace(/:[^:@]+@/, ':***@'));
    const prisma = new PrismaClient({
        adapter: new PrismaMariaDb(connectionString),
    });

    try {
        await prisma.$connect();
        console.log('✅ Connected to database');

        const tables = ['Account', 'Transaction', 'Customer', 'SalesUser'];
        for (const table of tables) {
            try {
                const count = await prisma[table.charAt(0).toLowerCase() + table.slice(1)].count();
                console.log(`✅ Table ${table}: ${count} records`);
            } catch (err) {
                console.error(`❌ Error querying ${table}:`, err.message);
            }
        }
    } catch (err) {
        console.error('❌ Connection error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
