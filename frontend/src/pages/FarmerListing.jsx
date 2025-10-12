import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import FarmerSidebar from "./FarmerSidebar";
import NewListingModal from "../components/NewListingModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

export default function FarmerListing() {
  const navigate = useNavigate();
  const { user, getToken, isLoading: userLoading } = useUser();
  const [farmerListings, setFarmerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

      let dataToSubmit;

      if (isEditMode) {
        dataToSubmit = { ...listingData };
        const productId = dataToSubmit._id;
        delete dataToSubmit._id;
        listingData._id = productId;
      } else {
        dataToSubmit = {
          ...listingData,
          user_id: user.user_id,
        };
      }

      let response;
      if (isEditMode) {
        const productId = listingData._id;
        if (!productId) {
          setError("Product ID not found for update");
          return;
        }

        const url = `http://127.0.0.1:8000/api/v1/farmer/${productId}`;
        response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });
      } else {
        const url = "http://127.0.0.1:8000/api/v1/farmer";
        response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });
      }

      const data = await response.json();

      if (response.ok) {
        await fetchFarmerListings();
        setError("");
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
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating/updating listing:", error);
      const errorMessage = error.message || "Network error. Please try again.";
      setError(errorMessage);
      throw error;
    }
  };

  // Function to initiate delete confirmation
  const initiateDelete = (listing) => {
    setListingToDelete(listing);
    setIsDeleteModalOpen(true);
  };

  // Function to delete a listing
  const handleDeleteListing = async () => {
    if (!user?.user_id || !listingToDelete?._id) {
      setError("User or listing not found. Please try again.");
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
        `http://127.0.0.1:8000/api/v1/farmer/${listingToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchFarmerListings();
        setError("");
        setIsDeleteModalOpen(false);
        setListingToDelete(null);
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

  // Function to handle view listing click
  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setIsViewModalOpen(true);
  };

  // Function to close modal and reset editing state
  const handleCloseModal = () => {
    setIsNewListingModalOpen(false);
    setEditingListing(null);
  };

  // Function to close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedListing(null);
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

  // Check authentication and fetch initial data
  useEffect(() => {
    if (userLoading) return;

    if (!user?.user_id) {
      setError("Please login to access this page.");
      navigate("/login");
      return;
    }

    fetchFarmerListings();
  }, [user?.user_id, getToken, navigate, userLoading]);

  return (
    <div className="flex h-screen bg-gray-50">
      <FarmerSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              My Product Listings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your agricultural products and track their availability
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Listings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {farmerListings.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Product Listings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your available products
                  </p>
                </div>
                <button
                  onClick={() => setIsNewListingModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Listing
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && farmerListings.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No listings found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first product listing.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setIsNewListingModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Add New Listing
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {farmerListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleViewListing(listing)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 pr-2">
                            {listing.product_name}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                              listing.admin_deal
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {listing.admin_deal ? "Admin Deal" : "Regular"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="truncate">
                            {formatDateRange(listing.from, listing.to)}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                          </svg>
                          <span className="truncate">
                            {listing.product_quantity} {listing.quantity_unit}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <svg
                            className="w-4 h-4 mr-2 text-green-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-semibold text-green-600 text-base">
                            ৳{listing.price_per_unit}/{listing.quantity_unit}
                          </span>
                        </div>

                        {listing.product_description && (
                          <div className="text-sm text-gray-600 mt-2">
                            <p className="line-clamp-2">
                              {listing.product_description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageListing(listing);
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors focus:outline-none"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateDelete(listing);
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:outline-none"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Listing Modal */}
        <NewListingModal
          isOpen={isNewListingModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateListing}
          editData={editingListing}
          onDelete={handleDeleteListing}
        />

        {/* View Product Details Modal */}
        {isViewModalOpen && selectedListing && (
          <ProductDetailsModal
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            listing={selectedListing}
            onEdit={handleManageListing}
            onDelete={initiateDelete}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setListingToDelete(null);
          }}
          onConfirm={handleDeleteListing}
          title="Delete Product Listing"
          message={`Are you sure you want to delete "${listingToDelete?.product_name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}
