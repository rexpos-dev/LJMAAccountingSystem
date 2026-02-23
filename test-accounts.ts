import { prisma } from './src/lib/prisma';

async function main() {
    console.log("Querying database...");
    const allAccounts = await prisma.account.findMany();
    console.log("Total accounts:", allAccounts.length);

    const liabilities = allAccounts.filter((acc: any) =>
        (acc.account_type && acc.account_type.toLowerCase().includes('liabilit')) ||
        (acc.header && acc.header.toLowerCase().includes('liabilit')) ||
        (acc.account_category && acc.account_category.toLowerCase().includes('liabilit')) ||
        (acc.account_name && acc.account_name.toLowerCase().includes('purchase supplier'))
    );

    console.log("Liability accounts found:");
    console.log(JSON.stringify(liabilities, null, 2));

    const sample = allAccounts.slice(0, 5);
    console.log("Sample accounts to see structure:");
    console.log(JSON.stringify(sample, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
