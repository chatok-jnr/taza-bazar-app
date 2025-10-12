import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageSquare, User, FileText, Edit2, Trash2, MapPin, Calendar, Package, DollarSign, TrendingUp, Bell, X, Save, Mail, Phone } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ConsumerDashboard() {
  console.log('ConsumerDashboard component mounted');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getToken, logout, isLoading: userLoading } = useUser();
  
  // Get active tab from URL search params, default to 'My Requests'
  const getActiveTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const validTabs = ['My Requests', 'Marketplace', 'Notifications', 'Messages', 'Profile'];
    return validTabs.includes(tab) ? tab : 'My Requests';
  };
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [marketplaceError, setMarketplaceError] = useState('');

  // Edit Request Modal State
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editRequestForm, setEditRequestForm] = useState({
    product_name: '',
    product_quantity: '',
    quantity_unit: 'kg',
    price_per_unit: '',
    when: '',
    request_description: '',
    admin_deal: false
  });

  // Delete Confirmation Modal State
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profile, setProfile] = useState({
    name: user?.user_name || 'John Anderson',
    email: user?.user_email || 'john.anderson@example.com',
    phone: user?.user_no || '+1 (555) 123-4567',
    userId: user?.user_id || 'USR-2024-001',
    location: user?.location || 'Green Valley, CA',
    gender: user?.gender || 'Not specified',
    birthDate: user?.user_birth_date ? new Date(user.user_birth_date).toLocaleDateString() : 'Not set',
    activeListing: user?.active_listing || 0,
    totalRevenue: user?.total_revenue || 0,
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
  });
  const [editForm, setEditForm] = useState({ ...profile });

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
        const responseData = data.data || {};
        const { req: requestsArray = [] } = responseData;
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

  // Fetch farmer products from API
  const fetchFarmerProducts = async () => {
    try {
      setMarketplaceLoading(true);
      setMarketplaceError('');
      const token = getToken();
      
      if (!token) {
        setMarketplaceError('No authentication token found. Please login again.');
        return;
      }

      console.log('Fetching farmer products...');

      const response = await fetch('http://127.0.0.1:8000/api/v1/farmer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Farmer products response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Farmer products data received:', data);
        
        // The API returns data.product array
        const responseData = data.data || {};
        const { product: productsArray = [] } = responseData;
        console.log('Extracted products array:', productsArray);
        
        setFarmerProducts(productsArray);
        setMarketplaceError('');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        setMarketplaceError(errorData.message || 'Failed to fetch farmer products');
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching farmer products:', error);
      setMarketplaceError('Network error. Please try again.');
    } finally {
      setMarketplaceLoading(false);
    }
  };

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    if (!user?.user_id) {
      console.log('No user ID available for profile fetch');
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        console.log('No authentication token found for profile fetch');
        return;
      }

      console.log('Fetching user profile for user ID:', user.user_id);

      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('User profile response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('User profile data received:', data);
        
        // Update profile with API data - mapping to actual API response structure
        const userData = data.data || {};
        const apiProfile = {
          name: userData.user_name || 'User',
          email: userData.user_email || 'user@example.com',
          phone: userData.user_no || '+1 (555) 123-4567',
          userId: userData._id || user.user_id,
          location: userData.location || 'Location not set',
          gender: userData.gender || 'Not specified',
          birthDate: userData.user_birth_date ? new Date(userData.user_birth_date).toLocaleDateString() : 'Not set',
          activeListing: userData.active_listing || 0,
          totalRevenue: userData.total_revenue || 0,
          memberSince: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'
        };
        
        setProfile(apiProfile);
        setEditForm(apiProfile);
      } else {
        const errorData = await response.json();
        console.error('Profile API Error:', errorData);
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Profile management functions
  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
    setProfileError('');
  };

  const handleSave = async () => {
    if (!user?.user_id) {
      setProfileError('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setProfileError('');
      const token = getToken();
      
      if (!token) {
        setProfileError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare data for PATCH request (exclude user_id and read-only fields)
      const updateData = { ...editForm };
      delete updateData.userId; // Don't send user_id in body
      
      // Map frontend field names to backend field names
      updateData.user_name = updateData.name;
      updateData.user_email = updateData.email;
      updateData.user_no = updateData.phone;
      // Keep location and gender as is
      
      // Remove frontend field names and read-only fields
      delete updateData.name;
      delete updateData.email;
      delete updateData.phone;
      delete updateData.birthDate;
      delete updateData.activeListing;
      delete updateData.totalRevenue;
      delete updateData.memberSince;

      console.log('Updating profile with data:', updateData);

      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${user.user_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        
        // Update the profile state with the new data
        setProfile({ ...editForm });
        setIsEditing(false);
        setProfileError('');
        
        // Optionally show success message
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Profile update error:', errorData);
        setProfileError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setProfileError('');
  };

  const handleProfileChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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
      
      // Fetch profile data if Profile tab is initially active
      const currentTab = getActiveTabFromURL();
      if (currentTab === 'Profile') {
        fetchUserProfile();
      }
      
      // Fetch farmer products if Marketplace tab is initially active
      if (currentTab === 'Marketplace') {
        fetchFarmerProducts();
      }
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

      if (response.ok) {
        const data = await response.json();
        console.log('Request created successfully:', data);
        
        // Close modal and refresh requests
        setIsNewRequestModalOpen(false);
        setNewRequestForm({
          product_name: '',
          product_quantity: '',
          quantity_unit: 'kg',
          price_per_unit: '',
          when: '',
          request_description: '',
          admin_deal: false
        });
        
        // Refresh the requests list
        await fetchConsumerRequests();
      } else {
        const errorData = await response.json();
        console.error('Error creating request:', errorData);
        setError(errorData.message || 'Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  // Edit request function
  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setEditRequestForm({
      product_name: request.product_name,
      product_quantity: request.product_quantity.toString(),
      quantity_unit: request.quantity_unit,
      price_per_unit: request.price_per_unit.toString(),
      when: request.when,
      request_description: request.request_description || '',
      admin_deal: request.admin_deal || false
    });
    setIsEditRequestModalOpen(true);
  };

  // Delete request function
  const handleDeleteRequest = async (requestId) => {
    // Open custom confirmation modal instead of window.confirm
    setRequestToDelete(requestId);
    setIsDeleteConfirmModalOpen(true);
  };

  // Confirm delete function
  const confirmDeleteRequest = async () => {
    if (!requestToDelete) {
      return;
    }

    try {
      const token = getToken();
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      console.log('Deleting request with ID:', requestToDelete);

      const response = await fetch(`http://127.0.0.1:8000/api/v1/consumer/${requestToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Request deleted successfully');
        // Refresh the requests list
        await fetchConsumerRequests();
        alert('Request deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error deleting request:', errorData);
        setError(errorData.message || 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      setError('Network error. Please try again.');
    } finally {
      // Close modal and reset state
      setIsDeleteConfirmModalOpen(false);
      setRequestToDelete(null);
    }
  };

  // Cancel delete function
  const cancelDeleteRequest = () => {
    setIsDeleteConfirmModalOpen(false);
    setRequestToDelete(null);
  };

  // Update request function
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    
    if (!editingRequest?._id) {
      setError('Request ID not found. Please try again.');
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
        ...editRequestForm,
        product_quantity: parseInt(editRequestForm.product_quantity),
        price_per_unit: parseFloat(editRequestForm.price_per_unit)
      };

      console.log('Updating request:', requestData);

      const response = await fetch(`http://127.0.0.1:8000/api/v1/consumer/${editingRequest._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Request updated successfully:', data);
        
        // Close modal and refresh requests
        setIsEditRequestModalOpen(false);
        setEditingRequest(null);
        setEditRequestForm({
          product_name: '',
          product_quantity: '',
          quantity_unit: 'kg',
          price_per_unit: '',
          when: '',
          request_description: '',
          admin_deal: false
        });
        
        // Refresh the requests list
        await fetchConsumerRequests();
        alert('Request updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error updating request:', errorData);
        setError(errorData.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
    
    // Update URL with the selected tab
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabName);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    
    // Fetch farmer products when Marketplace tab is selected
    if (tabName === 'Marketplace' && farmerProducts.length === 0) {
      fetchFarmerProducts();
    }
    
    // Fetch user profile when Profile tab is selected
    if (tabName === 'Profile') {
      fetchUserProfile();
    }
  };

  // Effect to sync activeTab with URL changes (like browser back/forward)
  useEffect(() => {
    const newActiveTab = getActiveTabFromURL();
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
      
      // Fetch farmer products when Marketplace tab is selected
      if (newActiveTab === 'Marketplace' && farmerProducts.length === 0) {
        fetchFarmerProducts();
      }
      
      // Fetch user profile when Profile tab is selected
      if (newActiveTab === 'Profile') {
        fetchUserProfile();
      }
    }
  }, [location.search]);

  // Effect to update profile when user data changes
  useEffect(() => {
    if (user) {
      const updatedProfile = {
        name: user.user_name || 'John Anderson',
        email: user.user_email || 'john.anderson@example.com', 
        phone: user.user_no || '+1 (555) 123-4567',
        userId: user.user_id || user._id || 'USR-2024-001',
        location: user.location || 'Green Valley, CA',
        gender: user.gender || 'Not specified',
        birthDate: user.user_birth_date ? new Date(user.user_birth_date).toLocaleDateString() : 'Not set',
        activeListing: user.active_listing || 0,
        totalRevenue: user.total_revenue || 0,
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
      };
      setProfile(updatedProfile);
      setEditForm(updatedProfile);
    }
  }, [user]);

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
                requests.map((requestItem) => (
                  <div key={requestItem._id || requestItem.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-gray-800">{requestItem.product_name}</h3>
                              {requestItem.admin_deal && (
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                  Admin Deal
                                </span>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditRequest(requestItem);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Edit Request"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRequest(requestItem._id || requestItem.id);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete Request"
                              >
                                <Trash2 size={18} />
                              </button>
                              <Link 
                                to={`/request/${requestItem._id || requestItem.id}`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <FileText size={18} />
                              </Link>
                            </div>
                          </div>
                        
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2 text-gray-700">
                              <Package size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Quantity</p>
                                <p className="font-semibold">{requestItem.product_quantity} {requestItem.quantity_unit}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <DollarSign size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Price per Unit</p>
                                <p className="font-semibold">৳{requestItem.price_per_unit}/{requestItem.quantity_unit}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <Calendar size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">When Needed</p>
                                <p className="font-semibold">{requestItem.when}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-700">
                              <FileText size={18} className="text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Description</p>
                                <p className="font-semibold text-sm">{requestItem.request_description || 'No description'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            
            {/* Loading State */}
            {marketplaceLoading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading farmer products...</p>
              </div>
            )}
            
            {/* Error State */}
            {marketplaceError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {marketplaceError}
                <button 
                  onClick={fetchFarmerProducts}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}
            
            {/* Products Grid */}
            {!marketplaceLoading && !marketplaceError && farmerProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmerProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <Package size={64} className="text-green-600" />
                      {product.admin_deal && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Admin Deal
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.product_name}</h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <Package size={16} className="mr-2 text-green-600" />
                          <span className="text-sm">Quantity: <strong>{product.product_quantity} {product.quantity_unit}</strong></span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                          <DollarSign size={16} className="mr-2 text-green-600" />
                          <span className="text-sm">Price: <strong>৳{product.price_per_unit}/{product.quantity_unit}</strong></span>
                        </div>
                        
                        {product.from && product.to && (
                          <div className="flex items-center text-gray-700">
                            <Calendar size={16} className="mr-2 text-green-600" />
                            <span className="text-sm">Available: {new Date(product.from).toLocaleDateString()} - {new Date(product.to).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {product.product_description && (
                          <div className="flex items-start text-gray-700">
                            <FileText size={16} className="mr-2 text-green-600 mt-0.5" />
                            <span className="text-sm">{product.product_description}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-2xl font-bold text-green-600">৳{product.price_per_unit}</span>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                          Contact Farmer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Products State */}
            {!marketplaceLoading && !marketplaceError && farmerProducts.length === 0 && (
              <div className="text-center py-16">
                <TrendingUp size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products available</h3>
                <p className="text-gray-500">Check back later for fresh produce from farmers</p>
                <button 
                  onClick={fetchFarmerProducts}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}
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
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
              <p className="text-gray-600 mt-2">Manage your account information</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8 mb-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-sm text-gray-500 mt-2">User ID: {profile.userId}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:scale-105"
                  >
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details Cards */}
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User ID Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">User ID</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Email Address</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Location</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.location}</p>
                    </div>
                  </div>
                </div>

                {/* Gender Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Gender</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Birth Date Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Birth Date</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.birthDate}</p>
                    </div>
                  </div>
                </div>

                {/* Member Since Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Member Since</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.memberSince}</p>
                    </div>
                  </div>
                </div>

                {/* Active Listings Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Active Listings</p>
                      <p className="text-gray-800 font-semibold mt-1">{profile.activeListing}</p>
                    </div>
                  </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                      <p className="text-gray-800 font-semibold mt-1">৳{profile.totalRevenue}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Profile Information</h3>
                
                {/* Error State */}
                {profileError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {profileError}
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User ID
                    </label>
                    <input
                      type="text"
                      name="userId"
                      value={editForm.userId}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">User ID cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Not specified">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:scale-105"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:bg-gray-300 hover:shadow-md"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user is not authenticated and there's an error
  if (error && !user?.user_id) {
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
          <button 
            onClick={() => navigate('/')}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
          </button>
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
          {renderTabContent()}
        </div>
      </div>

      {/* New Request Modal */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Create New Request</h3>
              <button
                onClick={() => setIsNewRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newRequestForm.product_name}
                    onChange={(e) => setNewRequestForm({...newRequestForm, product_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newRequestForm.product_quantity}
                    onChange={(e) => setNewRequestForm({...newRequestForm, product_quantity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={newRequestForm.quantity_unit}
                    onChange={(e) => setNewRequestForm({...newRequestForm, quantity_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRequestForm.price_per_unit}
                    onChange={(e) => setNewRequestForm({...newRequestForm, price_per_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When Needed</label>
                  <input
                    type="text"
                    value={newRequestForm.when}
                    onChange={(e) => setNewRequestForm({...newRequestForm, when: e.target.value})}
                    placeholder="e.g., ASAP, Next week, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newRequestForm.request_description}
                    onChange={(e) => setNewRequestForm({...newRequestForm, request_description: e.target.value})}
                    rows="3"
                    placeholder="Additional details about your request..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newRequestForm.admin_deal}
                      onChange={(e) => setNewRequestForm({...newRequestForm, admin_deal: e.target.checked})}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Admin Deal (Priority Request)</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {isEditRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Edit Request</h3>
              <button
                onClick={() => setIsEditRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateRequest} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editRequestForm.product_name}
                    onChange={(e) => setEditRequestForm({...editRequestForm, product_name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editRequestForm.product_quantity}
                    onChange={(e) => setEditRequestForm({...editRequestForm, product_quantity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={editRequestForm.quantity_unit}
                    onChange={(e) => setEditRequestForm({...editRequestForm, quantity_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="liter">liter</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editRequestForm.price_per_unit}
                    onChange={(e) => setEditRequestForm({...editRequestForm, price_per_unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When Needed</label>
                  <input
                    type="text"
                    value={editRequestForm.when}
                    onChange={(e) => setEditRequestForm({...editRequestForm, when: e.target.value})}
                    placeholder="e.g., ASAP, Next week, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editRequestForm.request_description}
                    onChange={(e) => setEditRequestForm({...editRequestForm, request_description: e.target.value})}
                    rows="3"
                    placeholder="Additional details about your request..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editRequestForm.admin_deal}
                      onChange={(e) => setEditRequestForm({...editRequestForm, admin_deal: e.target.checked})}
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Admin Deal (Priority Request)</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditRequestModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Delete Request</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this request? This will permanently remove the request and cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDeleteRequest}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteRequest}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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