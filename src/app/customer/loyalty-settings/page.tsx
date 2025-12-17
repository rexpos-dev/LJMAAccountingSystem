'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';

interface LoyaltySetting {
  id: string;
  description: string;
  amount: number;
  equivalentPoint: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function LoyaltySettingsPage() {
  const { openDialogs, closeDialog, openDialog } = useDialog();
  const { toast } = useToast();
  const [settings, setSettings] = useState<LoyaltySetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSetting, setSelectedSetting] = useState<LoyaltySetting | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const url = searchQuery
        ? `/api/loyalty-point-settings?search=${encodeURIComponent(searchQuery)}`
        : '/api/loyalty-point-settings';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load loyalty point settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openDialogs['loyalty-settings']) {
      fetchSettings();
    }
  }, [openDialogs['loyalty-settings']]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchSettings();
    };
    window.addEventListener('loyalty-settings-refresh', handleRefresh);
    return () => {
      window.removeEventListener('loyalty-settings-refresh', handleRefresh);
    };
  }, []);

  const filteredSettings = useMemo(() => {
    // If we have a search query, the API already filtered it
    // Otherwise, we can filter client-side if needed
    return settings;
  }, [settings]);

  const paginatedSettings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSettings.slice(startIndex, endIndex);
  }, [filteredSettings, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredSettings.length / itemsPerPage);
  }, [filteredSettings, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchQuery]);

  const handleDelete = async () => {
    if (!selectedSetting) return;

    if (!confirm(`Are you sure you want to delete "${selectedSetting.description}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/loyalty-point-settings?id=${selectedSetting.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete setting');
      }

      toast({
        title: 'Success',
        description: 'Loyalty point setting deleted successfully',
      });

      fetchSettings();
      setSelectedSetting(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete loyalty point setting',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    fetchSettings();
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Dialog open={openDialogs['loyalty-settings']} onOpenChange={() => closeDialog('loyalty-settings')}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Loyalty Points Settings</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => openDialog('add-loyalty-setting')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Setting
            </Button>
            <Button 
              variant="outline" 
              disabled={!selectedSetting}
              onClick={() => {
                if (selectedSetting) {
                  // TODO: Implement edit functionality
                  toast({
                    title: 'Edit',
                    description: 'Edit functionality coming soon',
                  });
                }
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              disabled={!selectedSetting}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Customer Name/Code"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Debounce search - fetch after user stops typing
                const timeoutId = setTimeout(() => {
                  fetchSettings();
                }, 500);
                return () => clearTimeout(timeoutId);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 pr-6 -mr-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Equivalent Point</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedSettings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    No loyalty settings found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSettings.map((setting, index) => {
                  const isSelected = selectedSetting &&
                    ((selectedSetting.id && setting.id && selectedSetting.id === setting.id) ||
                     (!selectedSetting.id && !setting.id && selectedSetting.description === setting.description && selectedSetting.amount === setting.amount));

                  return (
                    <TableRow
                      key={setting.id || `${setting.description}-${setting.amount}-${index}`}
                      className={isSelected ? 'bg-muted/50' : 'cursor-pointer'}
                      onClick={() => setSelectedSetting(setting)}
                    >
                      <TableCell>{setting.description}</TableCell>
                      <TableCell>{setting.amount.toFixed(2)}</TableCell>
                      <TableCell>{setting.equivalentPoint.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <Button
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="sm"
                className="min-w-[40px]"
              >
                {currentPage}
              </Button>
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
              <Label htmlFor="limit" className="text-sm">Limit</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger id="limit" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="page-input" className="text-sm">Page</Label>
              <Input
                id="page-input"
                type="number"
                min="1"
                max={totalPages || 1}
                value={currentPage}
                onChange={handlePageInputChange}
                className="w-16"
              />
              <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
