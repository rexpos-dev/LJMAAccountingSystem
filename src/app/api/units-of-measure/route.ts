import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const uoms = await prisma.unitOfMeasure.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(uoms);
  } catch (error: any) {
    console.error('Error fetching units of measure:', error);
    return NextResponse.json({ error: 'Failed to fetch units of measure' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Unit code is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Unit name is required' }, { status: 400 });
    }

    const uom = await prisma.unitOfMeasure.create({
      data: {
        code: code.trim(),
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(uom, { status: 201 });
  } catch (error: any) {
    console.error('Error creating unit of measure:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Unit already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create unit of measure' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, code, name, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Unit of measure ID is required' }, { status: 400 });
    }

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Unit code is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Unit name is required' }, { status: 400 });
    }

    const updateData: any = {
      code: code.trim(),
      name: name.trim(),
    };

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const uom = await prisma.unitOfMeasure.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(uom);
  } catch (error: any) {
    console.error('Error updating unit of measure:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Unit of measure not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Unit code or name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update unit of measure' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Unit of measure ID is required' }, { status: 400 });
    }

    await prisma.unitOfMeasure.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Unit of measure deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting unit of measure:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Unit of measure not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete unit of measure' }, { status: 500 });
  }
}
