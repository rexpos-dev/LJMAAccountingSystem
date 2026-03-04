
const mysql = require("mysql2/promise");

async function checkData() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123700",
        database: "ljma_accounting"
    });

    try {
        const [requestCount] = await connection.execute("SELECT COUNT(*) as count FROM request");
        const [userCount] = await connection.execute("SELECT COUNT(*) as count FROM user_permission");
        const [users] = await connection.execute("SELECT id, username, accountType, formPermissions FROM user_permission LIMIT 5");
        const [requests] = await connection.execute("SELECT id, requestNumber, requesterName, status FROM request LIMIT 5");

        console.log('--- DB DATA CHECK ---');
        console.log('Total Requests:', requestCount[0].count);
        console.log('Total Users:', userCount[0].count);
        console.log('User Samples:', JSON.stringify(users, null, 2));
        console.log('Request Samples:', JSON.stringify(requests, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkData();
