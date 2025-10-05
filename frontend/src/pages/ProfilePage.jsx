import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, X, Save, FileText, TrendingUp, Bell, MessageSquare, ShoppingCart, Repeat } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState('consumer'); // 'consumer' or 'farmer'
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '+1 (555) 123-4567',
    userId: 'USR-2024-001',
    location: 'Green Valley, CA'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
    switch (tabName) {
      case 'My Requests':
        if (userRole === 'consumer') {
          navigate('/consumer');
        } else {
          navigate('/farmer');
        }
        break;
      case 'Marketplace':
        navigate('/marketplace'); // Assuming a marketplace route
        break;
      case 'Notifications':
        navigate('/notifications'); // Assuming a notifications route
        break;
      case 'Messages':
        navigate('/messages'); // Assuming a messages route
        break;
      case 'Profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { name: 'My Requests', icon: FileText },
    { name: 'Marketplace', icon: TrendingUp },
    { name: 'Notifications', icon: Bell },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Profile', icon: User }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">TazaBazar</h1>
          <p className="text-sm text-gray-500 mt-1">{userRole === 'consumer' ? 'Consumer' : 'Farmer'} Dashboard</p>
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
        {/* Role Switcher for testing */}
        <div className="p-4 mt-auto border-t border-gray-200">
            <button 
                onClick={() => setUserRole(userRole === 'consumer' ? 'farmer' : 'consumer')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
                <Repeat size={16} />
                <span>Switch to {userRole === 'consumer' ? 'Farmer' : 'Consumer'}</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
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
            </div>
          ) : (
            /* Edit Form */
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Profile Information</h3>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
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
      </div>
    </div>
  );
}