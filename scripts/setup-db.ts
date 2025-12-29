import mysql from "mysql2/promise";

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123700"
  });

  try {
    // Drop old database if exists
    await connection.execute('DROP DATABASE IF EXISTS ljma_accounting');
    console.log('✅ Old database dropped (if existed)');

    // Create new database if not exists
    await connection.execute('CREATE DATABASE IF NOT EXISTS ljma_accounting');
    console.log('✅ New database created');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();