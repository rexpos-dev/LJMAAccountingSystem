import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const filterBy = searchParams.get('filterBy');
    const filterValue = searchParams.get('filterValue');

    let query = `
      SELECT * FROM product
      WHERE 1=1
    `;

    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR code LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (filterBy && filterValue) {
      switch (filterBy) {
        case 'date':
          query += ` AND DATE(createdAt) = ?`;
          params.push(filterValue);
          break;
        case 'productName':
          query += ` AND name LIKE ?`;
          params.push(`%${filterValue}%`);
          break;
        case 'code':
          query += ` AND code LIKE ?`;
          params.push(`%${filterValue}%`);
          break;
        case 'salesOrder':
          query += ` AND salesOrder LIKE ?`;
          params.push(`%${filterValue}%`);
          break;
      }
    }

    query += ` ORDER BY createdAt DESC`;

    const products = await prisma.$queryRawUnsafe(query, ...params);

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      name,
      barcode,
      description,
      additionalDescription,
      category,
      categoryId,
      subcategoryId,
      brandId,
      supplierId,
      unitOfMeasureId,
      unitPrice,
      costPrice,
      stockQuantity,
      minStockLevel,
      maxStockLevel,
      isActive,
      salesOrder,
      autoCreateChildren,
      incomeAccountId,
      expenseAccountId,
      initialStock,
      reorderPoint,
      conversionFactors,
    } = body;

    // Validate required fields
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Product code and name are required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create product record
      const product = await tx.product.create({
        data: {
          code: code.trim(),
          name: name.trim(),
          barcode: barcode?.trim() || null,
          description: description?.trim() || null,
          additionalDescription: additionalDescription?.trim() || null,
          category: category?.trim() || null,
          categoryId: categoryId || null,
          subcategoryId: subcategoryId || null,
          brandId: brandId || null,
          supplierId: supplierId || null,
          unitOfMeasureId: unitOfMeasureId || null,
          unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
          costPrice: costPrice ? parseFloat(costPrice) : 0,
          stockQuantity: (stockQuantity ? parseInt(stockQuantity) : 0) + (initialStock ? parseInt(initialStock) : 0),
          minStockLevel: minStockLevel ? parseInt(minStockLevel) : (reorderPoint ? parseInt(reorderPoint) : 0),
          maxStockLevel: maxStockLevel ? parseInt(maxStockLevel) : null,
          isActive: isActive ?? true,
          salesOrder: salesOrder?.trim() || null,
          autoCreateChildren: autoCreateChildren ?? false,
          incomeAccountId: incomeAccountId || null,
          expenseAccountId: expenseAccountId || null,
          initialStock: initialStock ? parseInt(initialStock) : 0,
          reorderPoint: reorderPoint ? parseInt(reorderPoint) : 0,
        },
      });

      // Create history record for creation
      await tx.productHistory.create({
        data: {
          productId: product.id,
          field: 'creation',
          newValue: 'Product Created',
          changedBy: 'System', // Replace with actual user if available
        },
      });

      // Create inventory transaction if there's initial stock
      const initialStockVal = initialStock ? parseInt(initialStock) : 0;
      if (initialStockVal > 0) {
        await tx.inventoryTransaction.create({
          data: {
            productId: product.id,
            type: 'IN',
            quantity: initialStockVal,
            referenceId: 'INITIAL_STOCK',
            status: 'Completed',
          },
        });
      }

      // Handle conversion factors if any
      if (conversionFactors && Array.isArray(conversionFactors)) {
        for (const factor of conversionFactors) {
          await tx.conversionFactor.create({
            data: {
              productId: product.id,
              unitName: factor.unitName,
              factor: factor.factor,
            },
          });
        }
      }

      return product;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      code,
      name,
      barcode,
      description,
      category,
      unitPrice,
      costPrice,
      stockQuantity,
      minStockLevel,
      maxStockLevel,
      isActive,
      salesOrder,
    } = body;

    // Validate required fields
    if (!id || !code || !name) {
      return NextResponse.json(
        { error: 'Product ID, code and name are required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get existing product for comparison
      const existingProduct = await tx.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Update product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          code: code.trim(),
          name: name.trim(),
          barcode: barcode?.trim() || null,
          description: description?.trim() || null,
          category: category?.trim() || null,
          unitPrice: unitPrice ? parseFloat(unitPrice) : 0,
          costPrice: costPrice ? parseFloat(costPrice) : 0,
          stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
          minStockLevel: minStockLevel ? parseInt(minStockLevel) : 0,
          maxStockLevel: maxStockLevel ? parseInt(maxStockLevel) : null,
          isActive: isActive ?? true,
          salesOrder: salesOrder?.trim() || null,
        },
      });

      // Track changes in history
      const changes = [];
      if (existingProduct.unitPrice !== updatedProduct.unitPrice) changes.push({ field: 'unitPrice', old: existingProduct.unitPrice, new: updatedProduct.unitPrice });
      if (existingProduct.costPrice !== updatedProduct.costPrice) changes.push({ field: 'costPrice', old: existingProduct.costPrice, new: updatedProduct.costPrice });
      if (existingProduct.stockQuantity !== updatedProduct.stockQuantity) changes.push({ field: 'stockQuantity', old: existingProduct.stockQuantity, new: updatedProduct.stockQuantity });

      for (const change of changes) {
        await tx.productHistory.create({
          data: {
            productId: id,
            field: change.field,
            oldValue: String(change.old),
            newValue: String(change.new),
            changedBy: 'System',
          },
        });
      }

      // Track stock adjustment if stock changed
      if (existingProduct.stockQuantity !== updatedProduct.stockQuantity) {
        const diff = updatedProduct.stockQuantity - existingProduct.stockQuantity;
        await tx.inventoryTransaction.create({
          data: {
            productId: id,
            type: diff > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT',
            quantity: Math.abs(diff),
            referenceId: 'MANUAL_EDIT',
            status: 'Completed',
          },
        });
      }

      return updatedProduct;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.message === 'Product not found') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.$queryRaw`
      SELECT id FROM product WHERE id = ${id}
    `;

    if ((existingProduct as any).length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product record using raw SQL
    await prisma.$queryRaw`
      DELETE FROM product WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete product',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
