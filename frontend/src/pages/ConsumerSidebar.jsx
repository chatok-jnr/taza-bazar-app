import {
  ShoppingCart,
  MessageSquare,
  Bell,
  User,
  FileText,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConsumerSidebar({ activeTab }) {
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "My Requests", icon: ShoppingCart, path: "/consumer" },
    { name: "Marketplace", icon: FileText, path: "/consumer/marketplace" },
    { name: "Messages", icon: MessageSquare, path: "/consumer/messages" },
    { name: "Notifications", icon: Bell, path: "/consumer/notifications" },
    { name: "Profile", icon: User, path: "/consumer/profile" },
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-screen p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-600">TazaBazar</h2>
          <p className="text-sm text-gray-600">Consumer Dashboard</p>
        </div>
        <nav className="space-y-2 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex items-center w-full px-4 py-2 text-left rounded-lg ${
                activeTab === item.name
                  ? "bg-green-100 text-green-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="flex items-center w-full px-4 py-2 text-left rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}