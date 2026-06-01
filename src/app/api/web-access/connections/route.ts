import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const connections = await prisma.apiConnection.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { call_logs: true } },
      },
    });
    return NextResponse.json(connections);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch API connections', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, endpoint_url, method, auth_type, auth_key, auth_value, custom_headers, description } = body;

    if (!name || !endpoint_url) {
      return NextResponse.json({ error: 'Name and endpoint URL are required' }, { status: 400 });
    }

    const connection = await prisma.apiConnection.create({
      data: {
        name: name.trim(),
        endpoint_url: endpoint_url.trim(),
        method: method || 'GET',
        auth_type: auth_type || 'NONE',
        auth_key: auth_key?.trim() || null,
        auth_value: auth_value?.trim() || null,
        custom_headers: custom_headers || null,
        description: description?.trim() || null,
        is_active: true,
      },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create API connection', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
