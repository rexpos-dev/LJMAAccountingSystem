"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, History, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface LoyaltyPoint {
  id: string;
  customerId: string;
  loyaltyCardId: string;
  totalPoints: number;
  pointSettingId: string;
  expiryDate: string | null;
  customer: {
    code: string;
    customerName: string;
  };
  pointSetting: {
    description: string;
  };
}

export default function CustomerLoyaltyPointsPage() {
  const { openDialogs, openDialog, closeDialog } = useDialog();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoint[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedRow, setSelectedRow] = useState<LoyaltyPoint | null>(null);

  const fetchLoyaltyPoints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/loyalty-points?search=${searchQuery}&limit=${limit}&page=${page}`);
      const data = await response.json();
      setLoyaltyPoints(data.data);
      // fetch per-customer balances using the summary endpoint
      const uniqueCustomerIds = Array.from(new Set(data.data.map((d: LoyaltyPoint) => String(d.customerId)))) as string[];
      if (uniqueCustomerIds.length > 0) {
        const balanceEntries = await Promise.all(uniqueCustomerIds.map(async (cid) => {
          try {
            const r = await fetch(`/api/loyalty-points/summary?customerId=${encodeURIComponent(cid)}`);
            if (!r.ok) return [cid, 0] as const;
            const json = await r.json();
            return [cid, Number(json.total ?? 0)] as const;
          } catch (err) {
            console.error('Error fetching balance for', cid, err);
            return [cid, 0] as const;
          }
        }));
        const map: Record<string, number> = {};
        for (const entry of balanceEntries) {
          const cid = String(entry[0]);
          const val = Number(entry[1] ?? 0);
          map[cid] = val;
        }
        setBalances(map);
      } else {
        setBalances({});
      }
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch loyalty points',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openDialogs['customer-loyalty-points']) {
      fetchLoyaltyPoints();
    }
  }, [openDialogs['customer-loyalty-points'], searchQuery, limit, page]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchLoyaltyPoints();
    };

    window.addEventListener('loyalty-points-refresh', handleRefresh);
    return () => {
      window.removeEventListener('loyalty-points-refresh', handleRefresh);
    };
  }, []);

  return (
    <Dialog open={openDialogs['customer-loyalty-points']} onOpenChange={() => closeDialog('customer-loyalty-points')}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customer Loyalty Points</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast({ title: 'Edit' })}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Remove' })}>
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'History' })}>
              <History className="mr-2 h-4 w-4" /> History
            </Button>
            <Button variant="outline" onClick={() => openDialog('add-loyalty-card')}>
              <User className="mr-2 h-4 w-4" /> Customer
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => openDialog('add-loyalty-points', { selectedCustomerId: selectedRow?.customerId, pointSettingId: selectedRow?.pointSettingId, mode: 'add' })}>
              <Plus className="mr-2 h-4 w-4" /> Add Points
            </Button>
            <Button variant="outline" onClick={() => openDialog('add-loyalty-points', { selectedCustomerId: selectedRow?.customerId, pointSettingId: selectedRow?.pointSettingId, mode: 'subtract' })}>
              Subtract Points
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Adjust Points" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add Points</SelectItem>
                <SelectItem value="subtract">Subtract Points</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="points">Points</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Customer Name/Code" className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Loyalty Card ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Point Setting</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : !loyaltyPoints || loyaltyPoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No customers with loyalty points found.
                  </TableCell>
                </TableRow>
              ) : (
                loyaltyPoints.map((point, index) => (
                  <TableRow key={`${point.id}-${index}`}>
                    <TableCell>
                      <input
                        type="radio"
                        name="customer-select"
                        checked={selectedRow?.id === point.id}
                        onChange={() => setSelectedRow(point)}
                      />
                    </TableCell>
                    <TableCell>{point.loyaltyCardId}</TableCell>
                    <TableCell>{point.customer.customerName}</TableCell>
                    <TableCell>{balances[point.customerId] ?? point.totalPoints ?? 0}</TableCell>
                    <TableCell>{point.totalPoints}</TableCell>
                    <TableCell>{point.pointSetting.description}</TableCell>
                    <TableCell>
                      {point.expiryDate ? new Date(point.expiryDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex items-center justify-between mt-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="px-3 py-1 bg-muted text-sm rounded">{page}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Limit</label>
            <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue>{String(limit)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 border rounded-md p-4 bg-muted/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Grand Total</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="text-lg font-semibold">
              {loyaltyPoints && loyaltyPoints.length > 0 ? loyaltyPoints.reduce((sum, point) => sum + point.totalPoints, 0).toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => closeDialog('customer-loyalty-points')}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
