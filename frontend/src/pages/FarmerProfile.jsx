import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, X, Save, FileText, TrendingUp, Bell, MessageSquare, ShoppingCart, Repeat, Calendar, DollarSign, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Utility function to format date (remove time)
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  try {
    const date = new Date(dateString);
    // Format as YYYY-MM-DD for input fields
    return date.toISOString().split('T')[0];
  } catch (error) {
    return 'Invalid date';
  }
};

// Utility function to format date for display (more readable)
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'Not specified';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

export default function FarmerProfile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, getToken, logout, isLoading: userLoading } = useUser();

  const [profile, setProfile] = useState({
    user_name: '',
    user_email: '',
    user_no: '',
    user_id: '',
    user_location: '',
    date_of_birth: '',
    gender: '',
    total_revenue: '',
    user_password: '',
    createdAt: ''
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Check authentication and fetch profile data
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      // Wait for UserContext to finish loading
      if (userLoading) {
        return;
      }
      
      // Check if user is authenticated
      if (!user?.user_id) {
        setError('Please login to access this page.');
        navigate('/login');
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

        console.log('Fetching profile for user ID:', user.user_id);

        const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${user.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Profile response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Profile data received:', data);
          
          // Assuming the API returns user data in data.data or data.user format
          const userData = data.data || data.user || data;
          
          const profileData = {
            user_name: userData.user_name || '',
            user_email: userData.user_email || '',
            user_no: userData.user_no || '',
            user_id: userData.user_id || user.user_id,
            user_location: userData.user_location || '',
            date_of_birth: formatDate(userData.user_birth_date) || '',
            gender: userData.gender || '',
            total_revenue: userData.total_revenue || '0',
            user_password: '', // Don't show password for security
            createdAt: userData.createdAt || ''
          };

          setProfile(profileData);
          setEditForm(profileData);
          setError('');
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          setError(errorData.message || 'Failed to fetch profile data');
          
          // If unauthorized, redirect to login
          if (response.status === 401 || response.status === 403) {
            logout();
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [user?.user_id, getToken, navigate, logout, userLoading]);

  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.user_id) {
      setError('User not found. Please login again.');
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

      // Prepare data for PATCH request (exclude user_id and empty password)
      const updateData = { ...editForm };
      delete updateData.user_id; // Don't send user_id in body
      
      // Map frontend field names to backend field names
      if (updateData.date_of_birth) {
        updateData.user_birth_date = updateData.date_of_birth;
        delete updateData.date_of_birth;
      }
      
      // Remove read-only fields
      delete updateData.createdAt;
      
      // Only include password if it's not empty
      if (!updateData.user_password || updateData.user_password.trim() === '') {
        delete updateData.user_password;
      }

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
        setError('');
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Update error:', errorData);
        setError(errorData.message || 'Failed to update profile');
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { name: 'My Listings', icon: FileText, path: '/farmer' },
    { name: 'Marketplace', icon: TrendingUp, path: '/farmer/marketplace' },
    { name: 'Messages', icon: MessageSquare, path: '/farmer/messages' },
    { name: 'Notifications', icon: Bell, path: '/farmer/notifications' },
    { name: 'Profile', icon: User, path: '/farmer/profile' }
  ];

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Profile</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
            <p className="text-sm text-gray-500 mt-1">Profile</p>
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

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-green-600">TazaBazar</h1>
          <p className="text-sm text-gray-500 mt-1">Profile</p>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
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
        <div className="p-4 mt-auto border-t border-gray-200">
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
                  {profile.user_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profile.user_name}</h2>
                  <p className="text-sm text-gray-500 mt-2">User ID: {profile.user_id}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User ID Card */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">User ID</p>
                    <p className="text-gray-800 font-semibold mt-1">{profile.user_id}</p>
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
                    <p className="text-gray-800 font-semibold mt-1">{profile.user_email}</p>
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
                    <p className="text-gray-800 font-semibold mt-1">{profile.user_no}</p>
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
                    <p className="text-gray-800 font-semibold mt-1">{profile.user_location}</p>
                  </div>
                </div>
              </div>

              {/* Date of Birth Card */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                    <p className="text-gray-800 font-semibold mt-1">{formatDisplayDate(profile.date_of_birth)}</p>
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
                    <p className="text-gray-800 font-semibold mt-1">{profile.gender || 'Not specified'}</p>
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
                    <p className="text-gray-800 font-semibold mt-1">৳{profile.total_revenue || '0'}</p>
                  </div>
                </div>
              </div>

              {/* Account Created Card */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Account Created</p>
                    <p className="text-gray-800 font-semibold mt-1">{formatDisplayDate(profile.createdAt)}</p>
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
                    name="user_id"
                    value={editForm.user_id}
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
                    name="user_name"
                    value={editForm.user_name}
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
                    name="user_email"
                    value={editForm.user_email}
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
                    name="user_no"
                    value={editForm.user_no}
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
                    name="user_location"
                    value={editForm.user_location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={editForm.date_of_birth}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Revenue
                  </label>
                  <input
                    type="number"
                    name="total_revenue"
                    value={editForm.total_revenue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="user_password"
                    value={editForm.user_password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if you don't want to change password</p>
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