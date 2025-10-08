import React, { useState } from "react";

import {
  FileText,
  MapPin,
  Calendar,
  Package,
  Award,
  X,
  DollarSign,
} from "lucide-react";

import FarmerSidebar from "./FarmerSidebar";
import DashboardLayout from "../components/DashboardLayout";

export default function FarmerDashboard() {
  const [activeTab] = useState("My Listings");
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([
    {
      id: 1,
      productName: "Organic Tomatoes",
      quantity: "500 kg",
      price: "BDT 50/unit",
      location: "Dhaka, Bangladesh",
      dateRange: "Oct 5 - Oct 20",
      adminDeal: true,
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=250&fit=crop",
      description:
        "Fresh, organically grown tomatoes perfect for salads and cooking. Rich in flavor and nutrients. Locally sourced from our sustainable farms.",
    },
    {
      id: 2,
      productName: "Fresh Wheat",
      quantity: "1000 kg",
      price: "BDT 30/unit",
      location: "Chittagong, Bangladesh",
      dateRange: "Oct 1 - Oct 15",
      adminDeal: false,
      description:
        "Premium quality wheat grains, perfect for flour production and baking. Hand-harvested and naturally processed.",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      productName: "Premium Rice",
      quantity: "750 kg",
      price: "BDT 45/unit",
      location: "Sylhet, Bangladesh",
      dateRange: "Oct 10 - Oct 25",
      adminDeal: true,
      description:
        "Premium quality Bangladeshi rice, known for its aromatic fragrance and perfect texture. Directly from local farmers.",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      productName: "Fresh Potatoes",
      quantity: "2000 kg",
      price: "BDT 25/unit",
      location: "Rajshahi, Bangladesh",
      dateRange: "Oct 3 - Oct 18",
      adminDeal: false,
      description:
        "Fresh, locally grown potatoes. Perfect for cooking and long-term storage. Naturally grown without harmful pesticides.",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=250&fit=crop",
    },
    {
      id: 5,
      productName: "Organic Spinach",
      quantity: "300 kg",
      price: "BDT 40/unit",
      location: "Khulna, Bangladesh",
      dateRange: "Oct 7 - Oct 14",
      adminDeal: false,
      description:
        "Fresh organic spinach leaves, rich in iron and vitamins. Perfect for salads and cooking. Harvested daily.",
      image:
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=250&fit=crop",
    },
    {
      id: 6,
      productName: "Local Fish (Rui)",
      quantity: "120 kg",
      price: "BDT 220/unit",
      location: "Barisal, Bangladesh",
      dateRange: "Oct 6 - Oct 12",
      adminDeal: true,
      description:
        "Fresh Rui fish from local waters. Caught daily and maintained in hygienic conditions. High in protein and omega-3.",
      image:
        "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=250&fit=crop",
    },
    {
      id: 7,
      productName: "Seasonal Mangoes",
      quantity: "1500 kg",
      price: "BDT 60/unit",
      location: "Rangpur, Bangladesh",
      dateRange: "Oct 10 - Oct 30",
      adminDeal: true,
      description:
        "Sweet and juicy seasonal mangoes. Handpicked at perfect ripeness. Various premium varieties available.",
      image:
        "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=250&fit=crop",
    },
    {
      id: 8,
      productName: "Fresh Oranges",
      quantity: "800 kg",
      price: "BDT 35/unit",
      location: "Comilla, Bangladesh",
      dateRange: "Oct 2 - Oct 20",
      adminDeal: false,
      description:
        "Sweet and tangy oranges, rich in Vitamin C. Perfect for juicing or eating fresh. Naturally ripened.",
      image:
        "https://images.unsplash.com/photo-1502741126161-b048400d3d9d?w=400&h=250&fit=crop",
    },
    {
      id: 9,
      productName: "Pure Honey",
      quantity: "200 kg",
      price: "BDT 450/unit",
      location: "Mymensingh, Bangladesh",
      dateRange: "Oct 1 - Oct 31",
      adminDeal: false,
      description:
        "100% pure, raw honey from Sundarban's flowers. No additives or preservatives. Rich in antioxidants.",
      image:
        "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=250&fit=crop",
    },
    {
      id: 10,
      productName: "Farm Fresh Eggs",
      quantity: "500 dozen",
      price: "BDT 250/unit",
      location: "Gazipur, Bangladesh",
      dateRange: "Oct 5 - Oct 20",
      adminDeal: false,
      description:
        "Farm-fresh eggs from free-range chickens. Rich in protein and naturally organic. Available in bulk.",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop",
    },
  ]);

  const handleNewListing = (newListing) => {
    setListings([
      {
        id: listings.length + 1,
        ...newListing,
        adminDeal: newListing.adminDeal || false,
        dateRange: `${new Date(newListing.startDate).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        )} - ${new Date(newListing.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`,
      },
      ...listings,
    ]);
    setShowNewListingModal(false);
  };

  const handleEditListing = (editedListing) => {
    setListings(
      listings.map((listing) =>
        listing.id === editedListing.id
          ? {
              ...editedListing,
              description: editedListing.description || listing.description,
              adminDeal:
                editedListing.adminDeal !== undefined
                  ? editedListing.adminDeal
                  : listing.adminDeal,
              dateRange: `${new Date(
                editedListing.startDate
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} - ${new Date(editedListing.endDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}`,
            }
          : listing
      )
    );
    setShowManageModal(false);
    setSelectedListing(null);
  };

  const handleDeleteListing = (listingId) => {
    setListings(listings.filter((listing) => listing.id !== listingId));
    setShowManageModal(false);
    setSelectedListing(null);
  };

  const openManageListing = (listing) => {
    setSelectedListing(listing);
    setShowManageModal(true);
  };

  return (
    <DashboardLayout sidebar={<FarmerSidebar activeTab={activeTab} />}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, Farmer!
          </h2>
          <p className="text-gray-600">
            Manage your listings and connect with buyers
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-green-600 font-semibold mb-2">
                  Active Listings
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold text-gray-800">
                    {listings.length}
                  </p>
                  <p className="text-green-600 text-lg">Products</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Manage your agricultural products in the marketplace
                </p>
              </div>
              <div className="bg-white p-4 rounded-full shadow-md">
                <FileText className="text-green-600" size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">My Listings</h3>
            <button
              onClick={() => setShowNewListingModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + New Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* New Listing Modal */}
            {showNewListingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Add New Listing</h3>
                    <button onClick={() => setShowNewListingModal(false)}>
                      <X size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const imageFile = formData.get("image");
                      const imageUrl = imageFile
                        ? URL.createObjectURL(imageFile)
                        : "";
                      handleNewListing({
                        productName: formData.get("productName"),
                        quantity: formData.get("quantity"),
                        price: `BDT ${formData.get("price")}/unit`,
                        location: formData.get("location"),
                        description: formData.get("description"),
                        adminDeal: formData.get("adminDeal") === "on",
                        image: imageUrl,
                      });
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          required
                          name="productName"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Quantity
                        </label>
                        <input
                          required
                          name="quantity"
                          type="text"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price per unit (BDT)
                        </label>
                        <input
                          required
                          name="price"
                          type="number"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Description
                        </label>
                        <textarea
                          required
                          name="description"
                          rows="3"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          required
                          name="location"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            From
                          </label>
                          <input
                            required
                            name="startDate"
                            type="date"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            To
                          </label>
                          <input
                            required
                            name="endDate"
                            type="date"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="adminDeal"
                          id="adminDeal"
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                          htmlFor="adminDeal"
                          className="text-sm font-medium text-gray-700"
                        >
                          Mark as Admin Deal
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Choose Image
                        </label>
                        <input
                          required
                          name="image"
                          type="file"
                          accept="image/*"
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      >
                        Add Listing
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Manage Listing Modal */}
            {showManageModal && selectedListing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Manage Listing</h3>
                    <button
                      onClick={() => {
                        setShowManageModal(false);
                        setSelectedListing(null);
                      }}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const imageFile = formData.get("image");
                      const imageUrl = imageFile
                        ? URL.createObjectURL(imageFile)
                        : selectedListing.image;
                      handleEditListing({
                        ...selectedListing,
                        productName: formData.get("productName"),
                        quantity: formData.get("quantity"),
                        price: `BDT ${formData.get("price")}/unit`,
                        location: formData.get("location"),
                        description: formData.get("description"),
                        adminDeal: formData.get("adminDeal") === "on",
                        image: imageUrl,
                      });
                    }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          required
                          name="productName"
                          defaultValue={selectedListing.productName}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Quantity
                        </label>
                        <input
                          required
                          name="quantity"
                          type="text"
                          defaultValue={selectedListing.quantity}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price per unit (BDT)
                        </label>
                        <input
                          required
                          name="price"
                          type="number"
                          defaultValue={selectedListing.price
                            .replace("BDT ", "")
                            .replace("/kg", "")}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Description
                        </label>
                        <textarea
                          required
                          name="description"
                          rows="3"
                          defaultValue={selectedListing.description}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          required
                          name="location"
                          defaultValue={selectedListing.location}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            required
                            name="startDate"
                            type="date"
                            defaultValue={
                              selectedListing.dateRange.split(" - ")[0]
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            required
                            name="endDate"
                            type="date"
                            defaultValue={
                              selectedListing.dateRange.split(" - ")[1]
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="adminDeal"
                          id="editAdminDeal"
                          defaultChecked={selectedListing.adminDeal}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label
                          htmlFor="editAdminDeal"
                          className="text-sm font-medium text-gray-700"
                        >
                          Mark as Admin Deal
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Change Picture
                        </label>
                        <input
                          name="image"
                          type="file"
                          accept="image/*"
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Current image: {selectedListing.image}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteListing(selectedListing.id)
                          }
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.productName}
                    className="w-full h-48 object-cover"
                  />
                  {listing.adminDeal && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Award size={14} />
                      Admin Deal
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {listing.productName}
                  </h4>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package size={16} className="mr-2 text-green-600" />
                      <span>{listing.quantity}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign size={16} className="mr-2 text-green-600" />
                      <span className="font-semibold text-gray-800">
                        {listing.price}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-green-600" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-green-600" />
                      <span>{listing.dateRange}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openManageListing(listing)}
                    className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium"
                  >
                    Manage Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketplace moved to a dedicated page (no inline panel here) */}
      </div>
    </DashboardLayout>
  );
}
