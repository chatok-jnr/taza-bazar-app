import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Send, Users, UserCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
// Types for backend responses
type Announcement = {
  _id: string;
  admin_id: string;
  announcement: string;
  __v?: number;
};

type AllAnnouncementsResponse = {
  status: string;
  data: Announcement[];
};

type MyAnnouncementsResponse = {
  status: string;
  myAnnouncement: Announcement[];
};

export function Announcements() {
  // Config
  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';
  const adminId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('admin_id') || '';
  }, []);

  // Auth token used for secured endpoints (common pattern across admin components)
  const token = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return (
      localStorage.getItem('adminToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      ''
    );
  }, []);

  // UI mode: 'all' | 'mine' | 'new'
  const [mode, setMode] = useState<'all' | 'mine' | 'new'>('all');

  // Lists
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>([]);
  const [myAnnouncements, setMyAnnouncements] = useState<Announcement[]>([]);

  // New announcement form
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleting, setDeleting] = useState(false);

  // UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch helpers
  const fetchAnnouncements = async (kind: 'all' | 'mine') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/announcement`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          // only include Authorization when token is available
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as AllAnnouncementsResponse & MyAnnouncementsResponse;
      if (kind === 'all') {
        const list = Array.isArray(data?.data) ? data.data : [];
        setAllAnnouncements(list);
      } else {
        const list = Array.isArray(data?.myAnnouncement) ? data.myAnnouncement : [];
        setMyAnnouncements(list);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'all') fetchAnnouncements('all');
    if (mode === 'mine') fetchAnnouncements('mine');
  }, [mode]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          admin_id: adminId,
          announcement: newMessage,
        }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Send failed: ${res.status}`);
      setNewMessage('');
      // After sending, show My Announcements to reflect the change
      setMode('mine');
    } catch (e: any) {
      setError(e?.message || 'Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteReason.trim()) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/announcement/${deleteTarget._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          admin_info: adminId,
          action_reasson: deleteReason,
        }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setMyAnnouncements((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      setDeleteTarget(null);
      setDeleteReason('');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete announcement');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setDeleteReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Announcements</h1>
        <p className="text-muted-foreground">Manage and broadcast announcements</p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'all' ? 'default' : 'outline'}
          className={mode === 'all' ? 'neon-glow-sm' : ''}
          onClick={() => setMode('all')}
        >
          All Announcements
        </Button>
        <Button
          variant={mode === 'mine' ? 'default' : 'outline'}
          className={mode === 'mine' ? 'neon-glow-sm' : ''}
          onClick={() => setMode('mine')}
        >
          My Announcements
        </Button>
        <Button
          variant={mode === 'new' ? 'default' : 'outline'}
          className={mode === 'new' ? 'neon-glow-sm' : ''}
          onClick={() => setMode('new')}
        >
          New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">All Users</p>
              <p className="text-foreground">12,847</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Farmers</p>
              <p className="text-foreground">5,234</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center cyan-glow">
              <ShoppingBag className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consumers</p>
              <p className="text-foreground">4,567</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center cyan-glow">
              <ShoppingBag className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Buyers</p>
              <p className="text-foreground">3,046</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content based on mode */}
      {mode === 'new' && (
        <Card className="p-6 bg-card neon-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-foreground">Create New Announcement</h2>
              <p className="text-sm text-muted-foreground">Write your message and send it to users</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your announcement message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="bg-input-background border-border min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setNewMessage('')}
                variant="outline"
                className="border-border hover:border-primary/50"
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send Announcement'}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </Card>
      )}

      {(mode === 'all' || mode === 'mine') && (
        <Card className="p-6 bg-card neon-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">{mode === 'all' ? 'All Announcements' : 'My Announcements'}</h3>
            <Badge>{loading ? 'Loading...' : mode === 'all' ? allAnnouncements.length : myAnnouncements.length}</Badge>
          </div>

          {error && (
            <p className="text-sm text-destructive mb-3">{error}</p>
          )}

          <div className="space-y-3">
            {(mode === 'all' ? allAnnouncements : myAnnouncements).map((a) => (
              <div key={a._id} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-foreground">Announcement</h4>
                      <Badge className="bg-muted text-muted-foreground">ID: {a._id.slice(-6)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.announcement}</p>
                  </div>
                  {mode === 'mine' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="hover:bg-destructive/10" onClick={() => setDeleteTarget(a)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {!loading && (mode === 'all' ? allAnnouncements.length === 0 : myAnnouncements.length === 0) && (
              <p className="text-sm text-muted-foreground">No announcements found.</p>
            )}
          </div>
        </Card>
      )}

      {/* Delete Reason Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <Card className="w-full max-w-md p-6 bg-card neon-border">
            <h4 className="text-foreground mb-1">Delete Announcement</h4>
            <p className="text-sm text-muted-foreground mb-4">Please provide a reason for deleting this announcement. This action cannot be undone.</p>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="bg-input-background border-border min-h-[100px]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="border-border" onClick={cancelDelete} disabled={deleting}>Cancel</Button>
              <Button
                className="bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30 flex-1"
                onClick={confirmDelete}
                disabled={!deleteReason.trim() || deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
