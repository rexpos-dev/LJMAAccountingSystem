const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allAccounts = await prisma.account.findMany();
    console.log('All accounts:', allAccounts);
}

main()
    .catch((e: any) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export { };
