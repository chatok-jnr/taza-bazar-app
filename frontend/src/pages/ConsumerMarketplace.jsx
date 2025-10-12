import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link, useLocation } from 'react-router-dom';
import { FileText, TrendingUp, Bell, MessageSquare, User, MapPin, Calendar, Package } from 'lucide-react';

// Posts will be loaded from an API; start with an empty array
// TODO: Replace with actual data fetching from backend API


// Sidebar Component
function Sidebar() {
  const location = useLocation();
  
  const sidebarItems = [
    { name: 'My Requests', icon: FileText, path: '/consumer' },
    { name: 'Marketplace', icon: TrendingUp, path: '/consumer/marketplace' },
    { name: 'Notifications', icon: Bell, path: '/consumer/notifications' },
    { name: 'Messages', icon: MessageSquare, path: '/consumer/messages' },
    { name: 'Profile', icon: User, path: '/consumer/profile' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
        <p className="text-sm text-gray-500 mt-1">Consumer Dashboard</p>
      </div>
      <nav className="p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// Product Card Component - Compact Fiverr Style
function ProductCard({ post, onViewDetails, hasUserBid, hasAcceptedBid }) {
  // Temporary test - make first product show as already bid
  const testHasUserBid = hasUserBid || post.productName === "Test Product";
  
  return (
    <div className={`group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer ${
      testHasUserBid ? 'ring-1 ring-yellow-400' : ''
    } ${hasAcceptedBid ? 'ring-1 ring-green-500' : ''}`}
    onClick={() => onViewDetails(post)}>
      
      {/* Compact Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500"></div>
        </div>
        
        {/* Product Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-green-700" />
          </div>
        </div>

        {/* Status Badge */}
        {(testHasUserBid || hasAcceptedBid) && (
          <div className="absolute top-2 left-2">
            {hasAcceptedBid ? (
              <div className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-sm">
                ✓ Accepted
              </div>
            ) : testHasUserBid ? (
              <div className="bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-sm">
                ⏳ Pending
              </div>
            ) : null}
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
            <span className="text-sm font-bold text-green-600">{post.price}</span>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
          {post.productName}
        </h3>
        
        {/* Farmer */}
        <p className="text-xs text-gray-500 mb-3">by {post.farmer}</p>
        
        {/* Key Info - Better Layout */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Package size={12} />
              <span>Qty: {post.quantity}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={12} />
              <span className="truncate max-w-20">{post.location}</span>
            </div>
          </div>
          
          {/* Availability Period - Full Text */}
          {post.dateRange && (
            <div className="flex items-start space-x-1 text-xs text-gray-600">
              <Calendar size={12} className="mt-0.5 flex-shrink-0" />
              <span className="leading-tight break-words">
                {post.dateRange}
              </span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button 
          className="w-full bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-green-300 group-hover:shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(post);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// Product Details Modal - Fiverr Style
function ProductDetailsModal({ isOpen, onClose, post, onPlaceBid, onContactFarmer, hasUserBid, hasAcceptedBid, activeFilter, acceptedBidDetails }) {
  if (!isOpen || !post) return null;

  const testHasUserBid = hasUserBid || post.productName === "Test Product";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
        {/* Header - Fixed */}
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">{post.productName}</h2>
            <p className="text-green-100">Fresh produce from {post.farmer}</p>
          </div>
          
          {/* Status Badge */}
          {(testHasUserBid || hasAcceptedBid) && (
            <div className="absolute bottom-4 left-6">
              {hasAcceptedBid ? (
                <div className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 text-sm font-bold rounded-full border border-white border-opacity-30">
                  🎉 Bid Accepted
                </div>
              ) : testHasUserBid ? (
                <div className="bg-yellow-500 bg-opacity-90 text-white px-3 py-1 text-sm font-bold rounded-full">
                  ⏳ Bid Pending
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Content - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="p-6">
              {/* Product Image */}
              <div className="relative h-64 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-xl mb-6 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Package className="w-12 h-12 text-green-700" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
                    <span className="text-2xl font-bold text-green-600">{post.price}</span>
                    <span className="text-sm text-gray-600 ml-1">per unit</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    Fresh, high-quality {post.productName.toLowerCase()} directly from our farm. 
                    We ensure the best quality produce with organic farming methods. 
                    This product is carefully selected and harvested at the perfect time 
                    to deliver maximum freshness and nutritional value.
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Quantity Available</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{post.quantity}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Location</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{post.location}</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Availability Period</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{post.dateRange}</p>
                  </div>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">About the Farmer</h4>
                    <p className="text-sm text-gray-600">Farmer: {post.farmer}</p>
                    <p className="text-sm text-blue-600">Verified local farmer with quality produce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Actions */}
          <div className="lg:w-80 bg-gray-50 p-6 border-l border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="space-y-6">
              {/* Price Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">{post.price}</div>
                  <div className="text-sm text-gray-600">per unit</div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Available Quantity</span>
                    <span className="font-semibold text-gray-900">{post.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="font-semibold text-gray-900 text-right text-sm">{post.location}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Available Until</span>
                    <span className="font-semibold text-gray-900 text-right text-sm">{post.dateRange?.split(' - ')[1] || 'Available'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {activeFilter === 'accepted' && acceptedBidDetails ? (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center space-x-2">
                          <span>🎉</span>
                          <span>Your Accepted Bid</span>
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">Quantity:</span>
                            <span className="text-sm font-bold">{acceptedBidDetails.requested_quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">Your Price:</span>
                            <span className="text-sm font-bold text-green-600">৳{acceptedBidDetails.bid_price}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-green-200">
                            <span className="font-medium">Total:</span>
                            <span className="text-lg font-bold text-green-700">৳{(acceptedBidDetails.bid_price * acceptedBidDetails.requested_quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onContactFarmer(post)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                      >
                        <MessageSquare size={18} />
                        <span>Contact Farmer</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {hasAcceptedBid ? (
                        <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-3 rounded-lg font-semibold text-center border border-green-200 flex items-center justify-center space-x-2">
                          <span>🎉</span>
                          <span>Bid Accepted!</span>
                        </div>
                      ) : testHasUserBid ? (
                        <div className="w-full bg-gray-100 text-gray-600 px-4 py-3 rounded-lg font-medium text-center border border-gray-200 flex items-center justify-center space-x-2">
                          <span>⏳</span>
                          <span>Bid Pending</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onPlaceBid(post)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <Package size={18} />
                          <span>Place Bid</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => onContactFarmer(post)}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <MessageSquare size={16} />
                        <span>Contact Farmer</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Trust & Safety */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Trust & Safety</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Verified farmer</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Quality guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment</span>
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

// Place Bid Modal Component
function PlaceBidModal({ isOpen, onClose, post, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    bid_price: '',
    requested_quantity: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bid_price || parseFloat(formData.bid_price) <= 0) {
      newErrors.bid_price = 'Please enter a valid bid price';
    }
    
    if (!formData.requested_quantity || parseInt(formData.requested_quantity) <= 0) {
      newErrors.requested_quantity = 'Please enter a valid quantity';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      bid_price: '',
      requested_quantity: '',
      message: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Place Bid</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        {post && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800">{post.productName}</h4>
            <p className="text-sm text-gray-600">by {post.farmer}</p>
            <p className="text-sm text-green-600 font-medium">Current Price: {post.price}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bid Price (৳)
            </label>
            <input
              type="number"
              name="bid_price"
              value={formData.bid_price}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.bid_price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your bid price"
            />
            {errors.bid_price && (
              <p className="text-red-500 text-sm mt-1">{errors.bid_price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requested Quantity
            </label>
            <input
              type="number"
              name="requested_quantity"
              value={formData.requested_quantity}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.requested_quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter quantity needed"
            />
            {errors.requested_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.requested_quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your message to the farmer"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Marketplace Component
export default function MarketplacePage() {
  const [posts, setPosts] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [marketplaceError, setMarketplaceError] = useState('');
  
  // User bids state
  const [userBids, setUserBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' or 'accepted'
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Accepted bids state
  const [acceptedBids, setAcceptedBids] = useState([]);
  const [acceptedBidsLoading, setAcceptedBidsLoading] = useState(false);
  const [acceptedBidsError, setAcceptedBidsError] = useState('');
  
  // Bid modal state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isBidSubmitting, setIsBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidError, setBidError] = useState('');
  
  // Details modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState(null);
  
  // Alert state for already bid message
  const [showAlreadyBidAlert, setShowAlreadyBidAlert] = useState(false);
  const [alreadyBidProduct, setAlreadyBidProduct] = useState('');
  
  const { getToken, logout, user } = useUser();

  // Fetch farmer products from API (token-aware)
  const fetchFarmerProducts = async () => {
    try {
      setMarketplaceLoading(true);
      setMarketplaceError('');

      const token = getToken && getToken();
      if (!token) {
        setMarketplaceError('No authentication token found. Please login again.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/farmer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const responseData = data.data || {};
        // Try to read both `product` or `posts` shape depending on API
        const productsArray = responseData.product || responseData.posts || responseData.products || [];
        // Normalize to posts shape used in this page if necessary
        setPosts(productsArray.map(p => ({
          id: p._id || p.id || p.product_id,
          productName: p.product_name || p.productName,
          farmer: p.farmer_name || p.farmer || p.user_name || p.seller,
          farmer_id: p.user_id || p.farmer_id || p.seller_id, // Make sure we capture farmer_id
          image: p.image || p.product_image || '/vite.svg',
          category: p.category || p.product_category || 'Vegetables',
          quantity: p.product_quantity || p.quantity || '1',
          location: p.location || p.from_location || 'Unknown',
          dateRange: p.from && p.to ? `${new Date(p.from).toLocaleDateString()} - ${new Date(p.to).toLocaleDateString()}` : (p.dateRange || ''),
          price: p.price_per_unit ? `৳${p.price_per_unit}` : (p.price || '৳0'),
        })));
        setMarketplaceError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMarketplaceError(errorData.message || 'Failed to fetch farmer products');
        if (response.status === 401 || response.status === 403) {
          logout && logout();
        }
      }
    } catch (error) {
      console.error('Error fetching farmer products:', error);
      setMarketplaceError('Network error. Please try again.');
    } finally {
      setMarketplaceLoading(false);
    }
  };

  // Fetch user's existing bids
  const fetchUserBids = async () => {
    try {
      setBidsLoading(true);

      const token = getToken && getToken();
      if (!token || !user || !user.user_id) {
        return;
      }

      // Assuming there's an endpoint to get user's bids
      const response = await fetch(`http://127.0.0.1:8000/api/v1/buyer/consumer/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user bids response:', data);
        const bidsData = data.data || data.bids || [];
        console.log('Processed bids data:', bidsData);
        setUserBids(bidsData);
      } else {
        console.error('Failed to fetch user bids');
      }
    } catch (error) {
      console.error('Error fetching user bids:', error);
    } finally {
      setBidsLoading(false);
    }
  };

  // Fetch accepted bids from API
  const fetchAcceptedBids = async () => {
    try {
      setAcceptedBidsLoading(true);
      setAcceptedBidsError('');

      const token = getToken && getToken();
      if (!token || !user || !user.user_id) {
        setAcceptedBidsError('No authentication token or user found. Please login again.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/v1/buyer/accepted', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consumer_id: user.user_id
        })
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched accepted bids response:', data);
        const acceptedBidsData = data.acBid || [];
        console.log('Processed accepted bids data:', acceptedBidsData);
        setAcceptedBids(acceptedBidsData);
        setAcceptedBidsError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setAcceptedBidsError(errorData.message || 'Failed to fetch accepted bids');
        if (response.status === 401 || response.status === 403) {
          logout && logout();
        }
      }
    } catch (error) {
      console.error('Error fetching accepted bids:', error);
      setAcceptedBidsError('Network error. Please try again.');
    } finally {
      setAcceptedBidsLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchFarmerProducts();
    if (user && user.user_id) {
      fetchUserBids();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Check if user has already bid on a product
  const hasAlreadyBid = (productId) => {
    console.log('Checking if user has bid on product:', productId);
    console.log('User bids:', userBids);
    const hasBid = userBids.some(bid => 
      (bid.post_id === productId || bid.product_id === productId)
    );
    console.log('Has already bid:', hasBid);
    return hasBid;
  };

  // Check if user has an accepted bid on a product
  const hasAcceptedBid = (productId) => {
    return acceptedBids.some(bid => bid.post_id === productId);
  };

  // Get accepted bid details for a product
  const getAcceptedBidDetails = (productId) => {
    return acceptedBids.find(bid => bid.post_id === productId);
  };

  // Filter products based on active filter
  const filterProducts = () => {
    if (activeFilter === 'all') {
      // Show products with quantity > 0 and valid date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
      
      return posts.filter(post => {
        // Check quantity
        const quantity = parseInt(post.quantity) || 0;
        if (quantity <= 0) return false;
        
        // Check date - extract end date from dateRange if available
        if (post.dateRange) {
          const dateMatch = post.dateRange.match(/- (.+)$/);
          if (dateMatch) {
            const endDate = new Date(dateMatch[1]);
            if (endDate < today) return false;
          }
        }
        
        return true;
      });
    } else if (activeFilter === 'accepted') {
      // Show only products that match accepted bid post_ids
      const acceptedPostIds = acceptedBids.map(bid => bid.post_id);
      return posts.filter(post => acceptedPostIds.includes(post.id));
    }
    
    return posts;
  };

  // Update filtered posts when posts, acceptedBids, or activeFilter changes
  useEffect(() => {
    setFilteredPosts(filterProducts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, acceptedBids, activeFilter]);

  // Handle placing a bid
  const handlePlaceBid = (post) => {
    // Check if user has already bid on this product
    if (hasAlreadyBid(post.id)) {
      setAlreadyBidProduct(post.productName);
      setShowAlreadyBidAlert(true);
      // Auto-hide the alert after 5 seconds
      setTimeout(() => {
        setShowAlreadyBidAlert(false);
        setAlreadyBidProduct('');
      }, 5000);
      return;
    }

    setSelectedPost(post);
    setIsBidModalOpen(true);
    setBidError('');
    setBidSuccess('');
  };

  // Handle contacting farmer
  const handleContactFarmer = (post) => {
    // TODO: Implement contact farmer functionality
    alert(`Contact farmer: ${post.farmer} for ${post.productName}`);
  };

  // Handle viewing product details
  const handleViewDetails = (post) => {
    setSelectedProductForDetails(post);
    setIsDetailsModalOpen(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProductForDetails(null);
  };

  // Submit bid to API
  const submitBid = async (formData) => {
    try {
      setIsBidSubmitting(true);
      setBidError('');

      const token = getToken && getToken();
      if (!token) {
        setBidError('No authentication token found. Please login again.');
        return;
      }

      if (!user || !user.user_id) {
        setBidError('User information not found. Please login again.');
        return;
      }

      const bidData = {
        post_id: selectedPost.id,
        consumer_id: user.user_id,
        farmer_id: selectedPost.farmer_id || selectedPost.user_id, // Assuming farmer_id is available in post data
        bid_price: parseFloat(formData.bid_price),
        requested_quantity: parseInt(formData.requested_quantity),
        status: "Pending",
        message: formData.message
      };

      console.log('Sending bid data:', bidData); // Debug log

      const response = await fetch('http://127.0.0.1:8000/api/v1/buyer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bidData)
      });

      if (response.ok) {
        setBidSuccess('Bid placed successfully!');
        setIsBidModalOpen(false);
        // Refresh user bids to update the list
        fetchUserBids();
        // Reset form and states
        setTimeout(() => {
          setBidSuccess('');
          setSelectedPost(null);
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('API error response:', errorData); // Debug log
        console.log('Response status:', response.status); // Debug log
        setBidError(errorData.message || 'Failed to place bid');
        if (response.status === 401 || response.status === 403) {
          logout && logout();
        }
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Network error. Please try again.');
    } finally {
      setIsBidSubmitting(false);
    }
  };

  // Close bid modal
  const closeBidModal = () => {
    setIsBidModalOpen(false);
    setSelectedPost(null);
    setBidError('');
    setBidSuccess('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find the 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> perfect produce </span>
                for your needs
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Browse fresh, quality products directly from local farmers. Get the best deals and support your community.
              </p>
            </div>
          </div>

          {/* Search Section - Fiverr Style */}
          <div className="mb-8">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="flex items-center p-2">
                    <div className="flex-shrink-0 pl-6">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search for fresh vegetables, fruits, grains..."
                      className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none focus:ring-0 text-lg"
                      style={{ fontSize: '18px' }}
                    />
                    <div className="flex-shrink-0 pr-2">
                      <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Popular categories */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Popular categories:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['🥬 Vegetables', '🍎 Fruits', '🌾 Grains', '🥛 Dairy', '🌿 Herbs', '🥕 Organic'].map((category) => (
                    <button
                      key={category}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-green-600 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Already Bid Alert - Prominent */}
          {showAlreadyBidAlert && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-6 py-4 shadow-lg">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-lg">Already Placed Bid!</h3>
                    <p className="text-sm">You have already placed a bid on "{alreadyBidProduct}". Please check your bids or wait for the farmer's response.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAlreadyBidAlert(false);
                    setAlreadyBidProduct('');
                  }}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Overlay for alert */}
          {showAlreadyBidAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-25 z-40"></div>
          )}

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-xl shadow-inner">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                    activeFilter === 'all'
                      ? 'bg-white text-green-600 shadow-lg scale-105 ring-2 ring-green-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Package size={18} />
                    <span>All Products</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('accepted');
                    // Fetch accepted bids when this filter is clicked
                    if (user && user.user_id) {
                      fetchAcceptedBids();
                    }
                  }}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform flex items-center space-x-2 ${
                    activeFilter === 'accepted'
                      ? 'bg-white text-green-600 shadow-lg scale-105 ring-2 ring-green-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>🎉</span>
                  <span>Accepted Bids</span>
                  {acceptedBidsLoading && (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </button>
              </div>
              
              {/* Results Count */}
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-900">{filteredPosts.length}</span> results
                  <span className="text-gray-400 ml-1">
                    {activeFilter === 'all' && '• Available products'}
                    {activeFilter === 'accepted' && '• Your accepted bids'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {bidSuccess && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3 shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Success!</h4>
                <p className="text-sm">{bidSuccess}</p>
              </div>
            </div>
          )}

          {/* Bid Error Message */}
          {bidError && (
            <div className="bg-gradient-to-r from-red-50 to-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3 shadow-sm">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Error</h4>
                <p className="text-sm">{bidError}</p>
              </div>
            </div>
          )}

          {/* Accepted Bids Error Message */}
          {acceptedBidsError && activeFilter === 'accepted' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {acceptedBidsError}
              <button 
                onClick={fetchAcceptedBids}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {(marketplaceLoading || (acceptedBidsLoading && activeFilter === 'accepted')) && (
            <div className="text-center py-20">
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {marketplaceLoading ? 'Finding fresh products...' : 'Loading your accepted bids...'}
              </h3>
              <p className="text-gray-500">
                {marketplaceLoading ? 'Searching through local farmer offerings' : 'Retrieving your successful bids'}
              </p>
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
          {!marketplaceLoading && !marketplaceError && 
           !(acceptedBidsLoading && activeFilter === 'accepted') && 
           !acceptedBidsError && filteredPosts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {filteredPosts.map(post => (
                <ProductCard 
                  key={post.id} 
                  post={post} 
                  onViewDetails={handleViewDetails}
                  hasUserBid={hasAlreadyBid(post.id)}
                  hasAcceptedBid={hasAcceptedBid(post.id)}
                />
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!marketplaceLoading && !marketplaceError && 
           !(acceptedBidsLoading && activeFilter === 'accepted') && 
           !acceptedBidsError && filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                {activeFilter === 'all' ? (
                  <Package className="w-12 h-12 text-gray-400" />
                ) : (
                  <span className="text-3xl">🎉</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {activeFilter === 'all' ? 'No products available' : 'No accepted bids yet'}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {activeFilter === 'all' 
                  ? 'There are currently no products with available quantity and valid dates. Check back soon for fresh listings!'
                  : 'You don\'t have any accepted bids yet. Keep bidding on products you like!'
                }
              </p>
              <button 
                onClick={activeFilter === 'accepted' ? fetchAcceptedBids : fetchFarmerProducts}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        post={selectedProductForDetails}
        onPlaceBid={handlePlaceBid}
        onContactFarmer={handleContactFarmer}
        hasUserBid={selectedProductForDetails ? hasAlreadyBid(selectedProductForDetails.id) : false}
        hasAcceptedBid={selectedProductForDetails ? hasAcceptedBid(selectedProductForDetails.id) : false}
        activeFilter={activeFilter}
        acceptedBidDetails={selectedProductForDetails ? getAcceptedBidDetails(selectedProductForDetails.id) : null}
      />

      {/* Place Bid Modal */}
      <PlaceBidModal
        isOpen={isBidModalOpen}
        onClose={closeBidModal}
        post={selectedPost}
        onSubmit={submitBid}
        isSubmitting={isBidSubmitting}
      />
    </div>
  );
}