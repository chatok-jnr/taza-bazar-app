import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, TrendingUp } from 'lucide-react';
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

const mockBids = [
  { id: 1, farmer: 'John Farmer', request: 'Need Fresh Vegetables for Restaurant', product: 'Organic Tomatoes', pricePerUnit: 42, quantity: 200, unit: 'kg', totalValue: 8400, status: 'pending', submittedDate: '2025-10-24 09:30' },
  { id: 2, farmer: 'Sarah Dairy', request: 'Bulk Order: Dairy Products', product: 'Fresh Milk', pricePerUnit: 33, quantity: 500, unit: 'liter', totalValue: 16500, status: 'accepted', submittedDate: '2025-10-23 14:20' },
  { id: 3, farmer: 'Mike Farm', request: 'Premium Rice for Export', product: 'Basmati Rice', pricePerUnit: 115, quantity: 5000, unit: 'kg', totalValue: 575000, status: 'pending', submittedDate: '2025-10-24 11:45' },
  { id: 4, farmer: 'Tom Poultry', request: 'Fresh Eggs - Weekly Supply', product: 'Free Range Eggs', pricePerUnit: 7, quantity: 100, unit: 'dozen', totalValue: 700, status: 'rejected', submittedDate: '2025-10-22 16:10' },
  { id: 5, farmer: 'Jane Miller', request: 'Organic Wheat Supply', product: 'Wheat Flour', pricePerUnit: 52, quantity: 1000, unit: 'kg', totalValue: 52000, status: 'accepted', submittedDate: '2025-10-23 10:00' },
];

export function BidsControl() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBid, setSelectedBid] = useState<typeof mockBids[0] | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const filteredBids = mockBids.filter(bid => {
    const matchesSearch = bid.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bid.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || bid.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockBids.filter(b => b.status === 'pending').length;
  const acceptedCount = mockBids.filter(b => b.status === 'accepted').length;
  const rejectedCount = mockBids.filter(b => b.status === 'rejected').length;

  const handleAction = (bid: typeof mockBids[0], type: 'accept' | 'reject') => {
    setSelectedBid(bid);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Action: ${actionType} on bid ${selectedBid?.id} with reason: ${actionReason}`);
    setActionDialogOpen(false);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Bids Control</h1>
        <p className="text-muted-foreground">Monitor and manage farmer bids on consumer requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
          <p className="text-foreground">{mockBids.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-secondary">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Accepted</p>
          <p className="text-primary">{acceptedCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Rejected</p>
          <p className="text-destructive">{rejectedCount}</p>
        </Card>
      </div>

      {/* Guardrails Config */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-4">Bid Guardrails</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="minPrice">Min Price per Unit ($)</Label>
            <Input id="minPrice" type="number" defaultValue="5" className="mt-2 bg-input-background border-border" />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price per Unit ($)</Label>
            <Input id="maxPrice" type="number" defaultValue="500" className="mt-2 bg-input-background border-border" />
          </div>
          <div>
            <Label htmlFor="increment">Allowed Increment ($)</Label>
            <Input id="increment" type="number" defaultValue="1" className="mt-2 bg-input-background border-border" />
          </div>
        </div>
        <Button className="mt-4 neon-glow-sm">Save Guardrails</Button>
      </Card>

      {/* Filters */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search bids..."
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
              variant={selectedStatus === 'accepted' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('accepted')}
              className={selectedStatus === 'accepted' ? 'neon-glow-sm' : ''}
            >
              Accepted
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

      {/* Bids Table */}
      <Card className="p-6 bg-card neon-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Farmer</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Request</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Product</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Price/Unit</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Quantity</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Total Value</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Date</th>
                <th className="text-right py-4 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{bid.farmer}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground max-w-xs truncate">{bid.request}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{bid.product}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">${bid.pricePerUnit}/{bid.unit}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{bid.quantity} {bid.unit}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <p className="text-sm text-foreground">${bid.totalValue.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={
                      bid.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                      bid.status === 'accepted' ? 'bg-primary/20 text-primary' :
                      'bg-destructive/20 text-destructive'
                    }>
                      {bid.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-xs text-muted-foreground">{bid.submittedDate}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      {bid.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(bid, 'accept')}
                            className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(bid, 'reject')}
                            className="bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                        <Eye className="w-4 h-4" />
                      </Button>
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
              {actionType === 'accept' && 'Accept Bid'}
              {actionType === 'reject' && 'Reject Bid'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'accept' && `Accept bid from ${selectedBid?.farmer} for ${selectedBid?.product}?`}
              {actionType === 'reject' && `Reject bid from ${selectedBid?.farmer}? The farmer will be notified.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Product</p>
                  <p className="text-foreground">{selectedBid?.product}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Value</p>
                  <p className="text-primary">${selectedBid?.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
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
