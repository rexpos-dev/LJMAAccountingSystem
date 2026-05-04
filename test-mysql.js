
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
    const dbUrlRaw = process.env.DATABASE_URL;
    console.log('Connecting to:', dbUrlRaw);

    try {
        const connection = await mysql.createConnection(dbUrlRaw.replace('mariadb://', 'mysql://'));
        console.log('✅ Connected to database successfully!');

        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM supplier');
        console.log('Suppliers count:', rows[0].count);

        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

main();
