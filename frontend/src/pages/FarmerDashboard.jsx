import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  MessageSquare,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Award,
  TrendingUp,
  Bell,
} from "lucide-react";

import FarmerSidebar from "./FarmerSidebar";

export default function FarmerDashboard() {
  const [activeTab] = useState("My Listings");

  const farmerListings = [
    {
      id: 1,
      productName: "Organic Tomatoes",
      quantity: "500 kg",
      price: "₹50/kg",
      location: "Punjab, India",
      dateRange: "Oct 5 - Oct 20",
      adminDeal: true,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      productName: "Fresh Wheat",
      quantity: "1000 kg",
      price: "₹30/kg",
      location: "Haryana, India",
      dateRange: "Oct 1 - Oct 15",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      productName: "Premium Rice",
      quantity: "750 kg",
      price: "₹45/kg",
      location: "West Bengal, India",
      dateRange: "Oct 10 - Oct 25",
      adminDeal: true,
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      productName: "Fresh Potatoes",
      quantity: "2000 kg",
      price: "₹25/kg",
      location: "Uttar Pradesh, India",
      dateRange: "Oct 3 - Oct 18",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=250&fit=crop",
    },
    {
      id: 5,
      productName: "Organic Spinach",
      quantity: "300 kg",
      price: "₹40/kg",
      location: "Kerala, India",
      dateRange: "Oct 7 - Oct 14",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=250&fit=crop",
    },
    {
      id: 6,
      productName: "Local Fish (Rui)",
      quantity: "120 kg",
      price: "₹220/kg",
      location: "Bengal, India",
      dateRange: "Oct 6 - Oct 12",
      adminDeal: true,
      image:
        "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=250&fit=crop",
    },
    {
      id: 7,
      productName: "Seasonal Mangoes",
      quantity: "1500 kg",
      price: "₹60/kg",
      location: "Maharashtra, India",
      dateRange: "Oct 10 - Oct 30",
      adminDeal: true,
      image:
        "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=250&fit=crop",
    },
    {
      id: 8,
      productName: "Citrus Oranges",
      quantity: "800 kg",
      price: "₹35/kg",
      location: "Nagpur, India",
      dateRange: "Oct 2 - Oct 20",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1502741126161-b048400d3d9d?w=400&h=250&fit=crop",
    },
    {
      id: 9,
      productName: "Honey (Raw)",
      quantity: "200 kg",
      price: "₹450/kg",
      location: "Assam, India",
      dateRange: "Oct 1 - Oct 31",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=250&fit=crop",
    },
    {
      id: 10,
      productName: "Organic Eggs",
      quantity: "500 dozen",
      price: "₹250/dozen",
      location: "Tamil Nadu, India",
      dateRange: "Oct 5 - Oct 20",
      adminDeal: false,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop",
    },
  ];

  const handleLogout = () => {
    // You can add any cleanup logic here
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <FarmerSidebar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, Farmer!
            </h2>
            <p className="text-gray-600">
              Manage your listings and connect with buyers
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {farmerListings.length}
                  </p>
                </div>
                <FileText className="text-green-600" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bids Placed</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                </div>
                <TrendingUp className="text-blue-600" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">8</p>
                </div>
                <MessageSquare className="text-purple-600" size={32} />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">₹45k</p>
                </div>
                <DollarSign className="text-green-600" size={32} />
              </div>
            </div>
          </div>

          {/* My Listings Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">My Listings</h3>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                + New Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {farmerListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.productName}
                      className="w-full h-48 object-cover"
                    />
                    {listing.adminDeal && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Award size={14} />
                        Admin Deal
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">
                      {listing.productName}
                    </h4>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Package size={16} className="mr-2 text-green-600" />
                        <span>{listing.quantity}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2 text-green-600" />
                        <span className="font-semibold text-gray-800">
                          {listing.price}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2 text-green-600" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2 text-green-600" />
                        <span>{listing.dateRange}</span>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium">
                      Manage Listing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketplace moved to a dedicated page (no inline panel here) */}
        </div>
      </div>
    </div>
  );
}
