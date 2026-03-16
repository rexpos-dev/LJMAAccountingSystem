'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useDialog } from '@/components/layout/dialog-provider';
import { useUpdateEmployee, useEmployees } from '@/hooks/use-employees';
import { useBranches } from '@/hooks/use-branches';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function EditEmployeeDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const updateEmployee = useUpdateEmployee();
    const { data: branches, isLoading: branchesLoading } = useBranches();
    const { data: employees } = useEmployees();
    const employeeData = getDialogData('edit-employee');

    const [formData, setFormData] = useState({
        id: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        designation: '',
        branchesAssigned: '',
        status: 'Active',
    });

    useEffect(() => {
        if (employeeData) {
            setFormData({
                id: employeeData.id || '',
                employeeId: employeeData.employeeId || '',
                firstName: employeeData.firstName || '',
                lastName: employeeData.lastName || '',
                designation: employeeData.designation || '',
                branchesAssigned: employeeData.branchesAssigned || '',
                status: employeeData.status || 'Active',
            });
        }
    }, [employeeData]);

    const isDuplicateId = useMemo(() => {
        if (!formData.employeeId) return false;
        return employees.some(
            (emp) =>
                emp.id !== formData.id && // Ignore the current employee being edited
                emp.employeeId?.toLowerCase() === formData.employeeId.toLowerCase()
        );
    }, [formData.employeeId, formData.id, employees]);

    const generateId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newId = `EMP-${randomNum}`;
        setFormData(prev => ({ ...prev, employeeId: newId }));
    };

    const handleClose = () => {
        if (updateEmployee.isPending) return;
        closeDialog('edit-employee');
        setFormData({
            id: '',
            employeeId: '',
            firstName: '',
            lastName: '',
            designation: '',
            branchesAssigned: '',
            status: 'Active',
        });
    };

    const handleSave = async () => {
        if (!formData.employeeId.trim() || !formData.firstName.trim() || !formData.lastName.trim()) {
            toast({
                title: 'Validation error',
                description: 'Please fill in required fields: Employee ID, First Name, Last Name.',
                variant: 'destructive',
            });
            return;
        }

        if (isDuplicateId) {
            toast({
                title: 'Duplicate ID',
                description: 'The specified Employee ID is already in use by another employee.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await updateEmployee.mutateAsync(formData);

            toast({
                title: 'Employee updated',
                description: `Employee ${formData.firstName} ${formData.lastName} has been updated successfully.`,
            });

            handleClose();
        } catch (error: any) {
            toast({
                title: 'Error updating employee',
                description: error?.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={openDialogs['edit-employee']} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-employeeId">Employee ID <span className="text-red-500">*</span></Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="edit-employeeId"
                                    value={formData.employeeId}
                                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                    placeholder="Enter Employee ID"
                                    className={isDuplicateId ? "border-red-500 pr-24" : "pr-24"}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={generateId}
                                    className="shrink-0"
                                >
                                    Generate
                                </Button>
                            </div>
                            {isDuplicateId && (
                                <p className="text-sm text-red-500">This ID already exists.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-designation">Designation</Label>
                            <Input
                                id="edit-designation"
                                value={formData.designation}
                                onChange={(e) => handleInputChange('designation', e.target.value)}
                                placeholder="Enter designation"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-firstName">First Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                placeholder="First name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-lastName">Last Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-branchesAssigned">Branches Assigned</Label>
                        <Select
                            disabled={branchesLoading}
                            value={formData.branchesAssigned}
                            onValueChange={(value) => handleInputChange('branchesAssigned', value)}
                        >
                            <SelectTrigger id="edit-branchesAssigned">
                                <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select a branch"} />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.name}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="edit-isActive"
                            checked={formData.status === 'Active'}
                            onCheckedChange={(checked) => handleInputChange('status', checked ? 'Active' : 'Inactive')}
                        />
                        <Label htmlFor="edit-isActive" className="font-normal">
                            Employee is Active
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={updateEmployee.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={updateEmployee.isPending || isDuplicateId}>
                        {updateEmployee.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
