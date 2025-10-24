import { useState } from 'react';
import { Search, CheckCircle, XCircle, Star, Archive, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
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

const mockListings = [
  { id: 1, title: 'Organic Tomatoes - Premium Quality', farmer: 'John Farmer', category: 'Vegetables', price: 45, unit: 'kg', quantity: 500, status: 'pending', dateCreated: '2025-10-24', adminDeal: false },
  { id: 2, title: 'Fresh Milk - Daily Supply', farmer: 'Sarah Dairy', category: 'Dairy', price: 35, unit: 'liter', quantity: 200, status: 'active', dateCreated: '2025-10-23', adminDeal: true },
  { id: 3, title: 'Premium Rice - Basmati', farmer: 'Mike Farm', category: 'Grains', price: 120, unit: 'kg', quantity: 1000, status: 'pending', dateCreated: '2025-10-24', adminDeal: false },
  { id: 4, title: 'Free Range Eggs', farmer: 'Tom Poultry', category: 'Poultry', price: 8, unit: 'dozen', quantity: 500, status: 'active', dateCreated: '2025-10-22', adminDeal: false },
  { id: 5, title: 'Organic Wheat Flour', farmer: 'Jane Miller', category: 'Grains', price: 55, unit: 'kg', quantity: 750, status: 'rejected', dateCreated: '2025-10-21', adminDeal: false },
];

export function ListingsModeration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<typeof mockListings[0] | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'feature' | 'archive' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || listing.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockListings.filter(l => l.status === 'pending').length;
  const activeCount = mockListings.filter(l => l.status === 'active').length;
  const rejectedCount = mockListings.filter(l => l.status === 'rejected').length;

  const handleAction = (listing: typeof mockListings[0], type: 'approve' | 'reject' | 'feature' | 'archive') => {
    setSelectedListing(listing);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Action: ${actionType} on listing ${selectedListing?.title} with reason: ${actionReason}`);
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
          <p className="text-foreground">{mockListings.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-secondary">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-primary">{activeCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Rejected</p>
          <p className="text-destructive">{rejectedCount}</p>
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
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('all')}
              className={selectedStatus === 'all' ? 'neon-glow-sm' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('pending')}
              className={selectedStatus === 'pending' ? 'neon-glow-sm' : ''}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={selectedStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('active')}
              className={selectedStatus === 'active' ? 'neon-glow-sm' : ''}
            >
              Active
            </Button>
            <Button
              variant={selectedStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('rejected')}
              className={selectedStatus === 'rejected' ? 'neon-glow-sm' : ''}
            >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-foreground">{listing.title}</h3>
                    {listing.adminDeal && (
                      <Star className="w-5 h-5 text-primary fill-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">by {listing.farmer}</p>
                </div>
                <Badge className={
                  listing.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                  listing.status === 'active' ? 'bg-primary/20 text-primary' :
                  'bg-destructive/20 text-destructive'
                }>
                  {listing.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm text-foreground">{listing.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-sm text-foreground">${listing.price}/{listing.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                  <p className="text-sm text-foreground">{listing.quantity} {listing.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date Created</p>
                  <p className="text-sm text-foreground">{listing.dateCreated}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {listing.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction(listing, 'approve')}
                      className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(listing, 'reject')}
                      className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {listing.status === 'active' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(listing, 'feature')}
                      className="flex-1"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {listing.adminDeal ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(listing, 'archive')}
                      className="flex-1"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:border-primary/50"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
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
              {actionType === 'approve' && `Approve "${selectedListing?.title}"?`}
              {actionType === 'reject' && `Reject "${selectedListing?.title}"? The farmer will be notified.`}
              {actionType === 'feature' && `Feature "${selectedListing?.title}" as an admin deal?`}
              {actionType === 'archive' && `Archive "${selectedListing?.title}"?`}
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
    </div>
  );
}
