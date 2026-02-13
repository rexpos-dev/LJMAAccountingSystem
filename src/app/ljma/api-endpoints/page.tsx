"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Terminal,
    Database,
    Lock,
    Users,
    ShoppingCart,
    Package,
    Activity,
    Bell,
    ShieldCheck,
    CheckCircle2,
    Copy,
    ChevronDown,
    LayoutGrid,
    Store,
    ArrowRightLeft,
    TrendingUp,
    Settings,
    FileBarChart,
    Truck,
    RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Component for copying text to clipboard
const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            title="Copy to clipboard"
        >
            {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
            )}
        </button>
    );
};

export default function APIEndpointsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const accountingCategories = [
        {
            title: "Core Entities",
            icon: <Database className="w-5 h-5 text-blue-500" />,
            endpoints: [
                { method: "GET", path: "/api/accounts", description: "Get all accounts", params: "bank (filter bank accounts), type (filter by type)" },
                { method: "POST", path: "/api/accounts", description: "Create new account" },
                { method: "PUT", path: "/api/accounts", description: "Update existing account" },
                { method: "POST", path: "/api/accounts/bulk-upload", description: "Bulk upload accounts from CSV" },
                { method: "GET", path: "/api/transactions", description: "Get all transactions", params: "accountNumber, limit, offset" },
                { method: "POST", path: "/api/transactions", description: "Create new transaction" },
                { method: "PUT", path: "/api/transactions", description: "Update existing transaction" },
                { method: "DELETE", path: "/api/transactions?id={id}", description: "Delete transaction" },
                { method: "GET", path: "/api/customers", description: "Get all customers" },
                { method: "POST", path: "/api/customers", description: "Create new customer" },
                { method: "PUT", path: "/api/customers", description: "Update existing customer" },
                { method: "DELETE", path: "/api/customers?id={id}", description: "Delete customer" },
                { method: "GET", path: "/api/products", description: "Get all products" },
                { method: "POST", path: "/api/products", description: "Create new product" },
                { method: "PUT", path: "/api/products", description: "Update existing product" },
                { method: "DELETE", path: "/api/products?id={id}", description: "Delete product" },
                { method: "GET", path: "/api/brands", description: "Get all brands" },
                { method: "POST", path: "/api/brands", description: "Create new brand" },
                { method: "GET", path: "/api/categories", description: "Get all parent categories" },
                { method: "GET", path: "/api/suppliers", description: "Get all active suppliers" },
                { method: "POST", path: "/api/suppliers", description: "Create new supplier" },
                { method: "GET", path: "/api/units-of-measure", description: "Get all active units of measure" },
                { method: "GET", path: "/api/conversion-factors", description: "Get all conversion factors" },
            ]
        },
        {
            title: "User Management",
            icon: <Users className="w-5 h-5 text-green-500" />,
            endpoints: [
                { method: "GET", path: "/api/user-permissions", description: "Get all user permissions" },
                { method: "POST", path: "/api/user-permissions", description: "Create new user permission" },
                { method: "PUT", path: "/api/user-permissions", description: "Update user permission" },
                { method: "DELETE", path: "/api/user-permissions?id={id}", description: "Delete user permission" },
                { method: "GET", path: "/api/sales-users", description: "Get all sales users" },
                { method: "POST", path: "/api/sales-users", description: "Create new sales user" },
            ]
        },
        {
            title: "Request Management",
            icon: <FileBarChart className="w-5 h-5 text-orange-500" />,
            endpoints: [
                { method: "GET", path: "/api/requests", description: "Get all requests" },
                { method: "POST", path: "/api/requests", description: "Create new request" },
                { method: "GET", path: "/api/requests/stats", description: "Get request statistics" },
                { method: "GET", path: "/api/requests/[id]", description: "Get single request details" },
                { method: "PATCH", path: "/api/requests/[id]", description: "Update request fields" },
                { method: "DELETE", path: "/api/requests/[id]", description: "Delete a request" },
            ]
        },
        {
            title: "Sales & Invoicing",
            icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
            endpoints: [
                { method: "GET", path: "/api/invoices", description: "Get all invoices" },
                { method: "POST", path: "/api/invoices", description: "Create new invoice" },
                { method: "GET", path: "/api/loyalty-points", description: "Get loyalty points" },
                { method: "POST", path: "/api/loyalty-points", description: "Create loyalty points entry" },
                { method: "GET", path: "/api/loyalty-points/summary", description: "Get loyalty points summary" },
            ]
        },
        {
            title: "Purchase Orders",
            icon: <Package className="w-5 h-5 text-yellow-500" />,
            endpoints: [
                { method: "GET", path: "/api/purchase-orders", description: "Get all purchase orders" },
                { method: "POST", path: "/api/purchase-orders", description: "Create new purchase order" },
                { method: "PUT", path: "/api/purchase-orders", description: "Update purchase order" },
                { method: "DELETE", path: "/api/purchase-orders?id={id}", description: "Delete purchase order" },
                { method: "GET", path: "/api/purchase-orders/[id]", description: "Get specific purchase order" },
            ]
        },
        {
            title: "Business Settings",
            icon: <Activity className="w-5 h-5 text-red-500" />,
            endpoints: [
                { method: "GET", path: "/api/business-profile", description: "Get business profile" },
                { method: "POST", path: "/api/business-profile", description: "Update business profile" },
                { method: "GET", path: "/api/reminders", description: "Get all active reminders" },
                { method: "POST", path: "/api/reminders", description: "Create new reminder" },
            ]
        },
        {
            title: "Notifications",
            icon: <Bell className="w-5 h-5 text-blue-400" />,
            endpoints: [
                { method: "GET", path: "/api/notifications", description: "Get unread notifications" },
                { method: "PUT", path: "/api/notifications", description: "Mark notification as read" },
            ]
        },
        {
            title: "Backup & Utilities",
            icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
            endpoints: [
                { method: "GET", path: "/api/backup", description: "Get recent backup jobs" },
                { method: "POST", path: "/api/backup", description: "Trigger new database backup" },
                { method: "GET", path: "/api/backup/download/[id]", description: "Download backup file" },
                { method: "GET", path: "/api/invoices/next-number", description: "Get next invoice number" },
                { method: "GET", path: "/api/purchase-orders/next-number", description: "Get next PO number" },
                { method: "GET", path: "/api/transactions/next-reference", description: "Get next transaction reference" },
            ]
        },
        {
            title: "Authentication",
            icon: <Lock className="w-5 h-5 text-red-400" />,
            endpoints: [
                { method: "GET", path: "/api/auth", description: "Get session status" },
                { method: "POST", path: "/api/auth/login", description: "User login" },
                { method: "POST", path: "/api/auth/logout", description: "User logout" }
            ]
        }
    ];

    const posCategories = [
        {
            title: "Point of Sale Operations",
            icon: <Store className="w-5 h-5 text-blue-600" />,
            endpoints: [
                { method: "POST", path: "/api/pos/checkout", description: "Process transaction checkout" },
                { method: "GET", path: "/api/pos/shifts", description: "Manage cashier shifts" },
                { method: "GET", path: "/api/pos/terminals", description: "List all POS terminals" },
                { method: "POST", path: "/api/pos/cash-transfer", description: "Transfer cash between terminals" },
                { method: "POST", path: "/api/pos/payment-validation", description: "Validate payment status" },
                { method: "GET", path: "/api/pos/recent-sales", description: "Get recently completed sales" },
                { method: "POST", path: "/api/pos/void-transaction", description: "Void a specific transaction" }
            ]
        },
        {
            title: "Sales & Transactions",
            icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
            endpoints: [
                { method: "GET", path: "/api/sales", description: "General sales overview" },
                { method: "GET", path: "/api/sales/by-date", description: "Sales analytics by date" },
                { method: "GET", path: "/api/sales/by-product", description: "Sales analytics by product" },
                { method: "GET", path: "/api/sales/hourly", description: "Hourly sales breakdown" },
                { method: "GET", path: "/api/sales/transactions", description: "History of all transactions" },
                { method: "GET", path: "/api/sales/returns", description: "Handle sales returns" },
                { method: "GET", path: "/api/sales/x-reading", description: "Generate X-Reading report" },
                { method: "GET", path: "/api/sales/z-reading", description: "Generate Z-Reading report" }
            ]
        },
        {
            title: "Inventory & Loyalty",
            icon: <Database className="w-5 h-5 text-green-600" />,
            endpoints: [
                { method: "GET", path: "/api/products", description: "List available products" },
                { method: "GET", path: "/api/stock-movements", description: "Track item movements" },
                { method: "GET", path: "/api/bad-orders", description: "Log defective or expired goods" },
                { method: "GET", path: "/api/customer-loyalty", description: "Get loyalty card data" },
                { method: "POST", path: "/api/customer-loyalty/adjust-points", description: "Manually adjust points" },
                { method: "GET", path: "/api/customer-loyalty/point-history", description: "View point activity log" }
            ]
        },
        {
            title: "Configuration & Management",
            icon: <Settings className="w-5 h-5 text-gray-600" />,
            endpoints: [
                { method: "GET", path: "/api/pos-settings", description: "Retrieve terminal settings" },
                { method: "POST", path: "/api/pos-settings/upload-logo", description: "Upload receipt/display logo" },
                { method: "GET", path: "/api/settings/api-config", description: "External API connection config" },
                { method: "POST", path: "/api/data-management/reset", description: "Reset terminal data" }
            ]
        },
        {
            title: "Reports",
            icon: <FileBarChart className="w-5 h-5 text-orange-600" />,
            endpoints: [
                { method: "GET", path: "/api/reports/inventory", description: "Generate inventory level reports" },
                { method: "GET", path: "/api/reports/soa", description: "Statement of Account reports" },
                { method: "GET", path: "/api/reports/velocity", description: "Item sales velocity analytics" },
                { method: "GET", path: "/api/reports/stats", description: "General performance statistics" }
            ]
        },
        {
            title: "Authentication",
            icon: <Lock className="w-5 h-5 text-red-500" />,
            endpoints: [
                { method: "POST", path: "/api/auth/login", description: "POS terminal login" },
                { method: "POST", path: "/api/auth/signup", description: "Register new cashier/user" }
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

    const filteredAccounting = useMemo(() => filterCategories(accountingCategories), [searchQuery]);
    const filteredPOS = useMemo(() => filterCategories(posCategories), [searchQuery]);

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
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Accordion type="multiple" className="space-y-3">
                    {categories.map((category: any, idx: number) => (
                        <AccordionItem
                            key={idx}
                            value={category.title}
                            className="bg-card border rounded-lg overflow-hidden shadow-sm"
                        >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-muted rounded-md shrink-0">
                                        {category.icon}
                                    </div>
                                    <div className="text-left">
                                        <span className="font-semibold text-sm">{category.title}</span>
                                        <div className="text-[10px] text-muted-foreground">
                                            {category.endpoints.length} Endpoint{category.endpoints.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 pt-1">
                                <div className="space-y-2 mt-2">
                                    {category.endpoints.map((ep: any, eIdx: number) => (
                                        <div
                                            key={eIdx}
                                            className="group flex flex-col gap-1.5 p-3 rounded-md bg-muted/40 border border-transparent hover:border-border hover:bg-muted/60 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {getMethodBadge(ep.method)}
                                                    <code className="text-[11px] font-mono font-medium text-foreground/80 truncate">
                                                        {ep.path}
                                                    </code>
                                                </div>
                                                <CopyButton text={ep.path} />
                                            </div>
                                            <div className="text-[11px] text-muted-foreground px-0.5">
                                                {ep.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                {categories.length === 0 && (
                    <div className="text-center py-10 bg-muted/10 rounded-lg border border-dashed text-muted-foreground text-sm">
                        No matches in this section
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background/95 p-6 md:p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Terminal className="w-6 h-6" />
                            <span className="font-mono text-sm tracking-widest uppercase">API Synchronization Hub</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">API Documentation</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            A dual-reference documentation for the LJMA System, showcasing existing Accounting services and upcoming POS integrations.
                        </p>
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Find endpoint across systems..."
                            className="pl-10 h-12 bg-muted/50 border-none shadow-inner focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Accounting */}
                    <APIList
                        title="Accounting API"
                        description="Legacy systems for ledger management, procurement, and administrative reporting."
                        categories={filteredAccounting}
                        color="bg-blue-500"
                    />

                    {/* Divider for Desktop */}
                    <div className="hidden lg:block absolute left-1/2 top-[280px] bottom-12 w-px bg-border -translate-x-1/2 opacity-50" />

                    {/* Right Column: POS */}
                    <APIList
                        title="POS API"
                        description="New endpoints designed for real-time retail transactions and terminal synchronization."
                        categories={filteredPOS}
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
                            <h4 className="text-sm font-bold">Data Sync</h4>
                            <p className="text-xs text-muted-foreground">POS transactions automatically reconcile with Accounting ledgers via internal bridge services.</p>
                        </div>
                    </div>
                    <div className="p-5 bg-orange-500/5 rounded-xl border border-orange-500/10 flex gap-4">
                        <div className="shrink-0 p-3 bg-orange-500/10 rounded-lg h-fit">
                            <RefreshCw className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold">POS Versioning</h4>
                            <p className="text-xs text-muted-foreground">The POS API is currently in V2-RC (Release Candidate) phase. Expect minor path adjustments.</p>
                        </div>
                    </div>
                </div>

                {/* Developer Attribution */}
                <div className="pt-8 flex flex-col items-center text-center space-y-2">
                    <Separator className="mb-6 opacity-50" />
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-medium uppercase tracking-widest">
                        <Users className="w-3.5 h-3.5" />
                        <span>Developed By</span>
                    </div>
                    <p className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Rex C. Domingo & Jhazon Enanoria
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <a
                            href="mailto:rexdomingocabiling@gmail.com"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <Bell className="w-3.5 h-3.5" />
                            rexdomingocabiling@gmail.com
                        </a>
                        <a
                            href="mailto:jhazoneanoria@gmail.com"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                            <Bell className="w-3.5 h-3.5" />
                            jhazoneanoria@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
