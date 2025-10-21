import React, { useState, useEffect } from "react";
import FarmerSidebar from "./FarmerSidebar";
import { useUser } from "../context/UserContext";
import axios from "axios";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  // Determine background color based on status
  const getStatusColor = (status) => {
    if (!status) return "";

    switch (status.toLowerCase()) {
      case "rejected":
        return "bg-red-50 border-l-4 border-red-500";
      case "accepted":
        return "bg-green-50 border-l-4 border-green-500";
      default:
        return "bg-white";
    }
  };

  // Determine text color based on status
  const getStatusTextColor = (status) => {
    if (!status) return "text-gray-600";

    switch (status.toLowerCase()) {
      case "rejected":
        return "text-red-600";
      case "accepted":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      onClick={() => onMarkAsRead(notification._id)}
      className={`flex items-start p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${getStatusColor(
        notification.status
      )} border-b border-gray-100`}
    >
      <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center">
        <span className="text-xl font-bold text-gray-600">
          {notification.status ? notification.status.charAt(0) : "N"}
        </span>
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Notification</h3>
            <p
              className={`text-sm mt-1 ${getStatusTextColor(
                notification.status
              )}`}
            >
              Status: {notification.status || "Pending"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Bid ID: {notification.bidInfo}
            </p>
            <p className="text-xs text-gray-500">
              Request ID: {notification.reqInfo}
            </p>
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

const FarmerNotification = () => {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/farmAlert/${user.user_id}`
        );

        if (response.data && response.data.status === "success") {
          setNotifications(response.data.data);
        } else {
          setNotifications([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = (id) => {
    // In a real application, you would call an API to mark the notification as read
    setNotifications(
      notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    // In a real application, you would call an API to mark all notifications as read
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="flex h-screen font-sans antialiased text-gray-800 bg-gray-50">
      <FarmerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1">
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
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 mx-auto max-w-md text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-xl">
                  No notifications found
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
};

export default FarmerNotification;
