import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Leaf, Fish, Apple, ShoppingBag, User, TrendingUp, Power } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout, isLoading } = useUser();
  const navigate = useNavigate();

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

  const farmerPosts = [
    {
      id: 1,
      farmer: 'Karim Rahman',
      product: 'Fresh Tomatoes',
      price: '৳80/kg',
      location: 'Narsingdi',
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      farmer: 'Fatema Begum',
      product: 'Organic Spinach',
      price: '৳60/kg',
      location: 'Gazipur',
      rating: 5.0,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      farmer: 'Rahim Mia',
      product: 'River Fish (Rui)',
      price: '৳350/kg',
      location: 'Munshiganj',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      farmer: 'Ayesha Khan',
      product: 'Fresh Mangoes',
      price: '৳120/kg',
      location: 'Rajshahi',
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=300&fit=crop'
    }
  ];

  const consumerRequests = [
    {
      id: 1,
      consumer: 'Nadia Islam',
      request: 'Looking for 10kg Fresh Potatoes',
      budget: '৳300-400',
      location: 'Dhaka',
      urgency: 'Within 2 days'
    },
    {
      id: 2,
      consumer: 'Hasan Ahmed',
      request: 'Need 5kg Organic Vegetables Mix',
      budget: '৳500-600',
      location: 'Chittagong',
      urgency: 'This week'
    },
    {
      id: 3,
      consumer: 'Sultana Parvin',
      request: 'Fresh Hilsa Fish 2-3kg',
      budget: '৳1500-2000',
      location: 'Narayanganj',
      urgency: 'Today'
    },
    {
      id: 4,
      consumer: 'Farhan Kabir',
      request: 'Seasonal Fruits Basket',
      budget: '৳800-1000',
      location: 'Sylhet',
      urgency: 'Within 3 days'
    }
  ];

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
            <div className="max-w-2xl mx-auto mb-8">
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
            </div>

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
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
              View All <TrendingUp className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transform hover:-translate-y-2 transition cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image} alt={post.product} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{post.farmer}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.product}</h3>
                  <p className="text-sm text-gray-500 mb-3">{post.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{post.price}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-semibold text-gray-900">{post.rating}</span>
                      <span className="text-sm text-gray-500">({post.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consumer Requests Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Consumer Requests</h2>
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
              View All <TrendingUp className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consumerRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transform hover:-translate-y-2 transition cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{request.consumer}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.request}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Budget:</span> {request.budget}</p>
                  <p><span className="font-medium">Location:</span> {request.location}</p>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {request.urgency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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