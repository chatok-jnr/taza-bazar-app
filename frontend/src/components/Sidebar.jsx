import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FileText, ShoppingCart, User, MessageSquare, Bell, LogOut, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const { userRole, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const consumerItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/consumer' },
    { name: 'Marketplace', icon: ShoppingCart, path: '/marketplace' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const farmerItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/farmer' },
    { name: 'Marketplace', icon: ShoppingCart, path: '/marketplace' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  const menuItems = userRole === 'consumer' ? consumerItems : farmerItems;

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 text-2xl font-bold text-green-600 border-b">
        TazaBazar
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <item.icon className="mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
