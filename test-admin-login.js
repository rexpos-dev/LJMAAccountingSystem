
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const connectionString = process.env.DATABASE_URL;

async function testAdminLogin() {
    const prisma = new PrismaClient({
        adapter: new PrismaMariaDb(connectionString),
    });

    const username = 'admin@ljma.com';
    const password = 'admin123';

    try {
        console.log(`Checking credentials for: ${username}`);

        const user = await prisma.userPermission.findUnique({
            where: { username },
        });

        if (!user) {
            console.error('❌ User NOT found!');
            process.exit(1);
        }

        console.log('✅ User found.');

        if (user.password === password) {
            console.log('✅ Password matches.');
            console.log('✅ Admin login verification SUCCESSFUL.');
        } else {
            console.error('❌ Password mismatch!');
            console.log(`Expected: ${password}`);
            console.log(`Actual: ${user.password}`);
        }

    } catch (error) {
        console.error('❌ Error during verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAdminLogin();
