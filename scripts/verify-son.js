
const mysql = require('mysql2/promise');

async function main() {
    const conn = await mysql.createConnection('mysql://root:123700@localhost:3306/ljma_accounting');
    try {
        const [rows] = await conn.execute('SELECT username, accountType, formPermissions, permissions FROM user_permission WHERE username = ?', ['Son']);
        if (rows.length > 0) {
            const user = rows[0];
            console.log('Username:', user.username);
            console.log('AccountType:', user.accountType);
            console.log('FormPermissions:', user.formPermissions);
            console.log('Permissions (JSON):', user.permissions);
            try {
                const perms = JSON.parse(user.permissions);
                console.log('Parsed Permissions:', perms);
                console.log('Is "JOB ORDER REQUEST FORM" in list?', perms.includes("JOB ORDER REQUEST FORM"));
                console.log('Is "DISBURSEMENT" in list?', perms.includes("DISBURSEMENT"));
            } catch (e) {
                console.log('Failed to parse permissions');
            }
        } else {
            console.log('User Son not found');
        }
    } catch (err) {
        console.log(err.message);
    } finally {
        await conn.end();
    }
}

main();
