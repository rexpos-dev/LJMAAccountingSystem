require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mariadb = require('mariadb');

async function testConnection() {
    console.log("Creating MariaDB pool...");
    const url = process.env.DATABASE_URL.replace('mysql://', 'mariadb://').replace('localhost', '127.0.0.1');
    const pool = mariadb.createPool(url);
    console.log("Initializing adapter...");
    const adapter = new PrismaMariaDb(pool);
    console.log("Creating PrismaClient...");
    const prisma = new PrismaClient({ adapter });

    try {
        console.log("Fetching user...");
        const user = await prisma.userPermission.findFirst();
        console.log("Success! Found user:", user ? user.username : "none");
    } catch (err) {
        console.error("Prisma error:", err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

testConnection().catch(console.error);
