import mysql from "mysql2/promise";

async function checkSalesUserTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123700",
    database: "ljma_accounting"
  });

  try {
    const [rows] = await connection.execute("SHOW TABLES LIKE 'sales_user'");
    if (rows.length > 0) {
      console.log('✅ sales_user table exists');
    } else {
      console.log('❌ sales_user table does not exist');
    }
  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    await connection.end();
  }
}

checkSalesUserTable();
