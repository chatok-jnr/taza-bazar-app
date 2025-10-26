import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, MoreVertical, Shield, Ban, RefreshCw, UserCheck, Edit, Bell } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

// API user shape based on provided response
type AdminUser = {
  _id: string;
  user_name: string;
  user_email: string;
  user_no: string;
  user_birth_date?: string;
  gender?: string;
  active_listing: number;
  total_revenue: number;
  total_spent?: number;
  createdAt: string;
  updatedAt?: string;
  verified?: boolean;
  user_status?: string; // "Active" | "Suspended" | etc (case-insensitive checks used)
};

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  // Filter tags: all | verified | active | suspended
  const [selectedTag, setSelectedTag] = useState<'all' | 'verified' | 'active' | 'suspended'>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'toggleStatus' | 'notify' | 'verify' | 'promote' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('adminToken') || localStorage.getItem('token')
            : null;

        const res = await fetch('http://127.0.0.1:8000/api/v1/admin/allUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch users (${res.status})`);
        }
        const json = await res.json();
        const data: AdminUser[] = json?.data || [];
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      const matchesSearch =
        user.user_name.toLowerCase().includes(q) ||
        user.user_email.toLowerCase().includes(q) ||
        (user.user_no || '').toLowerCase().includes(q);

      const status = (user.user_status || '').toLowerCase();
      const isVerified = Boolean(user.verified);

      const matchesTag =
        selectedTag === 'all'
          ? true
          : selectedTag === 'verified'
          ? isVerified
          : selectedTag === 'active'
          ? status === 'active'
          : status === 'suspended';

      return matchesSearch && matchesTag;
    });
  }, [users, searchQuery, selectedTag]);

  const handleAction = (user: AdminUser, type: 'toggleStatus' | 'notify' | 'verify' | 'promote') => {
    setSelectedUser(user);
    setActionType(type);
    setActionDialogOpen(true);
  };

  // Toggle Suspend/Activate via API and optimistically update UI
  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    if (actionType === 'toggleStatus') {
      const currentStatus = (selectedUser.user_status || '').toLowerCase();
      const nextStatus = currentStatus === 'suspended' ? 'Active' : 'Suspended';

      try {
        setActionLoading(true);
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('adminToken') || localStorage.getItem('token')
            : null;

        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/admin/userStatus/${selectedUser._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ user_status: nextStatus }),
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to update status (${res.status})`);
        }

        // Optimistic UI update
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, user_status: nextStatus } : u))
        );

        setActionDialogOpen(false);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to update user status');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    if (actionType === 'verify') {
      const nextVerified = !Boolean(selectedUser.verified);
      try {
        setActionLoading(true);
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('adminToken') || localStorage.getItem('token')
            : null;

        const res = await fetch(
          `http://127.0.0.1:8000/api/v1/admin/userStatus/${selectedUser._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ verified: nextVerified }),
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to update verification (${res.status})`);
        }

        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, verified: nextVerified } : u))
        );
        setActionDialogOpen(false);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to update verification');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    // Fallback for other actions (not implemented yet)
    console.log(
      `Action: ${actionType} on user ${selectedUser?.user_email} with reason/message: ${actionReason}`
    );
    setActionDialogOpen(false);
    setActionReason('');
  };

  const totalUsers = users.length;
  const verifiedCount = users.filter((u) => u.verified).length;
  const suspendedCount = users.filter((u) => (u.user_status || '').toLowerCase() === 'suspended').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage and moderate platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-foreground">{loading ? '...' : totalUsers}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Verified Users</p>
          <p className="text-primary">{loading ? '...' : verifiedCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Suspended</p>
          <p className="text-destructive">{loading ? '...' : suspendedCount}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedTag === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedTag('all')}
              className={selectedTag === 'all' ? 'neon-glow-sm' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedTag === 'verified' ? 'default' : 'outline'}
              onClick={() => setSelectedTag('verified')}
              className={selectedTag === 'verified' ? 'neon-glow-sm' : ''}
            >
              Verified
            </Button>
            <Button
              variant={selectedTag === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedTag('active')}
              className={selectedTag === 'active' ? 'neon-glow-sm' : ''}
            >
              Active
            </Button>
            <Button
              variant={selectedTag === 'suspended' ? 'default' : 'outline'}
              onClick={() => setSelectedTag('suspended')}
              className={selectedTag === 'suspended' ? 'neon-glow-sm' : ''}
            >
              Suspended
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6 bg-card neon-border">
        <div className="overflow-x-auto">
          {error && (
            <div className="text-destructive text-sm mb-4">{error}</div>
          )}
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">User</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Contact</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Activity</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Revenue</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Spent</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Joined</th>
                <th className="text-right py-4 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow-sm">
                        <span className="text-primary text-sm">{user.user_name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{user.user_name}</p>
                        {user.verified ? (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <UserCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{user.user_email}</p>
                    <p className="text-xs text-muted-foreground">{user.user_no}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      (user.user_status || '').toLowerCase() === 'active' ? 'bg-primary/20 text-primary' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {user.user_status || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{user.active_listing ?? 0} listings</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground">{user.total_revenue ?? 0}</td>
                  <td className="py-4 px-4 text-sm text-foreground">{user.total_spent ?? 0}</td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border neon-border">
                          <DropdownMenuItem onClick={() => handleAction(user, 'verify')} className="hover:bg-primary/10 cursor-pointer">
                            <UserCheck className="w-4 h-4 mr-2" />
                            {user.verified ? 'Unverify User' : 'Verify User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(user, 'toggleStatus')} className="hover:bg-destructive/10 cursor-pointer">
                            <Ban className="w-4 h-4 mr-2" />
                            {(user.user_status || '').toLowerCase() === 'suspended' ? 'Activate' : 'Suspend'} User
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem onClick={() => handleAction(user, 'promote')} className="hover:bg-secondary/10 cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem> */}
                          {/* <DropdownMenuItem onClick={() => handleAction(user, 'notify')} className="hover:bg-secondary/10 cursor-pointer">
                            <Bell className="w-4 h-4 mr-2" />
                            Send Notification / Warning
                          </DropdownMenuItem> */}
                          {/* <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-card border-border neon-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {actionType === 'toggleStatus' && ((selectedUser?.user_status || '').toLowerCase() === 'suspended' ? 'Activate User' : 'Suspend User')}
              {actionType === 'verify' && (selectedUser?.verified ? 'Unverify User' : 'Verify User')}
              {actionType === 'promote' && 'Promote to Admin'}
              {actionType === 'notify' && 'Send Notification / Warning'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'toggleStatus' && `Are you sure you want to ${(selectedUser?.user_status || '').toLowerCase() === 'suspended' ? 'activate' : 'suspend'} ${selectedUser?.user_name}?`}
              {actionType === 'verify' && `${selectedUser?.verified ? 'Unverify' : 'Verify'} ${selectedUser?.user_name}'s account?`}
              {actionType === 'promote' && `Promote ${selectedUser?.user_name} to admin role?`}
              {actionType === 'notify' && `Send a notification or warning to ${selectedUser?.user_name}.`}
            </DialogDescription>
          </DialogHeader>
          {actionType !== 'toggleStatus' && actionType !== 'verify' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">
                  {actionType === 'notify' ? 'Message (required)' : 'Reason (required for audit)'}
                </Label>
                <Textarea
                  id="reason"
                  placeholder={
                    actionType === 'notify'
                      ? 'Enter message to send to the user...'
                      : 'Enter reason for this action...'
                  }
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            {actionType === 'toggleStatus' ? (
              <Button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`neon-glow-sm text-white ${
                  (selectedUser?.user_status || '').toLowerCase() === 'suspended'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {(selectedUser?.user_status || '').toLowerCase() === 'suspended' ? 'Activate' : 'Suspend'}
              </Button>
            ) : actionType === 'verify' ? (
              <Button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`neon-glow-sm text-white ${
                  selectedUser?.verified ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {selectedUser?.verified ? 'Unverify' : 'Verify'}
              </Button>
            ) : (
              <Button onClick={confirmAction} disabled={!actionReason.trim() || actionLoading} className="neon-glow-sm">
                {actionLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Confirm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
