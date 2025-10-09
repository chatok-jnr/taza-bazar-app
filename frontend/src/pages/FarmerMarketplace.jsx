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

import FarmerSidebar from "./FarmerSidebar";

export default function FarmerMarketplace() {
  const [activeTab] = useState("Marketplace");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidFormData, setBidFormData] = useState({
    quantity: "",
    location: "",
    deliveryDate: "",
  });

  const [consumerRequests, setConsumerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsumerRequests();
  }, []);

  const fetchConsumerRequests = async () => {
    try {
      // Try to fetch from API first
      try {
        console.log("Attempting to fetch data from backend API...");
        const response = await fetch(
          "http://localhost:3000/api/consumer/requests"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch consumer requests");
        }
        const data = await response.json();
        setConsumerRequests(data);
        console.log("Successfully fetched data from backend API");
      } catch (apiError) {
        // If API fails, use example data
        console.log(
          "Backend API not available (this is expected during development)"
        );
        console.log("Using example data for development...");
        setConsumerRequests(exampleRequests);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error setting consumer requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/farmer/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit bid");
      }

      // Show success message or handle successful bid
      alert("Bid submitted successfully!");
      setShowBidForm(false);
    } catch (err) {
      console.error("Error submitting bid:", err);
      alert("Failed to submit bid. Please try again.");
    }
  };

  // Dummy consumer requests for development
  const exampleRequests = [
    {
      id: 1,
      product: "Tomato",
      quantity: 20,
      unit: "KG",
      pricePerUnit: 100,
      currency: "TK",
      neededBy: "2025-12-15",
      location: "Dhaka, Bangladesh",
      isAdminDeal: true,
      description:
        "Need fresh, organic tomatoes for my restaurant. Quality must be premium with no bruises or damage.",
      consumer: "Restaurant Dhaka Central",
      postedDate: "2025-10-01",
    },
    {
      id: 2,
      product: "Rice",
      quantity: 500,
      unit: "KG",
      pricePerUnit: 55,
      currency: "TK",
      neededBy: "2025-12-20",
      location: "Chittagong, Bangladesh",
      isAdminDeal: false,
      description:
        "Looking for high-quality basmati rice for wholesale distribution.",
      consumer: "Wholesale Traders Co",
      postedDate: "2025-10-05",
    },
    {
      id: 3,
      product: "Potato",
      quantity: 100,
      unit: "KG",
      pricePerUnit: 35,
      currency: "TK",
      neededBy: "2025-11-30",
      location: "Sylhet, Bangladesh",
      isAdminDeal: false,
      description:
        "Need fresh potatoes for chips production. Medium to large size preferred.",
      consumer: "Sylhet Snacks Ltd",
      postedDate: "2025-10-07",
    },
    {
      id: 4,
      product: "Mango",
      quantity: 50,
      unit: "KG",
      pricePerUnit: 150,
      currency: "TK",
      neededBy: "2025-11-15",
      location: "Rajshahi, Bangladesh",
      isAdminDeal: true,
      description:
        "Looking for premium quality Himsagar mangoes for export. Must be properly ripened.",
      consumer: "Fresh Fruit Exports",
      postedDate: "2025-10-03",
    },
    {
      id: 5,
      product: "Onion",
      quantity: 200,
      unit: "KG",
      pricePerUnit: 45,
      currency: "TK",
      neededBy: "2025-12-10",
      location: "Khulna, Bangladesh",
      isAdminDeal: false,
      description:
        "Bulk order for restaurant supply chain. Need medium-sized onions.",
      consumer: "Khulna Restaurant Association",
      postedDate: "2025-10-06",
    },
    {
      id: 6,
      product: "Carrots",
      quantity: 75,
      unit: "KG",
      pricePerUnit: 60,
      currency: "TK",
      neededBy: "2025-11-25",
      location: "Barisal, Bangladesh",
      isAdminDeal: true,
      description:
        "Fresh carrots needed for juice production. Must be organic certified.",
      consumer: "Healthy Juice Co",
      postedDate: "2025-10-04",
    },
    {
      id: 7,
      product: "Cauliflower",
      quantity: 150,
      unit: "KG",
      pricePerUnit: 40,
      currency: "TK",
      neededBy: "2025-12-05",
      location: "Rangpur, Bangladesh",
      isAdminDeal: false,
      description:
        "Looking for fresh cauliflower for hotel supply. Regular weekly order possible.",
      consumer: "Rangpur Grand Hotel",
      postedDate: "2025-10-02",
    },
  ];

  // Use consumerRequests if available, otherwise use exampleRequests
  const requestsToShow = consumerRequests.length > 0 ? consumerRequests : exampleRequests;

  const filteredRequests = requestsToShow.filter(
    (req) =>
      req.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <FarmerSidebar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Consumer Requests Marketplace
            </h1>
            <p className="text-gray-600">Browse and bid on consumer requests</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Request Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {request.product}
                    </h3>
                    {request.isAdminDeal && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Admin Deal
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Package className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        {request.quantity} {request.unit}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        {request.pricePerUnit} {request.currency}/{request.unit}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Due: {new Date(request.neededBy).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{request.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  <button
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowDetailsModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRequest.product}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Order Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Package className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Quantity: {selectedRequest.quantity}{" "}
                        {selectedRequest.unit}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Price: {selectedRequest.pricePerUnit}{" "}
                        {selectedRequest.currency}/{selectedRequest.unit}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Needed by:{" "}
                        {new Date(
                          selectedRequest.neededBy
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Consumer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      <span>Consumer: {selectedRequest.consumer}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>Location: {selectedRequest.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>
                        Posted:{" "}
                        {new Date(
                          selectedRequest.postedDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    setShowBidForm(true);
                    setShowDetailsModal(false);
                  }}
                >
                  Place Bid
                </button>
                <button
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // TODO: Implement message functionality
                    console.log("Message consumer clicked");
                  }}
                >
                  Message Consumer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid Form Modal */}
      {showBidForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Place Bid for {selectedRequest.product}
                </h2>
                <button
                  onClick={() => setShowBidForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePlaceBid(bidFormData);
                  setBidFormData({
                    quantity: "",
                    location: "",
                    deliveryDate: "",
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity ({selectedRequest.unit})
                    </label>
                    <input
                      type="number"
                      required
                      value={bidFormData.quantity}
                      onChange={(e) =>
                        setBidFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Enter quantity in ${selectedRequest.unit}`}
                      max={selectedRequest.quantity}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Location
                    </label>
                    <input
                      type="text"
                      required
                      value={bidFormData.location}
                      onChange={(e) =>
                        setBidFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bidFormData.deliveryDate}
                      onChange={(e) =>
                        setBidFormData((prev) => ({
                          ...prev,
                          deliveryDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={new Date().toISOString().split("T")[0]}
                      max={selectedRequest.neededBy}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Request for deal
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
