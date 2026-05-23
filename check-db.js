const mysql = require('mysql2/promise');

const dbUrlRaw = process.env.DATABASE_URL || 'mariadb://root:@localhost:3306/ljma_accounting';
const dbUrl = new URL(dbUrlRaw.replace(/^mysql:\/\//, 'http://').replace(/^mariadb:\/\//, 'http://'));

async function main() {
    const connection = await mysql.createConnection({
        host: dbUrl.hostname === 'localhost' ? '127.0.0.1' : dbUrl.hostname,
        port: parseInt(dbUrl.port, 10) || 3306,
        user: dbUrl.username || 'root',
        password: dbUrl.password ? decodeURIComponent(dbUrl.password) : '',
        database: dbUrl.pathname.replace('/', ''),
    });

    try {
        console.log('--- User Permissions ---');
        const [users] = await connection.execute(
            'SELECT username, firstName, lastName, accountType, formPermissions FROM user_permission WHERE firstName LIKE ? OR lastName LIKE ?',
            ['%Rex%', '%Domingo%']
        );
        console.log(JSON.stringify(users, null, 2));

        console.log('\n--- Status of REQ-00004 ---');
        const [reqs] = await connection.execute(
            'SELECT requestNumber, status, verifiedBy, approvedBy, processedBy FROM request WHERE requestNumber = ?',
            ['REQ-00004']
        );
        console.log(JSON.stringify(reqs, null, 2));

        console.log('\n--- Status counts ---');
        const [counts] = await connection.execute(
            'SELECT status, COUNT(*) as count FROM request GROUP BY status'
        );
        console.log(JSON.stringify(counts, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}

main();
