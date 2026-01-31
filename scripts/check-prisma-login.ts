import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const connectionString = process.env.DATABASE_URL!

const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(connectionString),
})

async function checkLogin() {
    const username = 'admin@ljma.com';
    const password = 'admin123';

    console.log(`Checking login for: ${username}`);

    try {
        const user = await prisma.userPermission.findUnique({
            where: { username },
        });

        if (!user) {
            console.log('❌ User not found.');
            return;
        }

        console.log('✅ User found:', user.username);
        console.log('Stored Password:', user.password);
        console.log('Input Password: ', password);

        if (user.password === password) {
            console.log('✅ Password MATCHES!');
        } else {
            console.log('❌ Password DOES NOT MATCH!');
        }

        console.log('Is Active:', user.isActive);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLogin();
