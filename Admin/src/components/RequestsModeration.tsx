import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, Archive } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import axios from 'axios';
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

// Backend base (Vite env override supported)
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://taza-bazar-backend.onrender.com';

// Types reflecting API response for consumer admin-deal requests
interface ConsumerRequestCore {
  _id: string; // nested request id
  user_id: string;
  product_name: string;
  product_quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  currency: string;
  when: string;
  request_description: string;
  admin_deal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConsumerDealRequest {
  _id: string; // admin-deal record id
  id: ConsumerRequestCore; // original consumer request
  verdict?: 'Pending' | 'Accepted' | 'Rejected' | string;
  createdAt: string;
  updatedAt: string;
}

export function RequestsModeration() {
  // Auth helpers copied to mirror ListingsModeration behavior
  const getAuthToken = () => {
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('adminToken') ||
      localStorage.getItem('authToken') ||
      ''
    );
  };
  const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) {
      if ((globalThis as any).process?.env?.NODE_ENV !== 'production') console.warn('Auth token not found in localStorage');
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  };
  // Resolve admin id to send alongside moderation actions
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const getAdminInfo = (): string => {
    const stored =
      localStorage.getItem('adminId') ||
      localStorage.getItem('userId') ||
      localStorage.getItem('id') ||
      '';
    if (stored) return stored;

    const token = getAuthToken();
    if (token) {
      const payload = parseJwt(token) as any;
      const possibleKeys = ['admin_id', 'adminId', 'id', '_id', 'user_id', 'sub'];
      for (const k of possibleKeys) {
        if (payload && payload[k]) return String(payload[k]);
      }
    }
    console.warn('Admin ID not found for moderation payload');
    return '';
  };

  // All consumer requests (not wrapped by admin deal)
  const [allRequests, setAllRequests] = useState<ConsumerRequestCore[]>([]);
  // Admin-deal consumer requests (wrapping original request)
  const [requests, setRequests] = useState<ConsumerDealRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminDealFilter, setAdminDealFilter] = useState<'all' | 'requested' | 'accepted'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ConsumerDealRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionReason, setActionReason] = useState('');
  // Delete flow
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ConsumerDealRequest | ConsumerRequestCore | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const headers = getAuthHeaders();
        const [allReqRes, dealReqRes] = await Promise.all([
          axios.get(`${API_BASE}/api/v1/admin/allReq`, { headers }),
          axios.get(`${API_BASE}/api/v1/admin/deal/consumerReq`, { headers }),
        ]);
        setAllRequests(allReqRes.data.data || []);
        setRequests(dealReqRes.data.data || []);
      } catch (error) {
        console.error('Error fetching consumer requests:', error);
      }
    };
    fetchRequests();
  }, []);

  // Search across the full requests list when in "All Requests" mode
  const filteredAllRequests = allRequests.filter((req) => {
    const name = req.product_name?.toLowerCase?.() || '';
    const user = (req.user_id as unknown as string)?.toLowerCase?.() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || user.includes(q);
  });

  const pendingRequests = requests.filter((r) => !r.verdict || r.verdict === 'Pending');
  const acceptedRequests = requests.filter((r) => r.verdict === 'Accepted');

  const pendingCount = pendingRequests.length;
  const totalAllCount = allRequests.length;
  const acceptedCount = acceptedRequests.length;

  const handleAction = (request: ConsumerDealRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleDeleteClick = (request: ConsumerDealRequest | ConsumerRequestCore) => {
    setDeleteTarget(request);
    setDeleteReason('');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const headers = getAuthHeaders();
  await axios.delete(`${API_BASE}/api/v1/admin/deal/consumerReq`, {
        headers,
        data: {
          request_ID: 'id' in deleteTarget ? deleteTarget.id._id : deleteTarget._id,
          // new audit fields
          adminID: getAdminInfo(),
          action_reasson: deleteReason || 'Admin initiated delete',
        },
      });
      // Update UI
      if ('id' in deleteTarget) {
        setRequests((prev) => prev.filter((r) => r.id._id !== deleteTarget.id._id));
      } else {
        setAllRequests((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      }
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setDeleteReason('');
    } catch (error) {
      console.error('Error deleting consumer request:', error);
      alert('Failed to delete request. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    try {
      const headers = getAuthHeaders();
    await axios.patch(
  `${API_BASE}/api/v1/admin/deal/consumerReq`,
        {
          request_ID: selectedRequest.id._id,
          ID: selectedRequest._id,
          verdict: actionType === 'approve' ? 'Accepted' : 'Rejected',
          // new audit fields
          adminID: getAdminInfo(),
          action_reasson: actionReason || undefined,
        },
        { headers }
      );
      // refresh list
  const res = await axios.get(`${API_BASE}/api/v1/admin/deal/consumerReq`, { headers });
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Error performing action:', error);
    }
    setActionDialogOpen(false);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Requests Moderation</h1>
        <p className="text-muted-foreground">Review and moderate consumer purchase requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
          <p className="text-foreground">{totalAllCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending Admin Deals</p>
          <p className="text-secondary">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Accepted Admin Deals</p>
          <p className="text-primary">{acceptedCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
          <p className="text-foreground">{new Date().toLocaleDateString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>
          <div className="flex gap-2 md:ml-auto">
            <Button
              variant={adminDealFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setAdminDealFilter('all')}
              className={adminDealFilter === 'all' ? 'neon-glow-sm' : ''}
            >
              All Requests
            </Button>
            <Button
              variant={adminDealFilter === 'requested' ? 'default' : 'outline'}
              onClick={() => setAdminDealFilter('requested')}
              className={adminDealFilter === 'requested' ? 'neon-glow-sm' : ''}
            >
              Requested Admin Deals ({pendingCount})
            </Button>
            <Button
              variant={adminDealFilter === 'accepted' ? 'default' : 'outline'}
              onClick={() => setAdminDealFilter('accepted')}
              className={adminDealFilter === 'accepted' ? 'neon-glow-sm' : ''}
            >
              Accepted Admin Deals ({acceptedCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adminDealFilter === 'all' ? (
          filteredAllRequests.map((request) => (
            <Card key={request._id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-foreground">{request.product_name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">User: {String(request.user_id)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="text-sm text-foreground">{request.currency} {request.price_per_unit}/{request.quantity_unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                    <p className="text-sm text-foreground">{request.product_quantity} {request.quantity_unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Needed By</p>
                    <p className="text-sm text-foreground">{request.when ? new Date(request.when).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm text-foreground">{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(request as unknown as ConsumerDealRequest)}
                    className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          requests
            .filter((req) => adminDealFilter === 'requested' ? (!req.verdict || req.verdict === 'Pending') : req.verdict === 'Accepted')
            .map((request) => (
              <Card key={request._id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-foreground">{request.id?.product_name || 'Product Name'}</h3>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/30">{request.verdict || 'Pending'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">User: {request.id?.user_id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="text-sm text-foreground">{request.id?.currency} {request.id?.price_per_unit}/{request.id?.quantity_unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                      <p className="text-sm text-foreground">{request.id?.product_quantity} {request.id?.quantity_unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Needed By</p>
                      <p className="text-sm text-foreground">{request.id?.when ? new Date(request.id.when).toLocaleDateString() : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Request Date</p>
                      <p className="text-sm text-foreground">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {(!request.verdict || request.verdict === 'Pending') && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(request, 'approve')}
                        className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request, 'reject')}
                        className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(request)}
                        className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-card border-border neon-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'approve' && `Approve "${selectedRequest?.id?.product_name}"?`}
              {actionType === 'reject' && `Reject "${selectedRequest?.id?.product_name}"? The consumer will be notified.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason {actionType === 'reject' ? '(required)' : '(optional)'}</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction} 
              disabled={actionType === 'reject' && !actionReason.trim()}
              className="neon-glow-sm"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border neon-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Request</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {(() => {
                const name = deleteTarget
                  ? ('id' in deleteTarget
                      ? deleteTarget.id?.product_name
                      : deleteTarget.product_name)
                  : '';
                return `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`;
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-reason">Reason (optional)</Label>
              <Textarea
                id="delete-reason"
                placeholder="Enter reason for deletion (optional)"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="bg-input-background border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-destructive/80 text-white hover:bg-destructive/90" disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
