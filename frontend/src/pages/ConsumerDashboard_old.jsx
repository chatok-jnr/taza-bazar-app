import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MessageSquare, User, FileText, Edit2, Trash2, MapPin, Calendar, Package, DollarSign, TrendingUp, Bell, X, Save } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ConsumerDashboard() {
  console.log('ConsumerDashboard component mounted');
  
  const [activeTab, setActiveTab] = useState('My Requests');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, getToken, logout, isLoading: userLoading } = useUser();

  console.log('ConsumerDashboard - user:', user, 'userLoading:', userLoading);

  // New Request Modal Form State
  const [newRequestForm, setNewRequestForm] = useState({
    product_name: '',
    product_quantity: '',
    quantity_unit: 'kg',
    price_per_unit: '',
    when: '',
    request_description: '',
    admin_deal: false
  });

  // Fetch consumer requests from API
  const fetchConsumerRequests = async () => {
    if (!user?.user_id) {
      setError('User not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      console.log('Fetching requests for user ID:', user.user_id);

      const response = await fetch(`http://127.0.0.1:8000/api/v1/consumer/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Requests data received:', data);
        
        // The API returns data.req (not data.requests)
        const requestsArray = data.data?.req || [];
        console.log('Extracted requests array:', requestsArray);
        
        setRequests(requestsArray);
        setError('');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setError(errorData.message || 'Failed to fetch requests');
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch requests
  useEffect(() => {
    const checkAuthAndFetchRequests = async () => {
      // Wait for UserContext to finish loading
      if (userLoading) {
        console.log('UserContext is still loading...');
        return;
      }
      
      console.log('UserContext loaded. User:', user);
      
      // Check if user is authenticated
      if (!user?.user_id) {
        console.log('User not authenticated, redirecting to login');
        setError('Please login to access this page.');
        navigate('/login');
        return;
      }

      console.log('User authenticated, fetching requests');
      await fetchConsumerRequests();
    };

    checkAuthAndFetchRequests();
  }, [user?.user_id, getToken, navigate, logout, userLoading]);

  // Function to create a new request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!user?.user_id) {
      setError('User not found. Please login again.');
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare data for API
      const requestData = {
        ...newRequestForm,
        user_id: user.user_id,
        product_quantity: parseInt(newRequestForm.product_quantity),
        price_per_unit: parseFloat(newRequestForm.price_per_unit)
      };

      console.log('Creating new request:', requestData);

      const response = await fetch('http://127.0.0.1:8000/api/v1/consumer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Create response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Request created successfully:', data);
        
        // Reset form and close modal
        setNewRequestForm({
          product_name: '',
          product_quantity: '',
          quantity_unit: 'kg',
          price_per_unit: '',
          when: '',
          request_description: '',
          admin_deal: false
        });
        setIsNewRequestModalOpen(false);
        
        // Refresh the requests list
        await fetchConsumerRequests();
        setError('');
        alert('Request created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Create error:', errorData);
        setError(errorData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Network error. Please try again.');
    }
  };

  // Handle form input changes
  const handleNewRequestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRequestForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
  };

  const sidebarItems = [
    { name: 'My Requests', icon: FileText },
    { name: 'Marketplace', icon: TrendingUp },
    { name: 'Notifications', icon: Bell },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Profile', icon: User }
  ];

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'My Requests':
        return (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
                <p className="text-gray-600 mt-2">Manage your product requests</p>
              </div>
              <button 
                onClick={() => setIsNewRequestModalOpen(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                + New Request
              </button>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Request Cards */}
            <div className="space-y-6">
              {Array.isArray(requests) && requests.length > 0 ? (
                requests.map((request) => (
                  <Link to={`/request/${request._id || request.id}`} key={request._id || request.id} className="block">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                              <h3 className="text-xl font-bold text-gray-800">{request.product_name}</h3>
                              {request.admin_deal && (
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
                                <p className="font-semibold">{request.product_quantity} {request.quantity_unit}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <DollarSign size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Price per Unit</p>
                                <p className="font-semibold">৳{request.price_per_unit}/{request.quantity_unit}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <Calendar size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">When Needed</p>
                                <p className="font-semibold">{request.when}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <FileText size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Description</p>
                                <p className="font-semibold text-sm">{request.request_description || 'No description'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests yet</h3>
                  <p className="text-gray-500">Create your first product request to get started</p>
                </div>
              )}
            </div>
          </>
        );
      
      case 'Marketplace':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Farmer Marketplace</h2>
            <p className="text-gray-600 mb-8">Browse fresh produce directly from local farmers</p>
            <div className="text-center py-16">
              <TrendingUp size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Marketplace Coming Soon</h3>
              <p className="text-gray-500">Browse products from farmers</p>
            </div>
          </div>
        );
      
      case 'Notifications':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h2>
            <p className="text-gray-600 mb-8">Stay updated with your activity</p>
            <div className="text-center py-16">
              <Bell size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          </div>
        );
      
      case 'Messages':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Messages</h2>
            <p className="text-gray-600 mb-8">Chat with farmers and other consumers</p>
            <div className="text-center py-16">
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No messages</h3>
              <p className="text-gray-500">Start a conversation with farmers</p>
            </div>
          </div>
        );
      
      case 'Profile':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile</h2>
            <p className="text-gray-600 mb-8">Manage your account settings</p>
            <div className="text-center py-16">
              <User size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Profile Settings</h3>
              <p className="text-gray-500">Update your personal information</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Show loading state while UserContext is loading
  if (userLoading || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading your requests...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (authentication error)
  if (!userLoading && !user?.user_id && error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
            <button
              onClick={() => navigate('/login')}
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
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
          <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.name)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  activeTab === item.name
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <User size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{activeTab}</h2>
              <p className="text-gray-600 mt-2">Manage your product requests</p>
            </div>
            <button 
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + New Request
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Request Cards */}
          <div className="space-y-6">
            {Array.isArray(requests) && requests.length > 0 ? (
              requests.map((request) => (
                <Link to={`/request/${request._id || request.id}`} key={request._id || request.id} className="block">
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{request.product_name}</h3>
                            {request.admin_deal && (
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
                              <p className="font-semibold">{request.product_quantity} {request.quantity_unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <DollarSign size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Price per Unit</p>
                              <p className="font-semibold">৳{request.price_per_unit}/{request.quantity_unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">When Needed</p>
                              <p className="font-semibold">{request.when}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <FileText size={18} className="text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Description</p>
                              <p className="font-semibold text-sm">{request.request_description || 'No description'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Add edit functionality later */ }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* Add delete functionality later */ }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
            ) : (
              // Empty State - when no requests or loading finished
              !loading && (
                <div className="text-center py-16">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests yet</h3>
                  <p className="text-gray-500">Create your first product request to get started</p>
                </div>
              )
            )}
          </div>

          {/* This empty state section is now redundant, so we can remove it */}

          {/* New Request Modal */}
          {isNewRequestModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Create New Request</h2>
                  <button
                    onClick={() => setIsNewRequestModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateRequest} className="p-6 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={newRequestForm.product_name}
                      onChange={handleNewRequestChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Quantity and Unit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="product_quantity"
                        value={newRequestForm.product_quantity}
                        onChange={handleNewRequestChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter quantity"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit *
                      </label>
                      <select
                        name="quantity_unit"
                        value={newRequestForm.quantity_unit}
                        onChange={handleNewRequestChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="piece">Piece</option>
                        <option value="gram">Gram (g)</option>
                        <option value="liter">Liter (L)</option>
                        <option value="ton">Ton</option>
                        <option value="dozen">Dozen</option>
                        <option value="bag">Bag</option>
                        <option value="box">Box</option>
                      </select>
                    </div>
                  </div>

                  {/* Price per Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Unit *
                    </label>
                    <input
                      type="number"
                      name="price_per_unit"
                      value={newRequestForm.price_per_unit}
                      onChange={handleNewRequestChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter price per unit"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* When Needed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      When Needed *
                    </label>
                    <input
                      type="text"
                      name="when"
                      value={newRequestForm.when}
                      onChange={handleNewRequestChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 10-Feb-2026"
                      required
                    />
                  </div>

                  {/* Request Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Description
                    </label>
                    <textarea
                      name="request_description"
                      value={newRequestForm.request_description}
                      onChange={handleNewRequestChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your requirements (optional)"
                    />
                  </div>

                  {/* Admin Deal Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Admin Deal</h4>
                      <p className="text-sm text-gray-600">Mark this as an admin-verified request</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNewRequestChange({ target: { name: 'admin_deal', type: 'checkbox', checked: !newRequestForm.admin_deal } })}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        newRequestForm.admin_deal ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          newRequestForm.admin_deal ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsNewRequestModalOpen(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Create Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {requests.length === 0 && (
            <div className="text-center py-16">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests yet</h3>
              <p className="text-gray-500">Create your first product request to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}