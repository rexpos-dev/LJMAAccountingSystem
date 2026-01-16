const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('Error: DATABASE_URL is not defined in environment variables.');
    process.exit(1);
}

async function fetchAllData() {
    const prisma = new PrismaClient({
        adapter: new PrismaMariaDb(connectionString),
    });

    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected.');

        const models = [
            'account',
            'transaction',
            'loyaltyPointSetting',
            'customer',
            'loyaltyPoint',
            'product',
            'conversionFactor',
            'brand',
            'category',
            'supplier',
            'unitOfMeasure',
            'reminder',
            'salesUser',
            'userPermission',
            'businessProfile',
            'backupSchedule',
            'notification',
        ];

        const allData = {};

        console.log('Fetching data from all models...');

        for (const model of models) {
            if (prisma[model]) {
                try {
                    const data = await prisma[model].findMany();
                    allData[model] = data;
                    console.log(`Fetched ${data.length} records from ${model}`);
                } catch (err) {
                    console.error(`Error fetching ${model}:`, err.message);
                    allData[model] = { error: err.message };
                }
            } else {
                console.warn(`Model ${model} not found in Prisma client.`);
            }
        }

        // Get latest transaction specifically
        console.log('Fetching latest transaction...');
        const latestTransaction = await prisma.transaction.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (latestTransaction) {
            console.log('Latest Transaction:', latestTransaction);
            allData['latestTransaction'] = latestTransaction;
        } else {
            console.log('No transactions found.');
        }

        // Write to file
        const outputPath = path.join(__dirname, '..', 'database_dump.json');
        fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
        console.log(`All data saved to ${outputPath}`);

    } catch (error) {
        console.error('Error in fetchAllData:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fetchAllData();
