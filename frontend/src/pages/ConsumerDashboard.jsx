import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import ConsumerSidebar from "./ConsumerSidebar";

export default function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState("My Requests");
  const navigate = useNavigate();
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
    setRequests(
      requests.map((req) => {
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
      })
    );
  };

  const handleRejectBid = (requestId, bidId) => {
    setRequests(
      requests.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            bids: req.bids.map((bid) =>
              bid.id === bidId ? { ...bid, response: "rejected" } : bid
            ),
          };
        }
        return req;
      })
    );
  };

  const handleDeleteRequest = (requestId) => {
    setRequests(requests.filter((req) => req.id !== requestId));
  };

  // Edit state & handlers
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

  return (
    <DashboardLayout sidebar={<ConsumerSidebar activeTab={activeTab} />}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
          <p className="text-gray-600 mt-2">Manage your product requests</p>
        </div>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          + New Request
        </button>
      </div>

      {/* Request Cards */}
      <div className="space-y-6">
        {requests.map((request) => (
          <Link
            to={`/request/${request.id}`}
            key={request.id}
            className="block"
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
                          <p className="text-xs text-gray-500">Date Needed</p>
                          <p className="font-semibold">{request.dateNeeded}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-semibold">{request.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEdit(request);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
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
          </Link>
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
    </DashboardLayout>
  );
}
