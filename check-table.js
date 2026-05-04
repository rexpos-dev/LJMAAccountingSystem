
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
    const dbUrlRaw = process.env.DATABASE_URL;
    try {
        const connection = await mysql.createConnection(dbUrlRaw.replace('mariadb://', 'mysql://'));
        const [rows] = await connection.execute('DESCRIBE supplier');
        console.log(JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
