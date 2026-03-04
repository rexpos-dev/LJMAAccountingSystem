const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const accountTypes = await prisma.account.findMany({ distinct: ['account_type'], select: { account_type: true } });
    console.log("Unique account_type in Account:", accountTypes.map(a => a.account_type));

    const accountCategories = await prisma.account.findMany({ distinct: ['account_category'], select: { account_category: true } });
    console.log("Unique account_category in Account:", accountCategories.map(a => a.account_category));

    const typesTable = await prisma.accountType.findMany();
    console.log("AccountType table:", typesTable);
}
main().catch(console.error).finally(() => prisma.$disconnect());
