import {
  Home,
  FileText,
  Bell,
  User,
  LogOut,
  TrendingUp,
  Award,
  Plus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function FarmerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Sidebar items for farmer dashboard
  const sidebarItems = [
    { name: "Dashboard", icon: Home, path: "/farmer" },
    { name: "My Listings", icon: FileText, path: "/farmer/listings" },
    { name: "Marketplace", icon: TrendingUp, path: "/farmer/marketplace" },
    { name: "Notifications", icon: Bell, path: "/farmer/notifications" },
    { name: "Announcements", icon: () => <div className="w-5 h-5 flex items-center justify-center">📢</div>, path: "/farmer/announcements" },
    { name: "Profile", icon: User, path: "/farmer/profile" },
  ];

  const handleNavigation = (item) => {
    // All items now navigate to dedicated pages
    navigate(item.path);
  };

  // Function to determine if a route is active based on current path
  const isActiveTab = (item) => {
    return location.pathname === item.path;
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
            <p className="text-sm text-gray-500 mt-1">Farmer Dashboard</p>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveTab(item);
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
          {/* Pro Seller Badge */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Pro Seller</p>
                <p className="text-xs text-gray-600">Level 2 Farmer</p>
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
