import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Eye,
  FileText,
  TrendingUp,
  Bell,
  User,
  MessageSquare,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import FarmerSidebar from "./FarmerSidebar";
import { getApiUrl } from '../config/api';

export default function FarmerMarketplace() {
  const navigate = useNavigate();
  const { user, getToken, logout, isLoading: userLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [consumerRequests, setConsumerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proposalForm, setProposalForm] = useState({
    quantity: "",
    price_per_unit: "",
    farm_location: "",
    message: "",
  });
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState("");

  // Fetch consumer requests from API
  const fetchConsumerRequests = async () => {
    console.log("Hola");

    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      console.log("Fetching consumer requests from API...");

      const response = await fetch(getApiUrl("api/v1/consumer"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Consumer requests data received:", data);

        // The API returns data.req
        const requestsArray = data.data?.req || [];
        console.log("Extracted requests array:", requestsArray);

        setConsumerRequests(requestsArray);
        setError("");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        setError(errorData.message || "Failed to fetch consumer requests");

        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching consumer requests:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit proposal function
  const submitProposal = async () => {
    try {
      setProposalLoading(true);
      setProposalError("");

      // Validate required fields
      if (
        !proposalForm.quantity ||
        !proposalForm.price_per_unit ||
        !proposalForm.farm_location
      ) {
        setProposalError("Please fill in all required fields (marked with *)");
        return;
      }

      const token = getToken();
      if (!token) {
        setProposalError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      if (!user?.user_id) {
        setProposalError("User information not available. Please login again.");
        navigate("/login");
        return;
      }

      // Debug user object to see available fields
      console.log("Current user object:", user);
      console.log("Available user fields:", Object.keys(user));
      console.log("User name fields:", {
        user_name: user.user_name,
        name: user.name,
        username: user.username,
      });

      const proposalData = {
        request_id: selectedRequest._id,
        consumer_id: selectedRequest.user_id || selectedRequest.consumer_id,
        farmer_id: user.user_id,
        farmer_name:
          user.user_name || user.name || user.username || "Unknown Farmer",
        quantity: parseFloat(proposalForm.quantity),
        price_per_unit: parseFloat(proposalForm.price_per_unit),
        farm_location: proposalForm.farm_location,
        message: proposalForm.message || "",
      };

      console.log("Submitting proposal:", proposalData);

      const response = await fetch(getApiUrl("api/v1/farmerBid"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Proposal submitted successfully:", result);

        // Reset form and close modals
        setProposalForm({
          quantity: "",
          price_per_unit: "",
          farm_location: "",
          message: "",
        });
        setShowProposalModal(false);
        setShowDetailsModal(false);

        // Show success message (you might want to add a toast notification here)
        alert("Proposal submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Proposal submission error:", errorData);
        setProposalError(errorData.message || "Failed to submit proposal");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      setProposalError("Network error. Please try again.");
    } finally {
      setProposalLoading(false);
    }
  };

  // Handle proposal form input changes
  const handleProposalInputChange = (field, value) => {
    setProposalForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (proposalError) {
      setProposalError("");
    }
  };

  // Authentication check and data fetching
  useEffect(() => {
    console.log(
      "FarmerMarketplace useEffect - userLoading:",
      userLoading,
      "user:",
      user
    );

    if (userLoading) {
      console.log("UserContext is still loading...");
      return;
    }

    if (!user?.user_id) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    // User is authenticated, fetch data
    fetchConsumerRequests();
  }, [user, userLoading, navigate]);

  const filteredRequests = consumerRequests.filter(
    (req) =>
      req.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.request_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Farmer Marketplace</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading consumer requests...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user?.user_id) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Farmer Marketplace</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <FarmerSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Consumer Requests Marketplace
            </h1>
            <p className="text-gray-600">Browse and bid on consumer requests</p>
          </div>

          {/* Search Bar - Fiverr Style */}
          <div className="mb-8">
            <div className="relative max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur-sm opacity-20"></div>
                <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 pl-6">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="What service are you looking for today?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none focus:ring-0 text-lg"
                      style={{ fontSize: "16px" }}
                    />
                    <div className="flex-shrink-0 pr-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                        onClick={() => {
                          // Optional: trigger search action
                          console.log("Search clicked:", searchTerm);
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular searches */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Popular:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Fresh Vegetables",
                    "Organic Fruits",
                    "Rice & Grains",
                    "Dairy Products",
                    "Seasonal Produce",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-green-600 border border-gray-300 hover:border-green-500 rounded-full transition-all duration-200 hover:bg-green-50"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Request Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetailsModal(true);
                  }}
                >
                  {/* Card Header with Image Placeholder */}
                  <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-green-600" />
                    </div>
                    {request.admin_deal && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Admin deal
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                        {new Date(request.when).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {request.product_name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {request.request_description}
                    </p>

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="font-medium text-gray-900">
                          {request.product_quantity} {request.quantity_unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium text-gray-900">
                          {request.price_per_unit} {request.currency || "BDT"}/
                          {request.quantity_unit}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          Due {new Date(request.when).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700">
                        <span>View Details</span>
                        <Eye className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-16">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No consumer requests found
                </h3>
                <p className="text-gray-500">
                  Check back later for new requests from consumers
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedRequest.product_name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Request Image/Banner */}
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg mb-6 overflow-hidden border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-16 h-16 text-green-600" />
                </div>
                {selectedRequest.admin_deal && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/90 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
                    Posted{" "}
                    {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Request Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Request Description
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedRequest.request_description}
                      </p>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Specifications
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Quantity Required
                            </p>
                            <p className="font-semibold text-gray-800">
                              {selectedRequest.product_quantity}{" "}
                              {selectedRequest.quantity_unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Budget per Unit
                            </p>
                            <p className="font-semibold text-gray-800">
                              {selectedRequest.price_per_unit}{" "}
                              {selectedRequest.currency || "BDT"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-600">Required By</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(
                                selectedRequest.when
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Total Budget
                            </p>
                            <p className="font-semibold text-green-600 text-lg">
                              {(
                                selectedRequest.price_per_unit *
                                selectedRequest.product_quantity
                              ).toLocaleString()}{" "}
                              {selectedRequest.currency || "BDT"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Action Panel */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    {/* Price Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-lg">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-800 mb-1">
                          {selectedRequest.price_per_unit}{" "}
                          {selectedRequest.currency || "BDT"}
                        </div>
                        <div className="text-sm text-gray-600">
                          per {selectedRequest.quantity_unit}
                        </div>
                        <div className="text-lg font-semibold text-green-600 mt-2">
                          Total:{" "}
                          {(
                            selectedRequest.price_per_unit *
                            selectedRequest.product_quantity
                          ).toLocaleString()}{" "}
                          {selectedRequest.currency || "BDT"}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              Delivery
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {Math.ceil(
                              (new Date(selectedRequest.when) - new Date()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              Quantity
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {selectedRequest.product_quantity}{" "}
                            {selectedRequest.quantity_unit}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          onClick={() => {
                            setShowProposalModal(true);
                          }}
                        >
                          <DollarSign className="w-5 h-5" />
                          <span>Submit Proposal</span>
                        </button>
                        <button
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-300"
                          onClick={() => {
                            // TODO: Implement message functionality
                            console.log(
                              "Message consumer clicked for request:",
                              selectedRequest._id
                            );
                          }}
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>Contact Buyer</span>
                        </button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-blue-600 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-800 mb-1">
                            Pro Tip
                          </h4>
                          <p className="text-sm text-blue-700">
                            Submit a competitive proposal with clear delivery
                            timeline to increase your chances of winning this
                            request.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300 rounded-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl border-b border-gray-200 bg-white/90 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800">
                Submit Proposal
              </h2>
              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setProposalForm({
                    quantity: "",
                    price_per_unit: "",
                    farm_location: "",
                    message: "",
                  });
                  setProposalError("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Request Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  Request Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-medium">Product:</span>
                    <p className="text-green-800">
                      {selectedRequest.product_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-green-600 font-medium">
                      Required Quantity:
                    </span>
                    <p className="text-green-800">
                      {selectedRequest.product_quantity}{" "}
                      {selectedRequest.quantity_unit}
                    </p>
                  </div>
                  <div>
                    <span className="text-green-600 font-medium">
                      Budget per Unit:
                    </span>
                    <p className="text-green-800">
                      {selectedRequest.price_per_unit}{" "}
                      {selectedRequest.currency || "BDT"}
                    </p>
                  </div>
                  <div>
                    <span className="text-green-600 font-medium">
                      Required By:
                    </span>
                    <p className="text-green-800">
                      {new Date(selectedRequest.when).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {proposalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{proposalError}</p>
                </div>
              )}

              {/* Proposal Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitProposal();
                }}
                className="space-y-6"
              >
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity You Can Supply{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={proposalForm.quantity}
                      onChange={(e) =>
                        handleProposalInputChange("quantity", e.target.value)
                      }
                      placeholder={`Enter quantity (max: ${selectedRequest.product_quantity})`}
                      min="0"
                      max={selectedRequest.product_quantity}
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">
                        {selectedRequest.quantity_unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price per Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Price per Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={proposalForm.price_per_unit}
                      onChange={(e) =>
                        handleProposalInputChange(
                          "price_per_unit",
                          e.target.value
                        )
                      }
                      placeholder={`Enter your price (budget: ${selectedRequest.price_per_unit})`}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">
                        {selectedRequest.currency || "BDT"}
                      </span>
                    </div>
                  </div>
                  {proposalForm.quantity && proposalForm.price_per_unit && (
                    <p className="text-sm text-gray-600 mt-2">
                      Total:{" "}
                      {(
                        parseFloat(proposalForm.quantity) *
                        parseFloat(proposalForm.price_per_unit)
                      ).toLocaleString()}{" "}
                      {selectedRequest.currency || "BDT"}
                    </p>
                  )}
                </div>

                {/* Farm Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={proposalForm.farm_location}
                    onChange={(e) =>
                      handleProposalInputChange("farm_location", e.target.value)
                    }
                    placeholder="Enter your farm location (e.g., Dhaka, Bangladesh)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={proposalForm.message}
                    onChange={(e) =>
                      handleProposalInputChange("message", e.target.value)
                    }
                    placeholder="Add any additional information about your proposal..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProposalModal(false);
                      setProposalForm({
                        quantity: "",
                        price_per_unit: "",
                        farm_location: "",
                        message: "",
                      });
                      setProposalError("");
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      proposalLoading ||
                      !proposalForm.quantity ||
                      !proposalForm.price_per_unit ||
                      !proposalForm.farm_location
                    }
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {proposalLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>Submit Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
