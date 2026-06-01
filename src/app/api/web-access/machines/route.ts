import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import net from 'net';

// ─── TCP probe ────────────────────────────────────────────────────────────────
// Tries to open a TCP connection to the given port.
// Returns true if the port accepts the connection (host is up & port is open).

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

// A host is considered reachable if at least one common port accepts a connection.
async function isHostReachable(ip: string): Promise<boolean> {
  const results = await Promise.all(PROBE_PORTS.map(p => probePort(ip, p)));
  return results.some(Boolean);
}

// ─── GET — fetch machines and probe each IP in parallel ──────────────────────

export async function GET() {
  try {
    const machines = await prisma.machineStatus.findMany({
      orderBy: { updated_at: 'desc' },
    });

    if (machines.length === 0) return NextResponse.json([]);

    // Probe all machines concurrently
    const probeResults = await Promise.all(
      machines.map(async (m) => ({
        id: m.id,
        reachable: await isHostReachable(m.ip_address),
      }))
    );

    // Determine which machines need a status update
    const updates: { id: string; status: string; last_seen?: Date }[] = [];
    for (const { id, reachable } of probeResults) {
      const machine = machines.find(m => m.id === id)!;
      const newStatus = reachable ? 'ONLINE' : 'OFFLINE';
      if (machine.status !== newStatus) {
        updates.push({
          id,
          status: newStatus,
          ...(reachable ? { last_seen: new Date() } : {}),
        });
      } else if (reachable) {
        // Still online — keep last_seen fresh even if status didn't change
        updates.push({ id, status: 'ONLINE', last_seen: new Date() });
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(
        updates.map(u =>
          prisma.machineStatus.update({
            where: { id: u.id },
            data: { status: u.status, ...(u.last_seen ? { last_seen: u.last_seen } : {}) },
          })
        )
      );
    }

    // Return fresh list with updated statuses
    const updated = await prisma.machineStatus.findMany({
      orderBy: { updated_at: 'desc' },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch machines', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

// ─── POST — register a new machine ───────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machine_name, machine_type, location, notes, offline_threshold_seconds } = body;

    if (!machine_name) {
      return NextResponse.json({ error: 'Machine name is required' }, { status: 400 });
    }

    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip_address =
      body.ip_address ||
      forwarded?.split(',')[0]?.trim() ||
      realIp ||
      '127.0.0.1';

    // Probe the IP immediately so the registered status is accurate
    const reachable = await isHostReachable(ip_address);

    const machine = await prisma.machineStatus.create({
      data: {
        machine_name: machine_name.trim(),
        ip_address,
        machine_type: machine_type || 'CLIENT',
        location: location?.trim() || null,
        status: reachable ? 'ONLINE' : 'OFFLINE',
        last_seen: reachable ? new Date() : null,
        offline_threshold_seconds: offline_threshold_seconds ?? 120,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(machine, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to register machine', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
