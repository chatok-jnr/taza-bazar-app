import { useState } from 'react';
import { Megaphone, Send, Users, UserCheck, ShoppingBag, Edit, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const mockAnnouncements = [
  { id: 1, title: 'Platform Maintenance Scheduled', message: 'We will be performing maintenance on Oct 28 from 2-4 AM.', audience: 'all', sentBy: 'Admin A', sentDate: '2025-10-23 10:00', recipients: 12847 },
  { id: 2, title: 'New Features for Farmers', message: 'We have added bulk listing upload and analytics dashboard.', audience: 'farmer', sentBy: 'Admin B', sentDate: '2025-10-22 14:30', recipients: 5234 },
  { id: 3, title: 'Holiday Delivery Schedule', message: 'Please note adjusted delivery times during the holiday season.', audience: 'consumer', sentBy: 'Admin A', sentDate: '2025-10-21 09:15', recipients: 4567 },
  { id: 4, title: 'Price Update Guidelines', message: 'New pricing transparency requirements for all sellers.', audience: 'farmer', sentBy: 'Admin C', sentDate: '2025-10-20 16:00', recipients: 5234 },
];

export function Announcements() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [preview, setPreview] = useState(false);

  const handleSend = () => {
    console.log('Sending announcement:', { title, message, audience });
    // Reset form
    setTitle('');
    setMessage('');
    setAudience('all');
    setPreview(false);
  };

  const getAudienceCount = (aud: string) => {
    switch (aud) {
      case 'farmer': return 5234;
      case 'consumer': return 4567;
      case 'buyer': return 3046;
      default: return 12847;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Announcements</h1>
        <p className="text-muted-foreground">Broadcast messages to platform users</p>
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

      {/* Create Announcement */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
            <Megaphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground">Create New Announcement</h2>
            <p className="text-sm text-muted-foreground">Broadcast a message to selected user groups</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              placeholder="Enter announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your announcement message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-input-background border-border min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="bg-input-background border-border">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border neon-border">
                <SelectItem value="all">All Users (12,847)</SelectItem>
                <SelectItem value="farmer">Farmers Only (5,234)</SelectItem>
                <SelectItem value="consumer">Consumers Only (4,567)</SelectItem>
                <SelectItem value="buyer">Buyers Only (3,046)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {preview && (
            <Card className="p-4 bg-muted/30 border-primary/30 neon-border">
              <div className="flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="text-foreground mb-2">{title || 'Preview Title'}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{message || 'Your message will appear here...'}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>To: {audience === 'all' ? 'All Users' : audience.charAt(0).toUpperCase() + audience.slice(1) + 's'}</span>
                    <span>•</span>
                    <span>{getAudienceCount(audience)} recipients</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setPreview(!preview)}
              variant="outline"
              className="border-border hover:border-primary/50"
            >
              {preview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!title.trim() || !message.trim()}
              className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
          </div>
        </div>
      </Card>

      {/* Past Announcements */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-4">Past Announcements</h3>
        <div className="space-y-3">
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-foreground">{announcement.title}</h4>
                    <Badge className={
                      announcement.audience === 'all' ? 'bg-primary/20 text-primary' :
                      announcement.audience === 'farmer' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }>
                      {announcement.audience === 'all' ? 'All Users' : announcement.audience}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{announcement.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Sent by {announcement.sentBy}</span>
                    <span>•</span>
                    <span>{announcement.sentDate}</span>
                    <span>•</span>
                    <span>{announcement.recipients.toLocaleString()} recipients</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
