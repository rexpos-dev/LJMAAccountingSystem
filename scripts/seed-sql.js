
const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL || 'mysql://root:123700@localhost:3306/ljma_accounting'
    });

    console.log('Connected to database.');

    try {
        // Delete existing requests
        await connection.execute('DELETE FROM request');
        console.log('Cleared requests table.');

        const requests = [
            ['REQ-00001', 'Juan Dela Cruz', 'Driver', '1001-2002-3003', 'Gas allowance for delivery truck', 5000, 'To Verify'],
            ['REQ-00002', 'Maria Clara', 'HR Manager', '4004-5005-6006', 'Office supplies replenishment', 2500.50, 'To Approve'],
            ['REQ-00003', 'Pedro Penduko', 'Site Engineer', '7007-8008-9009', 'Purchase of cement bags', 15000, 'To Process'],
            ['REQ-00004', 'Jose Rizal', 'Consultant', '1234-5678-9012', 'Professional fees', 50000, 'Released'],
            ['REQ-00005', 'Andres Bonifacio', 'Warehouse Staff', '9876-5432-1098', 'Emergency equipment repair', 3200, 'Received'],
            ['REQ-00006', 'Gabriela Silang', 'Admin Assistant', '1111-2222-3333', 'Transportation reimbursement', 450, 'To Verify'],
        ];

        const insertQuery = `
      INSERT INTO request (id, requestNumber, requesterName, position, accountNo, purpose, amount, status, createdAt, updatedAt, date)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `;

        // Prepare statement and execute for each
        for (const req of requests) {
            await connection.execute(insertQuery, req);
            console.log(`Inserted ${req[0]}`);
        }

        console.log('Seeding completed successfully.');

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await connection.end();
    }
}

main();
