import { NextResponse } from 'next/server';
import { getCostCenters, createCostCenter, updateCostCenter, deleteCostCenter } from '@/lib/database';

export async function GET() {
  try {
    const centers = await getCostCenters();
    return NextResponse.json(centers);
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    return NextResponse.json({ error: 'Failed to fetch cost centers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, isActive } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    if (id.length !== 2) {
      return NextResponse.json({ error: 'ID must be exactly 2 digits' }, { status: 400 });
    }

    const center = await createCostCenter({ id, name, description, isActive });
    return NextResponse.json(center, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cost center:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cost Center ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create cost center' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const center = await updateCostCenter(id, { name, description, isActive });
    return NextResponse.json(center);
  } catch (error: any) {
    console.error('Error updating cost center:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Cost Center not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update cost center' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteCostCenter(id);
    return NextResponse.json({ message: 'Cost Center deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting cost center:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Cost Center not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete cost center' }, { status: 500 });
  }
}
