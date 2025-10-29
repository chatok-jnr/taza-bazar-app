import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  Gavel, 
  AlertTriangle, 
  Megaphone, 
  FileCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'listings', label: 'Listings', icon: Package },
  { id: 'requests', label: 'Requests', icon: FileText },
  { id: 'bids', label: 'Bids', icon: Gavel },
  { id: 'reports', label: 'Reports', icon: AlertTriangle },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'audit', label: 'Audit Logs', icon: FileCheck },
];

export function AdminLayout({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card neon-border hover:neon-glow-sm transition-all duration-300"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center neon-glow-sm">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-primary">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Marketplace Control</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/20 text-primary neon-glow-sm scale-105'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center neon-glow-sm overflow-hidden">
              <span className="text-primary">SA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@marketplace.com</p>
            </div>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </div>
  );
}
