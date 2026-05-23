"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDialog } from "@/components/layout/dialog-context";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  Mail,
  User,
  ShieldCheck,
  Save,
  X,
  Zap,
  CreditCard,
  MapPin,
  Users,
  Trophy,
  ChevronRight,
  PlusCircle,
  Building2,
  Contact2
} from "lucide-react";
import { useSalesUsers } from "@/hooks/use-sales-users";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoyaltySetting {
  id: string;
  description: string;
  base: string;
  amount: number;
  equivalentPoint: number;
}

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
  createdAt: string;
  updatedAt: string;
}

export function AddCustomerDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();
  const { data: salesUsers = [], isLoading: salesUsersLoading } = useSalesUsers();

  const editCustomer = getDialogData("add-customer");
  const isEditing = !!editCustomer;

  const generateCustomerCode = () => {
    return `CUST-${Math.floor(Math.random() * 1000000)}`;
  };

  const [code, setCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [phonePrimary, setPhonePrimary] = useState("");
  const [phoneAlternative, setPhoneAlternative] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [creditLimit, setCreditLimit] = useState("");
  const [isTaxExempt, setIsTaxExempt] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState("days");
  const [paymentTermsValue, setPaymentTermsValue] = useState("30");
  const [salesperson, setSalesperson] = useState("");
  const [customerGroup, setCustomerGroup] = useState("default");
  const [isEntitledToLoyaltyPoints, setIsEntitledToLoyaltyPoints] = useState(false);
  const [pointSetting, setPointSetting] = useState("");
  const [loyaltyCalculationMethod, setLoyaltyCalculationMethod] = useState("automatic");
  const [loyaltyCardNumber, setLoyaltyCardNumber] = useState("");

  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySetting[]>([]);
  const [loyaltySettingsLoading, setLoyaltySettingsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (openDialogs["add-customer"]) {
      if (isEditing && editCustomer) {
        setCode(editCustomer.code);
        setCustomerName(editCustomer.customerName);
        setContactFirstName(editCustomer.contactFirstName || "");
        setAddress(editCustomer.address || "");
        setPhonePrimary(editCustomer.phonePrimary || "");
        setPhoneAlternative(editCustomer.phoneAlternative || "");
        setEmail(editCustomer.email || "");
        setIsActive(editCustomer.isActive);
        setCreditLimit(editCustomer.creditLimit ? editCustomer.creditLimit.toString() : "");
        setIsTaxExempt(editCustomer.isTaxExempt);
        setPaymentTerms(editCustomer.paymentTerms || "days");
        setPaymentTermsValue(editCustomer.paymentTermsValue || "30");
        setSalesperson(editCustomer.salesperson || "");
        setCustomerGroup(editCustomer.customerGroup || "default");
        setIsEntitledToLoyaltyPoints(editCustomer.isEntitledToLoyaltyPoints);
        setPointSetting(editCustomer.pointSetting || "");
        setLoyaltyCalculationMethod(editCustomer.loyaltyCalculationMethod || "automatic");
        setLoyaltyCardNumber(editCustomer.loyaltyCardNumber || "");
      } else {
        setCode(generateCustomerCode());
        setCustomerName("");
        setContactFirstName("");
        setAddress("");
        setPhonePrimary("");
        setPhoneAlternative("");
        setEmail("");
        setIsActive(true);
        setCreditLimit("");
        setIsTaxExempt(false);
        setPaymentTerms("days");
        setPaymentTermsValue("30");
        setSalesperson("");
        setCustomerGroup("default");
        setIsEntitledToLoyaltyPoints(false);
        setPointSetting("");
        setLoyaltyCalculationMethod("automatic");
        setLoyaltyCardNumber("");
      }
      fetchLoyaltySettings();
    }
  }, [openDialogs["add-customer"], isEditing, editCustomer]);

  const fetchLoyaltySettings = async () => {
    setLoyaltySettingsLoading(true);
    try {
      const response = await fetch("/api/loyalty-point-settings");
      if (!response.ok) throw new Error("Failed to fetch loyalty settings");
      const data = await response.json();
      setLoyaltySettings(data);
    } catch (error: any) {
      setLoyaltySettings([]);
    } finally {
      setLoyaltySettingsLoading(false);
    }
  };

  const handleOk = async () => {
    if (!customerName.trim() || !code.trim()) {
      toast({ title: "Validation Error", description: "Name and Code are required.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const customerData = {
        ...(isEditing ? { id: editCustomer!.id } : {}),
        code, customerName, contactFirstName, address, phonePrimary, phoneAlternative, email,
        isActive, creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
        isTaxExempt, paymentTerms, paymentTermsValue, salesperson, customerGroup,
        isEntitledToLoyaltyPoints, pointSetting, loyaltyCalculationMethod, loyaltyCardNumber,
      };

      const url = isEditing ? `/api/customers?id=${editCustomer!.id}` : "/api/customers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) throw new Error("Failed to save customer");

      toast({ title: "Success", description: `Customer ${isEditing ? "updated" : "created"} successfully` });
      closeDialog("add-customer");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={openDialogs["add-customer"]} onOpenChange={(open) => !open && closeDialog("add-customer")}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <User className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground">
                {isEditing ? "Profile Modification" : "Customer Acquisition"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border",
                  isActive ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/20" : "bg-red-400/20 text-red-400 border-red-400/20"
                )}>
                  {isActive ? "Active Account" : "Inactive Account"}
                </span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{code}</span>
              </div>
            </div>
          </div>

        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Identity & Contact */}
            <div className="space-y-8">
              {/* Section 1: Core Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Identity Matrix</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Unique Identifier</Label>
                      <Input value={code} readOnly className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Classification</Label>
                      <Select value={customerGroup} onValueChange={setCustomerGroup}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          <SelectItem value="default">Standard Entity</SelectItem>
                          <SelectItem value="vip">Tier-1 VIP</SelectItem>
                          <SelectItem value="wholesale">B2B Wholesale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Legal Entity Name</Label>
                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl font-bold uppercase italic tracking-tight"
                      placeholder="FULL CORPORATE OR INDIVIDUAL NAME"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Contact Person</Label>
                    <div className="relative">
                      <Input value={contactFirstName} onChange={(e) => setContactFirstName(e.target.value)}
                        className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl pl-10"
                        placeholder="Primary Representative"
                      />
                      <Contact2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Communication Infrastructure */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Communication Mesh</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Primary Email Gateway</Label>
                    <div className="relative">
                      <Input value={email} onChange={(e) => setEmail(e.target.value)}
                        className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl pl-10"
                        placeholder="entity@network.com"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Primary Comms</Label>
                      <div className="relative">
                        <Input value={phonePrimary} onChange={(e) => setPhonePrimary(e.target.value)}
                          className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl pl-10"
                          placeholder="+63 --- --- ---"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Alternate Line</Label>
                      <div className="relative">
                        <Input value={phoneAlternative} onChange={(e) => setPhoneAlternative(e.target.value)}
                          className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Geospatial Coordinates</Label>
                    <div className="relative">
                      <Textarea value={address} onChange={(e) => setAddress(e.target.value)}
                        className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl min-h-[100px] pl-10 pt-3"
                        placeholder="Street, City, Province, ZIP"
                      />
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Fiscal & Loyalty */}
            <div className="space-y-8">
              {/* Section 3: Fiscal Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Fiscal Configuration</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Exposure Limit</Label>
                      <div className="relative">
                        <Input type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)}
                          className="bg-foreground/5 border-foreground/10 text-emerald-400 h-11 rounded-xl pl-10 font-black italic"
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                      </div>
                    </div>
                    <div className="space-y-4 flex flex-col justify-end">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5 border border-foreground/5">
                        <Checkbox id="tax-exempt" checked={isTaxExempt} onCheckedChange={(c) => setIsTaxExempt(c as boolean)} />
                        <Label htmlFor="tax-exempt" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Tax Exempt Protocol</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Payment Terms</Label>
                      <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          <SelectItem value="days">Pay in Days</SelectItem>
                          <SelectItem value="net">Net Protocol</SelectItem>
                          <SelectItem value="due">Due on Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Terms Value</Label>
                      <Input value={paymentTermsValue} onChange={(e) => setPaymentTermsValue(e.target.value)} className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Assigned Strategist</Label>
                    <div className="relative">
                      <Select value={salesperson} onValueChange={setSalesperson}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl pl-10">
                          <SelectValue placeholder="Select Sales Personnel" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          {salesUsers.map((u: any) => (
                            <SelectItem key={u.id} value={u.complete_name || u.name}>{u.complete_name || u.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20 z-10 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Loyalty Program */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-yellow-400 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Reward Ecosystem</h3>
                </div>
                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
                    <div className="flex items-center gap-3">
                      <Checkbox id="loyalty" checked={isEntitledToLoyaltyPoints} onCheckedChange={(c) => setIsEntitledToLoyaltyPoints(c as boolean)} />
                      <Label htmlFor="loyalty" className="text-xs font-black uppercase tracking-widest text-yellow-400 cursor-pointer italic">Activate Reward Protocol</Label>
                    </div>
                    <Trophy className={cn("h-5 w-5 transition-all", isEntitledToLoyaltyPoints ? "text-yellow-400 scale-110" : "text-foreground/10")} />
                  </div>

                  {isEntitledToLoyaltyPoints && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Point Generation Setting</Label>
                        <Select value={pointSetting} onValueChange={setPointSetting}>
                          <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl">
                            <SelectValue placeholder="Select Configuration" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-foreground/10 text-foreground">
                            {loyaltySettings.map((s) => (
                              <SelectItem key={s.id} value={s.id || s.description}>{s.description}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <RadioGroup value={loyaltyCalculationMethod} onValueChange={setLoyaltyCalculationMethod} className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 transition-all cursor-pointer">
                          <RadioGroupItem value="automatic" id="auto" />
                          <Label htmlFor="auto" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Automatic Engine</Label>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 transition-all cursor-pointer">
                          <RadioGroupItem value="manual" id="manual" />
                          <Label htmlFor="manual" className="text-[10px] font-black uppercase tracking-widest text-foreground/60 cursor-pointer">Manual Override</Label>
                        </div>
                      </RadioGroup>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Credential Identifier</Label>
                        <div className="flex gap-2">
                          <Input value={loyaltyCardNumber} onChange={(e) => setLoyaltyCardNumber(e.target.value)}
                            className="bg-foreground/5 border-foreground/10 text-foreground h-11 rounded-xl font-mono"
                            placeholder="CARD-0000000000000"
                          />
                          <Button variant="outline" className="rounded-xl border-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black font-black uppercase tracking-widest text-[10px]" onClick={() => setLoyaltyCardNumber(Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join(""))}
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-foreground/20">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Compliance Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => closeDialog("add-customer")}
              className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-xs"
            >
              Cancel
            </Button>
            <Button onClick={handleOk} disabled={isSaving} className="px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition-all gap-2" >
              {isSaving ? (
                <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Syncing..." : isEditing ? "Update Profile" : "Register Customer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
