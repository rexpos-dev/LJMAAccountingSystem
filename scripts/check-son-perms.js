
const mysql = require('mysql2/promise');

async function main() {
    const conn = await mysql.createConnection('mysql://root:123700@localhost:3306/ljma_accounting');
    try {
        const [rows] = await conn.execute('SELECT username, accountType, formPermissions, permissions FROM user_permission WHERE username = ?', ['Son']);
        console.log(JSON.stringify(rows[0], null, 2));
    } catch (err) {
        console.log(err.message);
    } finally {
        await conn.end();
    }
}

main();
