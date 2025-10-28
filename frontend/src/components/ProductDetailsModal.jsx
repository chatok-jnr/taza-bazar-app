import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  Calendar,
  DollarSign,
  Type,
  Hash,
  User,
  Clock,
  Check,
  XCircle,
  TrendingUp,
  Edit,
  Trash2,
  Bell,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  listing,
  onEdit,
  onDelete,
  isBidSection = false,
  requestBids = [],
  bidsLoading = false,
  handleAcceptBid = null,
  handleRejectBid = null,
}) {
  const { user, getToken } = useUser();

  const [bidUpdates, setBidUpdates] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidError, setBidError] = useState("");
  const [processingBids, setProcessingBids] = useState(new Set());

  // Confirmation dialog state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingBidAction, setPendingBidAction] = useState(null);

  // Success message state for bid actions
  const [bidActionSuccess, setBidActionSuccess] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState(false);

  // Function to fetch bid updates for the listing
  const fetchBidUpdates = async (productId) => {
    if (!productId) return;

    try {
      setLoadingBids(true);
      setBidError("");

      const token = getToken();

      if (!token) {
        setBidError("Authentication token not found");
        return;
      }

      const response = await fetch(`https://taza-bazar-backend.onrender.com/api/v1/buyer/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: productId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBidUpdates(data.data?.bids || []);
      } else {
        setBidError("Failed to fetch bid updates");
      }
    } catch (error) {
      console.error("Error fetching bid updates:", error);
      setBidError("Network error while fetching bids");
    } finally {
      setLoadingBids(false);
    }
  };

  // Function to handle bid accept/reject
  const handleBidAction = (bidId, action) => {
    const bidDetails = bidUpdates.find((bid) => bid._id === bidId);

    if (!bidDetails) {
      setBidError("Bid not found");
      return;
    }

    setPendingBidAction({
      bidId,
      action,
      bidDetails,
    });
    setShowConfirmationDialog(true);
  };

  // Function to handle confirmed bid action
  const handleConfirmedBidAction = async () => {
    if (!pendingBidAction) return;

    const { bidId, action, bidDetails } = pendingBidAction;

    try {
      setProcessingBids((prev) => new Set(prev).add(bidId));

      const token = getToken();
      if (!token) {
        setBidError("Authentication token not found");
        return;
      }

      // Update the bid status
      const bidStatusResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/buyer/bids`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            _id: bidId,
            status: action === "accept" ? "Accepted" : "Rejected",
          }),
        }
      );

      if (!bidStatusResponse.ok) {
        setBidError(`Failed to update bid status`);
        return;
      }

      // Send notification to consumer about bid acceptance/rejection
      const notificationResponse = await fetch(
        "https://taza-bazar-backend.onrender.com/api/v1/consumerAlert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: typeof bidDetails.consumer_id === 'object' ? bidDetails.consumer_id._id : bidDetails.consumer_id, // Consumer's ID who placed the bid
            bidInfo: bidId, // Bid object ID
            productInfo: listing._id, // Product/listing ID
            status: action === "accept" ? "Accepted" : "Rejected",
          }),
        }
      );

      if (!notificationResponse.ok) {
        console.error("Failed to send notification to consumer");
        // Continue even if notification fails
      } else {
        console.log("Notification sent successfully to consumer");
        setNotificationSuccess(true);
        
        // Auto-hide notification success after 3 seconds
        setTimeout(() => {
          setNotificationSuccess(false);
        }, 3000);
      }

      // If accepting bid, reduce product quantity and update farmer's revenue
      if (action === "accept" && listing?._id) {
        const newQuantity = Math.max(
          0,
          parseInt(listing.product_quantity) -
            parseInt(bidDetails.requested_quantity)
        );

        // Calculate revenue from this bid
        const bidRevenue = parseFloat(bidDetails.bid_price) * parseInt(bidDetails.requested_quantity);

        // Update product quantity
        const productUpdateResponse = await fetch(
          `https://taza-bazar-backend.onrender.com/api/v1/farmer/${listing._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              product_quantity: newQuantity,
            }),
          }
        );

        if (!productUpdateResponse.ok) {
          setBidError("Failed to update product quantity");
          return;
        }

        // Update farmer's total revenue using the current user's ID
        // First get current revenue
        const farmerResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let revenueUpdateResponse;
        
        if (farmerResponse.ok) {
          const farmerData = await farmerResponse.json();
          // Use the special parameter "increment_revenue" to indicate we want to add to the existing value
          // The backend needs to be updated to handle this special parameter
          
          // Now update with the combined revenue
          revenueUpdateResponse = await fetch(
            `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                increment_revenue: bidRevenue, // Special parameter to indicate addition
              }),
            }
          );
          console.log("Incrementing farmer revenue by:", bidRevenue);
        } else {
          // If we can't get current revenue info, still use the increment parameter
          revenueUpdateResponse = await fetch(
            `http://127.0.0.1:8000/api/v1/users/${user.user_id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                increment_revenue: bidRevenue,
              }),
            }
          );
        }

        if (!revenueUpdateResponse.ok) {
          console.error("Failed to update farmer's revenue");
          // We continue even if revenue update fails to ensure product update happens
        } else {
          console.log("Farmer's revenue updated successfully");
        }
        
        // Update consumer's total spent
        if (bidDetails.consumer_id) {
          const consumerId = typeof bidDetails.consumer_id === 'object' ? bidDetails.consumer_id._id : bidDetails.consumer_id;
          
          // First get consumer's current total_spent
          const consumerResponse = await fetch(
            `http://127.0.0.1:8000/api/v1/users/${consumerId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          let spentUpdateResponse;
            
          if (consumerResponse.ok) {
            const consumerData = await consumerResponse.json();
            // Use a special parameter to indicate we want to increment the existing value
            
            // Now update with combined spent amount
            spentUpdateResponse = await fetch(
              `http://127.0.0.1:8000/api/v1/users/${consumerId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  increment_spent: bidRevenue, // Special parameter to indicate addition
                }),
              }
            );
            console.log("Incrementing consumer spent by:", bidRevenue);
          } else {
            // If we can't get current spent, still use increment parameter
            spentUpdateResponse = await fetch(
              `http://127.0.0.1:8000/api/v1/users/${consumerId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  increment_spent: bidRevenue,
                }),
              }
            );
          }
          
          if (spentUpdateResponse.ok) {
            console.log("Consumer's total spent updated successfully");
          } else {
            console.error("Failed to update consumer's total spent");
            // Continue even if consumer update fails
          }

          // We've already handled the response above
        }

        // Update listing data locally
        listing.product_quantity = newQuantity;
      }

      setShowConfirmationDialog(false);
      setPendingBidAction(null);

      setBidActionSuccess(
        `Bid ${action === "accept" ? "accepted" : "rejected"} successfully!`
      );

      setTimeout(() => {
        setBidActionSuccess("");
      }, 3000);

      // Refresh bid updates
      if (listing?._id) {
        await fetchBidUpdates(listing._id);
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      setBidError(`Network error while ${action}ing bid`);
    } finally {
      setProcessingBids((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  };

  // Helper functions
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

  const formatPrice = (price, currency) => {
    const currencySymbol = currency === "BDT" ? "৳" : "₹";
    return `${currencySymbol}${price}`;
  };

  // Fetch bid updates when modal opens
  useEffect(() => {
    if (isOpen && listing?._id && !isBidSection) {
      fetchBidUpdates(listing._id);
    }

    // Reset states when modal closes
    if (!isOpen) {
      setBidUpdates([]);
      setBidError("");
      setBidActionSuccess("");
      setNotificationSuccess(false);
      setShowConfirmationDialog(false);
      setPendingBidAction(null);
    }
  }, [isOpen, listing?._id, isBidSection]);

  if (!isOpen || !listing) return null;
  
  // Handler to close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isBidSection ? "Request Details" : "Product Details"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(listing);
                onClose();
              }}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
              title="Edit listing"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => {
                onDelete(listing);
                onClose();
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
              title="Delete listing"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {listing.product_name}
                </h3>
                <div className="flex items-center gap-3">
                  {listing.admin_deal && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Admin Deal
                    </span>
                  )}
                  {!isBidSection && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        new Date(listing.to) >= new Date()
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {new Date(listing.to) >= new Date()
                        ? "Available"
                        : "Not Available"}
                    </span>
                  )}
                  {isBidSection && listing.status && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        listing.status === "Active" 
                          ? "bg-green-100 text-green-800"
                          : listing.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Range or Needed By */}
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isBidSection ? "Needed By" : "Availability"}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isBidSection 
                      ? new Date(listing.when).toLocaleDateString()
                      : formatDateRange(listing.from, listing.to)}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Quantity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {listing.product_quantity} {listing.quantity_unit}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-full p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Price per Unit
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    ৳{listing.price_per_unit}/{listing.quantity_unit}
                  </p>
                </div>
              </div>

              {/* Total Value */}
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Hash className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Value
                  </p>
                  <p className="text-lg font-semibold text-purple-600">
                    ৳
                    {(
                      listing.price_per_unit * listing.product_quantity
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {(listing.product_description || listing.request_description) && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {listing.product_description || listing.request_description}
                </p>
              </div>
            )}
          </div>

          {/* Bid Updates Section for Farmer Listings */}
          {!isBidSection && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">Bid Updates</h3>
              </div>

              {loadingBids && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-600">Loading bid updates...</div>
                </div>
              )}

              {bidError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {bidError}
                </div>
              )}

              {bidActionSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                  {bidActionSuccess}
                </div>
              )}

              {!loadingBids && !bidError && bidUpdates.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No bids yet
                  </h4>
                  <p className="text-gray-600">
                    No one has placed a bid on this listing yet.
                  </p>
                </div>
              )}

              {!loadingBids && !bidError && bidUpdates.length > 0 && (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {bidUpdates.map((bid, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        bid.status === "accepted" || bid.status === "Accepted"
                          ? "bg-green-50 border-green-200"
                          : bid.status === "rejected" || bid.status === "Rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {bid.consumer_name || (bid.consumer_id && typeof bid.consumer_id === 'object' ? bid.consumer_id.user_name : bid.consumer_id) || "Anonymous Bidder"}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {bid.message || "No message provided"}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span>Bid: ৳{bid.bid_price}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                <span>Qty: {bid.requested_quantity}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              bid.status === "accepted" ||
                              bid.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "rejected" ||
                                  bid.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bid.status || "Pending"}
                          </span>

                          {/* Action buttons - only show for pending bids */}
                          {(bid.status === "Pending" ||
                            bid.status === "pending" ||
                            !bid.status) && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleBidAction(bid._id, "accept")}
                                disabled={processingBids.has(bid._id)}
                                className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Accept bid"
                              >
                                <Check size={12} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleBidAction(bid._id, "reject")}
                                disabled={processingBids.has(bid._id)}
                                className="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Reject bid"
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Farmer Bids Section for Consumer Requests */}
          {isBidSection && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">Farmer Bids</h3>
              </div>

              {bidsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <div className="ml-3 text-gray-600">Loading bids...</div>
                </div>
              ) : requestBids.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No bid has been placed yet
                  </h4>
                  <p className="text-gray-600">
                    Farmers will see your request and can place bids
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {requestBids.map((bid, index) => (
                    <div
                      key={bid._id || index}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        bid.status === "Accepted"
                          ? "bg-green-50 border-green-200"
                          : bid.status === "Rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {bid.farmer_name
                              ? bid.farmer_name.charAt(0)
                              : "F"}
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {bid.farmer_name || "Anonymous Farmer"}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              {bid.farm_location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {bid.farm_location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bid.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : bid.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : bid.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {bid.status || "Pending"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-500">
                            Offered Quantity
                          </p>
                          <p className="font-semibold text-gray-900">
                            {bid.quantity || "N/A"}{" "}
                            {listing.quantity_unit}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-xs text-gray-500">
                            Price per Unit
                          </p>
                          <p className="font-semibold text-gray-900">
                            ৳{bid.price_per_unit || "N/A"}
                          </p>
                        </div>
                      </div>

                      {bid.message && (
                        <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-2 rounded">
                          {bid.message}
                        </p>
                      )}

                      {bid.status === "Pending" && handleAcceptBid && handleRejectBid ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptBid(bid)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`text-center py-2 px-3 rounded text-xs font-medium ${
                            bid.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : bid.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {bid.status === "Accepted"
                            ? "✓ Accepted"
                            : bid.status === "Rejected"
                            ? "✗ Rejected"
                            : bid.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification Success Toast */}
        {notificationSuccess && (
          <div className="fixed bottom-4 right-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-lg z-50 flex items-center">
            <Bell className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-blue-700">Notification Sent</p>
              <p className="text-sm text-blue-600">
                The consumer has been notified about your decision.
              </p>
            </div>
          </div>
        )}

        {/* Bid Action Confirmation Dialog */}
        {showConfirmationDialog && pendingBidAction && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowConfirmationDialog(false);
                setPendingBidAction(null);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Confirm{" "}
                  {pendingBidAction.action === "accept" ? "Accept" : "Reject"}{" "}
                  Bid
                </h3>
                <button
                  onClick={() => {
                    setShowConfirmationDialog(false);
                    setPendingBidAction(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to {pendingBidAction.action} this bid?
                </p>

                {pendingBidAction.bidDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Bid Details:
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consumer:</span>
                        <span className="font-medium">
                          {pendingBidAction.bidDetails.consumer_name || 
                           (pendingBidAction.bidDetails.consumer_id && typeof pendingBidAction.bidDetails.consumer_id === 'object' 
                              ? pendingBidAction.bidDetails.consumer_id.user_name 
                              : pendingBidAction.bidDetails.consumer_id) ||
                            "Anonymous"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bid Price:</span>
                        <span className="font-medium text-green-600">
                          ৳{pendingBidAction.bidDetails.bid_price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">
                          {pendingBidAction.bidDetails.requested_quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-green-700">
                          ৳
                          {(
                            pendingBidAction.bidDetails.bid_price *
                            pendingBidAction.bidDetails.requested_quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {pendingBidAction.action === "accept" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Accepting this bid will reduce your
                      product quantity by{" "}
                      {pendingBidAction.bidDetails?.requested_quantity || 0}{" "}
                      units.
                    </p>
                  </div>
                )}

                {pendingBidAction.action === "reject" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Note:</strong> This action cannot be undone. The
                      bidder will be notified of the rejection.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmationDialog(false);
                    setPendingBidAction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedBidAction}
                  disabled={processingBids.has(pendingBidAction.bidId)}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    pendingBidAction.action === "accept"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {processingBids.has(pendingBidAction.bidId)
                    ? `${
                        pendingBidAction.action === "accept"
                          ? "Accepting"
                          : "Rejecting"
                      }...`
                    : `${
                        pendingBidAction.action === "accept"
                          ? "Accept"
                          : "Reject"
                      } Bid`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
