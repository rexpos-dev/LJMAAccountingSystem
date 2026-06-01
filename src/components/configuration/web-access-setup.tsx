'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Plus, RefreshCw, Trash2, Pencil, Play, Globe, Server, Monitor, Wifi, WifiOff,
  AlertTriangle, CheckCircle2, XCircle, Clock, Activity, Link2, Shield, Cpu,
  Search, Radio, Network, ScanLine, Zap, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiConnection {
  id: string; name: string; endpoint_url: string; method: string; auth_type: string;
  auth_key: string | null; auth_value: string | null; custom_headers: string | null;
  description: string | null; is_active: boolean; last_tested: string | null;
  last_status: string | null; response_time: number | null; created_at: string;
  _count?: { call_logs: number };
}

interface ApiCallLog {
  id: string; connection_id: string; status: string; status_code: number | null;
  response_time: number | null; error_message: string | null; called_at: string;
  connection?: { name: string; endpoint_url: string };
}

interface MachineRecord {
  id: string; machine_name: string; ip_address: string; machine_type: string;
  location: string | null; status: string; last_seen: string | null;
  offline_threshold_seconds: number; os_info: string | null; notes: string | null;
  created_at: string;
}

interface ScanResult {
  ip: string; alive: boolean; open_ports: number[]; response_time: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
const MACHINE_TYPES = ['CLIENT', 'SERVER', 'POS', 'TERMINAL', 'KIOSK'];
const MACHINE_STATUSES = ['ONLINE', 'OFFLINE', 'WARNING'];
const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds

// ─── Status helpers ───────────────────────────────────────────────────────────
// Status is now determined server-side by live TCP probing — just use machine.status directly.

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <Badge variant="outline" className="text-muted-foreground">Untested</Badge>;
  if (status === 'SUCCESS' || status === 'ONLINE')
    return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-200">{status}</Badge>;
  if (status === 'WARNING')
    return <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">{status}</Badge>;
  return <Badge className="bg-destructive/15 text-destructive border-destructive/20">{status}</Badge>;
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/10 text-blue-600 border-blue-200', POST: 'bg-green-500/10 text-green-600 border-green-200',
    PUT: 'bg-amber-500/10 text-amber-600 border-amber-200', PATCH: 'bg-purple-500/10 text-purple-600 border-purple-200',
    DELETE: 'bg-red-500/10 text-red-600 border-red-200', HEAD: 'bg-gray-500/10 text-gray-600 border-gray-200',
  };
  return <Badge variant="outline" className={cn('font-mono text-xs', colors[method] || '')}>{method}</Badge>;
}

// ─── Heartbeat hook ───────────────────────────────────────────────────────────
// Keeps "this machine" registration alive; marks offline when browser tab closes.

function useHeartbeat(machineId: string | null) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendHeartbeat = useCallback(async (id: string) => {
    try {
      await fetch(`/api/web-access/machines/${id}/heartbeat`, { method: 'POST' });
    } catch { /* ignore network errors */ }
  }, []);

  useEffect(() => {
    if (!machineId) return;

    // Immediate heartbeat
    sendHeartbeat(machineId);

    // Periodic heartbeat
    intervalRef.current = setInterval(() => sendHeartbeat(machineId), HEARTBEAT_INTERVAL_MS);

    // Mark offline when tab closes — sendBeacon is fire-and-forget, works on unload
    const markOffline = () => {
      navigator.sendBeacon(`/api/web-access/machines/${machineId}/heartbeat`, JSON.stringify({ _method: 'DELETE' }));
    };
    window.addEventListener('beforeunload', markOffline);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendHeartbeat(machineId);
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', markOffline);
    };
  }, [machineId, sendHeartbeat]);
}

// ─── Connection Dialog ────────────────────────────────────────────────────────

interface ConnDialogProps { open: boolean; onClose: () => void; onSaved: () => void; editing?: ApiConnection | null; }

function ConnectionDialog({ open, onClose, onSaved, editing }: ConnDialogProps) {
  const [form, setForm] = useState({ name: '', endpoint_url: '', method: 'GET', auth_type: 'NONE', auth_key: '', auth_value: '', custom_headers: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) setForm({ name: editing.name, endpoint_url: editing.endpoint_url, method: editing.method, auth_type: editing.auth_type, auth_key: editing.auth_key || '', auth_value: editing.auth_value || '', custom_headers: editing.custom_headers || '', description: editing.description || '' });
    else setForm({ name: '', endpoint_url: '', method: 'GET', auth_type: 'NONE', auth_key: '', auth_value: '', custom_headers: '', description: '' });
  }, [editing, open]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.endpoint_url) { toast.error('Name and endpoint URL are required'); return; }
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/web-access/connections/${editing.id}` : '/api/web-access/connections', {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editing ? 'Connection updated' : 'Connection created');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>{editing ? 'Edit API Connection' : 'New API Connection'}</DialogTitle></DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5"><Label>Name *</Label><Input placeholder="e.g. Payment Gateway" value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div className="col-span-2 space-y-1.5"><Label>Endpoint URL *</Label><Input placeholder="https://api.example.com/v1/endpoint" value={form.endpoint_url} onChange={e => set('endpoint_url', e.target.value)} /></div>
              <div className="space-y-1.5"><Label>HTTP Method</Label>
                <Select value={form.method} onValueChange={v => set('method', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HTTP_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-1.5"><Label>Auth Type</Label>
                <Select value={form.auth_type} onValueChange={v => set('auth_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NONE">None</SelectItem><SelectItem value="API_KEY">API Key (Header)</SelectItem><SelectItem value="BEARER">Bearer Token</SelectItem><SelectItem value="BASIC">Basic Auth</SelectItem></SelectContent></Select>
              </div>
              {form.auth_type === 'API_KEY' && (<><div className="space-y-1.5"><Label>Header Name</Label><Input placeholder="X-API-Key" value={form.auth_key} onChange={e => set('auth_key', e.target.value)} /></div><div className="space-y-1.5"><Label>API Key Value</Label><Input type="password" placeholder="your-api-key" value={form.auth_value} onChange={e => set('auth_value', e.target.value)} /></div></>)}
              {form.auth_type === 'BEARER' && (<div className="col-span-2 space-y-1.5"><Label>Bearer Token</Label><Input type="password" placeholder="eyJhbGci..." value={form.auth_value} onChange={e => set('auth_value', e.target.value)} /></div>)}
              {form.auth_type === 'BASIC' && (<div className="col-span-2 space-y-1.5"><Label>Credentials (username:password)</Label><Input type="password" placeholder="username:password" value={form.auth_value} onChange={e => set('auth_value', e.target.value)} /></div>)}
              <div className="col-span-2 space-y-1.5"><Label>Custom Headers <span className="text-muted-foreground text-xs">(JSON)</span></Label><Textarea rows={2} placeholder={'{"Accept": "application/json"}'} value={form.custom_headers} onChange={e => set('custom_headers', e.target.value)} className="font-mono text-xs" /></div>
              <div className="col-span-2 space-y-1.5"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving && <RefreshCw className="h-4 w-4 mr-1 animate-spin" />}{editing ? 'Save Changes' : 'Create Connection'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Machine Dialog ───────────────────────────────────────────────────────────

interface MachineDialogProps { open: boolean; onClose: () => void; onSaved: () => void; editing?: MachineRecord | null; prefillIp?: string; }

function MachineDialog({ open, onClose, onSaved, editing, prefillIp }: MachineDialogProps) {
  const [form, setForm] = useState({ machine_name: '', ip_address: '', machine_type: 'CLIENT', location: '', status: 'ONLINE', notes: '', offline_threshold_seconds: '120' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) setForm({ machine_name: editing.machine_name, ip_address: editing.ip_address, machine_type: editing.machine_type, location: editing.location || '', status: editing.status, notes: editing.notes || '', offline_threshold_seconds: String(editing.offline_threshold_seconds ?? 120) });
    else setForm({ machine_name: '', ip_address: prefillIp || '', machine_type: 'CLIENT', location: '', status: 'ONLINE', notes: '', offline_threshold_seconds: '120' });
  }, [editing, open, prefillIp]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.machine_name || !form.ip_address) { toast.error('Machine name and IP address are required'); return; }
    setSaving(true);
    try {
      const res = await fetch(editing ? `/api/web-access/machines/${editing.id}` : '/api/web-access/machines', {
        method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, offline_threshold_seconds: parseInt(form.offline_threshold_seconds) || 120 }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editing ? 'Machine updated' : 'Machine registered');
      onSaved(); onClose();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{editing ? 'Edit Machine' : 'Register Machine'}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5"><Label>Machine Name *</Label><Input placeholder="e.g. POS-Terminal-01" value={form.machine_name} onChange={e => set('machine_name', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>IP Address *</Label><Input placeholder="192.168.1.100" value={form.ip_address} onChange={e => set('ip_address', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Type</Label>
              <Select value={form.machine_type} onValueChange={v => set('machine_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MACHINE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5"><Label>Location</Label><Input placeholder="Branch / Floor" value={form.location} onChange={e => set('location', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MACHINE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Offline Threshold (seconds)</Label>
              <Input type="number" min={30} max={3600} value={form.offline_threshold_seconds} onChange={e => set('offline_threshold_seconds', e.target.value)} placeholder="120" />
              <p className="text-xs text-muted-foreground">Machine is marked OFFLINE if no heartbeat received within this time.</p>
            </div>
            <div className="col-span-2 space-y-1.5"><Label>Notes</Label><Textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving && <RefreshCw className="h-4 w-4 mr-1 animate-spin" />}{editing ? 'Save Changes' : 'Register'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── IP Scanner Tab ───────────────────────────────────────────────────────────

interface IpScannerTabProps { onRegister: (ip: string) => void; }

function IpScannerTab({ onRegister }: IpScannerTabProps) {
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [totalScanned, setTotalScanned] = useState(0);
  const [subnets, setSubnets] = useState<{ name: string; ip: string; subnet: string }[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [allResults, setAllResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    fetch('/api/web-access/scan')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setSubnets(data);
        if (data.length > 0) setTarget(data[0].subnet);
      })
      .catch(() => {});
  }, []);

  const handleScan = async () => {
    if (!target.trim()) { toast.error('Enter an IP range or CIDR block'); return; }
    setScanning(true);
    setProgress(0);
    setResults([]);
    setAllResults([]);

    // Simulate progress while waiting
    const progressInterval = setInterval(() => setProgress(p => Math.min(p + 2, 90)), 300);

    try {
      const res = await fetch('/api/web-access/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setResults(data.results);
      setAllResults(data.all_results || []);
      setTotalScanned(data.total_scanned);
      setProgress(100);
      toast.success(`Scan complete — ${data.alive_count} host${data.alive_count !== 1 ? 's' : ''} found of ${data.total_scanned} scanned`);
    } catch (e: any) {
      toast.error(e.message || 'Scan failed');
    } finally {
      clearInterval(progressInterval);
      setScanning(false);
    }
  };

  const displayResults = showAll ? allResults : results;

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Scans by attempting TCP connections on common ports (80, 443, 22, 3389, 445, 8080, 8443…). Devices that don't expose these ports may not appear even if online. Max 254 hosts per scan.
        </p>
      </div>

      {/* Subnet quick-select */}
      {subnets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Detected subnets:</span>
          {subnets.map(s => (
            <Button key={s.subnet} variant="outline" size="sm" className={cn('text-xs h-7', target === s.subnet && 'border-primary text-primary')} onClick={() => setTarget(s.subnet)}>
              <Network className="h-3 w-3 mr-1" />{s.name}: {s.subnet}
            </Button>
          ))}
        </div>
      )}

      {/* Scan input */}
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">IP Range or CIDR Block</Label>
          <Input
            placeholder="192.168.1.0/24  or  192.168.1.1-192.168.1.50"
            value={target}
            onChange={e => setTarget(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !scanning && handleScan()}
            className="font-mono text-sm"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleScan} disabled={scanning} className="gap-2">
            {scanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
            {scanning ? 'Scanning...' : 'Scan Network'}
          </Button>
        </div>
      </div>

      {/* Progress */}
      {scanning && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Probing hosts on {target}…</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {/* Results */}
      {(results.length > 0 || allResults.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">
                <span className="text-emerald-600 font-bold">{results.length}</span> live hosts found
                <span className="text-muted-foreground"> / {totalScanned} scanned</span>
              </p>
              {allResults.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setShowAll(v => !v)}>
                  {showAll ? 'Show live only' : `Show all ${allResults.length} IPs`}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500" /> Live
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30 ml-2" /> No response
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>IP Address</TableHead>
                    <TableHead>Open Ports</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayResults.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">No hosts responded to the scan.</TableCell></TableRow>
                  ) : (
                    displayResults.map(r => (
                      <TableRow key={r.ip} className={cn(!r.alive && 'opacity-40')}>
                        <TableCell>
                          <div className={cn('h-2.5 w-2.5 rounded-full', r.alive ? 'bg-emerald-500' : 'bg-muted-foreground/30')} />
                        </TableCell>
                        <TableCell className="font-mono text-sm font-medium">{r.ip}</TableCell>
                        <TableCell>
                          {r.open_ports.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {r.open_ports.map(p => (
                                <span key={p} className="text-xs font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-200">{p}</span>
                              ))}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {r.alive ? `${r.response_time}ms` : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.alive && (
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => onRegister(r.ip)}>
                              <Plus className="h-3 w-3" /> Register
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Machine Monitor Tab ──────────────────────────────────────────────────────

interface MachineMonitorTabProps {
  machines: MachineRecord[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (m: MachineRecord) => void;
  onDelete: (id: string) => void;
  onRegisterSelf: () => void;
  deletingId: string | null;
}

function MachineMonitorTab({ machines, loading, onRefresh, onEdit, onDelete, onRegisterSelf, deletingId }: MachineMonitorTabProps) {
  // Compute live status client-side so the UI stays accurate even between refreshes
  const withLiveStatus = machines;
  const online = withLiveStatus.filter(m => m.status === 'ONLINE').length;
  const offline = withLiveStatus.filter(m => m.status === 'OFFLINE').length;
  const warning = withLiveStatus.filter(m => m.status === 'WARNING').length;

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-500/5">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-emerald-600" />
            </div>
            <div><p className="text-2xl font-bold text-emerald-700">{online}</p><p className="text-xs text-emerald-600">Online</p></div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-destructive" />
            </div>
            <div><p className="text-2xl font-bold text-destructive">{offline}</p><p className="text-xs text-destructive/80">Offline</p></div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-500/5">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div><p className="text-2xl font-bold text-amber-700">{warning}</p><p className="text-xs text-amber-600">Warning</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Info: heartbeat explanation */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
        <Radio className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>
          Registered machines send a heartbeat every 30 s. If no heartbeat is received within the configured threshold,
          the status automatically changes to <strong>WARNING</strong> then <strong>OFFLINE</strong>. Closing this browser tab marks the machine offline immediately.
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{machines.length} machine{machines.length !== 1 ? 's' : ''} registered</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4 mr-1', loading && 'animate-spin')} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onRegisterSelf}>
            <Cpu className="h-4 w-4 mr-1" /> Register This Machine
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Heartbeat</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : withLiveStatus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Monitor className="h-8 w-8 opacity-30" />
                      <p>No machines registered yet</p>
                      <Button size="sm" variant="outline" onClick={onRegisterSelf}><Cpu className="h-4 w-4 mr-1" />Register This Machine</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                withLiveStatus.map(machine => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={cn('h-2 w-2 rounded-full shrink-0 animate-pulse', machine.status === 'ONLINE' ? 'bg-emerald-500' : machine.status === 'WARNING' ? 'bg-amber-500' : 'bg-muted-foreground/40')} />
                        <div>
                          <p>{machine.machine_name}</p>
                          {machine.notes && <p className="text-xs text-muted-foreground truncate max-w-[150px]">{machine.notes}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{machine.ip_address}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{machine.machine_type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{machine.location || '—'}</TableCell>
                    <TableCell><StatusBadge status={machine.status} /></TableCell>
                    <TableCell className="text-xs">
                      {machine.last_seen ? (
                        <div>
                          <p className="text-muted-foreground">{formatDistanceToNow(new Date(machine.last_seen), { addSuffix: true })}</p>
                          <p className="text-muted-foreground/50">{format(new Date(machine.last_seen), 'HH:mm:ss')}</p>
                        </div>
                      ) : <span className="text-muted-foreground">Never</span>}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{machine.offline_threshold_seconds}s</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(machine)} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => onDelete(machine.id)} disabled={deletingId === machine.id} title="Delete">
                          {deletingId === machine.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WebAccessSetup() {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [machines, setMachines] = useState<MachineRecord[]>([]);
  const [logs, setLogs] = useState<ApiCallLog[]>([]);
  const [loadingConns, setLoadingConns] = useState(false);
  const [loadingMachines, setLoadingMachines] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [connDialogOpen, setConnDialogOpen] = useState(false);
  const [editingConn, setEditingConn] = useState<ApiConnection | null>(null);
  const [machineDialogOpen, setMachineDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<MachineRecord | null>(null);
  const [prefillIp, setPrefillIp] = useState<string | undefined>(undefined);

  // ID of the machine registered via "Register This Machine" — kept in state to drive heartbeat
  const [selfMachineId, setSelfMachineId] = useState<string | null>(null);

  // Heartbeat hook — fires every 30 s and marks offline on tab close
  useHeartbeat(selfMachineId);

  const fetchConnections = useCallback(async () => {
    setLoadingConns(true);
    try { const r = await fetch('/api/web-access/connections'); if (r.ok) setConnections(await r.json()); }
    finally { setLoadingConns(false); }
  }, []);

  const fetchMachines = useCallback(async () => {
    setLoadingMachines(true);
    try { const r = await fetch('/api/web-access/machines'); if (r.ok) setMachines(await r.json()); }
    finally { setLoadingMachines(false); }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    try { const r = await fetch('/api/web-access/connections/logs?limit=50'); if (r.ok) setLogs(await r.json()); }
    finally { setLoadingLogs(false); }
  }, []);

  useEffect(() => {
    fetchConnections(); fetchMachines(); fetchLogs();
  }, [fetchConnections, fetchMachines, fetchLogs]);

  // Auto-refresh machines every 30 s so status updates are visible without manual refresh
  useEffect(() => {
    const id = setInterval(fetchMachines, 30_000);
    return () => clearInterval(id);
  }, [fetchMachines]);

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/web-access/connections/${id}/test`, { method: 'POST' });
      const data = await res.json();
      data.status === 'SUCCESS'
        ? toast.success(`Connection successful — ${data.response_time}ms (HTTP ${data.status_code})`)
        : toast.error(`Connection failed — ${data.error_message || `HTTP ${data.status_code}`}`);
      await Promise.all([fetchConnections(), fetchLogs()]);
    } catch { toast.error('Test request failed'); }
    finally { setTestingId(null); }
  };

  const handleDeleteConn = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/web-access/connections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Connection removed'); fetchConnections();
    } catch (e: any) { toast.error(e.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleDeleteMachine = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/web-access/machines/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Machine removed');
      if (id === selfMachineId) setSelfMachineId(null);
      fetchMachines();
    } catch (e: any) { toast.error(e.message || 'Delete failed'); }
    finally { setDeletingId(null); }
  };

  const handleRegisterSelf = async () => {
    try {
      const res = await fetch('/api/web-access/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machine_name: `Browser-${Date.now()}`, machine_type: 'CLIENT', offline_threshold_seconds: 90 }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const machine = await res.json();
      setSelfMachineId(machine.id);
      toast.success('This machine registered — heartbeat active');
      fetchMachines();
    } catch (e: any) { toast.error(e.message || 'Registration failed'); }
  };

  // Called from IP scanner "Register" button
  const handleRegisterFromScan = (ip: string) => {
    setPrefillIp(ip);
    setEditingMachine(null);
    setMachineDialogOpen(true);
  };

  // Dashboard stats
  const totalConns = connections.length;
  const activeConns = connections.filter(c => c.is_active).length;
  const successLogs = logs.filter(l => l.status === 'SUCCESS').length;
  const successRate = logs.length > 0 ? Math.round((successLogs / logs.length) * 100) : 0;
  const avgResponseTime = logs.filter(l => l.response_time).length > 0
    ? Math.round(logs.filter(l => l.response_time).reduce((s, l) => s + (l.response_time || 0), 0) / logs.filter(l => l.response_time).length)
    : 0;
  const liveMachines = machines;
  const onlineMachines = liveMachines.filter(m => m.status === 'ONLINE').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Set Up Web Access
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure API connections, monitor call activity, scan your network, and track machine status in real time.
          </p>
        </div>
        {selfMachineId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-200 text-xs text-emerald-700 font-medium">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Heartbeat active
          </div>
        )}
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="connections" className="flex items-center gap-1.5"><Link2 className="h-4 w-4" />API Connections</TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1.5"><Activity className="h-4 w-4" />Dashboard</TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-1.5"><ScanLine className="h-4 w-4" />IP Scanner</TabsTrigger>
          <TabsTrigger value="machines" className="flex items-center gap-1.5"><Monitor className="h-4 w-4" />Machine Monitor</TabsTrigger>
        </TabsList>

        {/* ── API Connections ─────────────────────────────────────────────────── */}
        <TabsContent value="connections" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{totalConns} connection{totalConns !== 1 ? 's' : ''} configured</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchConnections} disabled={loadingConns}>
                <RefreshCw className={cn('h-4 w-4 mr-1', loadingConns && 'animate-spin')} />Refresh
              </Button>
              <Button size="sm" onClick={() => { setEditingConn(null); setConnDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" />New Connection
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Endpoint</TableHead><TableHead>Method</TableHead>
                    <TableHead>Auth</TableHead><TableHead>Last Status</TableHead><TableHead>Response</TableHead>
                    <TableHead>Last Tested</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingConns ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading connections...</TableCell></TableRow>
                  ) : connections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Link2 className="h-8 w-8 opacity-30" />
                          <p>No API connections yet</p>
                          <Button size="sm" variant="outline" onClick={() => { setEditingConn(null); setConnDialogOpen(true); }}><Plus className="h-4 w-4 mr-1" />Add your first connection</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : connections.map(conn => (
                    <TableRow key={conn.id}>
                      <TableCell className="font-medium">
                        <div><p>{conn.name}</p>{conn.description && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{conn.description}</p>}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground max-w-[200px] truncate" title={conn.endpoint_url}>{conn.endpoint_url}</TableCell>
                      <TableCell><MethodBadge method={conn.method} /></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs"><Shield className="h-3 w-3 mr-1" />{conn.auth_type}</Badge></TableCell>
                      <TableCell><StatusBadge status={conn.last_status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{conn.response_time ? `${conn.response_time}ms` : '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{conn.last_tested ? formatDistanceToNow(new Date(conn.last_tested), { addSuffix: true }) : '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50" onClick={() => handleTest(conn.id)} disabled={testingId === conn.id} title="Test">
                            {testingId === conn.id ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingConn(conn); setConnDialogOpen(true); }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteConn(conn.id)} disabled={deletingId === conn.id} title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Dashboard ────────────────────────────────────────────────────────── */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" />Total Connections</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{totalConns}</p><p className="text-xs text-muted-foreground mt-1">{activeConns} active</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Success Rate</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{successRate}%</p><p className="text-xs text-muted-foreground mt-1">{logs.length} total calls</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" />Avg Response</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{avgResponseTime > 0 ? `${avgResponseTime}ms` : '—'}</p><p className="text-xs text-muted-foreground mt-1">across all calls</p></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-emerald-500" />Machines Online</CardDescription></CardHeader><CardContent><p className="text-3xl font-bold">{onlineMachines}</p><p className="text-xs text-muted-foreground mt-1">of {machines.length} registered</p></CardContent></Card>
          </div>

          {connections.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Connection Health</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {connections.map(conn => (
                    <div key={conn.id} className={cn('rounded-lg border p-3 space-y-1', conn.last_status === 'SUCCESS' ? 'border-emerald-200 bg-emerald-500/5' : conn.last_status === 'FAILED' ? 'border-destructive/20 bg-destructive/5' : 'border-border bg-muted/30')}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate mr-2">{conn.name}</p>
                        {conn.last_status === 'SUCCESS' ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : conn.last_status === 'FAILED' ? <XCircle className="h-4 w-4 text-destructive shrink-0" /> : <Clock className="h-4 w-4 text-muted-foreground shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conn.endpoint_url}</p>
                      <div className="flex items-center gap-2"><MethodBadge method={conn.method} />{conn.response_time && <span className="text-xs text-muted-foreground">{conn.response_time}ms</span>}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Call Logs</CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchLogs} disabled={loadingLogs}><RefreshCw className={cn('h-4 w-4', loadingLogs && 'animate-spin')} /></Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Connection</TableHead><TableHead>Status</TableHead><TableHead>HTTP Code</TableHead>
                    <TableHead>Response Time</TableHead><TableHead>Error</TableHead><TableHead>Called At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingLogs ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Loading logs...</TableCell></TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No call logs yet. Test a connection to see activity here.</TableCell></TableRow>
                  ) : logs.slice(0, 30).map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm font-medium">{log.connection?.name || '—'}</TableCell>
                      <TableCell><StatusBadge status={log.status} /></TableCell>
                      <TableCell>{log.status_code ? <span className={cn('text-sm font-mono font-medium', log.status_code < 400 ? 'text-emerald-600' : 'text-destructive')}>{log.status_code}</span> : '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.response_time ? `${log.response_time}ms` : '—'}</TableCell>
                      <TableCell className="text-xs text-destructive max-w-[200px] truncate">{log.error_message || '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(log.called_at), 'MMM d, HH:mm:ss')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── IP Scanner ───────────────────────────────────────────────────────── */}
        <TabsContent value="scanner" className="space-y-4">
          <IpScannerTab onRegister={handleRegisterFromScan} />
        </TabsContent>

        {/* ── Machine Monitor ──────────────────────────────────────────────────── */}
        <TabsContent value="machines" className="space-y-4">
          <MachineMonitorTab
            machines={machines}
            loading={loadingMachines}
            onRefresh={fetchMachines}
            onEdit={(m) => { setEditingMachine(m); setPrefillIp(undefined); setMachineDialogOpen(true); }}
            onDelete={handleDeleteMachine}
            onRegisterSelf={handleRegisterSelf}
            deletingId={deletingId}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ConnectionDialog open={connDialogOpen} onClose={() => { setConnDialogOpen(false); setEditingConn(null); }} onSaved={() => { fetchConnections(); fetchLogs(); }} editing={editingConn} />
      <MachineDialog open={machineDialogOpen} onClose={() => { setMachineDialogOpen(false); setEditingMachine(null); setPrefillIp(undefined); }} onSaved={fetchMachines} editing={editingMachine} prefillIp={prefillIp} />
    </div>
  );
}
