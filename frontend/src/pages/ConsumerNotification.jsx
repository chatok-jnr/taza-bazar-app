import React, { useState } from "react";
import ConsumerSidebar from "./ConsumerSidebar";

const NotificationItem = ({ notification, onMarkAsRead }) => (
  <div
    onClick={() => onMarkAsRead(notification.id)}
    className={`flex items-start p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
      !notification.read ? "bg-green-50" : "bg-white"
    } border-b border-gray-100`}
  >
    <img
      src={notification.avatar}
      alt={notification.title}
      className="w-12 h-12 rounded-full"
    />
    <div className="ml-4 flex-grow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        </div>
        <div className="flex items-center">
          {!notification.read && (
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          )}
          <span className="text-xs text-gray-500">
            {notification.timestamp}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default function ConsumerNotification() {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Offer Accepted",
      message: "Your offer for 3kg Tomatoes has been accepted by the farmer",
      timestamp: "2 minutes ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      read: false,
    },
    {
      id: 2,
      title: "Order Status Update",
      message: "Your order #456 is ready for pickup",
      timestamp: "1 hour ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      read: false,
    },
    {
      id: 3,
      title: "Payment Confirmation",
      message: "Payment of 350Tk sent successfully for order #456",
      timestamp: "2 hours ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
      read: false,
    },
    {
      id: 4,
      title: "New Response",
      message: "Farmer responded to your inquiry about organic vegetables",
      timestamp: "Yesterday",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
      read: true,
    },
    {
      id: 5,
      title: "Special Offer",
      message: "New seasonal vegetables available at discount prices",
      timestamp: "2 days ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705e",
      read: true,
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
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
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
