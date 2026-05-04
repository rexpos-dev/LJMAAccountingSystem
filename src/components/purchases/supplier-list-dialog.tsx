"use client";

import React, { useEffect, useState } from "react";
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
import { 
  Plus, 
  X, 
  Pencil, 
  Mail, 
  Phone, 
  RefreshCw,
  Search,
  Building2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Percent,
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useDialog } from "@/components/layout/dialog-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  contactPerson: string | null;
  contactFirstName: string | null;
  phoneAlternative: string | null;
  fax: string | null;
  address: string | null;
  paymentTerms: string | null;
  paymentTermsValue: string | null;
  vatInfo: string | null;
  isTaxExempt: boolean;
  additionalInfo: string | null;
  accountsPayable?: number;
}

export default function SupplierListDialog() {
  const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (openDialogs["supplier-list"]) {
      fetchSuppliers();
    }
  }, [openDialogs["supplier-list"]]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers");
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setDialogData("add-supplier", { mode: "add" });
    openDialog("add-supplier");
  };

  const handleEditSupplier = () => {
    if (!selectedSupplierId) return;
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (supplier) {
      setDialogData("add-supplier", { mode: "edit", supplier });
      openDialog("add-supplier");
    }
  };

  const handleDeleteSupplier = async () => {
    if (!selectedSupplierId) return;
    if (!confirm("Are you sure you want to terminate this provider node?")) return;

    try {
      const res = await fetch(`/api/suppliers?id=${selectedSupplierId}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Provider Removed", description: "Node has been successfully purged." });
        fetchSuppliers();
        setSelectedSupplierId(null);
      }
    } catch (error) {
      toast({ title: "Error", description: "Termination protocol failed.", variant: "destructive" });
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.contactPerson && s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={openDialogs["supplier-list"]} onOpenChange={() => closeDialog("supplier-list")}>
      <DialogContent className="max-w-[95vw] p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">Supply Chain Network</DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Verified Providers</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{filteredSuppliers.length} Active Nodes</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input
                placeholder="Locate Provider Node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 text-white pl-10 h-10 rounded-xl focus:ring-blue-400/20"
              />
            </div>
            <button 
              onClick={() => closeDialog("supplier-list")}
              className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Toolbar */}
        <div className="px-8 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-4 shrink-0">
          <Button 
            onClick={handleAddSupplier}
            className="bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-6 gap-2"
          >
            <Plus className="h-4 w-4" />
            Integrate Provider
          </Button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <Button 
            variant="outline" 
            disabled={!selectedSupplierId}
            onClick={handleEditSupplier}
            className="border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modify Matrix
          </Button>
          <Button 
            variant="outline" 
            disabled={!selectedSupplierId}
            onClick={handleDeleteSupplier}
            className="border-white/10 bg-white/5 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl px-4 gap-2 disabled:opacity-20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Purge Node
          </Button>
          <div className="ml-auto flex items-center gap-4">
             <Button 
                variant="outline" 
                disabled={!selectedSupplierId}
                onClick={() => {
                   const s = suppliers.find(x => x.id === selectedSupplierId);
                   if (s?.email) window.location.href = `mailto:${s.email}`;
                }}
                className="border-white/10 bg-white/5 text-white/40 hover:text-white h-10 w-10 p-0 rounded-xl disabled:opacity-20"
             >
                <Mail className="h-4 w-4" />
             </Button>
             <Button 
                variant="outline" 
                disabled={!selectedSupplierId}
                onClick={() => {
                   const s = suppliers.find(x => x.id === selectedSupplierId);
                   if (s?.phone) window.location.href = `tel:${s.phone}`;
                }}
                className="border-white/10 bg-white/5 text-white/40 hover:text-white h-10 w-10 p-0 rounded-xl disabled:opacity-20"
             >
                <Phone className="h-4 w-4" />
             </Button>
             <button 
               onClick={fetchSuppliers}
               className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
             >
               <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
             </button>
          </div>
        </div>

        {/* Master Table */}
        <ScrollArea className="flex-1">
          <div className="p-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Provider Identity</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Logistics Lead</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Accounts Payable</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Margin (%)</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Settlement Terms</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-white/20 gap-4">
                           <RefreshCw className="h-12 w-12 animate-spin opacity-20" />
                           <p className="text-sm font-black uppercase tracking-widest">Scanning Network...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center text-white/20 gap-2">
                          <Search className="h-12 w-12 opacity-20" />
                          <p className="text-sm font-black uppercase tracking-widest">No Providers Detected</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow 
                        key={supplier.id} 
                        onClick={() => setSelectedSupplierId(supplier.id)}
                        className={cn(
                          "border-white/5 cursor-pointer transition-all duration-300 group",
                          selectedSupplierId === supplier.id ? "bg-blue-400/10" : "hover:bg-white/[0.02]"
                        )}
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase italic tracking-tight text-white group-hover:translate-x-1 transition-transform">
                              {supplier.name}
                            </span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                              {supplier.vatInfo || "Tax Entity"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-white/60">{supplier.contactPerson || "-"}</span>
                              <span className="text-[10px] text-white/20 uppercase tracking-widest font-black italic">{supplier.phone || "No Comms"}</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-4">
                           <div className="flex items-center gap-2">
                              <CreditCard className="h-3 w-3 text-blue-400/40" />
                              <span className="text-sm font-black italic tracking-tighter text-blue-400">₱0.00</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-4">
                           <div className="flex items-center gap-2">
                              <Percent className="h-3 w-3 text-emerald-400/40" />
                              <span className="text-sm font-black italic tracking-tighter text-emerald-400">
                                 {(() => {
                                   const match = supplier.additionalInfo?.match(/Markup: (\d+)%/);
                                   return match ? `${match[1]}%` : "0%";
                                 })()}
                              </span>
                           </div>
                        </TableCell>
                        <TableCell className="py-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                              {supplier.paymentTerms === "Pay in Days"
                                ? `${supplier.paymentTermsValue} Days Credit`
                                : supplier.paymentTerms || "Instant Settlement"}
                           </span>
                        </TableCell>
                        <TableCell className="py-4">
                           <div className="flex items-center justify-center">
                              <div className="flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                                 <ShieldCheck className="h-3 w-3 text-emerald-400" />
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                              </div>
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
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Network Health: Optimal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white"
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
