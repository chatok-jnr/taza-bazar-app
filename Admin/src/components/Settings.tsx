import { useState } from 'react';
import { Settings as SettingsIcon, Save, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

const defaultCategories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Poultry', 'Livestock'];
const defaultUnits = ['kg', 'liter', 'dozen', 'ton', 'piece', 'bag'];

export function Settings() {
  const [categories, setCategories] = useState(defaultCategories);
  const [units, setUnits] = useState(defaultUnits);
  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [settings, setSettings] = useState({
    maxActiveListings: 10,
    maxActiveRequests: 5,
    bidMinPrice: 5,
    bidMaxPrice: 10000,
    requireApprovalForListings: true,
    requireApprovalForRequests: true,
    enableBroadcasts: true,
    autoExpireListings: true,
    listingExpiryDays: 30,
    requestExpiryDays: 14,
  });

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  const handleAddUnit = () => {
    if (newUnit.trim() && !units.includes(newUnit.trim())) {
      setUnits([...units, newUnit.trim()]);
      setNewUnit('');
    }
  };

  const handleRemoveUnit = (unit: string) => {
    setUnits(units.filter(u => u !== unit));
  };

  const handleSave = () => {
    console.log('Saving settings:', { categories, units, settings });
    // Save to backend
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-primary mb-2">Platform Settings</h1>
        <p className="text-muted-foreground">Configure marketplace rules and parameters</p>
      </div>

      {/* Categories Management */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground">Product Categories</h3>
            <p className="text-sm text-muted-foreground">Manage available product categories</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              className="bg-input-background border-border"
            />
            <Button onClick={handleAddCategory} className="neon-glow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30">
                <span className="text-sm text-primary">{category}</span>
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="text-primary hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Units Management */}
      <Card className="p-6 bg-card neon-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center cyan-glow">
            <SettingsIcon className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-foreground">Measurement Units</h3>
            <p className="text-sm text-muted-foreground">Manage available measurement units</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new unit..."
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUnit()}
              className="bg-input-background border-border"
            />
            <Button onClick={handleAddUnit} className="cyan-glow">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {units.map((unit) => (
              <div key={unit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/20 border border-secondary/30">
                <span className="text-sm text-secondary">{unit}</span>
                <button
                  onClick={() => handleRemoveUnit(unit)}
                  className="text-secondary hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* User Limits */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-6">User Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxListings">Max Active Listings per User</Label>
            <Input
              id="maxListings"
              type="number"
              value={settings.maxActiveListings}
              onChange={(e) => setSettings({ ...settings, maxActiveListings: parseInt(e.target.value) })}
              className="bg-input-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxRequests">Max Active Requests per User</Label>
            <Input
              id="maxRequests"
              type="number"
              value={settings.maxActiveRequests}
              onChange={(e) => setSettings({ ...settings, maxActiveRequests: parseInt(e.target.value) })}
              className="bg-input-background border-border"
            />
          </div>
        </div>
      </Card>

      {/* Bid Thresholds */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-6">Bid Price Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minPrice">Minimum Bid Price ($)</Label>
            <Input
              id="minPrice"
              type="number"
              value={settings.bidMinPrice}
              onChange={(e) => setSettings({ ...settings, bidMinPrice: parseInt(e.target.value) })}
              className="bg-input-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPrice">Maximum Bid Price ($)</Label>
            <Input
              id="maxPrice"
              type="number"
              value={settings.bidMaxPrice}
              onChange={(e) => setSettings({ ...settings, bidMaxPrice: parseInt(e.target.value) })}
              className="bg-input-background border-border"
            />
          </div>
        </div>
      </Card>

      {/* Feature Flags */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-6">Feature Flags</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex-1">
              <Label htmlFor="requireListingApproval">Require Approval for New Listings</Label>
              <p className="text-sm text-muted-foreground mt-1">All new listings must be approved by admin</p>
            </div>
            <Switch
              id="requireListingApproval"
              checked={settings.requireApprovalForListings}
              onCheckedChange={(checked) => setSettings({ ...settings, requireApprovalForListings: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex-1">
              <Label htmlFor="requireRequestApproval">Require Approval for New Requests</Label>
              <p className="text-sm text-muted-foreground mt-1">All new requests must be approved by admin</p>
            </div>
            <Switch
              id="requireRequestApproval"
              checked={settings.requireApprovalForRequests}
              onCheckedChange={(checked) => setSettings({ ...settings, requireApprovalForRequests: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex-1">
              <Label htmlFor="enableBroadcasts">Enable Broadcast Announcements</Label>
              <p className="text-sm text-muted-foreground mt-1">Allow admins to send platform-wide announcements</p>
            </div>
            <Switch
              id="enableBroadcasts"
              checked={settings.enableBroadcasts}
              onCheckedChange={(checked) => setSettings({ ...settings, enableBroadcasts: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex-1">
              <Label htmlFor="autoExpire">Auto-Expire Old Listings</Label>
              <p className="text-sm text-muted-foreground mt-1">Automatically archive listings after expiry period</p>
            </div>
            <Switch
              id="autoExpire"
              checked={settings.autoExpireListings}
              onCheckedChange={(checked) => setSettings({ ...settings, autoExpireListings: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Expiry Settings */}
      <Card className="p-6 bg-card neon-border">
        <h3 className="text-foreground mb-6">Auto-Expiry Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="listingExpiry">Listing Expiry (days)</Label>
            <Input
              id="listingExpiry"
              type="number"
              value={settings.listingExpiryDays}
              onChange={(e) => setSettings({ ...settings, listingExpiryDays: parseInt(e.target.value) })}
              className="bg-input-background border-border"
              disabled={!settings.autoExpireListings}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestExpiry">Request Expiry (days)</Label>
            <Input
              id="requestExpiry"
              type="number"
              value={settings.requestExpiryDays}
              onChange={(e) => setSettings({ ...settings, requestExpiryDays: parseInt(e.target.value) })}
              className="bg-input-background border-border"
              disabled={!settings.autoExpireListings}
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
