import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
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

const mockReports = [
  { id: 1, type: 'listing', reportedItem: 'Fake Organic Tomatoes', reportedBy: 'Jane Consumer', reportedUser: 'Suspicious Seller', reason: 'Misleading product description', evidence: 'Product received was not organic as advertised', status: 'pending', priority: 'high', submittedDate: '2025-10-24 10:30', sla: '2h remaining' },
  { id: 2, type: 'user', reportedItem: 'john.spammer@email.com', reportedBy: 'Mike Buyer', reportedUser: 'john.spammer@email.com', reason: 'Spam messaging', evidence: 'Sent unsolicited messages to multiple users', status: 'under_review', priority: 'medium', submittedDate: '2025-10-23 14:20', sla: 'Overdue by 1h' },
  { id: 3, type: 'request', reportedItem: 'Suspicious Bulk Order', reportedBy: 'Sarah Farmer', reportedUser: 'Fake Buyer', reason: 'Suspected scam', evidence: 'Request details seem fraudulent, asking for advance payment', status: 'pending', priority: 'high', submittedDate: '2025-10-24 09:15', sla: '3h remaining' },
  { id: 4, type: 'bid', reportedItem: 'Unrealistic bid on Premium Rice', reportedBy: 'Tom Market', reportedUser: 'Price Manipulator', reason: 'Price manipulation', evidence: 'Bid is significantly below market value', status: 'resolved', priority: 'low', submittedDate: '2025-10-22 16:00', sla: 'Resolved' },
  { id: 5, type: 'user', reportedItem: 'abusive.user@email.com', reportedBy: 'Alice Consumer', reportedUser: 'abusive.user@email.com', reason: 'Harassment', evidence: 'Sent threatening messages after bid rejection', status: 'resolved', priority: 'high', submittedDate: '2025-10-21 11:30', sla: 'Resolved' },
];

export function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'dismiss' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionDecision, setActionDecision] = useState('');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockReports.filter(r => r.status === 'pending').length;
  const underReviewCount = mockReports.filter(r => r.status === 'under_review').length;
  const resolvedCount = mockReports.filter(r => r.status === 'resolved').length;

  const handleAction = (report: typeof mockReports[0], type: 'resolve' | 'dismiss') => {
    setSelectedReport(report);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Action: ${actionType} on report ${selectedReport?.id} with decision: ${actionDecision}, reason: ${actionReason}`);
    setActionDialogOpen(false);
    setActionReason('');
    setActionDecision('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Trust & Safety Reports</h1>
        <p className="text-muted-foreground">Review and moderate user-reported content and behavior</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
          <p className="text-foreground">{mockReports.length}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-destructive">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Under Review</p>
          <p className="text-secondary">{underReviewCount}</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-primary">{resolvedCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
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
              variant={selectedStatus === 'under_review' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('under_review')}
              className={selectedStatus === 'under_review' ? 'neon-glow-sm' : ''}
            >
              Under Review
            </Button>
            <Button
              variant={selectedStatus === 'resolved' ? 'default' : 'outline'}
              onClick={() => setSelectedStatus('resolved')}
              className={selectedStatus === 'resolved' ? 'neon-glow-sm' : ''}
            >
              Resolved
            </Button>
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="p-6 bg-card neon-border hover:neon-glow-sm transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      report.priority === 'high' ? 'text-destructive' :
                      report.priority === 'medium' ? 'text-secondary' :
                      'text-muted-foreground'
                    }`} />
                    <h3 className="text-foreground">{report.reportedItem}</h3>
                    <Badge className={
                      report.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                      report.priority === 'medium' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }>
                      {report.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Type: <span className="text-foreground">{report.type}</span></span>
                    <span>•</span>
                    <span>Reported by: <span className="text-foreground">{report.reportedBy}</span></span>
                    <span>•</span>
                    <span>Reported user: <span className="text-foreground">{report.reportedUser}</span></span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={
                    report.status === 'pending' ? 'bg-secondary/20 text-secondary' :
                    report.status === 'under_review' ? 'bg-primary/20 text-primary' :
                    'bg-primary/20 text-primary'
                  }>
                    {report.status === 'under_review' ? 'Under Review' : report.status}
                  </Badge>
                  <div className={`flex items-center gap-1 text-xs ${
                    report.sla.includes('Overdue') ? 'text-destructive' :
                    report.sla.includes('Resolved') ? 'text-primary' :
                    'text-secondary'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{report.sla}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm text-foreground">{report.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Evidence</p>
                  <p className="text-sm text-foreground">{report.evidence}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Submitted Date</p>
                  <p className="text-sm text-foreground">{report.submittedDate}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {report.status !== 'resolved' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction(report, 'resolve')}
                      className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(report, 'dismiss')}
                      className="bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Dismiss
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
              {actionType === 'resolve' && 'Resolve Report'}
              {actionType === 'dismiss' && 'Dismiss Report'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'resolve' && `Take action on report: ${selectedReport?.reportedItem}`}
              {actionType === 'dismiss' && `Dismiss report: ${selectedReport?.reportedItem}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {actionType === 'resolve' && (
              <div className="space-y-2">
                <Label htmlFor="decision">Action Taken</Label>
                <Textarea
                  id="decision"
                  placeholder="Describe the action taken (e.g., User suspended, listing removed, warning issued)..."
                  value={actionDecision}
                  onChange={(e) => setActionDecision(e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason">Resolution Notes (required)</Label>
              <Textarea
                id="reason"
                placeholder="Enter detailed notes about your decision..."
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
              disabled={!actionReason.trim() || (actionType === 'resolve' && !actionDecision.trim())}
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
