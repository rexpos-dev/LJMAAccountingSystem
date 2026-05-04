"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  Search, 
  X, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Trophy,
  Mail,
  Phone,
  Settings2
} from "lucide-react";
import { useDialog } from "@/components/layout/dialog-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  code: string;
  customerName: string;
  contactFirstName: string | null;
  address: string | null;
  phonePrimary: string | null;
  phoneAlternative: string | null;
  email: string | null;
  isActive: boolean;
  creditLimit: number | null;
  isTaxExempt: boolean;
  paymentTerms: string | null;
  paymentTermsValue: string | null;
  salesperson: string | null;
  customerGroup: string | null;
  isEntitledToLoyaltyPoints: boolean;
  pointSetting: string | null;
  loyaltyCalculationMethod: string | null;
  loyaltyCardNumber: string | null;
  loyaltyPointsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerListDialog() {
  const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
  const { toast } = useToast();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuditor = user?.accountType === "Auditor";

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      const transformedData = data.map((customer: any) => ({
        ...customer,
        isActive: Boolean(customer.isActive),
        isTaxExempt: Boolean(customer.isTaxExempt),
        isEntitledToLoyaltyPoints: Boolean(customer.isEntitledToLoyaltyPoints),
        creditLimit: customer.creditLimit ? Number(customer.creditLimit) : null,
        loyaltyPointsBalance: customer.loyaltyPointsBalance || 0,
      }));
      setCustomers(transformedData);
    } catch (error: any) {
      setError("Synchronisation Error: Unable to retrieve customer directory.");
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openDialogs["customer-list"]) {
      fetchCustomers();
    }
  }, [openDialogs["customer-list"]]);

  useEffect(() => {
    const handleRefresh = () => fetchCustomers();
    window.addEventListener("customer-list-refresh", handleRefresh);
    return () => window.removeEventListener("customer-list-refresh", handleRefresh);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    if (!confirm(`Are you sure you want to terminate "${selectedCustomer.customerName}"?`)) return;

    try {
      const response = await fetch(`/api/customers?id=${selectedCustomer.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Termination failed");
      toast({ title: "Success", description: "Customer record removed." });
      fetchCustomers();
      setSelectedCustomer(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = () => {
    if (selectedCustomer) {
      setDialogData("add-customer", selectedCustomer);
      openDialog("add-customer");
    }
  };

  return (
    <Dialog open={openDialogs["customer-list"]} onOpenChange={(open) => !open && closeDialog("customer-list")}>
      <DialogContent className="max-w-[95vw] p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Customer Directory</DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">Client Intelligence</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{filteredCustomers.length} Total Entities</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input
                placeholder="Search Entity Database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white pl-10 h-10 rounded-xl focus:ring-primary/20"
              />
            </div>
            <button 
              onClick={() => closeDialog("customer-list")}
              className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Toolbar */}
        {!isAuditor && (
          <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-4 shrink-0">
            <Button 
              onClick={() => openDialog("add-customer")}
              className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-6 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Acquire New Entity
            </Button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Button 
              variant="outline" 
              disabled={!selectedCustomer}
              onClick={handleEdit}
              className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20"
            >
              <Pencil className="h-3.5 w-3.5" />
              Refine Record
            </Button>
            <Button 
              variant="outline" 
              disabled={!selectedCustomer}
              onClick={handleDelete}
              className="border-white/10 bg-white/5 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Terminate Entity
            </Button>
            <button 
              onClick={fetchCustomers}
              className="ml-auto p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
              title="Sync Database"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </button>
          </div>
        )}

        {/* Master Table */}
        <ScrollArea className="flex-1">
          <div className="p-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Identity Code</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Entity Profile</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Communications</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Fiscal Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Exposure Limit</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-center">Reward Protocol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-red-400 gap-2">
                          <ShieldCheck className="h-12 w-12 opacity-20" />
                          <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-white/20 gap-2">
                          <Search className="h-12 w-12 opacity-20" />
                          <p className="text-sm font-black uppercase tracking-widest">No Intelligence Found</p>
                          <p className="text-[10px] font-medium opacity-50">Refine search parameters or acquire new entity</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCustomers.map((customer) => (
                      <TableRow 
                        key={customer.id} 
                        onClick={() => setSelectedCustomer(customer)}
                        className={cn(
                          "border-white/5 cursor-pointer transition-all duration-300 group",
                          selectedCustomer?.id === customer.id ? "bg-primary/10" : "hover:bg-white/[0.02]"
                        )}
                      >
                        <TableCell className="py-4">
                          <span className="font-mono text-xs font-black tracking-tighter text-white/60 group-hover:text-primary transition-colors">
                            {customer.code}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase italic tracking-tight text-white group-hover:translate-x-1 transition-transform">
                              {customer.customerName}
                            </span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                              {customer.customerGroup || "Standard Entity"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            {customer.email && (
                              <div className="flex items-center gap-2 text-[10px] font-medium text-white/40">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </div>
                            )}
                            {customer.phonePrimary && (
                              <div className="flex items-center gap-2 text-[10px] font-medium text-white/40">
                                <Phone className="h-3 w-3" />
                                {customer.phonePrimary}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              customer.isActive ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                            )} />
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              customer.isActive ? "text-emerald-400" : "text-red-400"
                            )}>
                              {customer.isActive ? "Operational" : "Deactivated"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-blue-400/40" />
                            <span className="text-sm font-black italic tracking-tighter text-blue-400">
                              {customer.creditLimit ? `₱${customer.creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "₱0.00"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col items-center justify-center gap-1">
                             {customer.isEntitledToLoyaltyPoints ? (
                               <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                                  <Trophy className="h-3 w-3 text-yellow-400" />
                                  <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{customer.loyaltyPointsBalance} PTS</span>
                               </div>
                             ) : (
                               <span className="text-[10px] font-black text-white/10 uppercase tracking-widest italic">Disabled</span>
                             )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>

        {/* Refined Pagination Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/40">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Sync: 128ms</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 mr-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-2 text-xs">Node</span>
                {[...Array(totalPages)].map((_, i) => (
                   <button 
                     key={i} 
                     onClick={() => setCurrentPage(i + 1)}
                     className={cn(
                       "w-8 h-8 rounded-lg font-black text-xs transition-all border",
                       currentPage === i + 1 ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                     )}
                   >
                     {i + 1}
                   </button>
                ))}
             </div>
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
