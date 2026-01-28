
import { PrismaClient } from '@prisma/client';

console.log("DB URL:", process.env.DATABASE_URL);

// Fallback to standard client if adapter fails in script context, or try to fix env loading
// Fallback to standard client if adapter fails in script context, or try to fix env loading
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding requests...');

    // Need to remove this if using standard client, or ignore if standard client works
    try {
        await prisma.request.deleteMany();

        const requests = [
            {
                requestNumber: 'REQ-00001',
                requesterName: 'Juan Dela Cruz',
                position: 'Driver',
                accountNo: '1001-2002-3003',
                purpose: 'Gas allowance for delivery truck',
                amount: 5000,
                status: 'To Verify',
            },
            {
                requestNumber: 'REQ-00002',
                requesterName: 'Maria Clara',
                position: 'HR Manager',
                accountNo: '4004-5005-6006',
                purpose: 'Office supplies replenishment',
                amount: 2500.50,
                status: 'To Approve',
            },
            {
                requestNumber: 'REQ-00003',
                requesterName: 'Pedro Penduko',
                position: 'Site Engineer',
                accountNo: '7007-8008-9009',
                purpose: 'Purchase of cement bags',
                amount: 15000,
                status: 'To Process',
            },
            {
                requestNumber: 'REQ-00004',
                requesterName: 'Jose Rizal',
                position: 'Consultant',
                accountNo: '1234-5678-9012',
                purpose: 'Professional fees',
                amount: 50000,
                status: 'Released',
            },
            {
                requestNumber: 'REQ-00005',
                requesterName: 'Andres Bonifacio',
                position: 'Warehouse Staff',
                accountNo: '9876-5432-1098',
                purpose: 'Emergency equipment repair',
                amount: 3200,
                status: 'Received',
            },
            {
                requestNumber: 'REQ-00006',
                requesterName: 'Gabriela Silang',
                position: 'Admin Assistant',
                accountNo: '1111-2222-3333',
                purpose: 'Transportation reimbursement',
                amount: 450,
                status: 'To Verify',
            },
        ];

        for (const req of requests) {
            await prisma.request.create({
                data: req,
            });
            console.log(`Created request: ${req.requestNumber}`);
        }

        console.log('Seeding completed.');
    } catch (e) {
        console.error(e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
