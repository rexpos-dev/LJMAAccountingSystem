require('dotenv').config();
const mariadb = require('mariadb');

async function testConnection() {
    console.log("Connecting with mariadb...");
    console.log("URL:", process.env.DATABASE_URL.replace('mysql://', 'mariadb://').replace('localhost', '127.0.0.1'));
    try {
        const pool = mariadb.createPool(process.env.DATABASE_URL.replace('mysql://', 'mariadb://').replace('localhost', '127.0.0.1'));
        const connection = await pool.getConnection();
        console.log("Connected successfully!");
        const rows = await connection.query('SELECT 1 + 1 AS result');
        console.log("Query result:", rows[0].result);
        await connection.end();
        await pool.end();
    } catch (err) {
        console.error("Connection error:", err);
    }
}

testConnection();
