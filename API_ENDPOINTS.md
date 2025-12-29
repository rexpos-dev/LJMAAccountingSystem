# LJMA Accounting API Endpoints

This document lists all available API endpoints for the LJMA Accounting system.

## Database Entities

The following database entities have complete CRUD (Create, Read, Update, Delete) API endpoints:

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

### 7. Suppliers `/api/suppliers`
- **GET** `/api/suppliers` - Get all active suppliers
- **POST** `/api/suppliers` - Create new supplier
- **PUT** `/api/suppliers` - Update existing supplier
- **DELETE** `/api/suppliers?id={id}` - Delete supplier

### 8. Units of Measure `/api/units-of-measure`
- **GET** `/api/units-of-measure` - Get all active units of measure
- **POST** `/api/units-of-measure` - Create new unit of measure
- **PUT** `/api/units-of-measure` - Update existing unit of measure
- **DELETE** `/api/units-of-measure?id={id}` - Delete unit of measure

### 9. Reminders `/api/reminders`
- **GET** `/api/reminders` - Get all active reminders
- **POST** `/api/reminders` - Create new reminder
- **PUT** `/api/reminders` - Update existing reminder
- **DELETE** `/api/reminders?id={id}` - Soft delete reminder (sets isActive to false)

### 10. Loyalty Points `/api/loyalty-points`
- **GET** `/api/loyalty-points` - Get loyalty points
- **POST** `/api/loyalty-points` - Create loyalty points entry

### 11. Loyalty Point Settings `/api/loyalty-point-settings`
- **GET** `/api/loyalty-point-settings` - Get loyalty point settings
- **POST** `/api/loyalty-point-settings` - Create loyalty point setting

### 12. Conversion Factors `/api/conversion-factors`
- **GET** `/api/conversion-factors` - Get all conversion factors
  - Query params: `productId` (filter by product)
- **POST** `/api/conversion-factors` - Create new conversion factor
- **PUT** `/api/conversion-factors` - Update existing conversion factor
- **DELETE** `/api/conversion-factors?id={id}` - Delete conversion factor

### 13. External Products `/api/external-products`
- **GET** `/api/external-products` - Get external products

### 14. Subcategories `/api/categories/[categoryId]/subcategories`
- **GET** `/api/categories/[categoryId]/subcategories` - Get subcategories for a parent category

### 15. Loyalty Points Summary `/api/loyalty-points/summary`
- **GET** `/api/loyalty-points/summary` - Get loyalty points summary

## Error Handling

All API endpoints follow consistent error handling:
- **400 Bad Request** - Missing required fields or validation errors
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

### Delete a supplier:
```javascript
DELETE /api/suppliers?id=supplier_id_here
