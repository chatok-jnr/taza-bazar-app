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
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { getApiUrl } from "../config/api";

export default function ProductDetailsModal({
  isOpen,
  onClose,
  listing,
  onEdit,
  onDelete,
}) {
  const { getToken } = useUser();

  const [bidUpdates, setBidUpdates] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidError, setBidError] = useState("");
  const [processingBids, setProcessingBids] = useState(new Set());

  // Confirmation dialog state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingBidAction, setPendingBidAction] = useState(null);

  // Success message state for bid actions
  const [bidActionSuccess, setBidActionSuccess] = useState("");

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

      const response = await fetch(getApiUrl(`api/v1/buyer/bids`), {
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
        getApiUrl(`api/v1/buyer/bids`),
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

      // If accepting bid, reduce product quantity
      if (action === "accept" && listing?._id) {
        const newQuantity = Math.max(
          0,
          parseInt(listing.product_quantity) -
            parseInt(bidDetails.requested_quantity)
        );

        const productUpdateResponse = await fetch(
          getApiUrl(`api/v1/farmer/${listing._id}`),
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
    if (isOpen && listing?._id) {
      fetchBidUpdates(listing._id);
    }

    // Reset states when modal closes
    if (!isOpen) {
      setBidUpdates([]);
      setBidError("");
      setBidActionSuccess("");
      setShowConfirmationDialog(false);
      setPendingBidAction(null);
    }
  }, [isOpen, listing?._id]);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
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
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Range */}
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Availability
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDateRange(listing.from, listing.to)}
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
            {listing.product_description && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {listing.product_description}
                </p>
              </div>
            )}
          </div>

          {/* Bid Updates Section */}
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
                            {bid.consumer_id || "Anonymous Bidder"}
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
        </div>

        {/* Bid Action Confirmation Dialog */}
        {showConfirmationDialog && pendingBidAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                        <span className="text-gray-600">Consumer ID:</span>
                        <span className="font-medium">
                          {pendingBidAction.bidDetails.consumer_id ||
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
