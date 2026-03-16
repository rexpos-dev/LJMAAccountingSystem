'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';
import { useDeleteEmployee } from '@/hooks/use-employees';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types/employee';

export default function DeleteEmployeeDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const deleteEmployee = useDeleteEmployee();

    const [employee, setEmployee] = useState<Employee | null>(null);

    const employeeData = getDialogData('delete-employee');

    useEffect(() => {
        if (employeeData) {
            setEmployee(employeeData);
        }
    }, [employeeData]);

    const handleClose = () => {
        if (deleteEmployee.isPending) return;
        closeDialog('delete-employee');
        setEmployee(null);
    };

    const handleDelete = async () => {
        if (!employee) return;

        try {
            await deleteEmployee.mutateAsync(employee.id);

            toast({
                title: "Employee Deleted",
                description: `Employee ${employee.firstName} ${employee.lastName} has been deleted successfully.`,
            });
            handleClose();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete employee",
            });
        }
    };

    return (
        <Dialog open={openDialogs['delete-employee']} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Employee</DialogTitle>
                </DialogHeader>

                {employee ? (
                    <div className="space-y-2">
                        <p>Are you sure you want to delete the employee:</p>
                        <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                            {' '}({employee.employeeId})?
                        </p>
                        <p className="text-sm text-muted-foreground">
                            This action cannot be undone.
                        </p>
                    </div>
                ) : (
                    <p>Loading employee details...</p>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={deleteEmployee.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteEmployee.isPending}
                    >
                        {deleteEmployee.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
