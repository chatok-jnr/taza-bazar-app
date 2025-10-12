import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText, MessageSquare, User, MapPin, Calendar, DollarSign, Package, Award, TrendingUp, Bell } from 'lucide-react';
import { useUser } from '../context/UserContext';
import NewListingModal from '../components/NewListingModal';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('My Listings');
  const [farmerListings, setFarmerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const navigate = useNavigate();
  const { user, getToken, logout } = useUser();

  // Fetch farmer listings from API
  const fetchFarmerListings = async () => {
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

      const response = await fetch(`http://127.0.0.1:8000/api/v1/farmer/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      console.log(data);

      if (response.ok) {
        setFarmerListings(data.data.products || []);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching farmer listings:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerListings();
  }, [user?.user_id, getToken, navigate]);

  // Function to create a new listing
  const handleCreateListing = async (listingData, isEditMode = false) => {
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

      console.log('Edit mode:', isEditMode);
      console.log('Listing data received:', listingData);

      let dataToSubmit;
      
      if (isEditMode) {
        // For manage listing (edit mode), don't include user_id
        dataToSubmit = { ...listingData };
        // Keep the _id for URL construction but remove it from request body after using it
        const productId = dataToSubmit._id;
        delete dataToSubmit._id;
        // Store productId back in listingData for URL construction
        listingData._id = productId;
        console.log('Product ID for update:', productId);
        console.log('Data to submit for update:', dataToSubmit);
      } else {
        // For new listing, include user_id
        dataToSubmit = {
          ...listingData,
          user_id: user.user_id
        };
        console.log('Data to submit for create:', dataToSubmit);
      }

      let response;
      if (isEditMode) {
        // Update existing listing using PATCH request to the product ID endpoint
        const productId = listingData._id;
        if (!productId) {
          throw new Error('Product ID is required for updating');
        }
        
        const url = `http://127.0.0.1:8000/api/v1/farmer/${productId}`;
        console.log('PATCH URL:', url);
        
        response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });
      } else {
        // Create new listing
        const url = 'http://127.0.0.1:8000/api/v1/farmer';
        console.log('POST URL:', url);
        
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSubmit),
        });
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Success - refresh the listings by fetching fresh data from server
        await fetchFarmerListings();
        setError('');
        // Show success message (you can replace this with a toast notification)
        alert(isEditMode ? 'Listing updated successfully!' : 'Listing created successfully!');
      } else {
        const errorMessage = data.message || (isEditMode ? 'Failed to update listing' : 'Failed to create listing');
        setError(errorMessage);
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating/updating listing:', error);
      const errorMessage = error.message || 'Network error. Please try again.';
      setError(errorMessage);
      throw error; // Re-throw to let the modal handle it
    }
  };

  // Function to delete a listing
  const handleDeleteListing = async (listingId) => {
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

      const response = await fetch(`http://127.0.0.1:8000/api/v1/farmer/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Success - refresh the listings by fetching fresh data from server
        await fetchFarmerListings();
        setError('');
        alert('Listing deleted successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete listing');
        throw new Error(data.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Network error. Please try again.');
      throw error;
    }
  };

  // Function to handle manage listing click
  const handleManageListing = (listing) => {
    setEditingListing(listing);
    setIsNewListingModalOpen(true);
  };

  // Function to close modal and reset editing state
  const handleCloseModal = () => {
    setIsNewListingModalOpen(false);
    setEditingListing(null);
  };

  // Helper function to format date range
  const formatDateRange = (from, to) => {
    const fromDate = new Date(from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const toDate = new Date(to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${fromDate} - ${toDate}`;
  };

  // Helper function to format price with currency
  const formatPrice = (price, currency) => {
    const currencySymbol = currency === 'BDT' ? '৳' : '₹';
    return `${currencySymbol}${price}`;
  };

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { name: 'My Listings', icon: Home, path: '/farmer' },
    { name: 'Marketplace', icon: TrendingUp, path: '/farmer/marketplace' },
    { name: 'Messages', icon: MessageSquare, path: '/farmer/messages' },
    { name: 'Notifications', icon: Bell, path: '/farmer/notifications' },
    { name: 'Profile', icon: User, path: '/farmer/profile' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Farmer Dashboard</p>
          </button>
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
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <Award className="text-green-600 mb-2" size={24} />
            <p className="text-sm font-medium text-gray-800">Pro Seller</p>
            <p className="text-xs text-gray-600 mt-1">Level 2 Farmer</p>
          </div>
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
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.user_name || 'Farmer'}!
            </h2>
            <p className="text-gray-600">Manage your listings and connect with buyers</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{farmerListings.length}</p>
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
              <button 
                onClick={() => setIsNewListingModalOpen(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                + New Listing
              </button>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600">Loading your listings...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && farmerListings.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600">Create your first listing to start selling your products!</p>
              </div>
            )}

            {/* Listings Grid */}
            {!loading && !error && farmerListings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farmerListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                      {listing.admin_deal && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Award size={14} />
                          Admin Deal
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{listing.product_name}</h4>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Package size={16} className="mr-2 text-green-600" />
                          <span>{listing.product_quantity} {listing.quantity_unit}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign size={16} className="mr-2 text-green-600" />
                          <span className="font-semibold text-gray-800">
                            {formatPrice(listing.price_per_unit, listing.currency)}/{listing.quantity_unit}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2 text-green-600" />
                          <span>{formatDateRange(listing.from, listing.to)}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          <p className="line-clamp-2">{listing.product_description}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleManageListing(listing)}
                        className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium"
                      >
                        Manage Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace moved to a dedicated page (no inline panel here) */}
        </div>
      </div>

      {/* New Listing Modal */}
      <NewListingModal
        isOpen={isNewListingModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateListing}
        editData={editingListing}
        onDelete={handleDeleteListing}
      />
    </div>
  );
}