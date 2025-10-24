import { useState } from 'react';
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

const mockAuditLogs = [
  { id: 1, timestamp: '2025-10-24 14:30:45', admin: 'Admin A', action: 'APPROVE_LISTING', targetType: 'Listing', targetId: 'L-1234', details: 'Approved "Organic Tomatoes - Premium Quality"', reason: 'Quality verified, meets platform standards', ipAddress: '192.168.1.100' },
  { id: 2, timestamp: '2025-10-24 14:15:22', admin: 'Admin B', action: 'SUSPEND_USER', targetType: 'User', targetId: 'U-5678', details: 'Suspended user john.spammer@email.com', reason: 'Multiple spam reports, violated ToS', ipAddress: '192.168.1.101' },
  { id: 3, timestamp: '2025-10-24 13:45:10', admin: 'Admin A', action: 'REJECT_REQUEST', targetType: 'Request', targetId: 'R-9012', details: 'Rejected "Suspicious Bulk Order"', reason: 'Suspected fraudulent activity', ipAddress: '192.168.1.100' },
  { id: 4, timestamp: '2025-10-24 13:20:33', admin: 'Admin C', action: 'FEATURE_LISTING', targetType: 'Listing', targetId: 'L-3456', details: 'Featured "Premium Rice - Basmati" as admin deal', reason: 'High quality product, promotional campaign', ipAddress: '192.168.1.102' },
  { id: 5, timestamp: '2025-10-24 12:55:18', admin: 'Admin B', action: 'VERIFY_USER', targetType: 'User', targetId: 'U-7890', details: 'Verified user sarah@dairy.com', reason: 'KYC documents approved', ipAddress: '192.168.1.101' },
  { id: 6, timestamp: '2025-10-24 12:30:05', admin: 'Admin A', action: 'ACCEPT_BID', targetType: 'Bid', targetId: 'B-2345', details: 'Manually accepted bid for "Fresh Milk"', reason: 'Override due to special circumstances', ipAddress: '192.168.1.100' },
  { id: 7, timestamp: '2025-10-24 11:45:50', admin: 'Admin C', action: 'RESOLVE_REPORT', targetType: 'Report', targetId: 'RP-6789', details: 'Resolved report about fake listing', reason: 'Listing removed, user warned', ipAddress: '192.168.1.102' },
  { id: 8, timestamp: '2025-10-24 11:15:27', admin: 'Admin B', action: 'UPDATE_SETTINGS', targetType: 'Settings', targetId: 'S-GLOBAL', details: 'Updated platform settings', reason: 'Adjusted bid price thresholds', ipAddress: '192.168.1.101' },
  { id: 9, timestamp: '2025-10-24 10:50:12', admin: 'Admin A', action: 'SEND_ANNOUNCEMENT', targetType: 'Announcement', targetId: 'A-1234', details: 'Sent announcement to all users', reason: 'Platform maintenance notification', ipAddress: '192.168.1.100' },
  { id: 10, timestamp: '2025-10-24 10:20:38', admin: 'Admin C', action: 'DELETE_LISTING', targetType: 'Listing', targetId: 'L-5678', details: 'Deleted prohibited listing', reason: 'Violated content policy', ipAddress: '192.168.1.102' },
];

const actionIcons: { [key: string]: any } = {
  APPROVE_LISTING: CheckCircle,
  REJECT_REQUEST: XCircle,
  SUSPEND_USER: Ban,
  VERIFY_USER: Shield,
  FEATURE_LISTING: Edit,
  ACCEPT_BID: CheckCircle,
  RESOLVE_REPORT: CheckCircle,
  UPDATE_SETTINGS: Edit,
  SEND_ANNOUNCEMENT: User,
  DELETE_LISTING: Trash2,
};

const actionColors: { [key: string]: string } = {
  APPROVE_LISTING: 'text-primary',
  REJECT_REQUEST: 'text-destructive',
  SUSPEND_USER: 'text-destructive',
  VERIFY_USER: 'text-primary',
  FEATURE_LISTING: 'text-secondary',
  ACCEPT_BID: 'text-primary',
  RESOLVE_REPORT: 'text-primary',
  UPDATE_SETTINGS: 'text-secondary',
  SEND_ANNOUNCEMENT: 'text-secondary',
  DELETE_LISTING: 'text-destructive',
};

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.admin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesAdmin = selectedAdmin === 'all' || log.admin === selectedAdmin;
    return matchesSearch && matchesAction && matchesAdmin;
  });

  const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action)));
  const uniqueAdmins = Array.from(new Set(mockAuditLogs.map(log => log.admin)));

  const exportLogs = () => {
    console.log('Exporting audit logs...');
    // Export logic
  };

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
          <p className="text-foreground">{mockAuditLogs.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Today</p>
          <p className="text-primary">10</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Active Admins</p>
          <p className="text-secondary">3</p>
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
                <SelectItem key={action} value={action}>{action.replace(/_/g, ' ')}</SelectItem>
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
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const Icon = actionIcons[log.action] || Edit;
            const colorClass = actionColors[log.action] || 'text-foreground';

            return (
              <div key={log.id} className="relative pl-8 pb-4 border-l-2 border-border last:border-l-0 last:pb-0">
                <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-card border-2 border-primary" />
                
                <div className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-foreground">{log.admin}</span>
                          <Badge className="bg-primary/20 text-primary">
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-border">
                      {log.targetType}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-foreground">{log.details}</p>
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                      <p className="text-sm text-foreground">{log.reason}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Target ID: {log.targetId}</span>
                      <span>•</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No audit logs found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
