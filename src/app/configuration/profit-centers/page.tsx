'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useProfitCenters, ProfitCenter } from '@/hooks/use-profit-centers';
import { useToast } from '@/hooks/use-toast';

export default function ProfitCenterPage() {
  const { profitCenters, isLoading, error, refetch } = useProfitCenters();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<ProfitCenter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfitCenter>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filteredCenters = useMemo(() => {
    if (!profitCenters) return [];
    if (!searchQuery) return profitCenters;
    const query = searchQuery.toLowerCase();
    return profitCenters.filter(center =>
      center.name.toLowerCase().includes(query) ||
      center.id.toLowerCase().includes(query) ||
      (center.description && center.description.toLowerCase().includes(query))
    );
  }, [profitCenters, searchQuery]);

  const handleAdd = () => {
    setFormData({ id: '', name: '', description: '', isActive: true });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (center: ProfitCenter) => {
    setFormData(center);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (center: ProfitCenter) => {
    setSelectedCenter(center);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.name) {
      toast({ variant: 'destructive', title: 'Error', description: 'ID and Name are required' });
      return;
    }

    if (formData.id.length !== 2) {
      toast({ variant: 'destructive', title: 'Error', description: 'ID must be exactly 2 digits' });
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/profit-centers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save profit center');
      }

      toast({ title: 'Success', description: `Profit center ${isEditing ? 'updated' : 'created'} successfully` });
      setIsDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const confirmDelete = async () => {
    if (!selectedCenter) return;

    try {
      const response = await fetch(`/api/profit-centers?id=${selectedCenter.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete profit center');
      }

      toast({ title: 'Success', description: 'Profit center deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedCenter(null);
      refetch();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-background/50 border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-headline text-foreground">Profit Centers</CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Profit Center
            </Button>
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search profit centers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID (2 Digits)</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell>
                  </TableRow>
                ) : filteredCenters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No profit centers found.</TableCell>
                  </TableRow>
                ) : (
                  filteredCenters.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell className="font-mono font-bold text-primary">{center.id}</TableCell>
                      <TableCell>{center.name}</TableCell>
                      <TableCell className="text-muted-foreground">{center.description || '-'}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          center.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        )}>
                          {center.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(center)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(center)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Profit Center' : 'Add New Profit Center'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">Profit Center ID (2 Digits)</Label>
              <Input id="id" value={formData.id || ''} onChange={(e) => setFormData({ ...formData, id: e.target.value.slice(0, 2) })}
                disabled={isEditing}
                placeholder="e.g. 01"
                maxLength={2}
              />
              <p className="text-[10px] text-muted-foreground">Professional accounting segment ID. Must be 2 characters.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sales Division"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional details"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-muted bg-background text-primary focus:ring-primary h-4 w-4"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete profit center <strong>{selectedCenter?.id} - {selectedCenter?.name}</strong>?
            This action cannot be undone and may affect linked accounts.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
