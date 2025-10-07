import React, { useState } from "react";
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

  // No need for navigation handling as it's moved to the sidebar component

  const consumerRequests = [
    {
      id: 1,
      product: "Tomato",
      quantity: 20,
      unit: "KG",
      pricePerUnit: 100,
      currency: "TK",
      neededBy: "2025-02-15",
      location: "Dhaka, Bangladesh",
      isAdminDeal: true,
      description:
        "Need fresh, organic tomatoes for my restaurant. Quality must be premium with no bruises or damage.",
      consumer: "Restaurant Dhaka Central",
      postedDate: "2025-02-01",
    },
    {
      id: 2,
      product: "Rice",
      quantity: 500,
      unit: "KG",
      pricePerUnit: 55,
      currency: "TK",
      neededBy: "2025-02-20",
      location: "Chittagong, Bangladesh",
      isAdminDeal: false,
      description:
        "Looking for high-quality basmati rice for wholesale distribution.",
      consumer: "Wholesale Traders Co",
      postedDate: "2025-01-28",
    },
  ];

  const filteredRequests = consumerRequests.filter(
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
                    // TODO: Implement bid submission
                    console.log("Place bid clicked");
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
    </div>
  );
}
