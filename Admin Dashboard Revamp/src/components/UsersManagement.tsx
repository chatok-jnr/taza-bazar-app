import { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, Ban, RefreshCw, UserCheck, Edit } from 'lucide-react';
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

const mockUsers = [
  { id: 1, name: 'John Farmer', email: 'john@farm.com', phone: '+1234567890', role: 'farmer', status: 'active', verified: true, listings: 12, requests: 0, joinedDate: '2024-01-15' },
  { id: 2, name: 'Jane Consumer', email: 'jane@consumer.com', phone: '+1234567891', role: 'consumer', status: 'active', verified: true, listings: 0, requests: 8, joinedDate: '2024-02-20' },
  { id: 3, name: 'Mike Buyer', email: 'mike@buyer.com', phone: '+1234567892', role: 'buyer', status: 'active', verified: false, listings: 0, requests: 5, joinedDate: '2024-03-10' },
  { id: 4, name: 'Sarah Dairy', email: 'sarah@dairy.com', phone: '+1234567893', role: 'farmer', status: 'suspended', verified: true, listings: 23, requests: 0, joinedDate: '2023-12-05' },
  { id: 5, name: 'Tom Market', email: 'tom@market.com', phone: '+1234567894', role: 'buyer', status: 'active', verified: true, listings: 0, requests: 15, joinedDate: '2024-04-01' },
];

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'verify' | 'promote' | null>(null);
  const [actionReason, setActionReason] = useState('');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAction = (user: typeof mockUsers[0], type: 'suspend' | 'verify' | 'promote') => {
    setSelectedUser(user);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Action: ${actionType} on user ${selectedUser?.email} with reason: ${actionReason}`);
    setActionDialogOpen(false);
    setActionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage and moderate platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Total Users</p>
          <p className="text-foreground">12,847</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Verified Users</p>
          <p className="text-primary">10,234</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Suspended</p>
          <p className="text-destructive">127</p>
        </Card>
        <Card className="p-4 bg-card neon-border">
          <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
          <p className="text-secondary">89</p>
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
              variant={selectedRole === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('all')}
              className={selectedRole === 'all' ? 'neon-glow-sm' : ''}
            >
              All
            </Button>
            <Button
              variant={selectedRole === 'farmer' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('farmer')}
              className={selectedRole === 'farmer' ? 'neon-glow-sm' : ''}
            >
              Farmers
            </Button>
            <Button
              variant={selectedRole === 'consumer' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('consumer')}
              className={selectedRole === 'consumer' ? 'neon-glow-sm' : ''}
            >
              Consumers
            </Button>
            <Button
              variant={selectedRole === 'buyer' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('buyer')}
              className={selectedRole === 'buyer' ? 'neon-glow-sm' : ''}
            >
              Buyers
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6 bg-card neon-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">User</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Contact</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Role</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Activity</th>
                <th className="text-left py-4 px-4 text-sm text-muted-foreground">Joined</th>
                <th className="text-right py-4 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow-sm">
                        <span className="text-primary text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{user.name}</p>
                        {user.verified && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <UserCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'farmer' ? 'bg-primary/20 text-primary' :
                      user.role === 'consumer' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.status === 'active' ? 'bg-primary/20 text-primary' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-foreground">{user.listings} listings</p>
                    <p className="text-xs text-muted-foreground">{user.requests} requests</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {user.joinedDate}
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
                            Verify User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(user, 'suspend')} className="hover:bg-destructive/10 cursor-pointer">
                            <Ban className="w-4 h-4 mr-2" />
                            {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'} User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(user, 'promote')} className="hover:bg-secondary/10 cursor-pointer">
                            <Shield className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
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
              {actionType === 'suspend' && 'Suspend User'}
              {actionType === 'verify' && 'Verify User'}
              {actionType === 'promote' && 'Promote to Admin'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {actionType === 'suspend' && `Are you sure you want to ${selectedUser?.status === 'suspended' ? 'unsuspend' : 'suspend'} ${selectedUser?.name}?`}
              {actionType === 'verify' && `Verify ${selectedUser?.name}'s account?`}
              {actionType === 'promote' && `Promote ${selectedUser?.name} to admin role?`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (required for audit)</Label>
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
            <Button onClick={confirmAction} disabled={!actionReason.trim()} className="neon-glow-sm">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
