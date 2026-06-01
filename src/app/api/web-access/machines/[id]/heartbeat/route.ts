import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Regular heartbeat — marks machine ONLINE and updates last_seen
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // sendBeacon sends JSON with _method: DELETE when the tab is closing
    let body: any = {};
    try { body = await request.json(); } catch { /* empty body is fine */ }

    if (body?._method === 'DELETE') {
      // Tab is closing — mark offline immediately
      await prisma.machineStatus.update({
        where: { id: params.id },
        data: { status: 'OFFLINE' },
      });
      return NextResponse.json({ ok: true, status: 'OFFLINE' });
    }

    const machine = await prisma.machineStatus.update({
      where: { id: params.id },
      data: { last_seen: new Date(), status: 'ONLINE' },
    });
    return NextResponse.json({ ok: true, last_seen: machine.last_seen });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    return NextResponse.json({ error: 'Heartbeat failed' }, { status: 500 });
  }
}
