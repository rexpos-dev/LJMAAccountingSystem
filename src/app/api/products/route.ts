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
    if (!code || !name) {
      return NextResponse.json(
        { error: 'Product code and name are required' },
        { status: 400 }
      );
    }

    // Create product record using raw SQL
    await prisma.$queryRaw`
      INSERT INTO product (
        id, code, name, barcode, description, category, unitPrice, costPrice,
        stockQuantity, minStockLevel, maxStockLevel, isActive, salesOrder,
        createdAt, updatedAt
      ) VALUES (
        ${crypto.randomUUID()},
        ${code.trim()},
        ${name.trim()},
        ${barcode?.trim() || null},
        ${description?.trim() || null},
        ${category?.trim() || null},
        ${unitPrice ? parseFloat(unitPrice) : 0},
        ${costPrice ? parseFloat(costPrice) : 0},
        ${stockQuantity ? parseInt(stockQuantity) : 0},
        ${minStockLevel ? parseInt(minStockLevel) : 0},
        ${maxStockLevel ? parseInt(maxStockLevel) : null},
        ${isActive ?? true},
        ${salesOrder?.trim() || null},
        NOW(),
        NOW()
      )
    `;

    // Fetch the created product
    const product = await prisma.$queryRaw`
      SELECT * FROM product WHERE code = ${code.trim()}
    `;

    return NextResponse.json((product as any)[0], { status: 201 });
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

    // Update product record using raw SQL
    await prisma.$queryRaw`
      UPDATE product SET
        code = ${code.trim()},
        name = ${name.trim()},
        barcode = ${barcode?.trim() || null},
        description = ${description?.trim() || null},
        category = ${category?.trim() || null},
        unitPrice = ${unitPrice ? parseFloat(unitPrice) : 0},
        costPrice = ${costPrice ? parseFloat(costPrice) : 0},
        stockQuantity = ${stockQuantity ? parseInt(stockQuantity) : 0},
        minStockLevel = ${minStockLevel ? parseInt(minStockLevel) : 0},
        maxStockLevel = ${maxStockLevel ? parseInt(maxStockLevel) : null},
        isActive = ${isActive ?? true},
        salesOrder = ${salesOrder?.trim() || null},
        updatedAt = NOW()
      WHERE id = ${id}
    `;

    // Fetch the updated product
    const product = await prisma.$queryRaw`
      SELECT * FROM product WHERE id = ${id}
    `;

    if ((product as any).length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json((product as any)[0]);
  } catch (error: any) {
    console.error('Error updating product:', error);

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
