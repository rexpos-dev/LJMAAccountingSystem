const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkAdminUser() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log('🔍 Checking for admin user...');

    try {
        const [rows] = await connection.execute(
            'SELECT id, username, password, isActive FROM user_permission WHERE username = ?',
            ['admin@ljma.com']
        );

        if (rows.length > 0) {
            console.log('✅ Admin user found:', rows[0]);
        } else {
            console.log('❌ Admin user NOT found.');
        }

    } catch (error) {
        console.error('❌ Error checking admin user:', error);
    } finally {
        await connection.end();
    }
}

checkAdminUser();
