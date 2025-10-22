import React, { useState, useEffect } from "react";
import ConsumerSidebar from "./ConsumerSidebar";
import { useUser } from "../context/UserContext";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const isAccepted = notification.status === "Accepted";
  const bgColor = isAccepted ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const statusColor = isAccepted ? "text-green-700" : "text-red-700";
  const statusBgColor = isAccepted ? "bg-green-100" : "bg-red-100";

  return (
    <div
      onClick={() => onMarkAsRead(notification._id)}
      className={`flex items-start p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${bgColor} border-b`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-600">
          {isAccepted ? "✓" : "✗"}
        </span>
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Bid {notification.status}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Your bid has been {notification.status.toLowerCase()}
            </p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${statusColor} ${statusBgColor}`}>
              {notification.status}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ConsumerNotification() {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getToken } = useUser();

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || (!user._id && !user.user_id)) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const userId = user._id || user.user_id;
        const response = await fetch(`http://127.0.0.1:8000/api/v1/consumerAlert/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === "success") {
          setNotifications(data.data);
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ConsumerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors duration-200"
            >
              Mark all as read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Loading notifications...</span>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-red-600 text-center">
                  <p className="text-lg font-semibold">Error loading notifications</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-gray-500 text-center">
                  <p className="text-lg font-semibold">No notifications found</p>
                  <p className="text-sm">You don't have any notifications yet.</p>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
