import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Star, Archive, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { Badge } from './ui/badge';
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

interface FarmerRequest {
  user_type: string;
  _id: string;
  id: {
    _id: string;
    user_id: string;
    product_name: string;
    product_quantity: number;
    quantity_unit: string;
    price_per_unit: number;
    currency: string;
    from: string;
    to: string;
    product_description: string;
    admin_deal: boolean;
    createdAt: string;
    updatedAt: string;
  };
  verdict: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListing {
  _id: string;
  user_id: string;
  product_name: string;
  product_quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  currency: string;
  from: string;
  to: string;
  product_description: string;
  admin_deal: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ListingsModeration() {
  // Helper to read JWT token from common storage keys. Adjust keys as needed.
  const getAuthToken = () => {
    // try several common storage keys; adjust to your app's actual key if different
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
      // optional: warn in dev when token missing
      if (process.env.NODE_ENV !== 'production') console.warn('Auth token not found in localStorage');
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  };
  const [allListings, setAllListings] = useState<ProductListing[]>([]);
  const [adminDealRequests, setAdminDealRequests] = useState<FarmerRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<ProductListing | FarmerRequest | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'feature' | 'archive' | null>(null);
  const [actionReason, setActionReason] = useState('');
  // Delete flow
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductListing | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminDealFilter, setAdminDealFilter] = useState<'all' | 'requested' | 'accepted'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeaders();
        const [listingsRes, dealRequestsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/v1/admin/allList', { headers }),
          axios.get('http://127.0.0.1:8000/api/v1/admin/deal/farmerReq', { headers })
        ]);
        setAllListings(listingsRes.data.data);
        setAdminDealRequests(dealRequestsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = listing.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Log the requests to see what verdicts we have
  console.log('All admin deal requests (detailed):', JSON.stringify(adminDealRequests, null, 2));

  const pendingRequests = adminDealRequests.filter(req => req && (!req.verdict || req.verdict === 'Pending'));
  const acceptedRequests = adminDealRequests.filter(req => req && req.verdict === 'Accepted');

  console.log('Pending requests (detailed):', JSON.stringify(pendingRequests, null, 2));
  console.log('Accepted requests (detailed):', JSON.stringify(acceptedRequests, null, 2));

  const pendingCount = pendingRequests.length;
  const activeCount = allListings.length;
  const acceptedDealCount = acceptedRequests.length;

  const handleAction = async (listing: ProductListing | FarmerRequest, type: 'approve' | 'reject' | 'feature' | 'archive') => {
    setSelectedListing(listing);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const handleDeleteClick = (listing: ProductListing) => {
    setDeleteTarget(listing);
    setDeleteReason('');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const headers = getAuthHeaders();
      // axios.delete accepts body data via config.data
      await axios.delete('http://127.0.0.1:8000/api/v1/admin/deal/farmerReq', {
        headers,
        data: {
          ID: deleteTarget._id,
          // include reason as an optional field; backend should ignore if not used
          Reason: deleteReason || undefined,
        },
      });

      // Remove from local state so UI updates immediately
      setAllListings((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      // Optionally refresh deal requests if relevant
      const headersForRefresh = getAuthHeaders();
      try {
        const dealRequestsRes = await axios.get('http://127.0.0.1:8000/api/v1/admin/deal/farmerReq', { headers: headersForRefresh });
        setAdminDealRequests(dealRequestsRes.data.data);
      } catch (e) {
        // non-fatal
        console.warn('Could not refresh admin deal requests after delete', e);
      }

      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      setDeleteReason('');
    } catch (error) {
      console.error('Error deleting listing:', error);
      // Minimal user feedback; could be replaced with a toast
      alert('Failed to delete listing. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmAction = async () => {
    if (!selectedListing || !actionType) return;

    try {
      if ((actionType === 'approve' || actionType === 'reject') && 'id' in selectedListing) {
        const headers = getAuthHeaders();
        await axios.patch(
          'http://127.0.0.1:8000/api/v1/admin/deal/farmerReq',
          {
            product_ID: selectedListing.id._id,
            ID: selectedListing._id,
            verdict: actionType === 'approve' ? 'Accepted' : 'Rejected'
          },
          { headers }
        );
        // Refresh the data
        const dealRequestsRes = await axios.get('http://127.0.0.1:8000/api/v1/admin/deal/farmerReq', { headers });
        setAdminDealRequests(dealRequestsRes.data.data);
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }

    setActionDialogOpen(false);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Listings Moderation</h1>
        <p className="text-muted-foreground">Review and moderate farmer product listings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Listings</p>
          <p className="text-foreground">{allListings.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending Admin Deals</p>
          <p className="text-secondary">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Listings</p>
          <p className="text-primary">{activeCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Accepted Admin Deals</p>
          <p className="text-primary">{acceptedDealCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
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
              All Listings
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
              Accepted Admin Deals ({acceptedDealCount})
            </Button>
          </div>
        </div>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adminDealFilter === 'all' ? (
          // Show all listings
          filteredListings.map((listing) => (
            <Card key={listing._id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-foreground">{listing.product_name}</h3>
                      {listing.admin_deal && (
                        <Star className="w-5 h-5 text-primary fill-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {listing.user_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="text-sm text-foreground">{listing.currency} {listing.price_per_unit}/{listing.quantity_unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                    <p className="text-sm text-foreground">{listing.product_quantity} {listing.quantity_unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Available From</p>
                    <p className="text-sm text-foreground">{new Date(listing.from).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Available To</p>
                    <p className="text-sm text-foreground">{new Date(listing.to).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteClick(listing)}
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
          // Show admin deal requests based on filter
          adminDealRequests
            .filter(req => adminDealFilter === 'requested' ? (!req.verdict || req.verdict === 'Pending') : req.verdict === 'Accepted')
            .map((request) => (
              <Card key={request._id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-foreground">
                          {request.id ? request.id.product_name : 'Product Name Not Available'}
                        </h3>
                        <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                          {request.verdict || 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.user_type}</p>
                    </div>
                  </div>

                  {request.id ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                        <p className="text-sm text-foreground">
                          {request.id.currency} {request.id.price_per_unit}/{request.id.quantity_unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                        <p className="text-sm text-foreground">
                          {request.id.product_quantity} {request.id.quantity_unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Request Date</p>
                        <p className="text-sm text-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Product details not available
                    </div>
                  )}

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
              {actionType === 'approve' && 'Approve Listing'}
              {actionType === 'reject' && 'Reject Listing'}
              {actionType === 'feature' && 'Feature as Admin Deal'}
              {actionType === 'archive' && 'Archive Listing'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'approve' && `Approve "${selectedListing && 'id' in selectedListing ? selectedListing.id.product_name : selectedListing?.product_name}"?`}
              {actionType === 'reject' && `Reject "${selectedListing && 'id' in selectedListing ? selectedListing.id.product_name : selectedListing?.product_name}"? The farmer will be notified.`}
              {actionType === 'feature' && `Feature "${selectedListing && 'id' in selectedListing ? selectedListing.id.product_name : selectedListing?.product_name}" as an admin deal?`}
              {actionType === 'archive' && `Archive "${selectedListing && 'id' in selectedListing ? selectedListing.id.product_name : selectedListing?.product_name}"?`}
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
            <DialogTitle className="text-foreground">Delete Listing</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to permanently delete "{deleteTarget?.product_name}"? You may optionally provide a reason below. This action cannot be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
