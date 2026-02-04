"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    ChevronRight,
    Terminal,
    Globe,
    Lock,
    Database,
    Bell,
    ShieldCheck,
    Activity,
    FileText,
    Users,
    ShoppingCart,
    Package,
    Copy,
    CheckCircle2,
    ExternalLink,
    ChevronDown
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

    const categories = [
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
                { method: "PUT", path: "/api/brands", description: "Update existing brand" },
                { method: "DELETE", path: "/api/brands?id={id}", description: "Delete brand" },
                { method: "GET", path: "/api/categories", description: "Get all parent categories" },
                { method: "POST", path: "/api/categories", description: "Create new category" },
                { method: "PUT", path: "/api/categories", description: "Update existing category" },
                { method: "DELETE", path: "/api/categories?id={id}", description: "Delete category" },
                { method: "GET", path: "/api/categories/[categoryId]/subcategories", description: "Get subcategories for a parent category" },
                { method: "GET", path: "/api/suppliers", description: "Get all active suppliers" },
                { method: "POST", path: "/api/suppliers", description: "Create new supplier" },
                { method: "PUT", path: "/api/suppliers", description: "Update existing supplier" },
                { method: "DELETE", path: "/api/suppliers?id={id}", description: "Delete supplier" },
                { method: "GET", path: "/api/units-of-measure", description: "Get all active units of measure" },
                { method: "POST", path: "/api/units-of-measure", description: "Create new unit of measure" },
                { method: "PUT", path: "/api/units-of-measure", description: "Update existing unit of measure" },
                { method: "DELETE", path: "/api/units-of-measure?id={id}", description: "Delete unit of measure" },
                { method: "GET", path: "/api/conversion-factors", description: "Get all conversion factors" },
                { method: "POST", path: "/api/conversion-factors", description: "Create new conversion factor" },
                { method: "PUT", path: "/api/conversion-factors", description: "Update existing conversion factor" },
                { method: "DELETE", path: "/api/conversion-factors?id={id}", description: "Delete conversion factor" },
                { method: "GET", path: "/api/external-products", description: "Get external products" },
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
                { method: "PUT", path: "/api/sales-users", description: "Update sales user" },
                { method: "DELETE", path: "/api/sales-users?id={id}", description: "Delete sales user" },
            ]
        },
        {
            title: "Request Management",
            icon: <FileText className="w-5 h-5 text-orange-500" />,
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
            icon: <ShoppingCart className="w-5 h-5 text-purple-500" />,
            endpoints: [
                { method: "GET", path: "/api/invoices", description: "Get all invoices" },
                { method: "POST", path: "/api/invoices", description: "Create new invoice" },
                { method: "GET", path: "/api/loyalty-points", description: "Get loyalty points" },
                { method: "POST", path: "/api/loyalty-points", description: "Create loyalty points entry" },
                { method: "GET", path: "/api/loyalty-point-settings", description: "Get loyalty point settings" },
                { method: "POST", path: "/api/loyalty-point-settings", description: "Create loyalty point setting" },
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
                { method: "POST", path: "/api/purchase-orders/bulk-upload", description: "Bulk upload PO items" },
            ]
        },
        {
            title: "Business Settings",
            icon: <Activity className="w-5 h-5 text-red-500" />,
            endpoints: [
                { method: "GET", path: "/api/business-profile", description: "Get business profile" },
                { method: "POST", path: "/api/business-profile", description: "Create or update business profile" },
                { method: "GET", path: "/api/reminders", description: "Get all active reminders" },
                { method: "POST", path: "/api/reminders", description: "Create new reminder" },
                { method: "PUT", path: "/api/reminders", description: "Update existing reminder" },
                { method: "DELETE", path: "/api/reminders?id={id}", description: "Delete reminder" },
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
                { method: "GET", path: "/api/seed-requests", description: "Seed database with samples" },
            ]
        },
        {
            title: "Authentication",
            icon: <Lock className="w-5 h-5 text-red-400" />,
            endpoints: [
                { method: "GET", path: "/api/auth", description: "Get session status" },
                { method: "POST", path: "/api/auth/login", description: "User login" },
                { method: "POST", path: "/api/auth/logout", description: "User logout" },
            ]
        }
    ];

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;

        return categories.map(category => ({
            ...category,
            endpoints: category.endpoints.filter(ep =>
                ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ep.method.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.endpoints.length > 0);
    }, [searchQuery]);

    const getMethodBadge = (method: string) => {
        switch (method) {
            case "GET": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">GET</Badge>;
            case "POST": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">POST</Badge>;
            case "PUT": return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">PUT</Badge>;
            case "PATCH": return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">PATCH</Badge>;
            case "DELETE": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">DELETE</Badge>;
            default: return <Badge variant="outline">{method}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-background/95 p-6 md:p-10 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b pb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Terminal className="w-6 h-6" />
                            <span className="font-mono text-sm tracking-wider uppercase">Administrative Utilities</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">API Endpoints</h1>
                        <p className="text-muted-foreground text-lg">
                            Technical documentation for the LJMA Accounting System backend services.
                        </p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search endpoints..."
                            className="pl-10 h-11 bg-muted/50 border-none shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-8">
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                            <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-medium">No endpoints found</h3>
                            <p className="text-muted-foreground">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <Accordion type="multiple" defaultValue={categories.map(c => c.title)} className="space-y-4">
                            {filteredCategories.map((category, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={category.title}
                                    className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg">
                                                {category.icon}
                                            </div>
                                            <div className="text-left">
                                                <span className="font-semibold text-lg">{category.title}</span>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {category.endpoints.length} Endpoint{category.endpoints.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6 pt-2">
                                        <div className="space-y-3 mt-2">
                                            {category.endpoints.map((ep, eIdx) => (
                                                <div
                                                    key={eIdx}
                                                    className="group relative flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg bg-muted/40 border border-transparent hover:border-border hover:bg-muted/60 transition-all"
                                                >
                                                    <div className="flex items-center gap-3 md:w-1/4 min-w-[140px]">
                                                        {getMethodBadge(ep.method)}
                                                        <code className="text-xs font-mono font-medium text-foreground/80 break-all">
                                                            {ep.path}
                                                        </code>
                                                    </div>

                                                    <div className="flex-1 text-sm text-foreground/90">
                                                        {ep.description}
                                                        {ep.params && (
                                                            <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
                                                                <span className="font-semibold uppercase tracking-tighter opacity-70">Params:</span>
                                                                <code>{ep.params}</code>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <CopyButton text={ep.path} />
                                                        <div className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer" title="Try it (Experimental)">
                                                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>

                {/* Footer info */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="p-4 bg-blue-500/10 rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300">Developer Access Required</h4>
                        <p className="text-sm text-blue-800/70 dark:text-blue-400/70">
                            Most endpoints require appropriate JWT authorization tokens in the <code>Authorization: Bearer</code> header.
                            Be cautious when testing destructive POST/DELETE operations in production environments.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className="bg-blue-500 text-white border-none">v1.2.0 Stable</Badge>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-transparent">Internal Only</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
