import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
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

const mockRequests = [
  { id: 1, title: 'Need Fresh Vegetables for Restaurant', consumer: 'Jane Consumer', category: 'Vegetables', quantity: 200, unit: 'kg', budget: 9000, deadline: '2025-11-01', status: 'pending', bidsCount: 5, dateCreated: '2025-10-23' },
  { id: 2, title: 'Bulk Order: Dairy Products', consumer: 'Tom Market', category: 'Dairy', quantity: 500, unit: 'liter', budget: 17500, deadline: '2025-10-30', status: 'active', bidsCount: 12, dateCreated: '2025-10-22' },
  { id: 3, title: 'Premium Rice for Export', consumer: 'Mike Buyer', category: 'Grains', quantity: 5000, unit: 'kg', budget: 600000, deadline: '2025-11-15', status: 'pending', bidsCount: 3, dateCreated: '2025-10-24' },
  { id: 4, title: 'Organic Wheat Supply', consumer: 'Sarah Store', category: 'Grains', quantity: 1000, unit: 'kg', budget: 55000, deadline: '2025-11-05', status: 'active', bidsCount: 8, dateCreated: '2025-10-21' },
  { id: 5, title: 'Fresh Eggs - Weekly Supply', consumer: 'Bob Restaurant', category: 'Poultry', quantity: 100, unit: 'dozen', budget: 800, deadline: '2025-10-28', status: 'rejected', bidsCount: 2, dateCreated: '2025-10-20' },
];

export function RequestsModeration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.consumer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockRequests.filter(r => r.status === 'pending').length;
  const activeCount = mockRequests.filter(r => r.status === 'active').length;
  const rejectedCount = mockRequests.filter(r => r.status === 'rejected').length;

  const handleAction = (request: typeof mockRequests[0], type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Action: ${actionType} on request ${selectedRequest?.title} with reason: ${actionReason}`);
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
          <p className="text-foreground">{mockRequests.length}</p>
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
              placeholder="Search requests..."
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

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">by {request.consumer}</p>
                </div>
                <Badge className={
                  request.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                  request.status === 'active' ? 'bg-primary/20 text-primary' :
                  'bg-destructive/20 text-destructive'
                }>
                  {request.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm text-foreground">{request.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Budget</p>
                  <p className="text-sm text-foreground">${request.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                  <p className="text-sm text-foreground">{request.quantity} {request.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                  <p className="text-sm text-foreground">{request.deadline}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Bids Received</p>
                  <p className="text-sm text-primary">{request.bidsCount} bids</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date Created</p>
                  <p className="text-sm text-foreground">{request.dateCreated}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {request.status === 'pending' && (
                  <>
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
                  </>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border hover:border-primary/50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
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
              {actionType === 'approve' && 'Approve Request'}
              {actionType === 'reject' && 'Reject Request'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'approve' && `Approve "${selectedRequest?.title}"?`}
              {actionType === 'reject' && `Reject "${selectedRequest?.title}"? The consumer will be notified.`}
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
