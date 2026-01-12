import mysql from "mysql2/promise";

async function checkUserPermissionTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123700"
  });

  try {
    await connection.execute('USE ljma_accounting');

    // Check if user_permission table exists
    const [rows] = await connection.execute(
      "SHOW TABLES LIKE 'user_permission'"
    );

    if (rows.length > 0) {
      console.log('✅ user_permission table exists');

      // Check table structure
      const [columns] = await connection.execute(
        "DESCRIBE user_permission"
      );

      console.log('Table structure:');
      columns.forEach(column => {
        console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });

      // Check if there are any records
      const [count] = await connection.execute(
        "SELECT COUNT(*) as count FROM user_permission"
      );

      console.log(`📊 Records in table: ${count[0].count}`);
    } else {
      console.log('❌ user_permission table does not exist');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkUserPermissionTable();
