import React, { useState } from 'react';
import { MapPin, Calendar, Package, DollarSign, MessageCircle, CheckCircle, XCircle, Star, Award } from 'lucide-react';

export default function RequestDetails() {
  const [bids, setBids] = useState([
    {
      id: 1,
      farmerName: "John's Organic Farm",
      farmerLocation: "Dhaka Division",
      rating: 4.8,
      offeredQuantity: 450,
      pricePerUnit: 28,
      message: "I can supply fresh organic tomatoes from my farm. Quality guaranteed with organic certification.",
      avatar: "JF",
      status: "pending"
    },
    {
      id: 2,
      farmerName: "Green Valley Farms",
      farmerLocation: "Chittagong",
      rating: 4.9,
      offeredQuantity: 500,
      pricePerUnit: 25,
      message: "We have excellent quality tomatoes ready for harvest. Can deliver on your specified date.",
      avatar: "GV",
      status: "pending"
    },
    {
      id: 3,
      farmerName: "Sunrise Agriculture",
      farmerLocation: "Rajshahi",
      rating: 4.6,
      offeredQuantity: 400,
      pricePerUnit: 30,
      message: "Premium quality tomatoes available. We've been supplying to major retailers for 5 years.",
      avatar: "SA",
      status: "pending"
    }
  ]);

  const productRequest = {
    productName: "Fresh Organic Tomatoes",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 30,
    dateNeeded: "October 15, 2025",
    location: "Narsingdi, Dhaka Division",
    description: "Looking for fresh, organic tomatoes for my restaurant chain. Need consistent quality and timely delivery. Preferably certified organic farms.",
    category: "Vegetables",
    postedDate: "October 1, 2025",
    isAdminDeal: true
  };

  const consumer = {
    username: "RestaurantHub BD",
    location: "Dhaka Division",
    memberSince: "January 2024",
    totalRequests: 24,
    rating: 4.7,
    avatar: "RH"
  };

  const handleAccept = (bidId) => {
    setBids(bids.map(bid => 
      bid.id === bidId ? { ...bid, status: 'accepted' } : bid
    ));
  };

  const handleReject = (bidId) => {
    setBids(bids.map(bid => 
      bid.id === bidId ? { ...bid, status: 'rejected' } : bid
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-green-600 cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-green-600 cursor-pointer">Product Requests</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{productRequest.productName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {productRequest.productName}
                      </h1>
                      {productRequest.isAdminDeal && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                          <Award className="w-3 h-3" />
                          Admin Deal
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Posted on {productRequest.postedDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-semibold">{productRequest.quantity} {productRequest.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-semibold">৳{productRequest.pricePerUnit}/{productRequest.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Needed By</p>
                      <p className="font-semibold text-sm">{productRequest.dateNeeded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-semibold text-sm">{productRequest.location}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Request Details</h2>
                  <p className="text-gray-700 leading-relaxed">{productRequest.description}</p>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {productRequest.category}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {bids.length} Bids Received
                  </span>
                </div>
              </div>
            </div>

            {/* Farmer Bids Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Farmer Bids ({bids.length})</h2>
                <p className="text-sm text-gray-600 mt-1">Review and accept bids from qualified farmers</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {bids.map((bid) => (
                  <div key={bid.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {bid.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{bid.farmerName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">{bid.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="text-sm">{bid.farmerLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {bid.status === 'pending' && (
                        <button className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Chat</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 ml-16">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Offered Quantity</p>
                        <p className="text-lg font-bold text-gray-900">{bid.offeredQuantity} {productRequest.unit}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                        <p className="text-lg font-bold text-gray-900">৳{bid.pricePerUnit}</p>
                      </div>
                    </div>

                    <div className="ml-16">
                      <p className="text-gray-700 mb-4 leading-relaxed">{bid.message}</p>
                      
                      {bid.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAccept(bid.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Accept Bid
                          </button>
                          <button
                            onClick={() => handleReject(bid.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {bid.status === 'accepted' && (
                        <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-3 rounded-lg">
                          <CheckCircle className="w-5 h-5" />
                          Bid Accepted
                        </div>
                      )}
                      
                      {bid.status === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg">
                          <XCircle className="w-5 h-5" />
                          Bid Rejected
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Consumer Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    About the Buyer
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {consumer.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{consumer.username}</h4>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{consumer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member since</span>
                      <span className="text-sm font-medium text-gray-900">{consumer.memberSince}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total requests</span>
                      <span className="text-sm font-medium text-gray-900">{consumer.totalRequests}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">{consumer.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <MessageCircle className="w-5 h-5" />
                    Contact Buyer
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Request Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="text-lg font-bold text-green-600">
                      ৳{(productRequest.quantity * productRequest.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Bid</span>
                    <span className="text-lg font-bold text-gray-900">
                      ৳{Math.round(bids.reduce((acc, bid) => acc + bid.pricePerUnit, 0) / bids.length)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Until Needed</span>
                    <span className="text-lg font-bold text-orange-600">10 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}