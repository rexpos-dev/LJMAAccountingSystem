'use client';

import { useState, useMemo } from 'react';
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
import { useCreateEmployee, useEmployees } from '@/hooks/use-employees';
import { useBranches } from '@/hooks/use-branches';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AddEmployeeDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const createEmployee = useCreateEmployee();
    const { data: branches, isLoading: branchesLoading } = useBranches();
    const { data: employees } = useEmployees();
    const [formData, setFormData] = useState({
        employeeId: '',
        firstName: '',
        lastName: '',
        designation: '',
        branchesAssigned: '',
        status: 'Active',
    });

    const isDuplicateId = useMemo(() => {
        if (!formData.employeeId) return false;
        return employees.some(
            (emp) => emp.employeeId?.toLowerCase() === formData.employeeId.toLowerCase()
        );
    }, [formData.employeeId, employees]);

    const generateId = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newId = `EMP-${randomNum}`;
        setFormData(prev => ({ ...prev, employeeId: newId }));
    };

    const handleClose = () => {
        if (createEmployee.isPending) return;
        closeDialog('add-employee');
        setFormData({
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
                description: 'The specified Employee ID is already in use.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await createEmployee.mutateAsync(formData);

            toast({
                title: 'Employee created',
                description: 'The employee has been added successfully.',
            });

            handleClose();
        } catch (error: any) {
            toast({
                title: 'Error creating employee',
                description: error?.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={openDialogs['add-employee']} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="employeeId">Employee ID <span className="text-red-500">*</span></Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="employeeId"
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
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                value={formData.designation}
                                onChange={(e) => handleInputChange('designation', e.target.value)}
                                placeholder="Enter designation"
                            />
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
                            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="branchesAssigned">Branches Assigned</Label>
                        <Select
                            disabled={branchesLoading}
                            value={formData.branchesAssigned}
                            onValueChange={(value) => handleInputChange('branchesAssigned', value)}
                        >
                            <SelectTrigger id="branchesAssigned">
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
                            id="isActive"
                            checked={formData.status === 'Active'}
                            onCheckedChange={(checked) => handleInputChange('status', checked ? 'Active' : 'Inactive')}
                        />
                        <Label htmlFor="isActive" className="font-normal">
                            Employee is Active
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={createEmployee.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={createEmployee.isPending || isDuplicateId}>
                        {createEmployee.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
