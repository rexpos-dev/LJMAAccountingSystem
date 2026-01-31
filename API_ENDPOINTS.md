# LJMA Accounting API Endpoints

This document lists all available API endpoints for the LJMA Accounting system.

## Table of Contents
- [Core Entities](#core-entities)
- [User Management](#user-management)
- [Request Management](#request-management)
- [Sales & Invoicing](#sales--invoicing)
- [Purchase Orders](#purchase-orders)
- [Business Settings](#business-settings)
- [Notifications](#notifications)
- [Backup & Utilities](#backup--utilities)
- [Utility Endpoints](#utility-endpoints)

---

## Core Entities

### 1. Accounts `/api/accounts`
- **GET** `/api/accounts` - Get all accounts
  - Query params: `bank` (filter bank accounts), `type` (filter by type)
- **POST** `/api/accounts` - Create new account
- **PUT** `/api/accounts` - Update existing account

### 2. Transactions `/api/transactions`
- **GET** `/api/transactions` - Get all transactions
  - Query params: `accountNumber` (filter by account), `limit`, `offset`
- **POST** `/api/transactions` - Create new transaction
- **PUT** `/api/transactions` - Update existing transaction
- **DELETE** `/api/transactions?id={id}` - Delete transaction

### 3. Customers `/api/customers`
- **GET** `/api/customers` - Get all customers (with loyalty points balance)
- **POST** `/api/customers` - Create new customer
- **PUT** `/api/customers` - Update existing customer
- **DELETE** `/api/customers?id={id}` - Delete customer

### 4. Products `/api/products`
- **GET** `/api/products` - Get all products
  - Query params: `search`, `filterBy`, `filterValue`
- **POST** `/api/products` - Create new product
- **PUT** `/api/products` - Update existing product
- **DELETE** `/api/products?id={id}` - Delete product

### 5. Brands `/api/brands`
- **GET** `/api/brands` - Get all brands
- **POST** `/api/brands` - Create new brand
- **PUT** `/api/brands` - Update existing brand
- **DELETE** `/api/brands?id={id}` - Delete brand

### 6. Categories `/api/categories`
- **GET** `/api/categories` - Get all parent categories
- **POST** `/api/categories` - Create new category
- **PUT** `/api/categories` - Update existing category
- **DELETE** `/api/categories?id={id}` - Delete category

### 7. Subcategories `/api/categories/[categoryId]/subcategories`
- **GET** `/api/categories/[categoryId]/subcategories` - Get subcategories for a parent category

### 8. Suppliers `/api/suppliers`
- **GET** `/api/suppliers` - Get all active suppliers
- **POST** `/api/suppliers` - Create new supplier
- **PUT** `/api/suppliers` - Update existing supplier
- **DELETE** `/api/suppliers?id={id}` - Delete supplier

### 9. Units of Measure `/api/units-of-measure`
- **GET** `/api/units-of-measure` - Get all active units of measure
- **POST** `/api/units-of-measure` - Create new unit of measure
- **PUT** `/api/units-of-measure` - Update existing unit of measure
- **DELETE** `/api/units-of-measure?id={id}` - Delete unit of measure

### 10. Conversion Factors `/api/conversion-factors`
- **GET** `/api/conversion-factors` - Get all conversion factors
  - Query params: `productId` (filter by product)
- **POST** `/api/conversion-factors` - Create new conversion factor
- **PUT** `/api/conversion-factors` - Update existing conversion factor
- **DELETE** `/api/conversion-factors?id={id}` - Delete conversion factor

### 11. External Products `/api/external-products`
- **GET** `/api/external-products` - Get external products

---

## User Management

### 12. User Permissions `/api/user-permissions`
- **GET** `/api/user-permissions` - Get all user permissions
  - Returns: Array of users with permissions (ordered by createdAt desc)
- **POST** `/api/user-permissions` - Create new user permission
  - Required fields: `username`, `firstName`, `lastName`, `accountType`, `permissions`
  - Optional fields: `contactNo`, `password`
- **PUT** `/api/user-permissions` - Update user permission
  - Required fields: `id`, `username`, `firstName`, `lastName`, `accountType`, `permissions`
  - Optional fields: `contactNo`, `password`, `isActive`
- **DELETE** `/api/user-permissions?id={id}` - Delete user permission

### 13. Sales Users `/api/sales-users`
- **GET** `/api/sales-users` - Get all sales users
  - Query params: `action=next-id` (get next available SP-XXXX ID)
- **POST** `/api/sales-users` - Create new sales user
  - Required fields: `sp_id`, `complete_name`
  - Optional fields: `username`
- **PUT** `/api/sales-users` - Update sales user
  - Required fields: `id`
  - Optional fields: `name`, `username`, `isActive`
- **DELETE** `/api/sales-users?id={id}` - Delete sales user

---

## Request Management

### 14. Requests `/api/requests`
- **GET** `/api/requests` - Get all requests (ordered by createdAt desc)
  - Returns: Array of request forms with items
- **POST** `/api/requests` - Create new request
  - Auto-generates request number (REQ-XXXXX format)
  - Required fields: `requesterName`, `position`, `businessUnit`, `chargeTo`, `accountNo`, `purpose`, `amount`, `verifiedBy`, `approvedBy`, `processedBy`
  - Optional fields: `items` (array of request items)
  - Default status: "To Verify"

### 15. Request Statistics `/api/requests/stats`
- **GET** `/api/requests/stats` - Get request statistics
  - Returns: `{ total, toVerify, toApprove, toProcess, released, received, releasedAndReceived }`

---

## Sales & Invoicing

### 16. Invoices `/api/invoices`
- **GET** `/api/invoices` - Get all invoices
  - Query params: `status` (filter by status), `customerId` (filter by customer)
  - Returns: Invoices with customer details and items
- **POST** `/api/invoices` - Create new invoice
  - Required fields: `customerId`, `items`, `invoiceNumber`, `date`, `subtotal`, `total`
  - Optional fields: `customerPONumber`, `dueDate`, `terms`, `salesperson`, `depositAccount`, `billingAddress`, `shippingAddress`

### 17. Loyalty Points `/api/loyalty-points`
- **GET** `/api/loyalty-points` - Get loyalty points
- **POST** `/api/loyalty-points` - Create loyalty points entry

### 18. Loyalty Point Settings `/api/loyalty-point-settings`
- **GET** `/api/loyalty-point-settings` - Get loyalty point settings
- **POST** `/api/loyalty-point-settings` - Create loyalty point setting

### 19. Loyalty Points Summary `/api/loyalty-points/summary`
- **GET** `/api/loyalty-points/summary` - Get loyalty points summary

---

## Purchase Orders

### 20. Purchase Orders `/api/purchase-orders`
- **GET** `/api/purchase-orders` - Get all purchase orders
  - Query params: `limit`, `offset`, `status`, `supplierId`, `startDate`, `endDate`
  - Returns: Purchase orders with supplier and items
- **POST** `/api/purchase-orders` - Create new purchase order
  - Required fields: `supplierId`, `items`, `date`, `subtotal`, `taxTotal`, `total`
  - Optional fields: `vendorAddress`, `shippingAddress`, `taxType`, `comments`, `privateComments`, `status`
- **PUT** `/api/purchase-orders` - Update purchase order
  - Required fields: `id`
  - Optional fields: `status`, `items`, and other PO fields
- **DELETE** `/api/purchase-orders?id={id}` - Delete purchase order

### 21. Purchase Order Details `/api/purchase-orders/[id]`
- **GET** `/api/purchase-orders/[id]` - Get specific purchase order by ID

### 22. Bulk Upload Purchase Orders `/api/purchase-orders/bulk-upload`
- **POST** `/api/purchase-orders/bulk-upload` - Bulk upload purchase order items from CSV/Excel

---

## Business Settings

### 23. Business Profile `/api/business-profile`
- **GET** `/api/business-profile` - Get business profile
  - Returns: First business profile or empty object
- **POST** `/api/business-profile` - Create or update business profile
  - Upserts the business profile (only one profile exists)
  - Fields: `businessName`, `address`, `owner`, `contactPhone`, `contactTel`, `email`, `tin`, `permit`, `logo`

### 24. Reminders `/api/reminders`
- **GET** `/api/reminders` - Get all active reminders
- **POST** `/api/reminders` - Create new reminder
- **PUT** `/api/reminders` - Update existing reminder
- **DELETE** `/api/reminders?id={id}` - Soft delete reminder (sets isActive to false)

---

## Notifications

### 25. Notifications `/api/notifications`
- **GET** `/api/notifications` - Get unread notifications
  - Returns: Unread notifications ordered by createdAt desc
- **PUT** `/api/notifications` - Mark notification as read
  - Required fields: `id`, `isRead`

---

## Backup & Utilities

### 26. Backup Jobs `/api/backup`
- **GET** `/api/backup` - Get recent backup jobs (last 20)
  - Requires: Admin authentication
- **POST** `/api/backup` - Trigger new database backup
  - Requires: Admin authentication
  - Returns: `{ message, jobId }` with status 202 (Accepted)

### 27. Backup Download `/api/backup/download/[id]`
- **GET** `/api/backup/download/[id]` - Download backup file by job ID
  - Requires: Admin authentication

---

## Utility Endpoints

### 28. Next Invoice Number `/api/invoices/next-number`
- **GET** `/api/invoices/next-number` - Get next available invoice number
  - Returns: `{ nextNumber }` (starts at 10000)

### 29. Next PO Number `/api/invoices/next-po-number`
- **GET** `/api/invoices/next-po-number` - Get next available purchase order number

### 30. Next Transaction Reference `/api/transactions/next-reference`
- **GET** `/api/transactions/next-reference` - Get next transaction reference number
  - Returns: `{ nextReference }` (format: GJ-XXXXXX)

---

## Error Handling

All API endpoints follow consistent error handling:
- **400 Bad Request** - Missing required fields or validation errors
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate entry (unique constraint violation)
- **500 Internal Server Error** - Server error

## Data Validation

All endpoints include proper validation:
- Required field checking
- Data type conversion
- String trimming
- Null handling
- Unique constraint validation

## Database Schema

The APIs are based on the following Prisma models:
- Account (chart_of_account)
- Transaction (transactions)
- Customer (customer)
- Product (product)
- Brand (brand)
- Category (category)
- Supplier (supplier)
- UnitOfMeasure (unit_of_measure)
- Reminder (reminder)
- LoyaltyPoint (loyalty_point)
- LoyaltyPointSetting (loyalty_point_setting)
- ConversionFactor (conversion_factor)
- UserPermission (user_permission)
- SalesUser (sales_user)
- BusinessProfile (business_profile)
- Notification (notification)
- BackupJob (backup_job)
- PurchaseOrder (purchase_order)
- PurchaseOrderItem (purchase_order_item)
- Invoice (invoice)
- InvoiceItem (invoice_item)
- Request (request)
- RequestItem (request_item)

---

## Usage Examples

### Create a new customer:
```javascript
POST /api/customers
{
  "code": "CUST001",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phonePrimary": "123-456-7890"
}
```

### Get transactions for a specific account:
```javascript
GET /api/transactions?accountNumber=ACC001&limit=50
```

### Update a product:
```javascript
PUT /api/products
{
  "id": "product_id_here",
  "name": "Updated Product Name",
  "unitPrice": 99.99
}
```

### Create a new request:
```javascript
POST /api/requests
{
  "requesterName": "John Smith",
  "position": "Manager",
  "businessUnit": "Sales",
  "chargeTo": "Marketing",
  "accountNo": "ACC-001",
  "purpose": "Office supplies",
  "amount": 5000,
  "verifiedBy": "Jane Doe",
  "approvedBy": "Mike Johnson",
  "processedBy": "Sarah Williams",
  "items": [
    {
      "description": "Printer Paper",
      "quantity": 10,
      "unitPrice": 250,
      "total": 2500
    }
  ]
}
```

### Get user permissions:
```javascript
GET /api/user-permissions
```

### Create purchase order:
```javascript
POST /api/purchase-orders
{
  "supplierId": "supplier_id_here",
  "date": "2026-01-29",
  "items": [
    {
      "productId": "product_id",
      "description": "Item description",
      "qty": 100,
      "unitPrice": 50.00
    }
  ],
  "subtotal": 5000,
  "taxTotal": 600,
  "total": 5600
}
```

### Get request statistics:
```javascript
GET /api/requests/stats
// Returns: { total: 150, toVerify: 20, toApprove: 15, toProcess: 10, released: 80, received: 25, releasedAndReceived: 105 }
```

### Trigger database backup:
```javascript
POST /api/backup
// Returns: { message: "Backup started", jobId: "backup_job_id" }
```

### Get next invoice number:
```javascript
GET /api/invoices/next-number
// Returns: { nextNumber: "10001" }
