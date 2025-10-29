import {
  ShoppingCart,
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
    navigate("/");
  };

  // Updated sidebar items to match the routing structure used in other components
  const sidebarItems = [
    { name: "Dashboard", icon: Home, path: "/consumer" },
    { name: "My Requests", icon: FileText, path: "/consumer/requests" },
    { name: "Marketplace", icon: TrendingUp, path: "/consumer/marketplace" },
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
            onClick={() => navigate("/")}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveTab(item.path);
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-green-50 text-green-600 font-medium border border-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          {/* Consumer Badge */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Active Consumer
                </p>
                <p className="text-xs text-gray-600">Regular Member</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
