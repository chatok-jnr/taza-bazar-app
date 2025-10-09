import React, { useState } from "react";
import {
  Package,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  FileText,
  X,
  Star,
  DollarSign,
} from "lucide-react";
import ConsumerSidebar from "./ConsumerSidebar";

export default function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState("My Requests");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequestForm, setNewRequestForm] = useState({
    productName: "",
    quantity: "",
    unit: "kg",
    pricePerUnit: "",
    dateNeeded: "",
    location: "",
    adminDeal: false,
  });
  const [requests, setRequests] = useState([
    {
      id: 1,
      productName: "Organic Tomatoes",
      quantity: 500,
      unit: "kg",
      pricePerUnit: "$2.50/kg",
      dateNeeded: "2025-10-15",
      location: "Dhaka, Bangladesh",
      adminDeal: true,
      bids: [
        {
          id: 1,
          farmerName: "Ahmed Farm",
          price: "$2.30/kg",
          rating: 4.8,
          quantity: 200,
          response: "pending",
        },
        {
          id: 2,
          farmerName: "Green Valley",
          price: "$2.40/kg",
          rating: 4.5,
          quantity: 150,
          response: "pending",
        },
      ],
    },
    {
      id: 2,
      productName: "Fresh Potatoes",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: "$1.20/kg",
      dateNeeded: "2025-10-20",
      location: "Chittagong, Bangladesh",
      adminDeal: false,
      bids: [
        {
          id: 3,
          farmerName: "Harvest Fields",
          price: "$1.15/kg",
          rating: 4.9,
          quantity: 500,
          response: "pending",
        },
      ],
    },
    {
      id: 3,
      productName: "Rice (Basmati)",
      quantity: 2000,
      unit: "kg",
      pricePerUnit: "$1.80/kg",
      dateNeeded: "2025-10-25",
      location: "Sylhet, Bangladesh",
      adminDeal: true,
      bids: [],
    },
  ]);

  const handleAcceptBid = (requestId, bidId) => {
    const newRequests = requests.map((req) => {
      if (req.id === requestId) {
        const bid = req.bids.find((b) => b.id === bidId);
        const newQuantity = req.quantity - bid.quantity;

        return {
          ...req,
          quantity: newQuantity >= 0 ? newQuantity : 0,
          bids: req.bids.map((b) =>
            b.id === bidId ? { ...b, response: "accepted" } : b
          ),
        };
      }
      return req;
    });
    setRequests(newRequests);
    setSelectedRequest(newRequests.find((req) => req.id === requestId));
  };

  const handleRejectBid = (requestId, bidId) => {
    const newRequests = requests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          bids: req.bids.map((bid) =>
            bid.id === bidId ? { ...bid, response: "rejected" } : bid
          ),
        };
      }
      return req;
    });
    setRequests(newRequests);
    setSelectedRequest(newRequests.find((req) => req.id === requestId));
  };

  const handleDeleteRequest = (requestId) => {
    setRequests(requests.filter((req) => req.id !== requestId));
    setSelectedRequest(null);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    dateNeeded: "",
    location: "",
    adminDeal: false,
  });

  const startEdit = (request) => {
    setEditingRequestId(request.id);
    setEditForm({
      productName: request.productName,
      quantity: request.quantity,
      unit: request.unit,
      pricePerUnit: request.pricePerUnit,
      dateNeeded: request.dateNeeded,
      location: request.location,
      adminDeal: request.adminDeal || false,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingRequestId(null);
  };

  const saveEdit = () => {
    setRequests(
      requests.map((r) =>
        r.id === editingRequestId ? { ...r, ...editForm } : r
      )
    );
    cancelEdit();
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewRequestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRequestForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewRequestSubmit = () => {
    const newRequest = {
      id: requests.length + 1,
      ...newRequestForm,
      pricePerUnit: `৳${newRequestForm.pricePerUnit}/${newRequestForm.unit}`,
      bids: [],
    };
    setRequests([newRequest, ...requests]);
    setNewRequestForm({
      productName: "",
      quantity: "",
      unit: "kg",
      pricePerUnit: "",
      dateNeeded: "",
      location: "",
      adminDeal: false,
    });
    setShowNewRequestModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ConsumerSidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
              <p className="text-gray-600 mt-2">Manage your product requests</p>
            </div>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + New Request
            </button>
          </div>

          {/* New Request Modal */}
          {showNewRequestModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-xl p-6">
                <h3 className="text-lg font-semibold mb-4">New Request</h3>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    name="productName"
                    value={newRequestForm.productName}
                    onChange={handleNewRequestChange}
                    className="border p-2 rounded"
                    placeholder="Product name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      name="quantity"
                      value={newRequestForm.quantity}
                      onChange={handleNewRequestChange}
                      type="number"
                      className="border p-2 rounded col-span-2"
                      placeholder="Quantity"
                    />
                    <select
                      name="unit"
                      value={newRequestForm.unit}
                      onChange={handleNewRequestChange}
                      className="border p-2 rounded"
                    >
                      <option value="kg">kg</option>
                      <option value="gm">gm</option>
                      <option value="pieces">pieces</option>
                    </select>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      ৳
                    </span>
                    <input
                      name="pricePerUnit"
                      value={newRequestForm.pricePerUnit}
                      onChange={handleNewRequestChange}
                      type="number"
                      className="border p-2 pl-8 rounded w-full"
                      placeholder="Price per unit (BDT)"
                    />
                  </div>
                  <input
                    name="dateNeeded"
                    value={newRequestForm.dateNeeded}
                    onChange={handleNewRequestChange}
                    type="date"
                    className="border p-2 rounded"
                    placeholder="Date needed"
                  />
                  <input
                    name="location"
                    value={newRequestForm.location}
                    onChange={handleNewRequestChange}
                    className="border p-2 rounded"
                    placeholder="Location"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="adminDeal"
                      checked={newRequestForm.adminDeal}
                      onChange={handleNewRequestChange}
                      className="rounded text-green-600"
                    />
                    <span>Mark as Admin Deal</span>
                  </label>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setShowNewRequestModal(false)}
                      className="px-4 py-2 bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNewRequestSubmit}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Create Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedRequest.productName}
                      </h2>
                      {selectedRequest.adminDeal && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Admin Deal
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Package size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-semibold">
                            {selectedRequest.quantity} {selectedRequest.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <DollarSign size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Price per Unit
                          </p>
                          <p className="font-semibold">
                            {selectedRequest.pricePerUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Date Needed</p>
                          <p className="font-semibold">
                            {selectedRequest.dateNeeded}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-semibold">
                            {selectedRequest.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        Farmer Bids ({selectedRequest.bids.length})
                      </h3>
                    </div>

                    {selectedRequest.bids.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Package
                          size={48}
                          className="mx-auto text-gray-300 mb-3"
                        />
                        <p className="text-gray-500">No bids yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedRequest.bids.map((bid) => (
                          <div
                            key={bid.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-lg text-gray-800">
                                  {bid.farmerName}
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star
                                    size={16}
                                    className="fill-yellow-400 text-yellow-400"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    {bid.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                  {bid.price}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {bid.quantity}{" "}
                                  {selectedRequest.unit}
                                </p>
                              </div>
                            </div>

                            {bid.response === "pending" && (
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() =>
                                    handleAcceptBid(selectedRequest.id, bid.id)
                                  }
                                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                  Accept Bid
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectBid(selectedRequest.id, bid.id)
                                  }
                                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                            {bid.response === "accepted" && (
                              <div className="mt-3 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-center font-semibold">
                                ✓ Accepted
                              </div>
                            )}

                            {bid.response === "rejected" && (
                              <div className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-center font-semibold">
                                ✗ Rejected
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Cards */}
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className="block cursor-pointer"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <h3 className="text-xl font-bold text-gray-800">
                            {request.productName}
                          </h3>
                          {request.adminDeal && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Admin Deal
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Package size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Quantity</p>
                              <p className="font-semibold">
                                {request.quantity} {request.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <DollarSign size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Price per Unit
                              </p>
                              <p className="font-semibold">
                                {request.pricePerUnit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">
                                Date Needed
                              </p>
                              <p className="font-semibold">
                                {request.dateNeeded}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <MapPin size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="font-semibold">
                                {request.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(request);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(request.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg w-full max-w-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Request</h3>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    name="productName"
                    value={editForm.productName}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                    placeholder="Product name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      name="quantity"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      className="border p-2 rounded col-span-2"
                      placeholder="Quantity"
                    />
                    <input
                      name="unit"
                      value={editForm.unit}
                      onChange={handleEditChange}
                      className="border p-2 rounded"
                      placeholder="Unit"
                    />
                  </div>
                  <input
                    name="pricePerUnit"
                    value={editForm.pricePerUnit}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                    placeholder="Price per unit"
                  />
                  <input
                    name="dateNeeded"
                    value={editForm.dateNeeded}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                    placeholder="Date needed"
                  />
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="border p-2 rounded"
                    placeholder="Location"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {requests.length === 0 && (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No requests yet
              </h3>
              <p className="text-gray-500">
                Create your first product request to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}