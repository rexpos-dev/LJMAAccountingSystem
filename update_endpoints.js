const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'app', 'ljma', 'api-endpoints', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const apiCategories = `    const apiCategories = [
        {
            title: "Authentication",
            icon: <Lock className="w-5 h-5 text-red-500" />,
            endpoints: [
                { method: "POST", path: "/api/auth/login", description: "Authenticate a user and return a session token" },
                { method: "POST", path: "/api/auth/signup", description: "Register a new user account" }
            ]
        },
        {
            title: "Users & User Types",
            icon: <Users className="w-5 h-5 text-indigo-500" />,
            endpoints: [
                { method: "GET", path: "/api/users", description: "List all users" },
                { method: "POST", path: "/api/users", description: "Create a new user" },
                { method: "PATCH", path: "/api/users", description: "Update a user (bulk/query-based)" },
                { method: "DELETE", path: "/api/users", description: "Delete a user (query-based)" },
                { method: "PUT", path: "/api/users/[uid]", description: "Update a specific user by UID" },
                { method: "GET", path: "/api/user-types", description: "List all user types/roles" },
                { method: "POST", path: "/api/user-types", description: "Create a new user type" },
                { method: "PATCH", path: "/api/user-types/[id]", description: "Update a specific user type" },
                { method: "DELETE", path: "/api/user-types/[id]", description: "Delete a specific user type" }
            ]
        },
        {
            title: "User Activity Logs",
            icon: <Activity className="w-5 h-5 text-teal-500" />,
            endpoints: [
                { method: "GET", path: "/api/user-activity-logs", description: "Retrieve user activity log entries" },
                { method: "POST", path: "/api/user-activity-logs", description: "Record a new user activity log entry" }
            ]
        },
        {
            title: "Products",
            icon: <Package className="w-5 h-5 text-green-500" />,
            endpoints: [
                { method: "GET", path: "/api/products", description: "List all products" },
                { method: "POST", path: "/api/products", description: "Create a new product" },
                { method: "PATCH", path: "/api/products/[id]", description: "Update a specific product" },
                { method: "GET", path: "/api/products/attributes", description: "List all product attributes" },
                { method: "GET", path: "/api/inventory-batches", description: "List inventory batches" },
                { method: "GET", path: "/api/price-levels", description: "List price levels" },
                { method: "POST", path: "/api/price-levels", description: "Create a new price level" }
            ]
        },
        {
            title: "Suppliers",
            icon: <Truck className="w-5 h-5 text-amber-500" />,
            endpoints: [
                { method: "GET", path: "/api/suppliers", description: "List all suppliers" },
                { method: "POST", path: "/api/suppliers", description: "Create a new supplier" },
                { method: "GET", path: "/api/suppliers/[id]", description: "Get a specific supplier" },
                { method: "PUT", path: "/api/suppliers/[id]", description: "Update a specific supplier" },
                { method: "DELETE", path: "/api/suppliers/[id]", description: "Delete a specific supplier" },
                { method: "GET", path: "/api/suppliers/[id]/balance", description: "Get outstanding balance for a supplier" },
                { method: "GET", path: "/api/suppliers/export", description: "Export suppliers to a file" },
                { method: "GET", path: "/api/temp-suppliers", description: "List temporary/unconfirmed suppliers" }
            ]
        },
        {
            title: "Customers",
            icon: <Users className="w-5 h-5 text-blue-500" />,
            endpoints: [
                { method: "GET", path: "/api/customers", description: "List all customers" },
                { method: "POST", path: "/api/customers", description: "Create a new customer" },
                { method: "GET", path: "/api/customers/[id]", description: "Get a specific customer" },
                { method: "PUT", path: "/api/customers/[id]", description: "Update a specific customer" },
                { method: "DELETE", path: "/api/customers/[id]", description: "Delete a specific customer" },
                { method: "GET", path: "/api/customers/[id]/check-transactions", description: "Check if a customer has associated transactions" },
                { method: "GET", path: "/api/customers/balances", description: "Get outstanding balances for all customers" },
                { method: "GET", path: "/api/customers/invoices/[id]", description: "Get a specific customer invoice" },
                { method: "POST", path: "/api/customers/invoices/[id]/payment", description: "Record a payment against a customer invoice" },
                { method: "GET", path: "/api/customers/invoices/outstanding", description: "List all outstanding customer invoices" },
                { method: "GET", path: "/api/customers/payments", description: "List customer payment records" },
                { method: "POST", path: "/api/customers/payments", description: "Record a customer payment" },
                { method: "GET", path: "/api/customer-payments", description: "List customer payment transactions" },
                { method: "POST", path: "/api/customer-payments", description: "Create a new customer payment transaction" }
            ]
        },
        {
            title: "Customer Loyalty",
            icon: <Users className="w-5 h-5 text-purple-500" />,
            endpoints: [
                { method: "GET", path: "/api/customer-loyalty", description: "List all loyalty members" },
                { method: "POST", path: "/api/customer-loyalty", description: "Enroll a new loyalty member" },
                { method: "PUT", path: "/api/customer-loyalty/[id]", description: "Update a loyalty member" },
                { method: "DELETE", path: "/api/customer-loyalty/[id]", description: "Remove a loyalty member" },
                { method: "GET", path: "/api/customer-loyalty/lookup", description: "Look up a loyalty member by card/phone" },
                { method: "POST", path: "/api/customer-loyalty/adjust-points", description: "Manually adjust a member's loyalty points" },
                { method: "GET", path: "/api/customer-loyalty/point-history", description: "Get point transaction history for a member" },
                { method: "GET", path: "/api/loyalty-settings", description: "Get loyalty program settings" },
                { method: "POST", path: "/api/loyalty-settings", description: "Create loyalty program settings" },
                { method: "PUT", path: "/api/loyalty-settings/[id]", description: "Update loyalty program settings" },
                { method: "DELETE", path: "/api/loyalty-settings/[id]", description: "Delete a loyalty settings record" }
            ]
        },
        {
            title: "Purchase Orders",
            icon: <ShoppingCart className="w-5 h-5 text-orange-500" />,
            endpoints: [
                { method: "GET", path: "/api/purchase-orders", description: "List all purchase orders" },
                { method: "POST", path: "/api/purchase-orders", description: "Create a new purchase order" },
                { method: "PATCH", path: "/api/purchase-orders/[id]", description: "Update/receive a specific purchase order" },
                { method: "DELETE", path: "/api/purchase-orders/[id]", description: "Delete a specific purchase order" },
                { method: "GET", path: "/api/purchase-orders/export", description: "Export purchase orders to a file" }
            ]
        },
        {
            title: "Sales",
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            endpoints: [
                { method: "GET", path: "/api/sales", description: "List sales records" },
                { method: "POST", path: "/api/sales", description: "Create a new sale" },
                { method: "GET", path: "/api/sales/by-date", description: "Get sales aggregated by date" },
                { method: "GET", path: "/api/sales/by-product", description: "Get sales aggregated by product" },
                { method: "GET", path: "/api/sales/hourly", description: "Get sales broken down by hour" },
                { method: "GET", path: "/api/sales/monthly-category", description: "Get monthly sales by category" },
                { method: "GET", path: "/api/sales/top-products", description: "Get top-selling products" },
                { method: "GET", path: "/api/sales/batch-analysis", description: "Analyze sales by inventory batch" },
                { method: "GET", path: "/api/sales/transactions", description: "List all sales transactions" },
                { method: "POST", path: "/api/sales/transactions", description: "Record a sales transaction" },
                { method: "GET", path: "/api/sales/orders", description: "List sales orders" },
                { method: "POST", path: "/api/sales/orders", description: "Create a new sales order" },
                { method: "PUT", path: "/api/sales/orders/[id]", description: "Update a specific sales order" },
                { method: "DELETE", path: "/api/sales/orders/[id]", description: "Delete a specific sales order" },
                { method: "GET", path: "/api/sales/returns", description: "List sales returns" },
                { method: "POST", path: "/api/sales/returns", description: "Record a sales return" },
                { method: "GET", path: "/api/sales/split-payments", description: "List split payment records" },
                { method: "POST", path: "/api/sales/invoices/[id]/void", description: "Void a specific sales invoice" },
                { method: "GET", path: "/api/sales/voids-report", description: "Get a report of voided transactions" },
                { method: "GET", path: "/api/sales/x-reading", description: "Get current shift X-reading (interim report)" },
                { method: "POST", path: "/api/sales/x-reading", description: "Save/print an X-reading" },
                { method: "GET", path: "/api/sales/z-reading", description: "Get Z-reading (end-of-day report)" },
                { method: "POST", path: "/api/sales/z-reading", description: "Close the day and save a Z-reading" },
                { method: "GET", path: "/api/sales/overall-reading", description: "Get cumulative overall reading" },
                { method: "GET", path: "/api/sales/ejournal", description: "Get the electronic journal of sales" }
            ]
        },
        {
            title: "POS (Point of Sale)",
            icon: <Store className="w-5 h-5 text-blue-600" />,
            endpoints: [
                { method: "POST", path: "/api/pos/checkout", description: "Process a POS checkout/sale" },
                { method: "POST", path: "/api/pos/payment-validation", description: "Validate payment details before checkout" },
                { method: "POST", path: "/api/pos/void-transaction", description: "Void a POS transaction" },
                { method: "GET", path: "/api/pos/cash-transfer", description: "Get cash transfer records for the shift" },
                { method: "POST", path: "/api/pos/cash-transfer", description: "Record a cash transfer in/out" },
                { method: "GET", path: "/api/pos/terminals", description: "List POS terminals" },
                { method: "GET", path: "/api/pos/shifts", description: "Get shift records" },
                { method: "POST", path: "/api/pos/shifts", description: "Open a new POS shift" },
                { method: "PUT", path: "/api/pos/shifts", description: "Update/close a POS shift" },
                { method: "GET", path: "/api/pos/recent-sales", description: "Get recent sales for the active terminal" },
                { method: "GET", path: "/api/pos-settings", description: "Get POS configuration settings" },
                { method: "POST", path: "/api/pos-settings", description: "Save POS configuration settings" },
                { method: "POST", path: "/api/pos-settings/upload-logo", description: "Upload a logo for POS receipts" },
                { method: "GET", path: "/api/pos-terminals", description: "List all POS terminal registrations" },
                { method: "POST", path: "/api/pos-terminals", description: "Register a new POS terminal" },
                { method: "PUT", path: "/api/pos-terminals", description: "Update a POS terminal" },
                { method: "DELETE", path: "/api/pos-terminals", description: "Deregister a POS terminal" },
                { method: "GET", path: "/api/pos-transactions", description: "List POS transaction records" },
                { method: "POST", path: "/api/pos-transactions", description: "Record a POS transaction" }
            ]
        },
        {
            title: "Inventory",
            icon: <Package className="w-5 h-5 text-teal-600" />,
            endpoints: [
                { method: "GET", path: "/api/inventory/stock-counts", description: "List all stock count sessions" },
                { method: "POST", path: "/api/inventory/stock-counts", description: "Start a new stock count session" },
                { method: "GET", path: "/api/inventory/stock-counts/[id]", description: "Get a specific stock count session" },
                { method: "PUT", path: "/api/inventory/stock-counts/[id]", description: "Update a stock count session" },
                { method: "DELETE", path: "/api/inventory/stock-counts/[id]", description: "Delete a stock count session" },
                { method: "PUT", path: "/api/inventory/stock-counts/[id]/items", description: "Update counted items within a stock count" },
                { method: "POST", path: "/api/inventory/stock-counts/[id]/complete", description: "Mark a stock count as complete and apply variances" },
                { method: "GET", path: "/api/inventory/transfer", description: "List inventory transfer records" },
                { method: "POST", path: "/api/inventory/transfer", description: "Create an inventory transfer between warehouses" },
                { method: "POST", path: "/api/inventory/transfer/bulk", description: "Create multiple inventory transfers at once" },
                { method: "POST", path: "/api/inventory/adjust/bulk", description: "Apply bulk inventory adjustments" }
            ]
        },
        {
            title: "Warehouses & Shelf Locations",
            icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />,
            endpoints: [
                { method: "GET", path: "/api/warehouses", description: "List all warehouses" },
                { method: "POST", path: "/api/warehouses", description: "Create a new warehouse" },
                { method: "GET", path: "/api/warehouses/[id]", description: "Get a specific warehouse" },
                { method: "PUT", path: "/api/warehouses/[id]", description: "Update a specific warehouse" },
                { method: "DELETE", path: "/api/warehouses/[id]", description: "Delete a specific warehouse" },
                { method: "GET", path: "/api/shelf-locations", description: "List all shelf locations" },
                { method: "POST", path: "/api/shelf-locations", description: "Create a new shelf location" },
                { method: "PUT", path: "/api/shelf-locations/[id]", description: "Update a specific shelf location" },
                { method: "DELETE", path: "/api/shelf-locations/[id]", description: "Delete a specific shelf location" }
            ]
        },
        {
            title: "Stock Adjustments & Movements",
            icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" />,
            endpoints: [
                { method: "GET", path: "/api/stock-adjustments", description: "List stock adjustment records" },
                { method: "POST", path: "/api/stock-adjustments", description: "Create a stock adjustment entry" },
                { method: "GET", path: "/api/stock-adjustments/[id]", description: "Get a specific stock adjustment" },
                { method: "GET", path: "/api/stock-movements", description: "List stock movement history" },
                { method: "POST", path: "/api/stock-movements", description: "Record a stock movement" },
                { method: "GET", path: "/api/bad-orders", description: "List bad order (damaged/expired) records" },
                { method: "POST", path: "/api/bad-orders", description: "Record a new bad order" },
                { method: "GET", path: "/api/bad-orders/[id]", description: "Get a specific bad order" },
                { method: "PATCH", path: "/api/bad-orders/[id]", description: "Update a specific bad order" },
                { method: "DELETE", path: "/api/bad-orders/[id]", description: "Delete a specific bad order" },
                { method: "GET", path: "/api/bad-orders/stats", description: "Get bad order statistics summary" }
            ]
        },
        {
            title: "Reports",
            icon: <FileBarChart className="w-5 h-5 text-orange-600" />,
            endpoints: [
                { method: "GET", path: "/api/reports/stats", description: "Get high-level dashboard statistics" },
                { method: "GET", path: "/api/reports/inventory", description: "Get inventory valuation report" },
                { method: "GET", path: "/api/reports/movements", description: "Get stock movement report" },
                { method: "GET", path: "/api/reports/adjustments", description: "Get inventory adjustments report" },
                { method: "GET", path: "/api/reports/velocity", description: "Get product velocity (turnover rate) report" },
                { method: "GET", path: "/api/reports/purchases/by-supplier", description: "Get purchases aggregated by supplier" },
                { method: "GET", path: "/api/reports/purchases/by-product", description: "Get purchases aggregated by product" },
                { method: "GET", path: "/api/reports/soa", description: "Get Statement of Account (SOA) report for a customer" }
            ]
        },
        {
            title: "Settings",
            icon: <Settings className="w-5 h-5 text-gray-600" />,
            endpoints: [
                { method: "GET", path: "/api/settings/database", description: "Get database connection info" },
                { method: "POST", path: "/api/settings/database", description: "Update database connection settings" },
                { method: "GET", path: "/api/settings/api-config", description: "Get API configuration" },
                { method: "GET", path: "/api/settings/api-connection", description: "Get external API connection status" },
                { method: "POST", path: "/api/settings/api-connection", description: "Save external API connection settings" },
                { method: "GET", path: "/api/settings/tax-rates", description: "List all tax rates" },
                { method: "POST", path: "/api/settings/tax-rates", description: "Create a new tax rate" },
                { method: "PUT", path: "/api/settings/tax-rates/[id]", description: "Update a specific tax rate" },
                { method: "DELETE", path: "/api/settings/tax-rates/[id]", description: "Delete a specific tax rate" },
                { method: "GET", path: "/api/settings/external-api", description: "List configured external API connections" },
                { method: "POST", path: "/api/settings/external-api", description: "Add a new external API connection" },
                { method: "PUT", path: "/api/settings/external-api", description: "Update external API connection (bulk)" },
                { method: "PUT", path: "/api/settings/external-api/[id]", description: "Update a specific external API connection" },
                { method: "DELETE", path: "/api/settings/external-api/[id]", description: "Delete a specific external API connection" },
                { method: "POST", path: "/api/settings/backup/manual", description: "Trigger a manual database backup" },
                { method: "GET", path: "/api/settings/backup/files", description: "List available backup files" },
                { method: "GET", path: "/api/settings/backup/download/[filename]", description: "Download a specific backup file" },
                { method: "POST", path: "/api/settings/backup/restore", description: "Restore the database from a backup file" },
                { method: "GET", path: "/api/settings/backup/schedule", description: "Get the backup schedule configuration" },
                { method: "POST", path: "/api/settings/backup/schedule", description: "Save the backup schedule configuration" }
            ]
        },
        {
            title: "Cloud Sync",
            icon: <RefreshCw className="w-5 h-5 text-sky-500" />,
            endpoints: [
                { method: "GET", path: "/api/cloud-sync/health", description: "Check health/connectivity of the cloud sync service" },
                { method: "GET", path: "/api/cloud-sync/status", description: "Get the current cloud sync status and last sync time" },
                { method: "POST", path: "/api/cloud-sync/push", description: "Push local data changes to the cloud" },
                { method: "GET", path: "/api/cloud-sync/pull", description: "Pull data changes from the cloud" },
                { method: "POST", path: "/api/sync/push", description: "Alternative sync push endpoint" },
                { method: "GET", path: "/api/sync/pull", description: "Alternative sync pull endpoint" }
            ]
        },
        {
            title: "External API",
            icon: <Terminal className="w-5 h-5 text-indigo-400" />,
            endpoints: [
                { method: "GET", path: "/api/external-api/logs", description: "List external API call logs" },
                { method: "POST", path: "/api/external-api/logs", description: "Record a new external API log entry" },
                { method: "POST", path: "/api/external-api/logs/[id]/retry", description: "Retry a failed external API call" }
            ]
        },
        {
            title: "Approvals",
            icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
            endpoints: [
                { method: "GET", path: "/api/approvals/workflows", description: "List approval workflow definitions" },
                { method: "POST", path: "/api/approvals/workflows", description: "Create a new approval workflow" },
                { method: "GET", path: "/api/approvals/queue", description: "Get items pending approval" },
                { method: "POST", path: "/api/approvals/process", description: "Approve or reject a pending item" }
            ]
        },
        {
            title: "Data Management",
            icon: <Database className="w-5 h-5 text-teal-600" />,
            endpoints: [
                { method: "GET", path: "/api/data-management/export/customers", description: "Export customers to CSV/Excel" },
                { method: "GET", path: "/api/data-management/export/products", description: "Export products to CSV/Excel" },
                { method: "GET", path: "/api/data-management/export/suppliers", description: "Export suppliers to CSV/Excel" },
                { method: "POST", path: "/api/data-management/import/customers", description: "Import customers from a file" },
                { method: "POST", path: "/api/data-management/import/products", description: "Import products from a file" },
                { method: "POST", path: "/api/data-management/import/suppliers", description: "Import suppliers from a file" },
                { method: "POST", path: "/api/data-management/reset", description: "Reset/wipe selected data from the system" }
            ]
        },
        {
            title: "Accounts & Financials",
            icon: <Database className="w-5 h-5 text-blue-500" />,
            endpoints: [
                { method: "GET", path: "/api/accounts", description: "List chart of accounts" },
                { method: "POST", path: "/api/accounts", description: "Create a new account entry" }
            ]
        },
        {
            title: "Reference & Configuration Data",
            icon: <Settings className="w-5 h-5 text-gray-400" />,
            endpoints: [
                { method: "GET", path: "/api/payment-methods", description: "List payment methods" },
                { method: "POST", path: "/api/payment-methods", description: "Create a new payment method" },
                { method: "GET", path: "/api/payment-methods/[id]", description: "Get a specific payment method" },
                { method: "PUT", path: "/api/payment-methods/[id]", description: "Update a specific payment method" },
                { method: "DELETE", path: "/api/payment-methods/[id]", description: "Delete a specific payment method" },
                { method: "GET", path: "/api/payment-terms", description: "List payment terms" },
                { method: "POST", path: "/api/payment-terms", description: "Create a new payment term" },
                { method: "PUT", path: "/api/payment-terms", description: "Update a payment term (query-based)" },
                { method: "DELETE", path: "/api/payment-terms", description: "Delete a payment term (query-based)" },
                { method: "GET", path: "/api/payment-term-types", description: "List payment term types" },
                { method: "POST", path: "/api/payment-term-types", description: "Create a payment term type" },
                { method: "DELETE", path: "/api/payment-term-types", description: "Delete a payment term type" },
                { method: "GET", path: "/api/sales-areas", description: "List sales areas" },
                { method: "POST", path: "/api/sales-areas", description: "Create a sales area" },
                { method: "DELETE", path: "/api/sales-areas", description: "Delete a sales area" },
                { method: "GET", path: "/api/sales-groups", description: "List sales groups" },
                { method: "POST", path: "/api/sales-groups", description: "Create a sales group" },
                { method: "DELETE", path: "/api/sales-groups", description: "Delete a sales group" },
                { method: "GET", path: "/api/sales-persons", description: "List sales persons" },
                { method: "POST", path: "/api/sales-persons", description: "Create a sales person" },
                { method: "DELETE", path: "/api/sales-persons", description: "Delete a sales person (query-based)" },
                { method: "PUT", path: "/api/sales-persons/[id]", description: "Update a specific sales person" },
                { method: "DELETE", path: "/api/sales-persons/[id]", description: "Delete a specific sales person" },
                { method: "GET", path: "/api/transaction-references", description: "List transaction references" },
                { method: "POST", path: "/api/transaction-references", description: "Create a transaction reference" },
                { method: "GET", path: "/api/transactions/all-references", description: "Get all transaction reference numbers" },
                { method: "GET", path: "/api/transactions/last-references", description: "Get the last used transaction reference" }
            ]
        },
        {
            title: "Migrations",
            icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
            endpoints: [
                { method: "POST", path: "/api/migrate", description: "Run pending database migrations" },
                { method: "GET", path: "/api/migrate/batch-costing", description: "Run/check batch costing migration" },
                { method: "GET", path: "/api/migrate/fix-batch-ids", description: "Run/check fix for batch ID inconsistencies" }
            ]
        },
        {
            title: "Miscellaneous",
            icon: <Activity className="w-5 h-5 text-gray-500" />,
            endpoints: [
                { method: "GET", path: "/api/data", description: "Retrieve general application data" },
                { method: "POST", path: "/api/data", description: "Submit general application data" },
                { method: "GET", path: "/api/forward", description: "Proxy/forward a request to another service" },
                { method: "POST", path: "/api/forward", description: "Proxy/forward a POST request to another service" },
                { method: "GET", path: "/api/send-products", description: "Get product push/send status" },
                { method: "POST", path: "/api/send-products", description: "Push product data to an external system" }
            ]
        }
    ];

    const filterCategories = (categories: any[]) => {
        if (!searchQuery) return categories;

        return categories.map(category => ({
            ...category,
            endpoints: category.endpoints.filter((ep: any) =>
                ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ep.method.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.endpoints.length > 0);
    };

    const midIndex = Math.ceil(apiCategories.length / 2);
    const leftCategories = apiCategories.slice(0, midIndex);
    const rightCategories = apiCategories.slice(midIndex);

    const filteredLeft = useMemo(() => filterCategories(leftCategories), [searchQuery]);
    const filteredRight = useMemo(() => filterCategories(rightCategories), [searchQuery]);

    const getMethodBadge = (method: string) => {
        switch (method) {
            case "GET": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-1 py-0 text-[10px]">GET</Badge>;
            case "POST": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-1 py-0 text-[10px]">POST</Badge>;
            case "PUT": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-1 py-0 text-[10px]">PUT</Badge>;
            case "PATCH": return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-1 py-0 text-[10px]">PATCH</Badge>;
            case "DELETE": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-1 py-0 text-[10px]">DELETE</Badge>;
            default: return <Badge variant="outline">{method}</Badge>;
        }
    };

    const APIList = ({ categories, title, description, color }: any) => (
        <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className={\`w-2 h-2 rounded-full \${color}\`} />
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
                {categories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                        No endpoints match your search.
                    </div>
                ) : (
                    categories.map((category: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b">
                                {category.icon}
                                <h3 className="font-semibold text-foreground/80">{category.title}</h3>
                                <Badge variant="secondary" className="ml-auto text-[10px] font-mono">
                                    {category.endpoints.length} routes
                                </Badge>
                            </div>
                            <Accordion type="multiple" className="w-full space-y-2">
                                {category.endpoints.map((ep: any, eIdx: number) => (
                                    <AccordionItem key={eIdx} value={\`item-\${idx}-\${eIdx}\`} className="border rounded-lg bg-card/50 px-3 overflow-hidden">
                                        <AccordionTrigger className="hover:no-underline py-3">
                                            <div className="flex items-center gap-3 text-left w-full">
                                                {getMethodBadge(ep.method)}
                                                <code className="text-xs font-mono font-medium truncate shrink">
                                                    {ep.path}
                                                </code>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-3 pt-1 border-t text-sm text-muted-foreground space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <p>{ep.description}</p>
                                                <CopyButton text={\`\${ep.method} \${ep.path}\`} />
                                            </div>
                                            {ep.params && (
                                                <div className="bg-muted p-2 rounded-md text-xs font-mono">
                                                    <span className="text-foreground/50">Params: </span>
                                                    <span className="text-foreground/80">{ep.params}</span>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Section */}
            <div className="bg-card border-b relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
                <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Terminal className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">API Documentation Hub</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        A comprehensive documentation for all Stock Pilot API Routes.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-2xl border shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-md">
                            <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Search endpoints by path or description
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Input
                            placeholder="Find endpoint..."
                            className="pl-4 h-10 bg-muted/50 border-none shadow-inner focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <APIList
                        title="Core & Management API"
                        description="Endpoints for users, products, sales, and primary entities."
                        categories={filteredLeft}
                        color="bg-blue-500"
                    />

                    {/* Divider for Desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-[280px] bottom-12 w-px bg-border -translate-x-1/2 opacity-50" />

                    {/* Right Column */}
                    <APIList
                        title="Operations & Settings API"
                        description="Endpoints for inventory, configuration, migrations, and system tools."
                        categories={filteredRight}
                        color="bg-emerald-500"
                    />
                </div>

                {/* Footer / System Note */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
                    <div className="p-5 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-4">
                        <div className="shrink-0 p-3 bg-blue-500/10 rounded-lg h-fit">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">Standard Auth</h4>
                            <p className="text-xs text-muted-foreground">Both systems share the same JWT-based authentication protocol for seamless integration.</p>
                        </div>
                    </div>
                    <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex gap-4">
                        <div className="shrink-0 p-3 bg-emerald-500/10 rounded-lg h-fit">
                            <ArrowRightLeft className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">Real-time Sync</h4>
                            <p className="text-xs text-muted-foreground">POS data synchronizes locally when online, bridging retail operations with core ledgers.</p>
                        </div>
                    </div>
                    <div className="p-5 bg-purple-500/5 rounded-xl border border-purple-500/10 flex gap-4">
                        <div className="shrink-0 p-3 bg-purple-500/10 rounded-lg h-fit">
                            <Activity className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">Monitoring</h4>
                            <p className="text-xs text-muted-foreground">All external terminal requests are logged and monitored for latency and success rates.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
`;

fs.writeFileSync(filePath, content);
console.log('Updated correctly!');
