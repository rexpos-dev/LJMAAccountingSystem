import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, endpoint_url, method, auth_type, auth_key, auth_value, custom_headers, description, is_active } = body;

    const connection = await prisma.apiConnection.update({
      where: { id: params.id },
      data: {
        name: name?.trim(),
        endpoint_url: endpoint_url?.trim(),
        method,
        auth_type,
        auth_key: auth_key?.trim() ?? null,
        auth_value: auth_value?.trim() ?? null,
        custom_headers: custom_headers ?? null,
        description: description?.trim() ?? null,
        is_active: is_active ?? undefined,
      },
    });

    return NextResponse.json(connection);
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to update API connection', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.apiConnection.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Connection deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to delete API connection', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
