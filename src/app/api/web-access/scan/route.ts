import { NextResponse } from 'next/server';
import net from 'net';
import os from 'os';

const SCAN_PORTS = [80, 443, 22, 3389, 445, 8080, 8443, 135, 139];
const PORT_TIMEOUT_MS = 500;
const BATCH_SIZE = 20;

// Attempt TCP connect on a single port — returns true if the port accepts connections
function probePort(ip: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(PORT_TIMEOUT_MS);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => { socket.destroy(); resolve(false); });
    socket.connect(port, ip);
  });
}

// Probe all ports for a host; returns open ports and whether host is alive
async function probeHost(ip: string): Promise<{ ip: string; alive: boolean; open_ports: number[]; response_time: number }> {
  const start = Date.now();
  const results = await Promise.all(SCAN_PORTS.map(p => probePort(ip, p).then(ok => ({ port: p, ok }))));
  const open_ports = results.filter(r => r.ok).map(r => r.port);
  return { ip, alive: open_ports.length > 0, open_ports, response_time: Date.now() - start };
}

// Parse CIDR notation → array of IPs (max /24 = 254 hosts)
function expandCIDR(cidr: string): string[] {
  const [base, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr ?? '24');
  if (prefix < 16 || prefix > 32) throw new Error('Only /16 to /32 CIDR ranges supported');

  const parts = base.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    throw new Error('Invalid IP address');
  }

  const baseInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  const mask = prefix === 32 ? 0xffffffff : ~((1 << (32 - prefix)) - 1) >>> 0;
  const networkInt = (baseInt & mask) >>> 0;
  const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;

  const ips: string[] = [];
  // Skip network address (first) and broadcast (last) for /24 and larger subnets
  const start = prefix < 32 ? networkInt + 1 : networkInt;
  const end = prefix < 32 ? broadcastInt - 1 : broadcastInt;

  const maxHosts = Math.min(end - start + 1, 254);
  for (let i = 0; i < maxHosts; i++) {
    const n = start + i;
    ips.push(`${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`);
  }
  return ips;
}

// Parse a simple range like 192.168.1.1-192.168.1.50
function expandRange(range: string): string[] {
  const [start, end] = range.split('-').map(s => s.trim());
  const startParts = start.split('.').map(Number);
  const endParts = end.split('.').map(Number);
  if (startParts.length !== 4 || endParts.length !== 4) throw new Error('Invalid range');

  const toInt = (p: number[]) => (p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3];
  const startInt = toInt(startParts) >>> 0;
  const endInt = toInt(endParts) >>> 0;
  if (endInt < startInt || endInt - startInt > 253) throw new Error('Range too large (max 254 hosts)');

  const ips: string[] = [];
  for (let n = startInt; n <= endInt; n++) {
    ips.push(`${(n >>> 24) & 0xff}.${(n >>> 16) & 0xff}.${(n >>> 8) & 0xff}.${n & 0xff}`);
  }
  return ips;
}

// Get the server's local network interfaces so the client can auto-fill a subnet
export async function GET() {
  const ifaces = os.networkInterfaces();
  const addresses: { name: string; ip: string; subnet: string }[] = [];
  for (const [name, list] of Object.entries(ifaces)) {
    for (const iface of list ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const parts = iface.address.split('.');
        addresses.push({ name, ip: iface.address, subnet: `${parts[0]}.${parts[1]}.${parts[2]}.0/24` });
      }
    }
  }
  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target } = body; // CIDR "192.168.1.0/24" or range "192.168.1.1-192.168.1.50"

    if (!target) return NextResponse.json({ error: 'target is required (CIDR or range)' }, { status: 400 });

    let ips: string[];
    try {
      ips = target.includes('/') ? expandCIDR(target) : expandRange(target);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const results: Awaited<ReturnType<typeof probeHost>>[] = [];

    // Process in batches to avoid exhausting file descriptors
    for (let i = 0; i < ips.length; i += BATCH_SIZE) {
      const batch = ips.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(probeHost));
      results.push(...batchResults);
    }

    const alive = results.filter(r => r.alive);

    return NextResponse.json({
      total_scanned: results.length,
      alive_count: alive.length,
      results: results.filter(r => r.alive), // Only return live hosts
      all_results: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Scan failed', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
