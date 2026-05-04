
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
    const dbUrlRaw = process.env.DATABASE_URL;
    try {
        const connection = await mysql.createConnection(dbUrlRaw.replace('mariadb://', 'mysql://'));
        const [rows] = await connection.execute('SELECT * FROM supplier WHERE name = "A BS"');
        console.log(JSON.stringify(rows, (key, value) => {
            if (typeof value === 'string') {
                return value.replace(/[\x00-\x1F\x7F-\x9F]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
            }
            return value;
        }, 2));
        await connection.end();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
