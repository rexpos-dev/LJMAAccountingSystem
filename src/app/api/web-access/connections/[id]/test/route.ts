import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const start = Date.now();
  let status = 'FAILED';
  let status_code: number | null = null;
  let error_message: string | null = null;

  try {
    const connection = await prisma.apiConnection.findUnique({ where: { id: params.id } });
    if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 });

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (connection.auth_type === 'API_KEY' && connection.auth_key && connection.auth_value) {
      headers[connection.auth_key] = connection.auth_value;
    } else if (connection.auth_type === 'BEARER' && connection.auth_value) {
      headers['Authorization'] = `Bearer ${connection.auth_value}`;
    } else if (connection.auth_type === 'BASIC' && connection.auth_value) {
      headers['Authorization'] = `Basic ${Buffer.from(connection.auth_value).toString('base64')}`;
    }

    if (connection.custom_headers) {
      try {
        const extra = JSON.parse(connection.custom_headers);
        Object.assign(headers, extra);
      } catch { /* ignore malformed headers */ }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(connection.endpoint_url, {
        method: connection.method,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      status_code = res.status;
      status = res.ok ? 'SUCCESS' : 'FAILED';
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      error_message = fetchErr.name === 'AbortError' ? 'Request timed out (10s)' : fetchErr.message;
    }

    const response_time = Date.now() - start;

    await prisma.$transaction([
      prisma.apiCallLog.create({
        data: {
          connection_id: params.id,
          status,
          status_code,
          response_time,
          error_message,
        },
      }),
      prisma.apiConnection.update({
        where: { id: params.id },
        data: {
          last_tested: new Date(),
          last_status: status,
          response_time,
        },
      }),
    ]);

    return NextResponse.json({ status, status_code, response_time, error_message });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Test failed', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
