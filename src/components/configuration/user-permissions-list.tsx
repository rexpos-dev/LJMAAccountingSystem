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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { UserPermission } from '@/types/user-permission';

export default function UserPermissionsList() {
  const { openDialog, setDialogData } = useDialog();
  const { data: userPermissions = [], isLoading, error, refetch } = useUserPermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);

  const filteredUsers = userPermissions.filter((user) =>
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.designation || '').toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="flex flex-col">
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

      <ScrollArea className="flex-1 min-h-[300px] max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-b from-gray-100 to-gray-200">
              <TableHead className="w-24">Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="w-20">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-destructive">
                  Failed to load
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground">
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
                  <TableCell className="font-medium text-sm">{user.username}</TableCell>
                  <TableCell className="text-sm">{user.firstName} {user.middleName} {user.lastName}</TableCell>
                  <TableCell className="text-sm">{user.designation}</TableCell>
                  <TableCell className="text-sm">{user.accountType}</TableCell>
                  <TableCell>
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
      </ScrollArea>

      <div className="border-t pt-3 flex items-center justify-between mt-4">
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
            {filteredUsers.length} total
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}