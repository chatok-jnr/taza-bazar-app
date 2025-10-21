import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  MessageSquare,
  User,
  FileText,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  Bell,
  X,
  Save,
  Star,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import ConsumerSidebar from "./ConsumerSidebar";

// Main Consumer Requests Component
export default function ConsumerRequests() {
  const { user, getToken, logout, isLoading: userLoading } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Request Modal State
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    product_name: "",
    product_quantity: "",
    quantity_unit: "kg",
    price_per_unit: "",
    when: "",
    request_description: "",
    admin_deal: false,
  });

  // Delete Confirmation Modal State
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Edit Request Modal State
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editRequestForm, setEditRequestForm] = useState({
    product_name: "",
    product_quantity: "",
    quantity_unit: "kg",
    price_per_unit: "",
    when: "",
    request_description: "",
    admin_deal: false,
  });

  // Request Details Modal State
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] =
    useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestBids, setRequestBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  // Fetch consumer requests
  const fetchConsumerRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken && getToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      if (!user || !user.user_id) {
        setError("User information not found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/consumer/${user.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const requestsArray = data.data?.req || [];
        setRequests(requestsArray);
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to fetch requests");
        if (response.status === 401 || response.status === 403) {
          logout && logout();
        }
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new request
  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!user?.user_id) {
      setError("User not found. Please login again.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Prepare data for API
      const requestData = {
        ...newRequestForm,
        user_id: user.user_id,
        product_quantity: parseInt(newRequestForm.product_quantity),
        price_per_unit: parseFloat(newRequestForm.price_per_unit),
      };

      console.log("Creating new request:", requestData);

      const response = await fetch("http://127.0.0.1:8000/api/v1/consumer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Close modal and reset form
        setIsNewRequestModalOpen(false);
        setNewRequestForm({
          product_name: "",
          product_quantity: "",
          quantity_unit: "kg",
          price_per_unit: "",
          when: "",
          request_description: "",
          admin_deal: false,
        });

        // Refresh requests list
        await fetchConsumerRequests();
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setError("Network error. Please try again.");
    }
  };

  // Function to handle delete request click
  const handleDeleteRequest = (request) => {
    setRequestToDelete(request);
    setIsDeleteConfirmModalOpen(true);
  };

  // Function to confirm delete
  const confirmDeleteRequest = async () => {
    if (!requestToDelete) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      console.log("Deleting request with ID:", requestToDelete._id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/consumer/${requestToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Close modal and reset state
        setIsDeleteConfirmModalOpen(false);
        setRequestToDelete(null);

        // Refresh requests list
        await fetchConsumerRequests();
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to delete request");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      setError("Network error. Please try again.");
    } finally {
      // Close modal and reset state in case of error
      setIsDeleteConfirmModalOpen(false);
      setRequestToDelete(null);
    }
  };

  // Function to cancel delete
  const cancelDeleteRequest = () => {
    setIsDeleteConfirmModalOpen(false);
    setRequestToDelete(null);
  };

  // Function to handle edit request click
  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setEditRequestForm({
      product_name: request.product_name,
      product_quantity: request.product_quantity.toString(),
      quantity_unit: request.quantity_unit,
      price_per_unit: request.price_per_unit.toString(),
      when: request.when,
      request_description: request.request_description || "",
      admin_deal: request.admin_deal || false,
    });
    setIsEditRequestModalOpen(true);
  };

  // Function to handle manage request click (open details modal)
  const handleManageRequest = (request) => {
    setSelectedRequest(request);
    setIsRequestDetailsModalOpen(true);
    fetchRequestBids(request._id);
  };

  // Function to close request details modal
  const closeRequestDetailsModal = () => {
    setIsRequestDetailsModalOpen(false);
    setSelectedRequest(null);
    setRequestBids([]);
  };

  // Function to fetch bids for a specific request
  const fetchRequestBids = async (requestId) => {
    console.log("Fetching bids for request ID:", requestId);
    try {
      setBidsLoading(true);
      const token = getToken();

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/farmerBid/${requestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Fetch bids response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched bids data:", data);
        setRequestBids(data.data || []);
      } else {
        console.error("Failed to fetch bids, status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
        setRequestBids([]);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      setRequestBids([]);
    } finally {
      setBidsLoading(false);
    }
  };

  // Function to handle bid acceptance
  const handleAcceptBid = async (bid) => {
    console.log("Accept bid clicked:", bid);
    try {
      if (!bid || !bid._id) {
        console.error("No bid selected or bid ID missing");
        setError("Invalid bid information");
        return;
      }

      if (!selectedRequest || !selectedRequest._id) {
        console.error("No request selected or request ID missing");
        setError("Invalid request information");
        return;
      }

      const token = getToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Show confirmation before proceeding
      if (!window.confirm("Are you sure you want to accept this bid?")) {
        return;
      }

      console.log("Updating bid status to Accepted for bid ID:", bid._id);

      // First, update the bid status to "Accepted"
      const bidResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/farmerBid/${bid._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Accepted",
          }),
        }
      );

      if (!bidResponse.ok) {
        const errorData = await bidResponse.json().catch(() => ({}));
        console.error("Failed to accept bid:", errorData);
        setError(errorData.message || "Failed to accept bid");
        return;
      }

      console.log(
        "Bid accepted successfully, sending notification to farmer..."
      );

      // Send notification to farmer about bid acceptance using farmAlert endpoint
      const notificationResponse = await fetch(
        "http://127.0.0.1:8000/api/v1/farmAlert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: bid.farmer_id, // Farmer's ID who placed the bid
            bidInfo: bid._id, // Bid object ID
            reqInfo: selectedRequest._id, // Request object ID
            status: "Accepted",
          }),
        }
      );

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json().catch(() => ({}));
        console.error("Failed to send notification:", errorData);
        // Continue even if notification fails
      } else {
        console.log("Notification sent successfully to farmer");
      }

      // Calculate new quantity (reduce by bid quantity)
      const newQuantity = selectedRequest.product_quantity - bid.quantity;
      console.log("Original quantity:", selectedRequest.product_quantity);
      console.log("Bid quantity:", bid.quantity);
      console.log("New quantity:", newQuantity);

      // Update the request quantity
      const requestResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/consumer/${selectedRequest._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_quantity: newQuantity,
          }),
        }
      );

      if (!requestResponse.ok) {
        const errorData = await requestResponse.json().catch(() => ({}));
        console.error("Failed to update request quantity:", errorData);
        setError(errorData.message || "Failed to update request quantity");
        return;
      }

      console.log("Request quantity updated successfully, refreshing data...");

      // Update the selectedRequest state with new quantity
      setSelectedRequest((prev) => ({
        ...prev,
        product_quantity: newQuantity,
      }));

      // Refresh both bids and requests
      await fetchRequestBids(selectedRequest._id);
      await fetchConsumerRequests();
      setError("");
    } catch (error) {
      console.error("Error accepting bid:", error);
      setError("Network error. Please try again.");
    }
  };

  // Function to handle bid rejection
  const handleRejectBid = async (bid) => {
    console.log("Reject bid clicked:", bid);
    try {
      if (!bid || !bid._id) {
        console.error("No bid selected or bid ID missing");
        setError("Invalid bid information");
        return;
      }

      if (!selectedRequest || !selectedRequest._id) {
        console.error("No request selected or request ID missing");
        setError("Invalid request information");
        return;
      }

      const token = getToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Show confirmation before proceeding
      if (!window.confirm("Are you sure you want to reject this bid?")) {
        return;
      }

      console.log("Updating bid status to Rejected for bid ID:", bid._id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/farmerBid/${bid._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Rejected",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to reject bid:", errorData);
        setError(errorData.message || "Failed to reject bid");
        return;
      }

      console.log(
        "Bid rejected successfully, sending notification to farmer..."
      );

      // Send notification to farmer about bid rejection using farmAlert endpoint
      const notificationResponse = await fetch(
        "http://127.0.0.1:8000/api/v1/farmAlert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: bid.farmer_id, // Farmer's ID who placed the bid
            bidInfo: bid._id, // Bid object ID
            reqInfo: selectedRequest._id, // Request object ID
            status: "Rejected",
          }),
        }
      );

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json().catch(() => ({}));
        console.error("Failed to send notification:", errorData);
        // Continue even if notification fails
      } else {
        console.log("Notification sent successfully to farmer");
      }

      // Refresh bids to show updated status
      await fetchRequestBids(selectedRequest._id);
      setError("");
    } catch (error) {
      console.error("Error rejecting bid:", error);
      setError("Network error. Please try again.");
    }
  };

  // Function to update request
  const handleUpdateRequest = async (e) => {
    e.preventDefault();

    if (!editingRequest?._id) {
      setError("Request ID not found. Please try again.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Prepare data for API
      const requestData = {
        ...editRequestForm,
        product_quantity: parseInt(editRequestForm.product_quantity),
        price_per_unit: parseFloat(editRequestForm.price_per_unit),
      };

      console.log("Updating request:", requestData);

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/consumer/${editingRequest._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        // Close modal and reset form
        setIsEditRequestModalOpen(false);
        setEditingRequest(null);
        setEditRequestForm({
          product_name: "",
          product_quantity: "",
          quantity_unit: "kg",
          price_per_unit: "",
          when: "",
          request_description: "",
          admin_deal: false,
        });

        // Refresh requests list
        await fetchConsumerRequests();
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to update request");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      setError("Network error. Please try again.");
    }
  };

  // Fetch requests on mount and when user changes
  useEffect(() => {
    if (user && !userLoading) {
      fetchConsumerRequests();
    }
  }, [user, userLoading]);

  return (
    <div className="flex h-screen bg-gray-50">
      <ConsumerSidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  My Requests
                </h2>
                <p className="text-gray-600">Manage your product requests</p>
              </div>
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                + New Request
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your requests...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
              <button
                onClick={fetchConsumerRequests}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Requests Grid - Enhanced with Smaller Card Style */}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="group relative bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer transform hover:-translate-y-4 hover:rotate-1"
                  onClick={() => handleManageRequest(request)}
                >
                  {/* Enhanced Header Section with Dynamic Effects */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 overflow-hidden group-hover:from-orange-400 group-hover:via-red-400 group-hover:to-pink-400 transition-all duration-700">
                    {/* Dynamic background with multiple layers */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300 group-hover:animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-10 transform rotate-12 scale-150 group-hover:rotate-45 group-hover:scale-200 transition-transform duration-1000"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-white bg-opacity-20 rounded-full group-hover:scale-300 transition-transform duration-700"></div>
                    </div>

                    {/* Request Icon with enhanced 3D effects */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white border-opacity-30 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:bg-opacity-30">
                          <FileText className="w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        {/* Dynamic floating particles */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-100 group-hover:bg-pink-300 group-hover:scale-150 transition-all duration-500"></div>
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-300 rounded-full animate-bounce delay-300 group-hover:bg-purple-300 group-hover:scale-150 transition-all duration-500"></div>
                        <div className="absolute top-0 left-6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping group-hover:bg-orange-300 transition-colors duration-500"></div>
                      </div>
                    </div>

                    {/* Enhanced Status Badge with glow effect */}
                    <div className="absolute top-3 left-3 group-hover:scale-110 transition-transform duration-300">
                      <div
                        className={`px-3 py-1 text-xs font-bold rounded-xl shadow-lg border border-white border-opacity-30 backdrop-blur-sm flex items-center space-x-1 ${
                          request.status === "Active"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white group-hover:shadow-green-500/50 group-hover:shadow-xl"
                            : request.status === "Pending"
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white group-hover:shadow-yellow-500/50 group-hover:shadow-xl"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white group-hover:shadow-gray-500/50 group-hover:shadow-xl"
                        }`}
                      >
                        <span
                          className={
                            request.status === "Active"
                              ? "animate-pulse"
                              : request.status === "Pending"
                              ? "animate-spin"
                              : ""
                          }
                        >
                          {request.status === "Active"
                            ? "✓"
                            : request.status === "Pending"
                            ? "⏳"
                            : "●"}
                        </span>
                        <span>{request.status}</span>
                      </div>
                    </div>

                    {/* Admin Deal Badge */}
                    {request.admin_deal && (
                      <div className="absolute top-3 right-3 group-hover:bottom-4 group-hover:right-4 transition-all duration-500">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 text-xs font-bold rounded-xl shadow-lg border border-white border-opacity-30 backdrop-blur-sm flex items-center space-x-1 group-hover:scale-125 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-2xl">
                          <TrendingUp size={10} />
                          <span>Priority</span>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Price Badge with magnetic effect */}
                    <div className="absolute bottom-3 right-3 group-hover:bottom-4 group-hover:right-4 transition-all duration-500">
                      <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-xl border border-white border-opacity-50 group-hover:scale-125 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-2xl">
                        <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-500">
                          ৳{request.price_per_unit}
                        </span>
                      </div>
                    </div>

                    {/* Cool overlay effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Enhanced Content Section with slide-up effect */}
                  <div className="p-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-500">
                    {/* Title with cool text effect */}
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 leading-tight">
                      {request.product_name}
                    </h3>

                    {/* Enhanced Key Info with stagger animation */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between group-hover:transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                        <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                          <div className="w-4 h-4 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                            <Package size={10} className="text-green-600" />
                          </div>
                          <span className="font-medium">
                            Qty: {request.product_quantity}{" "}
                            {request.quantity_unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs text-gray-600 group-hover:transform group-hover:translate-x-1 transition-transform duration-300 delay-100">
                        <div className="w-4 h-4 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                          <DollarSign size={10} className="text-blue-600" />
                        </div>
                        <span className="font-medium">
                          Price: ৳{request.price_per_unit}/
                          {request.quantity_unit}
                        </span>
                      </div>

                      {/* Needed by date with slide effect */}
                      <div className="flex items-start space-x-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 group-hover:bg-gradient-to-r group-hover:from-gray-50 group-hover:to-blue-50 group-hover:transform group-hover:translate-x-1 transition-all duration-300 delay-150">
                        <div className="w-4 h-4 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                          <Calendar size={10} className="text-orange-600" />
                        </div>
                        <span className="leading-relaxed break-words font-medium">
                          Needed by:{" "}
                          {new Date(request.when).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Manage Request Button with magnetic effect */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManageRequest(request);
                      }}
                      className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-500 hover:to-purple-500 text-gray-700 hover:text-white px-3 py-3 rounded-xl text-xs font-bold transition-all duration-500 border border-gray-200 hover:border-transparent group-hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center space-x-2 group-hover:animate-pulse"
                    >
                      <span>Manage Request</span>
                      <svg
                        className="w-3 h-3 group-hover:translate-x-2 group-hover:scale-125 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Enhanced card glow with rainbow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 opacity-0 group-hover:opacity-30 transition-opacity duration-700 -z-10 blur-2xl group-hover:animate-pulse"></div>

                  {/* Sparkle effects */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-200"></div>
                  <div className="absolute bottom-8 left-4 w-1 h-1 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300 delay-400"></div>
                </div>
              ))}
            </div>
          )}

          {/* No Requests Message */}
          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No requests found</p>
              <p className="text-gray-500 mt-2">
                Create your first product request to get started
              </p>
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Request
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {isRequestDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Request Details
              </h3>
              <button
                onClick={closeRequestDetailsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Request Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedRequest.product_name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedRequest.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : selectedRequest.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

                {selectedRequest.admin_deal && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                    <TrendingUp className="w-3 h-3" />
                    Admin Deal
                  </div>
                )}
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">
                      Quantity
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedRequest.product_quantity}{" "}
                    {selectedRequest.quantity_unit}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">
                      Price per Unit
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ৳{selectedRequest.price_per_unit}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">
                      Needed By
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(selectedRequest.when).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-500">
                      Total Budget
                    </span>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    ৳
                    {(
                      selectedRequest.product_quantity *
                      selectedRequest.price_per_unit
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedRequest.request_description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRequest.request_description}
                    </p>
                  </div>
                </div>
              )}

              {/* Request Timeline */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Request Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Request ID</span>
                      <p className="font-medium text-gray-900">
                        {selectedRequest._id}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        Created Date
                      </span>
                      <p className="font-medium text-gray-900">
                        {selectedRequest.createdAt
                          ? new Date(
                              selectedRequest.createdAt
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Bids Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Farmer Bids
                </h4>

                {bidsLoading ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading bids...</p>
                  </div>
                ) : requestBids.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-lg font-medium">
                      No bid has been placed yet
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Farmers will see your request and can place bids
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {requestBids.map((bid, index) => (
                      <div
                        key={bid._id || index}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          bid.status === "Accepted"
                            ? "bg-green-50 border-green-200"
                            : bid.status === "Rejected"
                            ? "bg-red-50 border-red-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {bid.farmer_name
                                ? bid.farmer_name.charAt(0)
                                : "F"}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {bid.farmer_name || "Anonymous Farmer"}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                {bid.farm_location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">
                                      {bid.farm_location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              bid.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : bid.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {bid.status || "Pending"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">
                              Offered Quantity
                            </p>
                            <p className="font-semibold text-gray-900">
                              {bid.quantity || "N/A"}{" "}
                              {selectedRequest.quantity_unit}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-500">
                              Price per Unit
                            </p>
                            <p className="font-semibold text-gray-900">
                              ৳{bid.price_per_unit || "N/A"}
                            </p>
                          </div>
                        </div>

                        {bid.message && (
                          <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-2 rounded">
                            {bid.message}
                          </p>
                        )}

                        {bid.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                console.log("Accept button clicked");
                                handleAcceptBid(bid);
                              }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                console.log("Reject button clicked");
                                handleRejectBid(bid);
                              }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`text-center py-2 px-3 rounded text-xs font-medium ${
                              bid.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {bid.status === "Accepted"
                              ? "✓ Accepted"
                              : bid.status === "Rejected"
                              ? "✗ Rejected"
                              : bid.status}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    closeRequestDetailsModal();
                    handleEditRequest(selectedRequest);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit2 size={18} />
                  Edit Request
                </button>
                <button
                  onClick={() => {
                    closeRequestDetailsModal();
                    handleDeleteRequest(selectedRequest);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Delete Request
                </button>
                <button
                  onClick={closeRequestDetailsModal}
                  className="flex-1 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Create New Request
              </h3>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newRequestForm.product_name}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        product_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Quantity
                  </label>
                  <input
                    type="number"
                    value={newRequestForm.product_quantity}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        product_quantity: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Unit
                  </label>
                  <select
                    value={newRequestForm.quantity_unit}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        quantity_unit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="lb">lb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRequestForm.price_per_unit}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        price_per_unit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When do you need it?
                  </label>
                  <input
                    type="text"
                    value={newRequestForm.when}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        when: e.target.value,
                      })
                    }
                    placeholder="e.g., 10-Feb-2026, ASAP, Next week"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRequestForm.request_description}
                    onChange={(e) =>
                      setNewRequestForm({
                        ...newRequestForm,
                        request_description: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Additional details about your request..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRequestForm.admin_deal}
                      onChange={(e) =>
                        setNewRequestForm({
                          ...newRequestForm,
                          admin_deal: e.target.checked,
                        })
                      }
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      Admin Deal (Priority Request)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {isEditRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Request
              </h3>
              <button
                onClick={() => setIsEditRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateRequest} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editRequestForm.product_name}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        product_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Quantity
                  </label>
                  <input
                    type="number"
                    value={editRequestForm.product_quantity}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        product_quantity: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity Unit
                  </label>
                  <select
                    value={editRequestForm.quantity_unit}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        quantity_unit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="lb">lb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editRequestForm.price_per_unit}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        price_per_unit: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When do you need it?
                  </label>
                  <input
                    type="text"
                    value={editRequestForm.when}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        when: e.target.value,
                      })
                    }
                    placeholder="e.g., 10-Feb-2026, ASAP, Next week"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editRequestForm.request_description}
                    onChange={(e) =>
                      setEditRequestForm({
                        ...editRequestForm,
                        request_description: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Additional details about your request..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editRequestForm.admin_deal}
                      onChange={(e) =>
                        setEditRequestForm({
                          ...editRequestForm,
                          admin_deal: e.target.checked,
                        })
                      }
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      Admin Deal (Priority Request)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditRequestModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && requestToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Delete Request
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this request?
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-800">
                    {requestToDelete.product_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {requestToDelete.product_quantity}{" "}
                    {requestToDelete.quantity_unit} • Price: ৳
                    {requestToDelete.price_per_unit}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                This will permanently remove the request and cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteRequest}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteRequest}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
