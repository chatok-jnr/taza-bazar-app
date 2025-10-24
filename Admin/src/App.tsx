import { useState } from 'react';
import { Login } from './components/Login';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './components/Dashboard';
import { UsersManagement } from './components/UsersManagement';
import { ListingsModeration } from './components/ListingsModeration';
import { RequestsModeration } from './components/RequestsModeration';
import { BidsControl } from './components/BidsControl';
import { Reports } from './components/Reports';
import { Announcements } from './components/Announcements';
import { Settings } from './components/Settings';
import { AuditLogs } from './components/AuditLogs';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (email: string, password: string) => {
    // In a real application, you would validate credentials with your backend
    // For demo purposes, we're accepting the mock credentials
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard'); // Reset to dashboard on logout
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersManagement />;
      case 'listings':
        return <ListingsModeration />;
      case 'requests':
        return <RequestsModeration />;
      case 'bids':
        return <BidsControl />;
      case 'reports':
        return <Reports />;
      case 'announcements':
        return <Announcements />;
      case 'settings':
        return <Settings />;
      case 'audit':
        return <AuditLogs />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show admin dashboard if authenticated
  return (
    <div className="min-h-screen bg-background">
      <AdminLayout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>
    </div>
  );
}
