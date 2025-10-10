import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Package, DollarSign, Eye, FileText, TrendingUp, Bell, User, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function FarmerMarketplace() {
  const navigate = useNavigate();
  const { user, getToken, logout, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('Marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [consumerRequests, setConsumerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch consumer requests from API
  const fetchConsumerRequests = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      console.log('Fetching consumer requests from API...');

      const response = await fetch('http://127.0.0.1:8000/api/v1/consumer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Consumer requests data received:', data);
        
        // The API returns data.req
        const requestsArray = data.data?.req || [];
        console.log('Extracted requests array:', requestsArray);
        
        setConsumerRequests(requestsArray);
        setError('');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setError(errorData.message || 'Failed to fetch consumer requests');
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching consumer requests:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Authentication check and data fetching
  useEffect(() => {
    console.log('FarmerMarketplace useEffect - userLoading:', userLoading, 'user:', user);
    
    if (userLoading) {
      console.log('UserContext is still loading...');
      return;
    }

    if (!user?.user_id) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // User is authenticated, fetch data
    fetchConsumerRequests();
  }, [user, userLoading, navigate]);

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  const sidebarItems = [
    { name: 'My Listings', icon: FileText, path: '/farmer' },
    { name: 'Marketplace', icon: TrendingUp, path: '/farmer/marketplace' },
    { name: 'Messages', icon: MessageSquare, path: '/farmer/messages' },
    { name: 'Notifications', icon: Bell, path: '/farmer/notifications' },
    { name: 'Profile', icon: User, path: '/farmer/profile' }
  ];

  const filteredRequests = consumerRequests.filter(req => 
    req.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.request_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">FarmConnect</h1>
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
            <h1 className="text-2xl font-bold text-green-600">FarmConnect</h1>
            <p className="text-sm text-gray-500 mt-1">Farmer Marketplace</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
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
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-green-600">FarmConnect</h1>
          <p className="text-sm text-gray-500 mt-1">Farmer Marketplace</p>
        </div>
        
        <nav className="flex-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === item.name
                    ? 'bg-green-50 text-green-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <User size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Consumer Requests Marketplace</h1>
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
            {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div 
                  key={request._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{request.product_name}</h3>
                      {request.admin_deal && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Admin Deal
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Package className="w-4 h-4 mr-2 text-green-600" />
                        <span>{request.product_quantity} {request.quantity_unit}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        <span>{request.price_per_unit} {request.currency || 'BDT'}/{request.quantity_unit}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        <span>Due: {new Date(request.when).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {request.request_description}
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
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-16">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No consumer requests found</h3>
                <p className="text-gray-500">Check back later for new requests from consumers</p>
              </div>
            )}
          </div>
                                    </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
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
                <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.product}</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Package className="w-4 h-4 mr-2 text-green-600" />
                      <span>Quantity: {selectedRequest.quantity} {selectedRequest.unit}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      <span>Price: {selectedRequest.pricePerUnit} {selectedRequest.currency}/{selectedRequest.unit}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>Needed by: {new Date(selectedRequest.neededBy).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Consumer Details</h3>
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
                      <span>Posted: {new Date(selectedRequest.postedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => {
                    // TODO: Implement bid submission
                    console.log('Place bid clicked');
                  }}
                >
                  Place Bid
                </button>
                <button 
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // TODO: Implement message functionality
                    console.log('Message consumer clicked');
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