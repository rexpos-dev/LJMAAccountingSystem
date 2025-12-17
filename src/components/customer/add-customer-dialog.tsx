'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Folder } from 'lucide-react';

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

interface AddCustomerDialogProps {
  editCustomer?: Customer | null;
}

export function AddCustomerDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();

  const editCustomer = getDialogData('add-customer');
  const isEditing = !!editCustomer;

  // Generate customer code
  const generateCustomerCode = () => {
    return `CUST-${Math.floor(Math.random() * 1000000)}`;
  };

  const [code, setCode] = useState(generateCustomerCode());
  const [customerName, setCustomerName] = useState('');
  const [contactFirstName, setContactFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneAlternative, setPhoneAlternative] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [creditLimit, setCreditLimit] = useState('');
  const [isTaxExempt, setIsTaxExempt] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState('days');
  const [paymentTermsValue, setPaymentTermsValue] = useState('30');
  const [salesperson, setSalesperson] = useState('');
  const [customerGroup, setCustomerGroup] = useState('default');
  const [isEntitledToLoyaltyPoints, setIsEntitledToLoyaltyPoints] = useState(false);
  const [pointSetting, setPointSetting] = useState('');
  const [loyaltyCalculationMethod, setLoyaltyCalculationMethod] = useState('automatic');
  const [loyaltyCardNumber, setLoyaltyCardNumber] = useState('');

  // Loyalty settings state
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySetting[]>([]);
  const [loyaltySettingsLoading, setLoyaltySettingsLoading] = useState(false);

  // Save loading state
  const [isSaving, setIsSaving] = useState(false);

  // Fetch loyalty settings when dialog opens
  useEffect(() => {
    if (openDialogs['add-customer']) {
      if (isEditing && editCustomer) {
        // Populate form with existing customer data
        setCode(editCustomer.code);
        setCustomerName(editCustomer.customerName);
        setContactFirstName(editCustomer.contactFirstName || '');
        setAddress(editCustomer.address || '');
        setPhonePrimary(editCustomer.phonePrimary || '');
        setPhoneAlternative(editCustomer.phoneAlternative || '');
        setEmail(editCustomer.email || '');
        setIsActive(editCustomer.isActive);
        setCreditLimit(editCustomer.creditLimit ? editCustomer.creditLimit.toString() : '');
        setIsTaxExempt(editCustomer.isTaxExempt);
        setPaymentTerms(editCustomer.paymentTerms || 'days');
        setPaymentTermsValue(editCustomer.paymentTermsValue || '30');
        setSalesperson(editCustomer.salesperson || '');
        setCustomerGroup(editCustomer.customerGroup || 'default');
        setIsEntitledToLoyaltyPoints(editCustomer.isEntitledToLoyaltyPoints);
        setPointSetting(editCustomer.pointSetting || '');
        setLoyaltyCalculationMethod(editCustomer.loyaltyCalculationMethod || 'automatic');
        setLoyaltyCardNumber(editCustomer.loyaltyCardNumber || '');
      } else {
        // Reset form for new customer
        setCode(generateCustomerCode());
        setCustomerName('');
        setContactFirstName('');
        setAddress('');
        setPhonePrimary('');
        setPhoneAlternative('');
        setEmail('');
        setIsActive(true);
        setCreditLimit('');
        setIsTaxExempt(false);
        setPaymentTerms('days');
        setPaymentTermsValue('30');
        setSalesperson('');
        setCustomerGroup('default');
        setIsEntitledToLoyaltyPoints(false);
        setPointSetting('');
        setLoyaltyCalculationMethod('automatic');
        setLoyaltyCardNumber('');
      }

      // Fetch loyalty settings
      fetchLoyaltySettings();
    }
  }, [openDialogs['add-customer'], isEditing, editCustomer]);

  const fetchLoyaltySettings = async () => {
    setLoyaltySettingsLoading(true);
    try {
      const response = await fetch('/api/loyalty-point-settings');
      if (!response.ok) throw new Error('Failed to fetch loyalty settings');
      const data = await response.json();
      setLoyaltySettings(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load loyalty point settings',
        variant: 'destructive',
      });
      setLoyaltySettings([]);
    } finally {
      setLoyaltySettingsLoading(false);
    }
  };

  const handleOk = async () => {
    if (!customerName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Customer name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Customer code is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const customerData = {
        ...(isEditing ? { id: editCustomer!.id } : {}),
        code,
        customerName,
        contactFirstName,
        address,
        phonePrimary,
        phoneAlternative,
        email,
        isActive,
        creditLimit: creditLimit ? parseFloat(creditLimit) : 0,
        isTaxExempt,
        paymentTerms,
        paymentTermsValue,
        salesperson,
        customerGroup,
        isEntitledToLoyaltyPoints,
        pointSetting,
        loyaltyCalculationMethod,
        loyaltyCardNumber,
      };

      const url = isEditing ? `/api/customers?id=${editCustomer!.id}` : '/api/customers';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} customer`);
      }

      const savedCustomer = await response.json();
      console.log('Customer saved successfully:', savedCustomer);

      toast({
        title: 'Success',
        description: `Customer ${isEditing ? 'updated' : 'created'} successfully`,
      });

      closeDialog('add-customer');
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} customer:`, error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditing ? 'update' : 'save'} customer`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    closeDialog('add-customer');
  };

  const handleGenerateLoyaltyCard = () => {
    // Generate a random 13-digit EAN-13 loyalty card number
    const cardNumber = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    setLoyaltyCardNumber(cardNumber);
  };

  return (
    <Dialog open={openDialogs['add-customer']} onOpenChange={() => closeDialog('add-customer')}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-6 -mr-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Left Column - Customer Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer name</Label>
                <Input
                  id="customer-name"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-first-name">Contact first name</Label>
                <Input
                  id="contact-first-name"
                  placeholder="Enter contact first name"
                  value={contactFirstName}
                  onChange={(e) => setContactFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-primary">Phone (primary)</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-primary"
                    placeholder="Enter primary phone"
                    value={phonePrimary}
                    onChange={(e) => setPhonePrimary(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Call</span>
                  </Button>
                  <Button variant="outline">Call</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-alternative">Phone (alternative)</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone-alternative"
                    placeholder="Enter alternative phone"
                    value={phoneAlternative}
                    onChange={(e) => setPhoneAlternative(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Call</span>
                  </Button>
                  <Button variant="outline">Call</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                  <Button variant="outline">Send</Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <Label htmlFor="is-active" className="font-normal cursor-pointer">
                  This customer is active
                </Label>
              </div>
            </div>

            {/* Right Column - Financial and Loyalty Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="credit-limit">Credit Limit</Label>
                <Input
                  id="credit-limit"
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tax-exempt"
                  checked={isTaxExempt}
                  onCheckedChange={(checked) => setIsTaxExempt(checked as boolean)}
                />
                <Label htmlFor="tax-exempt" className="font-normal cursor-pointer">
                  Set tax exempt for this customer
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Payment terms</Label>
                <div className="flex gap-2">
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Pay in Days</SelectItem>
                      <SelectItem value="net">Net</SelectItem>
                      <SelectItem value="due">Due on Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={paymentTermsValue}
                    onChange={(e) => setPaymentTermsValue(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesperson">Salesperson</Label>
                <Select value={salesperson} onValueChange={setSalesperson}>
                  <SelectTrigger id="salesperson">
                    <SelectValue placeholder="Select salesperson" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="bob">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer group</Label>
                <div className="flex gap-2">
                  <Select value={customerGroup} onValueChange={setCustomerGroup}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Folder className="h-4 w-4" />
                    <span className="sr-only">Manage groups</span>
                  </Button>
                </div>
              </div>

              {/* Loyalty Points Setting Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loyalty-points"
                    checked={isEntitledToLoyaltyPoints}
                    onCheckedChange={(checked) => setIsEntitledToLoyaltyPoints(checked as boolean)}
                  />
                  <Label htmlFor="loyalty-points" className="font-normal cursor-pointer">
                    This customer is entitled to loyalty points
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="point-setting">Point Setting</Label>
                  <Select
                    value={pointSetting}
                    onValueChange={setPointSetting}
                    disabled={!isEntitledToLoyaltyPoints || loyaltySettingsLoading}
                  >
                    <SelectTrigger id="point-setting">
                      <SelectValue placeholder={loyaltySettingsLoading ? "Loading..." : "Select a setting"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loyaltySettings.map((setting) => (
                        <SelectItem key={setting.id || setting.description} value={setting.id || setting.description}>
                          {setting.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <RadioGroup
                  value={loyaltyCalculationMethod}
                  onValueChange={setLoyaltyCalculationMethod}
                  disabled={!isEntitledToLoyaltyPoints}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="automatic" id="automatic" />
                    <Label htmlFor="automatic" className="font-normal cursor-pointer">
                      Calculate loyalty points automatically
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="font-normal cursor-pointer">
                      Manually enter loyalty points on each invoice
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label htmlFor="loyalty-card">Loyalty card number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="loyalty-card"
                      value={loyaltyCardNumber}
                      onChange={(e) => setLoyaltyCardNumber(e.target.value)}
                      disabled={!isEntitledToLoyaltyPoints}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleGenerateLoyaltyCard}
                      disabled={!isEntitledToLoyaltyPoints}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex gap-2 ml-auto">
            <Button onClick={handleOk} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'OK'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="outline">Help</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
