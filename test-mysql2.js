require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log("Connecting with mysql2...");
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);
        console.log("Connected successfully!");
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log("Query result:", rows[0].result);
        await connection.end();
    } catch (err) {
        console.error("Connection error:", err);
    }
}

testConnection();
