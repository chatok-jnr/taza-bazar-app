import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Trash2, Eye, MessageCircle, Clock, MapPin, IndianRupee } from 'lucide-react';

export default function ConsumerRequests() {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/requests/consumer/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageRequest = (request) => {
    setSelectedRequest(request);
    setShowManageModal(true);
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/requests/${requestToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRequests(requests.filter(req => req.id !== requestToDelete.id));
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
    setShowDeleteModal(false);
    setRequestToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="mt-1 text-gray-600">Manage your product requests and view bids</p>
            </div>
            <div className="text-sm text-gray-500">
              {requests.length} active request{requests.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600">Create your first product request to get started!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg leading-tight">
                        {request.product_name || 'Product Request'}
                      </h3>
                      <div className="flex items-center mt-2 text-green-100">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{request.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(request)}
                      className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="space-y-3">
                    {/* Quantity and Price */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Quantity</span>
                        <p className="font-semibold text-gray-900">{request.quantity || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Budget</span>
                        <div className="flex items-center justify-end">
                          <IndianRupee className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-900">{request.budget || 'Negotiable'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <div>
                        <span className="text-sm text-gray-600">Description</span>
                        <p className="text-gray-800 text-sm mt-1 line-clamp-2">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Status and Timing */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status || 'Active'}
                      </span>
                    </div>

                    {/* Bids Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {request.bids_count || 0} bid{(request.bids_count || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleManageRequest(request)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Manage Request
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manage Request Modal */}
      {showManageModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedRequest.product_name || 'Product Request'}
              </h3>
              <p className="text-gray-600 mt-1">Request details and bids</p>
            </div>
            
            <div className="p-6">
              {/* Request Details */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Request Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{selectedRequest.quantity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">₹{selectedRequest.budget || 'Negotiable'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedRequest.location || 'Not specified'}</span>
                  </div>
                  {selectedRequest.description && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="text-gray-800 mt-1">{selectedRequest.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bids Section */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Bids ({selectedRequest.bids?.length || 0})
                </h4>
                {selectedRequest.bids && selectedRequest.bids.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.bids.map((bid, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{bid.farmer_name}</p>
                            <p className="text-sm text-gray-600">{bid.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">₹{bid.price}</p>
                            <p className="text-sm text-gray-600">{bid.quantity}</p>
                          </div>
                        </div>
                        {bid.message && (
                          <p className="text-gray-700 text-sm mt-2">{bid.message}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Accept
                          </button>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                            Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No bids yet</p>
                    <p className="text-sm">Farmers will bid on your request soon!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowManageModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && requestToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Request</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{requestToDelete.product_name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
