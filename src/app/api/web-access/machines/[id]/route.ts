import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import net from 'net';

const PROBE_PORTS = [80, 443, 22, 3389, 445, 135, 139, 8080, 8443];
const PROBE_TIMEOUT_MS = 600;

function probePort(ip: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(PROBE_TIMEOUT_MS);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => { socket.destroy(); resolve(false); });
    socket.connect(port, ip);
  });
}

async function isHostReachable(ip: string): Promise<boolean> {
  const results = await Promise.all(PROBE_PORTS.map(p => probePort(ip, p)));
  return results.some(Boolean);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { machine_name, ip_address, machine_type, location, notes, offline_threshold_seconds } = body;

    // Probe the (possibly new) IP to get accurate live status
    const targetIp = ip_address?.trim();
    const reachable = targetIp ? await isHostReachable(targetIp) : false;

    const machine = await prisma.machineStatus.update({
      where: { id: params.id },
      data: {
        machine_name: machine_name?.trim(),
        ip_address: targetIp,
        machine_type,
        location: location?.trim() ?? null,
        status: reachable ? 'ONLINE' : 'OFFLINE',
        last_seen: reachable ? new Date() : undefined,
        notes: notes?.trim() ?? null,
        ...(offline_threshold_seconds != null ? { offline_threshold_seconds: parseInt(offline_threshold_seconds) } : {}),
      },
    });

    return NextResponse.json(machine);
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to update machine', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.machineStatus.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Machine removed' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to delete machine', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
