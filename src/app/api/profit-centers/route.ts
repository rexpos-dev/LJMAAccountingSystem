import { NextResponse } from 'next/server';
import { getProfitCenters, createProfitCenter, updateProfitCenter, deleteProfitCenter } from '@/lib/database';

export async function GET() {
  try {
    const centers = await getProfitCenters();
    return NextResponse.json(centers);
  } catch (error) {
    console.error('Error fetching profit centers:', error);
    return NextResponse.json({ error: 'Failed to fetch profit centers' }, { status: 500 });
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

    const center = await createProfitCenter({ id, name, description, isActive });
    return NextResponse.json(center, { status: 201 });
  } catch (error: any) {
    console.error('Error creating profit center:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Profit Center ID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create profit center' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const center = await updateProfitCenter(id, { name, description, isActive });
    return NextResponse.json(center);
  } catch (error: any) {
    console.error('Error updating profit center:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profit Center not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update profit center' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteProfitCenter(id);
    return NextResponse.json({ message: 'Profit Center deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting profit center:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Profit Center not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete profit center' }, { status: 500 });
  }
}
