"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDialog } from "@/components/layout/dialog-context";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Contact2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Percent, 
  Save, 
  X, 
  ShieldCheck, 
  ChevronRight,
  UserPlus,
  Briefcase,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddSupplierDialog() {
  const { openDialogs, closeDialog, getDialogData, setDialogData } = useDialog();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const dialogData = getDialogData("add-supplier");
  const isEditMode = dialogData?.mode === "edit";
  const supplierToEdit = dialogData?.supplier;

  const getMarkupFromInfo = (info: string | null) => {
    if (!info) return "0";
    const match = info.match(/Markup: (\d+)%/);
    return match ? match[1] : "0";
  };

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    contactFirstName: "",
    address: "",
    phone: "",
    phoneAlternative: "",
    fax: "",
    email: "",
    vatInfo: "",
    isTaxExempt: false,
    additionalInfo: "",
    markup: "0",
    paymentTerms: "",
    paymentTermsValue: "30",
  });

  useEffect(() => {
    if (openDialogs["add-supplier"] && isEditMode && supplierToEdit) {
      setFormData({
        name: supplierToEdit.name || "",
        contactPerson: supplierToEdit.contactPerson || "",
        contactFirstName: supplierToEdit.contactFirstName || "",
        address: supplierToEdit.address || "",
        phone: supplierToEdit.phone || "",
        phoneAlternative: supplierToEdit.phoneAlternative || "",
        fax: supplierToEdit.fax || "",
        email: supplierToEdit.email || "",
        vatInfo: supplierToEdit.vatInfo || "",
        isTaxExempt: supplierToEdit.isTaxExempt || false,
        additionalInfo: supplierToEdit.additionalInfo || "",
        markup: getMarkupFromInfo(supplierToEdit.additionalInfo),
        paymentTerms: supplierToEdit.paymentTerms || "",
        paymentTermsValue: supplierToEdit.paymentTermsValue || "30",
      });
    } else if (openDialogs["add-supplier"]) {
       setFormData({
        name: "", contactPerson: "", contactFirstName: "", address: "", phone: "", 
        phoneAlternative: "", fax: "", email: "", vatInfo: "", isTaxExempt: false, 
        additionalInfo: "", markup: "0", paymentTerms: "", paymentTermsValue: "30",
      });
    }
  }, [openDialogs["add-supplier"], isEditMode, supplierToEdit]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    closeDialog("add-supplier");
    setDialogData("add-supplier", null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Validation Error", description: "Supplier Name is required.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const finalAdditionalInfo = `Markup: ${formData.markup}%`;
      const body = isEditMode ? { ...formData, additionalInfo: finalAdditionalInfo, id: supplierToEdit.id } : { ...formData, additionalInfo: finalAdditionalInfo };

      const response = await fetch("/api/suppliers", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save supplier");

      toast({ title: "Success", description: `Supplier ${isEditMode ? "updated" : "added"} successfully.` });
      handleClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialogs["add-supplier"]} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[85vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
                {isEditMode ? "Supplier Refinement" : "Vendor Acquisition"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Supply Chain Node</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Provider Database</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="relative z-10 p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Entity Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Entity Identification</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Legal Trade Name</Label>
                    <div className="relative">
                      <Input 
                        value={formData.name} 
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl pl-10 font-bold uppercase italic tracking-tight" 
                        placeholder="OFFICIAL VENDOR NAME"
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Company Alias</Label>
                      <Input 
                        value={formData.contactPerson} 
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tax ID (TIN)</Label>
                      <Input 
                        value={formData.vatInfo} 
                        onChange={(e) => handleInputChange("vatInfo", e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl font-mono text-xs" 
                        placeholder="000-000-000-000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Communication Node</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Email Gateway</Label>
                    <div className="relative">
                      <Input 
                        value={formData.email} 
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl pl-10" 
                        placeholder="vendor@enterprise.net"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Landline Comms</Label>
                      <div className="relative">
                        <Input 
                          value={formData.phone} 
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-11 rounded-xl pl-10" 
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Mobile Uplink</Label>
                      <div className="relative">
                        <Input 
                          value={formData.phoneAlternative} 
                          onChange={(e) => handleInputChange("phoneAlternative", e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-11 rounded-xl pl-10" 
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Commercial & Logistics */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Commercial Configuration</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Settlement Terms</Label>
                      <Select 
                        value={formData.paymentTerms} 
                        onValueChange={(val) => handleInputChange("paymentTerms", val)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-11 rounded-xl">
                          <SelectValue placeholder="Select Terms" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          <SelectItem value="Pay in Days">Standard Credit</SelectItem>
                          <SelectItem value="COD">Cash on Delivery</SelectItem>
                          <SelectItem value="Prepaid">Pre-Funded Protocol</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Margin Escalation (%)</Label>
                      <div className="relative">
                        <Input 
                          type="number" 
                          value={formData.markup} 
                          onChange={(e) => handleInputChange("markup", e.target.value)}
                          className="bg-white/5 border-white/10 text-primary h-11 rounded-xl pl-10 font-black italic" 
                        />
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Operation Parameters</Label>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                       <ShieldCheck className="h-4 w-4 text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Auto-Reconcile Invoices</span>
                       <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Logistics Matrix</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Headquarters Address</Label>
                    <div className="relative">
                      <Textarea 
                        value={formData.address} 
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-white/5 border-white/10 text-white rounded-xl min-h-[140px] pl-10 pt-3" 
                        placeholder="Logistics Hub Location..."
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-white/20">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Provider Integrity Verified</span>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="px-6 h-12 rounded-xl border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
            >
              Discard
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 h-12 rounded-xl bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-400/20 transition-all gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? "Processing..." : isEditMode ? "Synchronize Node" : "Establish Provider"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
