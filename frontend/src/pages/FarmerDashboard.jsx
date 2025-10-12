import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  MessageSquare,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Bell,
  Edit2,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import FarmerSidebar from "./FarmerSidebar";

export default function FarmerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, getToken, isLoading: userLoading } = useUser();

  // Get active tab from URL search params, default to 'Dashboard'
  const getActiveTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const validTabs = ["Dashboard", "Notifications", "Messages", "Profile"];
    return validTabs.includes(tab) ? tab : "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profile, setProfile] = useState({
    name: user?.user_name || "Farmer Name",
    email: user?.user_email || "farmer@example.com",
    phone: user?.user_no || "+1 (555) 123-4567",
    userId: user?.user_id || "FARMER-2024-001",
    location: user?.location || "Farm Location",
    gender: user?.gender || "Not specified",
    birthDate: user?.user_birth_date
      ? new Date(user.user_birth_date).toLocaleDateString()
      : "Not set",
    activeListing: 0,
    totalRevenue: user?.total_revenue || 0,
    memberSince: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "Unknown",
  });
  const [editForm, setEditForm] = useState({ ...profile });

  // Tab switching function
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Update URL params
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tabName);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });

    if (tabName === "Profile") {
      fetchUserProfile();
    }
  };

  // Profile management functions
  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
    setProfileError("");
  };

  const handleSave = async () => {
    if (!user?.user_id) {
      setProfileError("User not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setProfileError("");
      const token = getToken();

      if (!token) {
        setProfileError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      // Prepare data for PATCH request
      const updateData = { ...editForm };
      delete updateData.userId;

      // Map frontend field names to backend field names
      updateData.user_name = updateData.name;
      updateData.user_email = updateData.email;
      updateData.user_no = updateData.phone;

      // Remove frontend field names and read-only fields
      delete updateData.name;
      delete updateData.email;
      delete updateData.phone;
      delete updateData.birthDate;
      delete updateData.activeListing;
      delete updateData.totalRevenue;
      delete updateData.memberSince;

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        setProfile({ ...editForm });
        setIsEditing(false);
        setProfileError("");
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      setProfileError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setProfileError("");
  };

  const handleProfileChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Fetch user profile data from API
  const fetchUserProfile = async () => {
    if (!user?.user_id) return;

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const userData = data.data || {};
        const apiProfile = {
          name: userData.user_name || "Farmer",
          email: userData.user_email || "farmer@example.com",
          phone: userData.user_no || "+1 (555) 123-4567",
          userId: userData._id || user.user_id,
          location: userData.location || "Farm Location",
          gender: userData.gender || "Not specified",
          birthDate: userData.user_birth_date
            ? new Date(userData.user_birth_date).toLocaleDateString()
            : "Not set",
          activeListing: farmerListings?.length || 0,
          totalRevenue: userData.total_revenue || 0,
          memberSince: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : "Unknown",
        };

        setProfile(apiProfile);
        setEditForm(apiProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Fetch consumer requests for marketplace
  const fetchConsumerRequests = async () => {
    try {
      setMarketplaceLoading(true);
      setMarketplaceError("");
      const token = getToken();

      if (!token) {
        setMarketplaceError(
          "No authentication token found. Please login again."
        );
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/v1/consumer", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const responseData = data.data || {};
        const { req: requestsArray = [] } = responseData;
        setConsumerRequests(requestsArray);
        setMarketplaceError("");
      } else {
        const errorData = await response.json();
        setMarketplaceError(
          errorData.message || "Failed to fetch consumer requests"
        );
      }
    } catch (error) {
      setMarketplaceError("Network error. Please try again.");
    } finally {
      setMarketplaceLoading(false);
    }
  };
  // Fetch farmer listings from API
  const fetchFarmerListings = async () => {
    if (!user?.user_id) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/farmer/${user.user_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFarmerListings(data.data.products || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch listings");
      }
    } catch (error) {
      console.error("Error fetching farmer listings:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch initial data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (userLoading) return;

      if (!user?.user_id) {
        setError("Please login to access this page.");
        navigate("/login");
        return;
      }

      // Fetch data based on initial tab
      const currentTab = getActiveTabFromURL();
      if (currentTab === "Profile") {
        fetchUserProfile();
      }
    };

    checkAuthAndFetchData();
  }, [user?.user_id, getToken, navigate, userLoading]);

  // Effect to sync activeTab with URL changes
  useEffect(() => {
    const newActiveTab = getActiveTabFromURL();
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);

      if (newActiveTab === "Profile") {
        fetchUserProfile();
      }
    }
  }, [location.search]);

  // Effect to update profile when user data changes
  useEffect(() => {
    if (user) {
      const updatedProfile = {
        name: user.user_name || "Farmer",
        email: user.user_email || "farmer@example.com",
        phone: user.user_no || "+1 (555) 123-4567",
        userId: user.user_id || user._id || "FARMER-2024-001",
        location: user.location || "Farm Location",
        gender: user.gender || "Not specified",
        birthDate: user.user_birth_date
          ? new Date(user.user_birth_date).toLocaleDateString()
          : "Not set",
        activeListing: 0,
        totalRevenue: user.total_revenue || 0,
        memberSince: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown",
      };
      setProfile(updatedProfile);
      setEditForm(updatedProfile);
    }
  }, [user]);

  // Function to create a new listing
  const handleCreateListing = async (listingData, isEditMode = false) => {
    if (!user?.user_id) {
      setError("User not found. Please login again.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      console.log("Edit mode:", isEditMode);
      console.log("Listing data received:", listingData);

      let dataToSubmit;

      if (isEditMode) {
        // For manage listing (edit mode), don't include user_id
        dataToSubmit = { ...listingData };
        // Keep the _id for URL construction but remove it from request body after using it
        const productId = dataToSubmit._id;
        delete dataToSubmit._id;
        // Store productId back in listingData for URL construction
        listingData._id = productId;
        console.log("Product ID for update:", productId);
        console.log("Data to submit for update:", dataToSubmit);
      } else {
        // For new listing, include user_id
        dataToSubmit = {
          ...listingData,
          user_id: user.user_id,
        };
        console.log("Data to submit for create:", dataToSubmit);
      }

      let response;
      if (isEditMode) {
        // Update existing listing using PATCH request to the product ID endpoint
        const productId = listingData._id;
        if (!productId) {
          throw new Error("Product ID is required for updating");
        }

        const url = `http://127.0.0.1:8000/api/v1/farmer/${productId}`;
        console.log("PATCH URL:", url);

        response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });
      } else {
        // Create new listing
        const url = "http://127.0.0.1:8000/api/v1/farmer";
        console.log("POST URL:", url);

        response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });
      }

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Success - refresh the listings by fetching fresh data from server
        await fetchFarmerListings();
        setError("");
        // Show success message (you can replace this with a toast notification)
        alert(
          isEditMode
            ? "Listing updated successfully!"
            : "Listing created successfully!"
        );
      } else {
        const errorMessage =
          data.message ||
          (isEditMode
            ? "Failed to update listing"
            : "Failed to create listing");
        setError(errorMessage);
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating/updating listing:", error);
      const errorMessage = error.message || "Network error. Please try again.";
      setError(errorMessage);
      throw error; // Re-throw to let the modal handle it
    }
  };

  // Function to delete a listing
  const handleDeleteListing = async (listingId) => {
    if (!user?.user_id) {
      setError("User not found. Please login again.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/farmer/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Success - refresh the listings by fetching fresh data from server
        await fetchFarmerListings();
        setError("");
        alert("Listing deleted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete listing");
        throw new Error(data.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError("Network error. Please try again.");
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

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.user_name || "Farmer"}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your farm business today
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">0</p>
                  </div>
                  <FileText className="text-green-600" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      ₹{profile.totalRevenue || 0}
                    </p>
                  </div>
                  <DollarSign className="text-blue-600" size={32} />
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
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">92%</p>
                  </div>
                  <TrendingUp className="text-green-600" size={32} />
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New listing created</p>
                    <p className="text-sm text-gray-600">Fresh tomatoes added to marketplace</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New message received</p>
                    <p className="text-sm text-gray-600">Customer inquiry about organic vegetables</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* What would you like to do today - Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                What would you like to do today?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "View My Listings",
                    description: "Manage and update your product listings",
                    icon: Package,
                    color: "bg-blue-500",
                    action: () => handleTabChange("My Listings"),
                  },
                  {
                    title: "Browse Marketplace",
                    description: "Find consumer requests and potential buyers",
                    icon: TrendingUp,
                    color: "bg-purple-500",
                    action: () => handleTabChange("Marketplace"),
                  },
                  {
                    title: "Messages",
                    description: "Chat with customers and respond to inquiries",
                    icon: MessageSquare,
                    color: "bg-indigo-500",
                    action: () => handleTabChange("Messages"),
                  },
                  {
                    title: "Profile",
                    description: "Update your account and farm information",
                    icon: User,
                    color: "bg-green-500",
                    action: () => handleTabChange("Profile"),
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                      >
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-green-600 transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>

                      {/* Arrow indicator */}
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case "My Listings":
        navigate("/farmer/listings");
        return null;

      case "Marketplace":
        return (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Marketplace
            </h3>
            <p className="text-gray-600">Coming soon!</p>
          </div>
        );

      case "Messages":
        return (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600">Message functionality coming soon!</p>
          </div>
        );

      case "Notifications":
        return (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Notifications
            </h3>
            <p className="text-gray-600">No new notifications</p>
          </div>
        );

      case "Profile":
        return (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
              <p className="text-gray-600 mt-2">
                Manage your account information
              </p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8 mb-6 transition-all duration-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {profile.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      Farmer ID: {profile.userId}
                    </p>
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
                {/* Email Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        {profile.email}
                      </p>
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
                      <p className="text-sm text-gray-500 font-medium">
                        Phone Number
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        {profile.phone}
                      </p>
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
                      <p className="text-sm text-gray-500 font-medium">
                        Location
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Listings Card */}
                <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">
                        Active Listings
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        {profile.activeListing}
                      </p>
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
                      <p className="text-sm text-gray-500 font-medium">
                        Member Since
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        {profile.memberSince}
                      </p>
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
                      <p className="text-sm text-gray-500 font-medium">
                        Total Revenue
                      </p>
                      <p className="text-gray-800 font-semibold mt-1">
                        ₹{profile.totalRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Profile Form */
              <div className="bg-white rounded-xl shadow-sm border border-green-100 p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="Not specified">Not specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </form>

                {/* Profile Error */}
                {profileError && (
                  <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {profileError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
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

  // Helper function to format date range
  const formatDateRange = (from, to) => {
    const fromDate = new Date(from).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const toDate = new Date(to).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${fromDate} - ${toDate}`;
  };

  // Helper function to format price with currency
  const formatPrice = (price, currency) => {
    const currencySymbol = currency === "BDT" ? "৳" : "₹";
    return `${currencySymbol}${price}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <FarmerSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">{renderTabContent()}</div>
      </div>
    </div>
  );
}
