import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.userPermission.findMany();
    console.log('Total users:', users.length);
    for (const u of users) {
        console.log(`- ${u.id}: ${u.username} (${u.firstName} ${u.lastName}) | Active: ${u.isActive}`);
    }
}

main().finally(() => prisma.$disconnect());
