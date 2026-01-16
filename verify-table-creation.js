
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const connectionString = process.env.DATABASE_URL;

async function verifyTables() {
    const prisma = new PrismaClient({
        adapter: new PrismaMariaDb(connectionString),
    });

    try {
        console.log('Verifying tables...');
        await prisma.$connect();

        // Query information_schema to get list of tables
        // Note: This raw query syntax might need adjustment depending on the exact MariaDB version/Prisma setup,
        // but standard SQL should work.
        const result = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `;

        console.log('Tables found in database:');
        if (Array.isArray(result)) {
            result.forEach(row => {
                // The result structure depends on the driver, but typically it's an array of objects
                // with keys lowercased or matching the column name.
                console.log(`- ${row.TABLE_NAME || row.table_name}`);
            });
            console.log(`\nTotal tables: ${result.length}`);
        } else {
            console.log('Result format unexpected:', result);
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyTables();
