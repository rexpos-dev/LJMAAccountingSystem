"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface UnitOfMeasure {
  id: string;
  code: string;
  name: string;
}

interface Account {
  id: string;
  account_no: number;
  account_name: string;
  account_type: string;
}

interface ConversionFactor {
  unitName: string;
  factor: number;
}

export function AddProductDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');
  const [autoCreateChildren, setAutoCreateChildren] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedUomId, setSelectedUomId] = useState<string | null>(null);
  const [selectedIncomeAccountId, setSelectedIncomeAccountId] = useState<string | null>(null);
  const [selectedExpenseAccountId, setSelectedExpenseAccountId] = useState<string | null>(null);

  const [initialStock, setInitialStock] = useState('0');
  const [reorderPoint, setReorderPoint] = useState('0');
  const [costPrice, setCostPrice] = useState('');
  const [unitPrice, setUnitPrice] = useState('0');

  const [conversionFactors, setConversionFactors] = useState<ConversionFactor[]>([]);
  const [newConversionUnitName, setNewConversionUnitName] = useState('');
  const [newConversionFactor, setNewConversionFactor] = useState('');

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [uoms, setUoms] = useState<UnitOfMeasure[]>([]);
  const [incomeAccounts, setIncomeAccounts] = useState<Account[]>([]);
  const [expenseAccounts, setExpenseAccounts] = useState<Account[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data when dialog opens
  useEffect(() => {
    if (!openDialogs['add-product']) return;

    let mounted = true;
    setIsLoading(true);

    (async () => {
      try {
        // Fetch brands
        const brandRes = await fetch('/api/brands');
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (mounted) setBrands(Array.isArray(brandData) ? brandData : []);
        }

        // Fetch categories
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (mounted) setCategories(Array.isArray(catData) ? catData : []);
        }

        // Fetch suppliers
        const suppRes = await fetch('/api/suppliers');
        if (suppRes.ok) {
          const suppData = await suppRes.json();
          if (mounted) setSuppliers(Array.isArray(suppData) ? suppData : []);
        }

        // Fetch UOMs
        const uomRes = await fetch('/api/units-of-measure');
        if (uomRes.ok) {
          const uomData = await uomRes.json();
          if (mounted) setUoms(Array.isArray(uomData) ? uomData : []);
        }

        // Fetch income accounts (chart of accounts with type 'Income')
        const incomeRes = await fetch('/api/accounts?type=Income');
        if (incomeRes.ok) {
          const incomeData = await incomeRes.json();
          if (mounted) setIncomeAccounts(Array.isArray(incomeData) ? incomeData : []);
        }

        // Fetch expense accounts (chart of accounts with type 'Expense')
        const expenseRes = await fetch('/api/accounts?type=Expense');
        if (expenseRes.ok) {
          const expenseData = await expenseRes.json();
          if (mounted) setExpenseAccounts(Array.isArray(expenseData) ? expenseData : []);
        }
      } catch (err) {
        console.error('Error loading product data:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [openDialogs['add-product']]);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setSubcategories([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/categories/${selectedCategoryId}/subcategories`);
        if (res.ok) {
          const data = await res.json();
          setSubcategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error loading subcategories:', err);
      }
    })();
  }, [selectedCategoryId]);

  const addConversionFactor = () => {
    if (!newConversionUnitName.trim()) {
      toast({ title: 'Validation', description: 'Unit name is required', variant: 'destructive' });
      return;
    }

    if (!newConversionFactor || isNaN(Number(newConversionFactor))) {
      toast({ title: 'Validation', description: 'Valid factor number is required', variant: 'destructive' });
      return;
    }

    setConversionFactors([...conversionFactors, { unitName: newConversionUnitName.trim(), factor: Number(newConversionFactor) }]);
    setNewConversionUnitName('');
    setNewConversionFactor('');
  };

  const removeConversionFactor = (index: number) => {
    setConversionFactors(conversionFactors.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validation
    if (!productName.trim()) {
      toast({ title: 'Validation', description: 'Product name is required', variant: 'destructive' });
      return;
    }

    if (!sku.trim()) {
      toast({ title: 'Validation', description: 'SKU is required', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: productName.trim(),
        code: sku.trim(),
        barcode: barcode.trim() || null,
        description: description.trim() || null,
        additionalDescription: additionalDescription.trim() || null,
        brandId: selectedBrandId,
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubcategoryId,
        supplierId: selectedSupplierId,
        unitOfMeasureId: selectedUomId,
        initialStock: Number(initialStock) || 0,
        reorderPoint: Number(reorderPoint) || 0,
        costPrice: costPrice ? parseFloat(costPrice) : 0,
        unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
        incomeAccountId: selectedIncomeAccountId,
        expenseAccountId: selectedExpenseAccountId,
        conversionFactors,
        autoCreateChildren,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Failed to create product');

      toast({ title: 'Success', description: 'Product created successfully' });
      closeDialog('add-product');
      window.dispatchEvent(new CustomEvent('products-refresh'));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create product', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={openDialogs['add-product']} onOpenChange={() => closeDialog('add-product')}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Fill in the details below to add a new product.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Name and Brand Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Cola-Cola"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="brand">Brand</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedBrandId || ''} onValueChange={(v) => setSelectedBrandId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SKU and Barcode Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="e.g., PRO-P8WC1N"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode (UPC)</Label>
              <Input
                id="barcode"
                placeholder="e.g., 123456789012"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A short description of the product."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Additional Description */}
          <div>
            <Label htmlFor="additionalDescription">Additional Description (Optional)</Label>
            <Textarea
              id="additionalDescription"
              placeholder="Provide additional details like specifications or special notes."
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Category and Subcategory Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="category">Category</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedCategoryId || ''} onValueChange={(v) => setSelectedCategoryId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedSubcategoryId || ''} onValueChange={(v) => setSelectedSubcategoryId(v || null)} disabled={!selectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sc) => (
                    <SelectItem key={sc.id} value={sc.id}>{sc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Supplier and Unit of Measure Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="supplier">Supplier (Optional)</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedSupplierId || ''} onValueChange={(v) => setSelectedSupplierId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="uom">Unit of Measure</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedUomId || ''} onValueChange={(v) => setSelectedUomId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {uoms.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Fields Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="initialStock">Initial Stock</Label>
              <Input
                id="initialStock"
                type="number"
                placeholder="0"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                placeholder="0"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(e.target.value)}
              />
            </div>
            <div></div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPrice">Cost (₱)</Label>
              <Input
                id="costPrice"
                type="number"
                placeholder="e.g., 50.00"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Price (₱)</Label>
              <Input
                id="unitPrice"
                type="number"
                placeholder="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Accounts Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="incomeAccount">Income Account (Optional)</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedIncomeAccountId || ''} onValueChange={(v) => setSelectedIncomeAccountId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select income account" />
                </SelectTrigger>
                <SelectContent>
                  {incomeAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="expenseAccount">Expense Account (Optional)</Label>
                <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
              </div>
              <Select value={selectedExpenseAccountId || ''} onValueChange={(v) => setSelectedExpenseAccountId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select expense account" />
                </SelectTrigger>
                <SelectContent>
                  {expenseAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversion Factors Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Conversion Factors (Optional)</Label>
              <Button variant="outline" size="sm" onClick={addConversionFactor}>
                <Plus className="h-4 w-4 mr-2" /> Add Conversion Factor
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Define how this product converts between different units (e.g., 1 Case = 12 Pieces). These conversion factors will be used for automatic stock calculations.
            </p>

            {conversionFactors.length > 0 ? (
              <Table className="border rounded-lg mb-3">
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Name</TableHead>
                    <TableHead>Factor</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversionFactors.map((cf, index) => (
                    <TableRow key={index}>
                      <TableCell>{cf.unitName}</TableCell>
                      <TableCell>{cf.factor}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConversionFactor(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="border rounded-lg p-4 text-center text-sm text-muted-foreground bg-muted/50">
                No conversion factors added. Click "Add Conversion Factor" to define unit conversions.
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <Input
                placeholder="Unit Name"
                value={newConversionUnitName}
                onChange={(e) => setNewConversionUnitName(e.target.value)}
              />
              <Input
                placeholder="Factor"
                type="number"
                value={newConversionFactor}
                onChange={(e) => setNewConversionFactor(e.target.value)}
              />
              <Button onClick={addConversionFactor} variant="secondary">Add</Button>
            </div>
          </div>

          {/* Auto-create child products checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="autoCreateChildren"
              checked={autoCreateChildren}
              onCheckedChange={(checked) => setAutoCreateChildren(checked === true)}
            />
            <Label htmlFor="autoCreateChildren" className="cursor-pointer">Auto-create child products from conversion factors</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog('add-product')} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>{isSaving ? 'Saving...' : 'Add Product'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductDialog;
