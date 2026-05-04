import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { mockTransactions, mockAuditLogs } from '../src/lib/mock-data'

const connectionString = process.env.DATABASE_URL!

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(connectionString),
})

async function main() {
  console.log('Seeding database...')

  // Seed accounts
  const accounts = [
    // Current Assets (1100)
    { account_no: 1101, account_name: 'Cash on Hand', balance: 50000, account_type: 'Asset', header: 'No', bank: 'Yes', account_category: 'Assets' },
    { account_no: 1102, account_name: 'Petty Cash', balance: 5000, account_type: 'Asset', header: 'No', bank: 'Yes', account_category: 'Assets' },
    { account_no: 1103, account_name: 'Cash in Bank', balance: 100000, account_type: 'Asset', header: 'No', bank: 'Yes', account_category: 'Assets' },
    { account_no: 1104, account_name: 'Accounts Receivable', balance: 25000, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1105, account_name: 'Allowance for Doubtful Accounts', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1106, account_name: 'Inventory', balance: 75000, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1107, account_name: 'Prepaid Expenses', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1108, account_name: 'Input VAT', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },

    // Non-Current Assets (1200)
    { account_no: 1201, account_name: 'Property and Equipment', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1202, account_name: 'Accumulated Depreciation', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1203, account_name: 'Intangible Assets', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },
    { account_no: 1204, account_name: 'Security Deposits', balance: 0, account_type: 'Asset', header: 'No', bank: 'No', account_category: 'Assets' },

    // Current Liabilities (2100)
    { account_no: 2101, account_name: 'Accounts Payable', balance: -30000, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2102, account_name: 'Accrued Expenses', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2103, account_name: 'Salaries Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2104, account_name: 'Withholding Tax Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2105, account_name: 'Output VAT Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2106, account_name: 'SSS Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2107, account_name: 'PhilHealth Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2108, account_name: 'Pag-IBIG Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },

    // Non-Current Liabilities (2200)
    { account_no: 2201, account_name: 'Bank Loan', balance: -50000, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },
    { account_no: 2202, account_name: 'Notes Payable', balance: 0, account_type: 'Liability', header: 'No', bank: 'No', account_category: 'Liabilities' },

    // Equity (3000)
    { account_no: 3101, account_name: 'Owner\'s Capital', balance: 0, account_type: 'Equity', header: 'No', bank: 'No', account_category: 'Equity' },
    { account_no: 3102, account_name: 'Retained Earnings', balance: 0, account_type: 'Equity', header: 'No', bank: 'No', account_category: 'Equity' },
    { account_no: 3103, account_name: 'Drawings', balance: 0, account_type: 'Equity', header: 'No', bank: 'No', account_category: 'Equity' },

    // Income (4000)
    { account_no: 4101, account_name: 'Sales Revenue', balance: 0, account_type: 'Income', header: 'No', bank: 'No', account_category: 'Income' },
    { account_no: 4102, account_name: 'Service Income', balance: 0, account_type: 'Income', header: 'No', bank: 'No', account_category: 'Income' },
    { account_no: 4103, account_name: 'Other Income', balance: 0, account_type: 'Income', header: 'No', bank: 'No', account_category: 'Income' },

    // Cost of Sales (5000)
    { account_no: 5101, account_name: 'Cost of Goods Sold', balance: 0, account_type: 'Cost of Sales', header: 'No', bank: 'No', account_category: 'Cost of Sales' },
    { account_no: 5102, account_name: 'Freight In', balance: 0, account_type: 'Cost of Sales', header: 'No', bank: 'No', account_category: 'Cost of Sales' },

    // Expenses (6000-7000)
    // Operating Expenses (6100)
    { account_no: 6101, account_name: 'Salaries and Wages', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6102, account_name: 'Manager Allowance', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6103, account_name: 'Rent Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6104, account_name: 'Utilities Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6105, account_name: 'Office Supplies Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6106, account_name: 'Transportation Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6107, account_name: 'Fuel Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6108, account_name: 'Repairs and Maintenance', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6109, account_name: 'Depreciation Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6110, account_name: 'Internet Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },

    // Administrative Expenses (6200)
    { account_no: 6201, account_name: 'Professional Fees', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6202, account_name: 'Representation Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
    { account_no: 6203, account_name: 'Miscellaneous Expense', balance: 0, account_type: 'Expense', header: 'No', bank: 'No', account_category: 'Expenses' },
  ]

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { account_no: account.account_no },
      update: {},
      create: account,
    })
  }

  // Seed transactions from mock data
  const transactions = JSON.parse(mockTransactions)
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        seq: parseInt(transaction.transaction_id.split('_')[1]),
        ledger: 'General',
        transNo: transaction.transaction_id,
        code: transaction.transaction_id,
        accountNumber: transaction.from_account,
        date: new Date(transaction.date),
        particulars: transaction.description,
        debit: transaction.amount,
        credit: 0,
        balance: 0,
        user: 'system',
        approval: 'Auto',
      },
    })
  }

  // Delete existing loyalty points to avoid conflicts
  await prisma.loyaltyPoint.deleteMany({})

  // Delete existing loyalty point settings to avoid conflicts
  await prisma.loyaltyPointSetting.deleteMany({})

  // Seed loyalty point settings
  const loyaltySettings = [
    { description: 'Every P100 = 1 point', amount: 100, equivalentPoint: 1 },
    { description: 'Every P200 = 3 points', amount: 200, equivalentPoint: 3 },
    { description: 'Every P500 = 10 points', amount: 500, equivalentPoint: 10 },
  ]

  const createdSettings = []
  for (const setting of loyaltySettings) {
    const createdSetting = await prisma.loyaltyPointSetting.create({
      data: setting,
    })
    createdSettings.push(createdSetting)
  }

  // Seed customers
  const customers = [
    {
      code: 'CUST001',
      customerName: 'John Doe',
      contactFirstName: 'John',
      address: '123 Main St, City',
      phonePrimary: '+1234567890',
      email: 'john.doe@example.com',
      isActive: true,
      creditLimit: 50000,
      isTaxExempt: false,
      paymentTerms: '30',
      paymentTermsValue: '30',
      salesperson: 'Sales Team',
      customerGroup: 'Regular',
      isEntitledToLoyaltyPoints: true,
      pointSetting: '1',
      loyaltyCalculationMethod: 'automatic',
      loyaltyCardNumber: '1234567890123',
    },
    {
      code: 'CUST002',
      customerName: 'Jane Smith',
      contactFirstName: 'Jane',
      address: '456 Oak Ave, Town',
      phonePrimary: '+1234567891',
      email: 'jane.smith@example.com',
      isActive: true,
      creditLimit: 75000,
      isTaxExempt: false,
      paymentTerms: '15',
      paymentTermsValue: '15',
      salesperson: 'Sales Team',
      customerGroup: 'VIP',
      isEntitledToLoyaltyPoints: true,
      pointSetting: '2',
      loyaltyCalculationMethod: 'automatic',
      loyaltyCardNumber: '9876543210987',
    },
    {
      code: 'CUST003',
      customerName: 'Bob Johnson',
      contactFirstName: 'Bob',
      address: '789 Pine Rd, Village',
      phonePrimary: '+1234567892',
      email: 'bob.johnson@example.com',
      isActive: true,
      creditLimit: 25000,
      isTaxExempt: false,
      paymentTerms: '30',
      paymentTermsValue: '30',
      salesperson: 'Sales Team',
      customerGroup: 'Regular',
      isEntitledToLoyaltyPoints: false,
      pointSetting: null,
      loyaltyCalculationMethod: 'automatic',
      loyaltyCardNumber: null,
    },
  ]

  // Store created/updated customers to get their IDs
  const createdCustomers = []
  for (const customer of customers) {
    const createdCustomer = await prisma.customer.upsert({
      where: { code: customer.code },
      update: customer,
      create: customer,
    })
    createdCustomers.push(createdCustomer)
  }


  // Seed loyalty points using the actual customer and setting IDs
  const loyaltyPoints = [
    {
      customerId: createdCustomers[0].id, // John Doe
      loyaltyCardId: '1234567890123',
      totalPoints: 150,
      pointSettingId: createdSettings[0].id, // First setting
      expiryDate: new Date('2026-12-31'),
    },
    {
      customerId: createdCustomers[1].id, // Jane Smith
      loyaltyCardId: '9876543210987',
      totalPoints: 450,
      pointSettingId: createdSettings[1].id, // Second setting
      expiryDate: new Date('2026-12-31'),
    },
    {
      customerId: createdCustomers[0].id, // John Doe
      loyaltyCardId: '1234567890123',
      totalPoints: 75,
      pointSettingId: createdSettings[0].id, // First setting
      expiryDate: new Date('2025-12-31'),
    },
  ]

  for (const point of loyaltyPoints) {
    await prisma.loyaltyPoint.create({
      data: point,
    })
  }

  // Seed admin user
  const adminUser = {
    username: 'admin@ljma.com',
    firstName: 'Super',
    lastName: 'Admin',
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
  }

  await prisma.userPermission.upsert({
    where: { username: adminUser.username },
    update: adminUser,
    create: adminUser,
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
