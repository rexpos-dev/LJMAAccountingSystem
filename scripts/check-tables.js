
const mysql = require('mysql2/promise');

async function main() {
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL || 'mysql://root:123700@localhost:3306/ljma_accounting'
    });

    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables:', rows);

    await connection.end();
}

main();
