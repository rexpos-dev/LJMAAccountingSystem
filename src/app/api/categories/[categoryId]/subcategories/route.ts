import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId;

    const subcategories = await prisma.category.findMany({
      where: { parentCategoryId: categoryId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(subcategories);
  } catch (error: any) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}
