'use client';

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  code: string;
  name: string;
  barcode?: string;
  description?: string;
  category?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  isActive: boolean;
  salesOrder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalProduct {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  stock: number;
  price: string;
  cost: string | null;
  sku: string;
  barcode: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalProductResponse {
  success: boolean;
  data: ExternalProduct[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  timestamp: string;
}

export function useProducts(search?: string, filterBy?: string, filterValue?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterBy) params.append('filterBy', filterBy);
      if (filterValue) params.append('filterValue', filterValue);

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const newProduct = await response.json();

      // Refresh the product list
      await fetchProducts();

      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...productData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();

      // Update the product in the local state
      setProducts(prev => prev.map(product =>
        product.id === id ? updatedProduct : product
      ));

      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Remove the product from the local state
      setProducts(prev => prev.filter(product => product.id !== id));

      return await response.json();
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [search, filterBy, filterValue]);

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };
}

export function useExternalProducts(page: number = 1, limit: number = 10, search?: string, filterBy?: string, filterValue?: string) {
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<ExternalProductResponse['pagination'] | null>(null);
  const [allProducts, setAllProducts] = useState<ExternalProduct[]>([]);

  const fetchExternalProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, fetch all products or a larger set to enable local filtering
      const fetchAllParams = new URLSearchParams({
        limit: '1000', // Fetch a large set for local filtering
        offset: '0',
      });

      const response = await fetch(`/api/external-products?${fetchAllParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch external products: ${response.statusText}`);
      }

      const data: ExternalProductResponse = await response.json();

      if (data.success) {
        setAllProducts(data.data);

        // Apply local filtering for enhanced search
        let filteredProducts = data.data;

        // Apply search filtering (enhanced to include category and brand)
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name?.toLowerCase().includes(searchLower) ||
            product.sku?.toLowerCase().includes(searchLower) ||
            product.barcode?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) || // Enhanced: include category
            product.brand?.toLowerCase().includes(searchLower) ||     // Enhanced: include brand
            product.description?.toLowerCase().includes(searchLower)
          );
        }

        // Apply additional filtering
        if (filterBy && filterValue) {
          filteredProducts = filteredProducts.filter(product => {
            const value = product[filterBy as keyof ExternalProduct];
            if (filterBy === 'date') {
              return value && new Date(value as string).toDateString() === new Date(filterValue).toDateString();
            }
            return value && String(value).toLowerCase().includes(filterValue.toLowerCase());
          });
        }

        // Apply pagination to filtered results
        const offset = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(offset, offset + limit);

        setExternalProducts(paginatedProducts);
        setPagination({
          total: filteredProducts.length,
          limit: limit,
          offset: offset,
          hasMore: offset + limit < filteredProducts.length,
        });
      } else {
        throw new Error('API response indicates failure');
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching external products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalProducts();
  }, [page, limit, search, filterBy, filterValue]);

  return {
    externalProducts,
    isLoading,
    error,
    pagination,
    refreshExternalProducts: fetchExternalProducts,
  };
}
