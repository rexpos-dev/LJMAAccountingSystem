const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Script to seed the default admin user in the MySQL database.
 * Usage: node scripts/seed-admin-user.js
 */
async function seedAdminUser() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log('🚀 Seeding default admin user...');

    try {
        const adminUser = {
            username: 'admin@ljma.com',
            firstName: 'Super',
            lastName: 'Admin',
            designation: 'Administrator',
            userAccess: 'Full Access',
            accountType: 'Admin',
            password: 'admin123',
            permissions: JSON.stringify([
                'Dashboard', 'Inventory', 'Stocks', 'Stock movement', 'Stock Adjustment', 'Adjustment History',
                'Purchases', 'Warehouse', 'Product Brand', 'Category', 'Price Type', 'Unit of Measure',
                'Sales', 'Customers', 'Suppliers', 'Setup', 'Cashier Admin', 'Backup Database',
                'Positive Adjustment', 'Negative Adjustment', 'Transfer Stocks',
                'Add Purchase Order', 'Approve Purchase Order', 'Receive Purchase Order', 'Void Purchase Order', 'Add/Edit Purchase Cost',
                'Add/Edit Category', 'Add/Edit Price Type',
                'Customer List', 'Customer Balances', 'Customer Payment', 'Customer Loyalty Points', 'Loyalty Points Setting',
                'Add/Edit user'
            ]),
            isActive: true,
            id: 'admin-id-default'
        };

        // Upsert logic
        const [rows] = await connection.execute(
            'SELECT id FROM user_permission WHERE username = ?',
            [adminUser.username]
        );

        if (rows.length > 0) {
            console.log('ℹ️ Admin user already exists. Updating...');
            await connection.execute(
                `UPDATE user_permission SET 
          firstName = ?, lastName = ?, designation = ?, userAccess = ?, 
          accountType = ?, password = ?, permissions = ?, isActive = ? 
        WHERE username = ?`,
                [
                    adminUser.firstName, adminUser.lastName, adminUser.designation,
                    adminUser.userAccess, adminUser.accountType, adminUser.password,
                    adminUser.permissions, adminUser.isActive ? 1 : 0, adminUser.username
                ]
            );
        } else {
            console.log('✨ Creating new admin user...');
            await connection.execute(
                `INSERT INTO user_permission (
          id, username, firstName, lastName, designation, userAccess, 
          accountType, password, permissions, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    adminUser.id, adminUser.username, adminUser.firstName, adminUser.lastName,
                    adminUser.designation, adminUser.userAccess, adminUser.accountType,
                    adminUser.password, adminUser.permissions, adminUser.isActive ? 1 : 0,
                    new Date(), new Date()
                ]
            );
        }

        console.log('✅ Admin user seeded successfully!');
        console.log('Credentials: admin@ljma.com / admin123');

    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    } finally {
        await connection.end();
    }
}

seedAdminUser();
