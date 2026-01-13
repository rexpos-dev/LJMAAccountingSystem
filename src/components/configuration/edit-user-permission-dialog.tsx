'use client';

import { useState, useEffect } from 'react';
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
import { useUpdateUserPermission } from '@/hooks/use-user-permissions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EditUserPermissionDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();
  const updateUserPermission = useUpdateUserPermission();

  const userData = getDialogData('edit-user-permission');

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    contactNo: '',
    accountType: '',
    password: '',
    confirmPassword: '',
    permissions: [] as string[],
    isActive: true,
  });

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
      items: ['Customer List', 'Customer Balances', 'Customer Payment', 'Customer Loyalty Points', 'Loyalty Points Setting']
    },
    {
      title: 'User Management',
      items: ['Add/Edit user']
    }
  ];

  useEffect(() => {
    if (userData) {
      setFormData({
        id: userData.id || '',
        username: userData.username || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        contactNo: userData.contactNo || '',
        accountType: userData.accountType || '',
        password: '',
        confirmPassword: '',
        permissions: userData.permissions ? JSON.parse(userData.permissions) : [],
        isActive: userData.isActive || true,
      });
    }
  }, [userData]);

  // Extract all permissions from groups
  const ALL_PERMISSIONS = permissionGroups.flatMap(group => group.items);

  const AUDITOR_PERMISSIONS = [
    'Dashboard',
    'Adjustment History',
    'Stock movement',
    'Customer Balances',
    'Purchases',
    'Void Purchase Order'
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => {
      const updates: any = { [field]: value };

      if (field === 'accountType') {
        if (value === 'Auditor') {
          updates.permissions = AUDITOR_PERMISSIONS;
        } else if (value === 'Admin') {
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


  const handleClose = () => {
    if (updateUserPermission.isPending) return;
    closeDialog('edit-user-permission');
    setFormData({
      id: '',
      username: '',
      firstName: '',
      lastName: '',
      contactNo: '',
      accountType: '',
      password: '',
      confirmPassword: '',
      permissions: [],
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!formData.username.trim() || !formData.firstName.trim() || !formData.lastName.trim() || !formData.accountType.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields including Username, First Name, Last Name, and Account Type.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Validation error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      // Only include password if it's not empty (i.e. if it's being updated)
      if (!submitData.password) {
        delete (submitData as any).password;
      }

      await updateUserPermission.mutateAsync(submitData);

      toast({
        title: "User Permission Updated",
        description: `User permission for ${formData.username} has been updated successfully.`,
      });
      handleClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user permission",
      });
    }
  };

  return (
    <Dialog open={openDialogs['edit-user-permission']} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit User Permission</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
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
                <Label htmlFor="password">New Password (Leave blank to keep same)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Account Permissions</Label>
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
              />
              <Label htmlFor="isActive" className="font-normal">
                User is Active
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={updateUserPermission.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateUserPermission.isPending}>
            {updateUserPermission.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
