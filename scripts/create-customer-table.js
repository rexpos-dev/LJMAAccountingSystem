const mysql = require('mysql2/promise');

async function createCustomerTable() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123700',
      database: 'ljma'
    });

    console.log('Connected to MySQL database');

    // Create customer table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS customer (
        id VARCHAR(191) NOT NULL,
        code VARCHAR(191) NOT NULL,
        customerName VARCHAR(191) NOT NULL,
        contactFirstName VARCHAR(191) NULL,
        address VARCHAR(191) NULL,
        phonePrimary VARCHAR(191) NULL,
        phoneAlternative VARCHAR(191) NULL,
        email VARCHAR(191) NULL,
        isActive BOOLEAN NOT NULL DEFAULT true,
        creditLimit DOUBLE NULL DEFAULT 0,
        isTaxExempt BOOLEAN NOT NULL DEFAULT false,
        paymentTerms VARCHAR(191) NULL DEFAULT 'days',
        paymentTermsValue VARCHAR(191) NULL DEFAULT '30',
        salesperson VARCHAR(191) NULL,
        customerGroup VARCHAR(191) NULL DEFAULT 'default',
        isEntitledToLoyaltyPoints BOOLEAN NOT NULL DEFAULT false,
        pointSetting VARCHAR(191) NULL,
        loyaltyCalculationMethod VARCHAR(191) NULL DEFAULT 'automatic',
        loyaltyCardNumber VARCHAR(191) NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        UNIQUE INDEX customer_code_key(code),
        PRIMARY KEY (id)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableQuery);
    console.log('Customer table created successfully');

    // Check if table exists
    const [rows] = await connection.execute("SHOW TABLES LIKE 'customer'");
    if (rows.length > 0) {
      console.log('✅ Customer table exists in ljma database');
    } else {
      console.log('❌ Customer table does not exist');
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

createCustomerTable();
