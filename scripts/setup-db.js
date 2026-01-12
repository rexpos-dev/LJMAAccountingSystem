import mysql from "mysql2/promise";

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123700"
  });

  try {
    // Create database if not exists (preserve existing data)
    await connection.execute('CREATE DATABASE IF NOT EXISTS ljma_accounting');
    console.log('✅ Database created (if not existed)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();