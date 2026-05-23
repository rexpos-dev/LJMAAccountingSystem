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
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { useEmployees } from "@/hooks/use-employees";
import {
  FileText,
  User,
  Briefcase,
  Target,
  DollarSign,
  PenTool,
  CheckCircle2,
  ShieldCheck,
  Send,
  Printer,
  Calendar as CalendarIcon,
  X,
  CreditCard,
  Hash,
  Activity,
  Calculator,
  Building2,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CashFundRequestDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { data: userPermissions = [], isLoading: usersLoading } = useUserPermissions();
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const [formData, setFormData] = useState({
    controlNo: "",
    date: new Date().toISOString().split("T")[0],
    requestor: "",
    position: "",
    temporaryChargeTo: "",
    tempAccountNo: "",
    finalChargeTo: "",
    finalAccountNo: "",
    purpose: "",
    amount: "",
    requestedBy: "",
    verifiedBy: "",
    approvedBy: "",
    processedBy: "",
    releasedReceivedBy: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isSaving) return;
    closeDialog("cash-fund-request");
  };

  const handleSave = async () => {
    if (!formData.requestor || !formData.purpose || !formData.amount) {
      alert("Required: Requestor, Purpose, and Amount.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: formData.requestor,
          position: formData.position,
          businessUnit: formData.temporaryChargeTo,
          chargeTo: formData.finalChargeTo,
          accountNo: formData.finalAccountNo,
          purpose: formData.purpose,
          amount: parseFloat(formData.amount) || 0,
          verifiedBy: formData.verifiedBy,
          approvedBy: formData.approvedBy,
          processedBy: formData.processedBy,
          items: [],
          formName: "CASH FUND REQUEST"
        }),
      });

      if (!response.ok) throw new Error("Failed to save request");
      handleClose();
    } catch (error) {
      console.error("Error saving request:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={openDialogs["cash-fund-request"]} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[85vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">Liquidity Requisition</DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-400 border border-amber-400/20">Operational Cash</span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Protocol CR-v2.0</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest text-right">Reference Serial</span>
              <span className="text-sm font-bold text-foreground font-mono uppercase tracking-tighter">
                {formData.controlNo || "UNASSIGNED-NODE"}
              </span>
            </div>
            
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Top Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-400">
                  <Calculator className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Requested Liquidity</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-amber-400/60 uppercase">PHP</span>
                  <span className="text-3xl font-black italic tracking-tighter text-amber-400">
                    {Number(formData.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
                  <User className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Initiating Entity</p>
                <span className="text-2xl font-black italic tracking-tighter text-blue-400 uppercase truncate block">
                  {formData.requestor || "IDENTIFY REQUESTOR"}
                </span>
              </div>

              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-400">
                  <Activity className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Compliance Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    formData.requestor && formData.amount ? "bg-emerald-400 animate-pulse" : "bg-foreground/10"
                  )} />
                  <span className={cn(
                    "text-lg font-black italic tracking-tighter uppercase",
                    formData.requestor && formData.amount ? "text-emerald-400" : "text-foreground/20"
                  )}>
                    {formData.requestor && formData.amount ? "Node Validated" : "Awaiting Data"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Requisition Parameters */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Requisition Parameters</h3>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Event Horizon</Label>
                      <div className="relative group">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400 transition-transform group-focus-within:scale-110" />
                        <Input type="date" className="pl-10 bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase transition-all focus:bg-foreground/10" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Serial Node</Label>
                      <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs placeholder:text-foreground/10" placeholder="AUTO-GEN" value={formData.controlNo} onChange={(e) => handleInputChange("controlNo", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Initiating Identity</Label>
                    <Select value={formData.requestor} onValueChange={(val) => {
                      handleInputChange('requestor', val);
                      const emp = employees.find((e: any) => `${e.firstName} ${e.lastName}` === val);
                      if (emp) {
                        if (emp.designation) handleInputChange('position', emp.designation);
                        if (emp.employeeId) handleInputChange('tempAccountNo', emp.employeeId);
                      }
                    }}>
                      <SelectTrigger className=" bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                        <SelectValue placeholder="Identify Personnel" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-foreground/10 text-foreground">
                        {employees.map((emp: any) => (
                          <SelectItem key={emp.id} value={`${emp.firstName} ${emp.lastName}`} className="text-xs font-bold uppercase">
                            {emp.firstName} {emp.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Designation Context</Label>
                    <div className="relative group">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 group-focus-within:animate-pulse" />
                      <Input className="pl-10 bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase" value={formData.position} onChange={(e) => handleInputChange("position", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Allocation & Purpose */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Fiscal Target Matrix</h3>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-3xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-3 w-3 text-amber-400/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Temporal Node</span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-black uppercase text-foreground/30 ml-1">Business Unit</Label>
                          <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-xs uppercase" value={formData.temporaryChargeTo} onChange={(e) => handleInputChange("temporaryChargeTo", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-black uppercase text-foreground/30 ml-1">Account Ref</Label>
                          <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg font-mono text-[10px]" value={formData.tempAccountNo} onChange={(e) => handleInputChange("tempAccountNo", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-3 w-3 text-emerald-400/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">Final Allocation</span>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-black uppercase text-foreground/30 ml-1">Ledger Target</Label>
                          <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg text-xs uppercase" value={formData.finalChargeTo} onChange={(e) => handleInputChange("finalChargeTo", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[9px] font-black uppercase text-foreground/30 ml-1">Account Node</Label>
                          <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-lg font-mono text-[10px]" value={formData.finalAccountNo} onChange={(e) => handleInputChange("finalAccountNo", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Intent Logic / Purpose</Label>
                      <Textarea className="min-h-[100px] bg-foreground/5 border-foreground/10 text-foreground/80 rounded-2xl text-xs font-bold leading-relaxed resize-none placeholder:text-foreground/5" placeholder="Add mission-critical particulars..." value={formData.purpose} onChange={(e) => handleInputChange("purpose", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Value Capture</Label>
                      <div className="relative group h-[100px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-amber-400 italic group-focus-within:scale-110 transition-transform">₱</span>
                        <Input className="pl-10 h-full bg-amber-400/5 border-amber-400/10 focus:border-amber-400/30 text-amber-400 text-3xl font-black italic tracking-tighter text-right rounded-2xl pr-4 transition-all" value={formData.amount} onChange={(e) => handleInputChange("amount", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorization Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Authorization Hierarchy</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Originator", field: "requestedBy", icon: User },
                  { label: "Verifying Node", field: "verifiedBy", icon: ShieldCheck },
                  { label: "Approving Authority", field: "approvedBy", icon: Zap },
                  { label: "Processing Unit", field: "processedBy", icon: Activity },
                  { label: "Release Receptor", field: "releasedReceivedBy", icon: CheckCircle2 }
                ].map((auth, idx) => (
                  <div key={idx} className="bg-foreground/5 border border-foreground/10 p-4 rounded-2xl space-y-3 group hover:bg-foreground/[0.08] transition-all">
                    <div className="flex items-center gap-2">
                      <auth.icon className="h-3 w-3 text-foreground/20 group-hover:text-amber-400 transition-colors" />
                      <Label className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{auth.label}</Label>
                    </div>
                    <Select 
                      value={(formData as any)[auth.field]} 
                      onValueChange={(value) => handleInputChange(auth.field, value)}
                    >
                      <SelectTrigger className=" bg-transparent border-foreground/10 text-foreground rounded-lg text-[10px] font-black uppercase tracking-tight italic">
                        <SelectValue placeholder="Identify..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-foreground/10 text-foreground">
                        {userPermissions.filter(u => u.isActive).map((user) => (
                          <SelectItem key={user.id} value={`${user.firstName} ${user.lastName}`} className="text-[10px] font-black uppercase">
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="h-px bg-foreground/5 mt-2" />
                    <span className="text-[8px] font-black uppercase text-foreground/10 text-center block tracking-[0.3em]">Signatory</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.print()}
              className="h-12 rounded-2xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px] px-6 gap-2"
            >
              <Printer className="h-4 w-4" />
              Hardcopy Stream
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleClose} className="rounded-2xl text-foreground/20 hover:text-foreground hover:bg-foreground/5 transition-all font-black uppercase tracking-widest text-[10px] px-6" >
              Abort Requisition
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.amount || !formData.requestor} className="rounded-2xl bg-amber-400 hover:bg-amber-400/90 text-black font-black uppercase tracking-widest text-[10px] px-10 shadow-lg shadow-amber-400/20 transition-all gap-2" >
              {isSaving ? <Activity className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Commit Requisition
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
