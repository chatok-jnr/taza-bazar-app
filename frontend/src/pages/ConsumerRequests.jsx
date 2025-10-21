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
  Eye,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import ConsumerSidebar from "./ConsumerSidebar";
import { getApiUrl } from '../config/api';

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
        getApiUrl(`api/v1/consumer/${user.user_id}`),
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

      const response = await fetch(getApiUrl("api/v1/consumer"), {
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
        getApiUrl(`api/v1/consumer/${requestToDelete._id}`),
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
        getApiUrl(`api/v1/farmerBid/${requestId}`),
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
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      console.log("Updating bid status to Accepted for bid ID:", bid._id);

      // First, update the bid status to "Accepted"
      const bidResponse = await fetch(
        getApiUrl(`api/v1/farmerBid/${bid._id}`),
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

      console.log("Bid response status:", bidResponse.status);

      if (!bidResponse.ok) {
        const errorData = await bidResponse.json().catch(() => ({}));
        console.error("Failed to accept bid:", errorData);
        setError(errorData.message || "Failed to accept bid");
        return;
      }

      console.log(
        "Bid accepted successfully, now updating request quantity..."
      );

      // Calculate new quantity (reduce by bid quantity)
      const newQuantity = selectedRequest.product_quantity - bid.quantity;
      console.log("Original quantity:", selectedRequest.product_quantity);
      console.log("Bid quantity:", bid.quantity);
      console.log("New quantity:", newQuantity);

      // Update the request quantity
      const requestResponse = await fetch(
        getApiUrl(`api/v1/consumer/${selectedRequest._id}`),
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

      console.log("Request update response status:", requestResponse.status);

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
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      console.log("Updating bid status to Rejected for bid ID:", bid._id);

      const response = await fetch(
        getApiUrl(`api/v1/farmerBid/${bid._id}`),
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

      console.log("Reject response status:", response.status);

      if (response.ok) {
        console.log("Bid rejected successfully, refreshing bids...");
        // Refresh bids to show updated status
        await fetchRequestBids(selectedRequest._id);
        setError("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to reject bid:", errorData);
        setError(errorData.message || "Failed to reject bid");
      }
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
        getApiUrl(`api/v1/consumer/${editingRequest._id}`),
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

          {/* Requests Grid - New Card Style from Consumer Marketplace */}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => handleManageRequest(request)}
                >
                  {/* Card Header with Image Placeholder */}
                  <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${
                          request.status === "Active"
                            ? "bg-green-500"
                            : request.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        } text-white text-xs font-bold px-2 py-1 rounded-full`}
                      >
                        {request.status}
                      </span>
                    </div>

                    {/* Admin Priority Badge */}
                    {request.admin_deal && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                          <TrendingUp size={10} />
                          <span>Admin deal</span>
                        </div>
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-semibold text-green-700">
                        ৳{request.price_per_unit}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {request.product_name}
                    </h3>

                    {/* Description - if available */}
                    {request.request_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {request.request_description}
                      </p>
                    )}

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium text-gray-900">
                          {request.product_quantity} {request.quantity_unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price per unit:</span>
                        <span className="font-medium text-gray-900">
                          ৳{request.price_per_unit}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          Needed by:{" "}
                          {new Date(request.when).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                        <Eye className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
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
