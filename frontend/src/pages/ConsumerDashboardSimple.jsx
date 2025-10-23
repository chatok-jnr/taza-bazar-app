import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ConsumerSidebar from './ConsumerSidebar';
import { ShoppingCart, Package, TrendingUp, Bell, MessageSquare, User } from 'lucide-react';

export default function ConsumerDashboardSimple() {
  const { user, isLoading, logout } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedOrders: 0,
    unreadNotifications: 0
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Mock stats for now - replace with actual API calls
  useEffect(() => {
    if (user) {
      setStats({
        totalRequests: "!available yet",
        activeRequests: "!available yet",
        completedOrders: "!available yet",
        unreadNotifications: "!available yet"
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const quickActions = [
    {
      title: 'My Requests',
      description: 'View and manage your product requests',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      path: '/consumer/requests'
    },
    {
      title: 'Browse Marketplace',
      description: 'Find fresh products from local farmers',
      icon: Package,
      color: 'bg-green-500',
      path: '/consumer/marketplace'
    },
    {
      title: 'Messages',
      description: 'Chat with farmers and vendors',
      icon: MessageSquare,
      color: 'bg-purple-500',
      path: '/consumer/messages'
    },
    {
      title: 'Profile',
      description: 'Update your account information',
      icon: User,
      color: 'bg-indigo-500',
      path: '/consumer/profile'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ConsumerSidebar activeTab="Dashboard" />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.user_name}! 👋
            </h1>
            <p className="text-lg text-gray-600">Find the perfect fresh produce for your needs</p>
          </div>
        </div>

        <div className="p-8">
          {/* Beautiful Stats Cards - Fiverr Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Requests Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{stats.totalRequests}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Total Requests</h3>
                  <p className="text-sm text-gray-500">All time requests made</p>
                </div>
              </div>
            </div>

            {/* Active Requests Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{stats.activeRequests}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Active Requests</h3>
                  <p className="text-sm text-gray-500">Currently pending requests</p>
                </div>
              </div>
            </div>

            {/* Completed Orders Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{stats.completedOrders}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Completed Orders</h3>
                  <p className="text-sm text-gray-500">Successfully completed</p>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{stats.unreadNotifications}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Notifications</h3>
                  <p className="text-sm text-gray-500">Unread notifications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Quick Actions - Fiverr Style */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What would you like to do today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-green-600 transition-colors duration-300">{action.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                    
                    {/* Arrow indicator */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}