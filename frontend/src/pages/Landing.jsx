import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Leaf, Fish, Apple, ShoppingBag, User, TrendingUp, Power, Package } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [farmerPosts, setFarmerPosts] = useState([]);
  const [isLatestLoading, setIsLatestLoading] = useState(true);
  const [latestError, setLatestError] = useState(null);
  const { isAuthenticated, user, logout, isLoading } = useUser();
  const navigate = useNavigate();

  // Fetch latest products for the "Latest from Farmers" section
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLatestLoading(true);
        setLatestError(null);
        const res = await fetch('https://taza-bazar-backend.onrender.com/api/v1/latestProducts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        if (isMounted) setFarmerPosts(items);
      } catch (err) {
        if (isMounted) setLatestError(err.message || 'Failed to load latest products');
      } finally {
        if (isMounted) setIsLatestLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleConsumerClick = () => {
    console.log('Consumer click - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    if (isLoading) {
      console.log('Still loading, waiting...');
      return; // Don't navigate while loading
    }
    
    if (isAuthenticated) {
      console.log('Authenticated, navigating to /consumer');
      navigate('/consumer');
    } else {
      console.log('Not authenticated, navigating to /login');
      navigate('/login');
    }
  };

  const handleFarmerClick = () => {
    console.log('Farmer click - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    if (isLoading) {
      console.log('Still loading, waiting...');
      return; // Don't navigate while loading
    }
    
    if (isAuthenticated) {
      console.log('Authenticated, navigating to /farmer');
      navigate('/farmer');
    } else {
      console.log('Not authenticated, navigating to /login');
      navigate('/login');
    }
  };

  const categories = [
    { name: 'Vegetables', icon: Leaf, color: 'bg-green-100 text-green-600' },
    { name: 'Fish', icon: Fish, color: 'bg-blue-100 text-blue-600' },
    { name: 'Fruits', icon: Apple, color: 'bg-red-100 text-red-600' }
  ];

  // Small helpers
  const formatBDT = (value) => {
    if (value == null) return '—';
    try {
      return new Intl.NumberFormat('en-BD').format(Number(value));
    } catch {
      return String(value);
    }
  };
  const timeAgo = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const diff = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diff < 60) return 'just now';
      const mins = Math.floor(diff / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return '';
    }
  };

  const [consumerRequests, setConsumerRequests] = useState([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState(null);

  // Fetch latest consumer requests
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsRequestsLoading(true);
        setRequestsError(null);
        const res = await fetch('http://127.0.0.1:8000/api/v1/latestRequest', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];
        if (isMounted) setConsumerRequests(items);
      } catch (err) {
        if (isMounted) setRequestsError(err.message || 'Failed to load latest requests');
      } finally {
        if (isMounted) setIsRequestsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TazaBazar</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {/* <a href="#" className="text-gray-600 hover:text-gray-900 transition">Browse</a> */}
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">How it Works</a>
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome, {user?.user_name}!</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 px-2 py-1 border border-red-600 bg-white text-red-600 rounded-full text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-600 hover:text-white hover:shadow-[0_0_10px_2px_rgba(220,38,38,0.5)] hover:border-red-700"
                    title="Logout"
                  >
                    <Power className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-2 py-1 border border-green-600 bg-white text-green-600 rounded-full text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 hover:bg-green-600 hover:text-white hover:shadow-[0_0_10px_2px_rgba(22,163,74,0.5)] hover:border-green-700"
                  >
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1 px-2 py-1 border border-green-600 bg-white text-green-600 rounded-full text-sm font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 hover:bg-green-600 hover:text-white hover:shadow-[0_0_10px_2px_rgba(22,163,74,0.5)] hover:border-green-700"
                  >
                    <span>Join Now</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect Farmers with Consumers
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Buy fresh produce directly from farmers or find customers for your harvest
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder='Search products like "Tomato", "Fish"...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:outline-none text-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleConsumerClick}
                className="px-8 py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition flex items-center gap-2 w-64"
              >
                <ShoppingBag className="h-5 w-5" />
                I'm a Consumer
              </button>
              <button 
                onClick={handleFarmerClick}
                className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg text-lg font-semibold hover:bg-green-50 transform hover:scale-105 transition flex items-center gap-2 w-64"
              >
                <User className="h-5 w-5" />
                I'm a Farmer
              </button>
            </div>
            
            {!isAuthenticated && (
              <p className="text-sm text-gray-600 mt-4">
                Please login to access Consumer or Farmer features
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="p-8 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transform hover:-translate-y-1 transition cursor-pointer"
              >
                <div className={`inline-flex p-4 rounded-lg ${category.color} mb-4`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                <p className="text-gray-600 mt-2">Fresh and quality {category.name.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest from Farmers</h2>
          </div>
          {isLatestLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isLatestLoading && latestError && (
            <div className="text-red-600">{latestError}</div>
          )}
          {!isLatestLoading && !latestError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {farmerPosts.map((post) => {
                const title = post?.product_name || 'Product';
                const farmerName = post?.user_id?.user_name || 'Unknown Farmer';
                const price = post?.price_per_unit;
                const created = post?.createdAt;
                return (
                  <div
                    key={post?._id || created}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                  >
                    {/* Header with gradient and price badge (matching consumer marketplace style) */}
                    <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <Package className="w-12 h-12 text-green-600" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                          ৳{formatBDT(price)}
                        </div>
                      </div>
                      {created && (
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                            {new Date(created).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        by {farmerName}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
                          </svg>
                          <span>{created ? `Posted ${timeAgo(created)}` : 'Available'}</span>
                        </div>
                        <div className="flex items-center text-green-600 text-sm font-semibold">
                          <span>৳{formatBDT(price)}</span>
                          <span className="ml-1 text-gray-500 font-normal">/unit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Consumer Requests Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Consumer Requests</h2>
          </div>
          {isRequestsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-6 border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isRequestsLoading && requestsError && (
            <div className="text-red-600">{requestsError}</div>
          )}
          {!isRequestsLoading && !requestsError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {consumerRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transform hover:-translate-y-2 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{request.user_id.user_name}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.product_name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Quantity:</span> {request.product_quantity} {request.quantity_unit}</p>
                    <p><span className="font-medium">Price:</span> ৳{formatBDT(request.price_per_unit)}/{request.quantity_unit}</p>
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        Posted {timeAgo(request.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-500" />
                <span className="ml-2 text-2xl font-bold">TazaBazar</span>
              </div>
              <p className="text-gray-400">Connecting farmers and consumers for fresh, quality produce.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="/about-developer" className="text-gray-400 hover:text-white transition">👨‍💻 About the Developer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Get Started</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sign Up</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Become a Farmer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Start Shopping</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TazaBazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}