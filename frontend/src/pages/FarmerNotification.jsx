import React, { useState, useEffect } from "react";
import FarmerSidebar from "./FarmerSidebar";
import { useUser } from "../context/UserContext";
import axios from "axios";

// Modal component for detailed notification view
const NotificationDetailModal = ({ notification, isOpen, onClose }) => {
  if (!isOpen || !notification) return null;

  const { bidInfo, reqInfo, status } = notification;
  const isAccepted = status === "Accepted";
  
  // Handler to close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Bid Details - {status}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <span className="text-xl font-bold">{isAccepted ? "✓" : "✗"}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  <span className={`${isAccepted ? 'text-green-700' : 'text-red-700'}`}>{status}</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Your bid has been {status.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Bid Information */}
          {bidInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Bid Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bid Price</p>
                  <p className="font-semibold text-lg">{bidInfo.price_per_unit} BDT</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-semibold text-lg">{bidInfo.quantity} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-lg">{bidInfo.farm_location}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Your Message</p>
                  <p className="font-medium">{bidInfo.message || "No message provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bid Submitted</p>
                  <p className="font-medium">{new Date(bidInfo.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(bidInfo.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Request Information */}
          {reqInfo && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Request Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="font-semibold text-lg">{reqInfo.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per Unit</p>
                  <p className="font-semibold text-lg">{reqInfo.price_per_unit} {reqInfo.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested Quantity</p>
                  <p className="font-semibold text-lg">{reqInfo.product_quantity} {reqInfo.quantity_unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin Deal</p>
                  <p className="font-semibold text-lg">{reqInfo.admin_deal ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Needed By</p>
                  <p className="font-medium">{new Date(reqInfo.when).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{reqInfo.request_description || "No description provided"}</p>
                </div>
              </div>
            </div>
          )}

          {/* If no request info available */}
          {!reqInfo && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800">
                Request information is not available for this notification.
              </p>
            </div>
          )}

          {/* Total Calculation */}
          {bidInfo && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-green-600">
                  {bidInfo.price_per_unit * bidInfo.quantity} BDT
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {bidInfo.quantity} kg × {bidInfo.price_per_unit} BDT per kg
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, onViewDetails }) => {
  const isAccepted = notification.status === "Accepted";
  const isRead = notification.read === true;
  
  // Use blue-50 as the default unread notification color, white for read notifications
  const bgColor = isRead ? "bg-white" : "bg-blue-50 border-blue-100";
  
  // Keep status colors for the small badge
  const statusColor = isAccepted ? "text-green-700" : "text-red-700";
  const statusBgColor = isAccepted ? "bg-green-100" : "bg-red-100";

  const handleClick = (e) => {
    e.preventDefault();
    onViewDetails(notification);
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    onMarkAsRead(notification._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${bgColor} border-b`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        <span className="text-lg font-semibold">
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
            {notification.bidInfo && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Amount:</span> {notification.bidInfo.price_per_unit} BDT × {notification.bidInfo.quantity} kg
                </p>
                {notification.reqInfo && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Product:</span> {notification.reqInfo.product_name}
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center mt-2 space-x-2">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColor} ${statusBgColor}`}>
                {notification.status}
              </span>
              {!notification.read && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors duration-150"
                >
                  Mark as read
                </button>
              )}
              {notification.read && (
                <span className="text-xs text-gray-500 px-2">Read</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            <span className="text-xs text-blue-600 mt-1 font-medium">
              Click for details →
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
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, getToken } = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user.user_id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://taza-bazar-admin.onrender.com/api/v1/farmAlert/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.status === "success") {
          // Ensure all notifications have a read property
          const notificationsWithReadStatus = response.data.data.map(notification => ({
            ...notification,
            read: notification.read || false // Set default read status to false if not present
          }));
          setNotifications(notificationsWithReadStatus);
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

  const handleMarkAsRead = async (id) => {
    // In a real application, you would call an API to mark the notification as read
    // For now, we're just updating the local state
    setNotifications(
      notifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
    
    // You could implement an API call here:
    // try {
    //   const token = getToken();
  //   await axios.patch(`https://taza-bazar-admin.onrender.com/api/v1/farmAlert/${id}/markAsRead`, {}, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   });
    // } catch (err) {
    //   console.error("Error marking notification as read:", err);
    // }
  };

  const handleMarkAllAsRead = async () => {
    // In a real application, you would call an API to mark all notifications as read
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
    
    // You could implement an API call here:
    // try {
    //   const token = getToken();
  //   await axios.patch(`https://taza-bazar-admin.onrender.com/api/v1/farmAlert/markAllAsRead`, 
    //     { userId: user.user_id },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // } catch (err) {
    //   console.error("Error marking all notifications as read:", err);
    // }
  };
  
  const handleViewDetails = (notification) => {
    // Mark as read when viewing details
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <FarmerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium rounded-md mt-1">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              )}
            </div>
            <button
              onClick={handleMarkAllAsRead}
              disabled={notifications.every(n => n.read)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                notifications.some(n => !n.read) 
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
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
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default FarmerNotification;
