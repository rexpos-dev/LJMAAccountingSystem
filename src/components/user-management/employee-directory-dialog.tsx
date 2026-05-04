'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-context';
import { useEmployees } from '@/hooks/use-employees';
import { Employee } from '@/types/employee';

export default function EmployeeDirectoryDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { data: employees = [], isLoading, error, refetch } = useEmployees();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const filteredEmployees = employees.filter((emp) =>
        (emp.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.designation || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const handleEdit = () => {
        if (selectedEmployee) {
            setDialogData('edit-employee', selectedEmployee);
            openDialog('edit-employee');
        }
    };

    const handleDelete = () => {
        if (selectedEmployee) {
            setDialogData('delete-employee', selectedEmployee);
            openDialog('delete-employee');
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <Dialog open={openDialogs['employee-directory']} onOpenChange={() => closeDialog('employee-directory')}>
            <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Employee Directory</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-3">
                    <Button size="sm" onClick={() => openDialog('add-employee')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedEmployee}
                        onClick={handleEdit}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedEmployee}
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <div className="relative flex-1 ml-auto">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, name, or designation..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-8 h-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-[300px] max-h-[450px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32">Employee ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Branches Assigned</TableHead>
                                <TableHead className="w-24">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-sm">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-sm text-destructive">
                                        Failed to load
                                    </TableCell>
                                </TableRow>
                            ) : paginatedEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                                        {searchQuery ? 'No matches found' : 'No employees in directory'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedEmployees.map((emp) => (
                                    <TableRow
                                        key={emp.id}
                                        className={selectedEmployee?.id === emp.id ? 'bg-muted/50' : 'cursor-pointer'}
                                        onClick={() => setSelectedEmployee(emp)}
                                    >
                                        <TableCell className="font-medium text-sm">{emp.employeeId}</TableCell>
                                        <TableCell className="text-sm">{emp.firstName}</TableCell>
                                        <TableCell className="text-sm">{emp.lastName}</TableCell>
                                        <TableCell className="text-sm">{emp.designation || '-'}</TableCell>
                                        <TableCell className="text-sm max-w-[200px] truncate" title={emp.branchesAssigned || ''}>
                                            {emp.branchesAssigned || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${emp.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {emp.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                <div className="border-t pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Next
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {filteredEmployees.length} total
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
