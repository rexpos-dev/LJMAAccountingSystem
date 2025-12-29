const mysql = require('mysql2/promise');

async function checkLoyaltySettingTable() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123700',
      database: 'ljma'
    });

    console.log('Connected to MySQL database');

    // Check if loyalty_point_setting table exists
    const [rows] = await connection.execute("SHOW TABLES LIKE 'loyalty_point_setting'");
    if (rows.length > 0) {
      console.log('✅ loyalty_point_setting table exists');

      // Check if it has data
      const [dataRows] = await connection.execute("SELECT COUNT(*) as count FROM loyalty_point_setting");
      console.log(`✅ loyalty_point_setting table has ${dataRows[0].count} records`);
    } else {
      console.log('❌ loyalty_point_setting table does not exist');
    }

    // Check if loyalty_point table exists
    const [loyaltyRows] = await connection.execute("SHOW TABLES LIKE 'loyalty_point'");
    if (loyaltyRows.length > 0) {
      console.log('✅ loyalty_point table exists');

      // Check if it has data
      const [loyaltyDataRows] = await connection.execute("SELECT COUNT(*) as count FROM loyalty_point");
      console.log(`✅ loyalty_point table has ${loyaltyDataRows[0].count} records`);
    } else {
      console.log('❌ loyalty_point table does not exist');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

checkLoyaltySettingTable();
