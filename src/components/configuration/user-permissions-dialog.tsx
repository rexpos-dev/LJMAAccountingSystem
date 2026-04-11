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
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { UserPermission } from '@/types/user-permission';

export default function UserPermissionsDialog() {
  const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
  const { data: userPermissions = [], isLoading, error, refetch } = useUserPermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);

  const filteredUsers = userPermissions.filter((user) =>
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.lastName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleEdit = () => {
    if (selectedUser) {
      setDialogData('edit-user-permission', selectedUser);
      openDialog('edit-user-permission');
    }
  };

  const handleDelete = () => {
    if (selectedUser) {
      setDialogData('delete-user-permission', selectedUser);
      openDialog('delete-user-permission');
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
    <Dialog open={openDialogs['user-permissions']} onOpenChange={() => closeDialog('user-permissions')}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>User Permissions</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-3">
          <Button size="sm" onClick={() => openDialog('add-user-permission')}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedUser}
            onClick={handleEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedUser}
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

        <div className="rounded-md border overflow-y-auto" style={{ maxHeight: '450px' }}>
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              <TableRow>
                <TableHead className="w-24">Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead className="w-20">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-destructive">
                    Failed to load
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-muted-foreground">
                    {searchQuery ? 'No matches' : 'No user permissions'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className={selectedUser?.id === user.id ? 'bg-muted/50' : 'cursor-pointer'}
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell className="w-24 font-medium text-sm">{user.username}</TableCell>
                    <TableCell className="text-sm">{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="text-sm">{user.accountType}</TableCell>
                    <TableCell className="w-20">
                      <span className={`px-2 py-0.5 rounded text-xs ${user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page:</span>
              <select
                className="h-8 w-16 rounded-md border border-input bg-transparent px-2 text-xs"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={filteredUsers.length || 100}>All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground px-2 whitespace-nowrap">
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
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredUsers.length} total
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