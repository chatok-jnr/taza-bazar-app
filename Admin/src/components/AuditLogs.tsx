import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Download, Shield, Ban, CheckCircle, XCircle, Edit, Trash2, User } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Prefer Vite env var when available, fall back to the known backend URL
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://taza-bazar-backend.onrender.com';

// API response types
type AdminInfo = string | { _id?: string; name?: string; email?: string };
type AuditLog = {
  _id: string;
  admin_info: AdminInfo;
  admin_action:
    | 'SUSPEND USER'
    | 'ACTIVE USER'
    | 'VERIFY USER'
    | 'UNVERIFY USER'
    | 'APPROVE LISTING'
    | 'REJECT LISTING'
    | 'DELETE LISTING'
    | 'APPROVE REQUEST'
    | 'REJECT REQUEST'
    | 'DELETE REQUEST'
    | 'SEND ANNOUNCEMENT'
    | string; // be tolerant to unexpected new actions
  action_reasson?: string;
  createdAt: string;
  updatedAt: string;
};
type AuditLogsResponse = {
  status: string;
  allAudit: AuditLog[];
};

// Map backend action strings (with spaces) to icons
const actionIcons: { [key: string]: any } = {
  'APPROVE LISTING': CheckCircle,
  'REJECT LISTING': XCircle,
  'DELETE LISTING': Trash2,
  'APPROVE REQUEST': CheckCircle,
  'REJECT REQUEST': XCircle,
  'DELETE REQUEST': Trash2,
  'SUSPEND USER': Ban,
  'ACTIVE USER': CheckCircle,
  'VERIFY USER': Shield,
  'UNVERIFY USER': XCircle,
  'SEND ANNOUNCEMENT': User,
};

const actionColors: { [key: string]: string } = {
  'APPROVE LISTING': 'text-primary',
  'REJECT LISTING': 'text-destructive',
  'DELETE LISTING': 'text-destructive',
  'APPROVE REQUEST': 'text-primary',
  'REJECT REQUEST': 'text-destructive',
  'DELETE REQUEST': 'text-destructive',
  'SUSPEND USER': 'text-destructive',
  'ACTIVE USER': 'text-primary',
  'VERIFY USER': 'text-primary',
  'UNVERIFY USER': 'text-secondary',
  'SEND ANNOUNCEMENT': 'text-secondary',
};

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
  // include Authorization header when admin JWT exists in localStorage
  const token =
    (typeof window !== 'undefined' &&
      (localStorage.getItem('adminToken') || localStorage.getItem('token') || localStorage.getItem('authToken'))) || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}/api/v1/admin/auditLogs`, {
          method: 'GET',
          headers,
          // Note: credentials are omitted to avoid CORS issues with wildcard origin
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: AuditLogsResponse = await res.json();
        if (isMounted) {
          setLogs(Array.isArray(data.allAudit) ? data.allAudit : []);
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to load audit logs');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedAdmin = (admin_info: AdminInfo) => {
    if (!admin_info) return 'Unknown Admin';
    if (typeof admin_info === 'string') {
      return admin_info.length > 10 ? `${admin_info.slice(0, 6)}…${admin_info.slice(-4)}` : admin_info;
    }
    return admin_info.name || admin_info.email || (admin_info._id ? `${admin_info._id.slice(0, 6)}…${admin_info._id.slice(-4)}` : 'Unknown Admin');
  };

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return logs.filter((log) => {
      const adminStr = normalizedAdmin(log.admin_info).toLowerCase();
      const reasonStr = (log.action_reasson || '').toLowerCase();
      const actionStr = (log.admin_action || '').toLowerCase();

      const matchesSearch =
        adminStr.includes(q) || reasonStr.includes(q) || actionStr.includes(q) || (log._id || '').toLowerCase().includes(q);
      const matchesAction = selectedAction === 'all' || log.admin_action === selectedAction;
      const matchesAdmin = selectedAdmin === 'all' || normalizedAdmin(log.admin_info) === selectedAdmin;
      return matchesSearch && matchesAction && matchesAdmin;
    });
  }, [logs, searchQuery, selectedAction, selectedAdmin]);

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map((l) => l.admin_action))), [logs]);
  const uniqueAdmins = useMemo(() => Array.from(new Set(logs.map((l) => normalizedAdmin(l.admin_info)))), [logs]);

  const exportLogs = () => {
    const rows = filteredLogs.map((l) => ({
      id: l._id,
      // Prefer human-friendly admin name (or email), fall back to ID
      admin_info:
        typeof l.admin_info === 'string'
          ? l.admin_info
          : l.admin_info?.name || l.admin_info?.email || l.admin_info?._id || '',
      admin_action: l.admin_action,
      action_reasson: l.action_reasson || '',
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    }));
    const headers = Object.keys(rows[0] || { id: '', admin_info: '', admin_action: '', action_reasson: '', createdAt: '', updatedAt: '' });
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => JSON.stringify((row as any)[h] ?? '')).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const countToday = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return logs.filter((l) => {
      const t = new Date(l.createdAt);
      return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
    }).length;
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary mb-2">Audit Logs</h1>
          <p className="text-muted-foreground">Complete history of all admin actions</p>
        </div>
        <Button onClick={exportLogs} variant="outline" className="border-border hover:border-primary/50 neon-glow-sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Actions</p>
          <p className="text-foreground">{logs.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Today</p>
          <p className="text-primary">{countToday}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Active Admins</p>
          <p className="text-secondary">{uniqueAdmins.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Unique Actions</p>
          <p className="text-foreground">{uniqueActions.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card neon-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>

          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border neon-border">
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>{action}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
            <SelectTrigger className="bg-input-background border-border">
              <SelectValue placeholder="Filter by admin" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border neon-border">
              <SelectItem value="all">All Admins</SelectItem>
              {uniqueAdmins.map((admin) => (
                <SelectItem key={admin} value={admin}>{admin}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs Timeline */}
      <Card className="p-6 bg-card neon-border">
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading audit logs…</p>
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          {!loading && !error && filteredLogs.map((log) => {
            const Icon = actionIcons[log.admin_action] || Edit;
            const colorClass = actionColors[log.admin_action] || 'text-foreground';

            return (
              <div key={log._id} className="relative pl-8 pb-4 border-l-2 border-border last:border-l-0 last:pb-0">
                <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-card border-2 border-primary" />
                
                <div className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-foreground">{normalizedAdmin(log.admin_info)}</span>
                          <Badge className="bg-primary/20 text-primary">
                            {log.admin_action}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-border">
                      ID: {log._id.slice(-6)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {log.action_reasson && (
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                        <p className="text-sm text-foreground">{log.action_reasson}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {formatDateTime(log.createdAt)}</span>
                      <span>•</span>
                      <span>Updated: {formatDateTime(log.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && !error && filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No audit logs found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
