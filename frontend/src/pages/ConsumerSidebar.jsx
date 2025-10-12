import {
  ShoppingCart,
  MessageSquare,
  Bell,
  User,
  FileText,
  LogOut,
  Home,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ConsumerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Updated sidebar items to match the routing structure used in other components
  const sidebarItems = [
    { name: "Dashboard", icon: Home, path: "/consumer" },
    { name: "My Requests", icon: FileText, path: "/consumer/requests" },
    { name: "Marketplace", icon: TrendingUp, path: "/consumer/marketplace" },
    { name: "Messages", icon: MessageSquare, path: "/consumer/messages" },
    { name: "Notifications", icon: Bell, path: "/consumer/notifications" },
    { name: "Profile", icon: User, path: "/consumer/profile" },
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  // Function to determine if a tab is active based on current location
  const isActiveTab = (itemPath) => {
    return location.pathname === itemPath;
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-screen p-4">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <h2 className="text-2xl font-bold text-gray-800">TazaBazar</h2>
            <p className="text-sm text-gray-500">Consumer Dashboard</p>
          </button>
        </div>
        <nav className="space-y-2 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                isActiveTab(item.path)
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}