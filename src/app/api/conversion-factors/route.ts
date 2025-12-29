import { NextResponse } from 'next/server';
import { getConversionFactors, createConversionFactor, updateConversionFactor, deleteConversionFactor } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const conversionFactors = await getConversionFactors(productId || undefined);

    return NextResponse.json(conversionFactors);
  } catch (error) {
    console.error('Error fetching conversion factors:', error);
    return NextResponse.json({ error: 'Failed to fetch conversion factors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, unitName, factor } = body;

    if (!productId || !unitName || factor === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: productId, unitName, factor' 
      }, { status: 400 });
    }

    const conversionFactor = await createConversionFactor({
      productId,
      unitName,
      factor: parseFloat(factor),
    });

    return NextResponse.json(conversionFactor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating conversion factor:', error);
    return NextResponse.json({ error: 'Failed to create conversion factor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, productId, unitName, factor } = body;

    if (!id) {
      return NextResponse.json({ error: 'Conversion factor ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (productId !== undefined) updateData.productId = productId;
    if (unitName !== undefined) updateData.unitName = unitName;
    if (factor !== undefined) updateData.factor = parseFloat(factor);

    const conversionFactor = await updateConversionFactor(id, updateData);

    return NextResponse.json(conversionFactor);
  } catch (error: any) {
    console.error('Error updating conversion factor:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Conversion factor not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update conversion factor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Conversion factor ID is required' }, { status: 400 });
    }

    await deleteConversionFactor(id);

    return NextResponse.json({ message: 'Conversion factor deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting conversion factor:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Conversion factor not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete conversion factor' }, { status: 500 });
  }
}
