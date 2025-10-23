import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

// Main Consumer Requests Component
export default function ConsumerRequests() {
  const navigate = useNavigate();
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

  // Product Details Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  // Function to handle view request click (open details modal)
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
    fetchRequestBids(request._id);
  };

  // Function to close request details modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
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

      // Calculate the total transaction amount based on bid
      const totalAmount = bid.quantity * bid.price_per_unit;
      console.log("Total transaction amount:", totalAmount);

      // First, get current consumer data to get existing total_spent value
      const consumerResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Hello = ${bid.quantity * bid.price_per_unit + consumerResponse.total_spent} `);

      if (consumerResponse.ok) {
        const consumerData = await consumerResponse.json();
        const currentTotalSpent = consumerData.data?.total_spent || 0;
        const newTotalSpent = currentTotalSpent + totalAmount;
        console.log("Current total spent:", currentTotalSpent);
        console.log("New total spent:", newTotalSpent);

        // Since the backend directly replaces values with Object.assign
        // We need to send the calculated sum for total_spent 
        const consumerUpdateResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              total_spent: newTotalSpent, // Send the pre-calculated sum
            }),
          }
        );

        if (!consumerUpdateResponse.ok) {
          const errorData = await consumerUpdateResponse.json().catch(() => ({}));
          console.error("Failed to update consumer total_spent:", errorData);
          // Continue even if update fails
        } else {
          console.log("Consumer total_spent updated successfully");
        }
      } else {
        console.error("Failed to fetch consumer data for total_spent update");
      }

      // Get current farmer data to get existing total_revenue value
      const farmerResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/users/${bid.farmer_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (farmerResponse.ok) {
        const farmerData = await farmerResponse.json();
        const currentTotalRevenue = farmerData.data?.total_revenue || 0;
        const newTotalRevenue = currentTotalRevenue + totalAmount;
        console.log("Current total revenue:", currentTotalRevenue);
        console.log("New total revenue:", newTotalRevenue);

        // Since the backend directly replaces values with Object.assign
        // We need to send the calculated sum for total_revenue
        const farmerUpdateResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/users/${bid.farmer_id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              total_revenue: newTotalRevenue, // Send the pre-calculated sum
            }),
          }
        );

        if (!farmerUpdateResponse.ok) {
          const errorData = await farmerUpdateResponse.json().catch(() => ({}));
          console.error("Failed to update farmer total_revenue:", errorData);
          // Continue even if update fails
        } else {
          console.log("Farmer total_revenue updated successfully");
        }
      } else {
        console.error("Failed to fetch farmer data for total_revenue update");
      }

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

          {/* Loading State - Marketplace Style */}
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your requests...</p>
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

          {/* Requests Grid - Matching Consumer Marketplace Style */}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {requests.map((request) => (
                <div 
                  key={request._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => handleViewRequest(request)}
                >
                  <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-green-600" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${
                        request.status === "Active" ? "bg-green-500" : 
                        request.status === "Pending" ? "bg-orange-500" : "bg-gray-500"
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    
                    {/* Admin Deal Badge */}
                    {request.admin_deal && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Admin deal
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                        {new Date(request.when).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {request.product_name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {request.request_description || `Request for ${request.product_quantity} ${request.quantity_unit} of ${request.product_name}`}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium text-gray-900">{request.product_quantity} {request.quantity_unit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-gray-900">৳{request.price_per_unit}/{request.quantity_unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Needed by {new Date(request.when).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRequest(request);
                          }}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(request);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                          <Eye className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Requests Message - Marketplace Style */}
          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={36} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first product request to connect with local farmers
              </p>
              <button
                onClick={() => setIsNewRequestModalOpen(true)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center mx-auto space-x-2"
              >
                <span>Create First Request</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Product Details Modal */}
      {isViewModalOpen && selectedRequest && (
        <ProductDetailsModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          listing={selectedRequest}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
          isBidSection={true}
          requestBids={requestBids}
          bidsLoading={bidsLoading}
          handleAcceptBid={handleAcceptBid}
          handleRejectBid={handleRejectBid}
        />
      )}

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsNewRequestModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditRequestModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
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
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={cancelDeleteRequest}
        onConfirm={confirmDeleteRequest}
        title="Delete Request"
        message={`Are you sure you want to delete "${requestToDelete?.product_name}"? This action cannot be undone.`}
      />
    </div>
  );
}
