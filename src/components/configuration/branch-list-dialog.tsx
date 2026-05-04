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
import { useBranches, Branch } from '@/hooks/use-branches';

export default function BranchListDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { data: branches = [], isLoading, error, refetch, deleteBranch } = useBranches();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const filteredBranches = branches.filter((branch) =>
        (branch.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (branch.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (branch.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedBranches = filteredBranches.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

    const handleAdd = () => {
        setDialogData('add-branch', null);
        openDialog('add-branch');
    };

    const handleEdit = () => {
        if (selectedBranch) {
            setDialogData('add-branch', selectedBranch);
            openDialog('add-branch');
        }
    };

    const handleDelete = async () => {
        if (selectedBranch && window.confirm(`Are you sure you want to delete branch "${selectedBranch.name}"?`)) {
            try {
                await deleteBranch(selectedBranch.id);
                setSelectedBranch(null);
            } catch (err: any) {
                alert(err.message || 'Failed to delete branch');
            }
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
        <Dialog open={openDialogs['branch-list']} onOpenChange={() => closeDialog('branch-list')}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Branch Management</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-3">
                    <Button size="sm" onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedBranch}
                        onClick={handleEdit}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!selectedBranch}
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                    <div className="relative flex-1 ml-auto">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-8 h-9"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 min-h-[300px] max-h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Contact Number</TableHead>
                                <TableHead className="w-24">Type</TableHead>
                                <TableHead className="w-20">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-sm">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-sm text-destructive">
                                        Failed to load
                                    </TableCell>
                                </TableRow>
                            ) : paginatedBranches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-sm text-muted-foreground">
                                        {searchQuery ? 'No matches' : 'No branches'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedBranches.map((branch) => (
                                    <TableRow
                                        key={branch.id}
                                        className={selectedBranch?.id === branch.id ? 'bg-muted/50' : 'cursor-pointer'}
                                        onClick={() => setSelectedBranch(branch)}
                                    >
                                        <TableCell className="font-medium text-sm">{branch.code || '-'}</TableCell>
                                        <TableCell className="text-sm">{branch.name}</TableCell>
                                        <TableCell className="text-sm">{branch.address || '-'}</TableCell>
                                        <TableCell className="text-sm">{branch.phone || '-'}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{branch.type || '-'}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded text-xs ${branch.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {branch.isActive ? 'Active' : 'Inactive'}
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
                            {filteredBranches.length} total
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
