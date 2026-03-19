const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const acc1210 = await prisma.account.findUnique({
        where: { account_no: 1210 }
    });
    const acc4000 = await prisma.account.findUnique({
        where: { account_no: 4000 }
    });

    console.log("Account 1210 (AR):", acc1210 ? "Found" : "Not Found");
    console.log("Account 4000 (Revenue):", acc4000 ? "Found" : "Not Found");

    if (!acc1210 || !acc4000) {
        console.log("\nOne or more required accounts are missing. This will cause invoice saving to fail.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
