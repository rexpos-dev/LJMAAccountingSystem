const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bas = await prisma.bankAccount.findMany({
        include: {
            gl_account: true
        }
    });
    console.log(JSON.stringify(bas, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
