'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/components/layout/dialog-provider';
import { useCreateUserPermission } from '@/hooks/use-user-permissions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff } from 'lucide-react';

export default function AddUserPermissionDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const createUserPermission = useCreateUserPermission();

  // Permission groups based on the requirements
  const permissionGroups = [
    {
      title: 'Main',
      items: ['Dashboard', 'Inventory', 'Stocks', 'Stock movement', 'Stock Adjustment', 'Adjustment History', 'Purchases', 'Warehouse', 'Product Brand', 'Category', 'Price Type', 'Unit of Measure', 'Sales', 'Customers', 'Suppliers', 'Setup', 'Cashier Admin', 'Backup Database']
    },
    {
      title: 'Inventory Sub-items',
      items: ['Positive Adjustment', 'Negative Adjustment', 'Transfer Stocks']
    },
    {
      title: 'Purchases Sub-items',
      items: ['Add Purchase Order', 'Approve Purchase Order', 'Receive Purchase Order', 'Void Purchase Order', 'Add/Edit Purchase Cost']
    },
    {
      title: 'Product/Category Sub-items',
      items: ['Add/Edit Category', 'Add/Edit Price Type']
    },
    {
      title: 'Sales Sub-items',
      items: ['Customer List', 'Customer Balances', 'Customer Payment', 'Customer Loyalty Points', 'Loyalty Points Setting', 'Non-Invoiced Cash Sale']
    },
    {
      title: 'User Management',
      items: ['Add/Edit user']
    },
    {
      title: 'Reports',
      items: ['Reports', 'Income Statement', 'Balance Sheet']
    },
    {
      title: 'Forms',
      items: [
        "ACCOUNT DEDUCTION REQUEST FORM",
        "CASH ADVANCE REQUEST FOR FOR CONTRACTOR",
        "CASH FUND REQUEST FORM",
        "CONTRACTOR CASH ADVANCE MONITORING FILE",
        "DISBURSEMENT",
        "HOUSE CHARGE REQUEST FORM",
        "JOB ORDER REQUEST FORM",
        "JOB ORDER REQUEST FORM INTERNAL",
        "MATERNAL REQUEST FORM",
        "PURCHASE ORDER REQUEST (EXTERNAL)",
        "PURCHASE ORDER REQUEST (SUPERMARKET)",
        "REQUEST AND AUTHORIZATION OF CASH ADVANCES",
        "STORE USE REQUEST FORM"
      ]
    }
  ];

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    contactNo: '',
    accountType: '',
    formPermissions: '',
    password: '',
    confirmPassword: '',
    permissions: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    if (createUserPermission.isPending) return;
    closeDialog('add-user-permission');
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      contactNo: '',
      accountType: '',
      formPermissions: '',
      password: '',
      confirmPassword: '',
      permissions: [],
    });
  };

  const handleSave = async () => {
    if (!formData.username.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.accountType.trim() || !formData.password.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields including Username, First Name, Last Name, Account Type, and Password.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitData } = formData;
      await createUserPermission.mutateAsync(submitData);

      toast({
        title: 'User created',
        description: 'The user has been added successfully.',
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: 'Error creating user',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  // Extract all permissions from groups
  const ALL_PERMISSIONS = permissionGroups.flatMap(group => group.items);

  const AUDITOR_PERMISSIONS = [
    'Dashboard',
    'Inventory',
    'Stocks',
    'Stock movement',
    'Adjustment History',
    'Purchases',
    'Sales',
    'Customers',
    'Reports',
    'Income Statement',
    'Balance Sheet'
  ];

  const MANAGER_PERMISSIONS = ALL_PERMISSIONS.filter(permission =>
    !['Setup', 'Backup Database', 'Add/Edit user', 'Non-Invoiced Cash Sale'].includes(permission)
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updates: any = { [field]: value };

      if (field === 'accountType') {
        if (value === 'Auditor') {
          updates.permissions = AUDITOR_PERMISSIONS;
        } else if (value === 'Manager') {
          updates.permissions = MANAGER_PERMISSIONS;
        } else if (value === 'Administrator') {
          updates.permissions = ALL_PERMISSIONS;
        }
      }

      return { ...prev, ...updates };
    });
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => {
      const newPermissions = checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission);
      return { ...prev, permissions: newPermissions };
    });
  };


  return (
    <Dialog open={openDialogs['add-user-permission']} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact No</Label>
                <Input
                  id="contactNo"
                  value={formData.contactNo}
                  onChange={(e) => handleInputChange('contactNo', e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className={formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type <span className="text-red-500">*</span></Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="AdminStaff">Admin Staff</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="formPermissions">Form Permissions</Label>
                <Select value={formData.formPermissions} onValueChange={(value) => handleInputChange('formPermissions', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verifier">Verifier</SelectItem>
                    <SelectItem value="Approver">Approver</SelectItem>
                    <SelectItem value="Processor">Processor</SelectItem>
                    <SelectItem value="Released/Received">Released/Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Account Permissions <span className="text-red-500">*</span></Label>
              <div className="columns-2 lg:columns-3 gap-6 space-y-6">
                {permissionGroups.map((group) => (
                  <div key={group.title} className="break-inside-avoid space-y-3 p-4 border rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 mb-6">
                    <h4 className="font-medium text-sm text-muted-foreground border-b pb-1">{group.title}</h4>
                    <div className="space-y-2">
                      {group.items.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission}`}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                          />
                          <Label
                            htmlFor={`permission-${permission}`}
                            className="text-sm font-normal cursor-pointer hover:text-primary transition-colors text-black"
                          >
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={createUserPermission.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createUserPermission.isPending}>
            {createUserPermission.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
