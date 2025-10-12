import React, { useState } from 'react';
import { X, Package, Calendar, DollarSign, Type, Hash, ToggleLeft, ToggleRight, Trash2, TrendingUp, User, Clock, Check, XCircle } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useUser } from '../context/UserContext';

export default function NewListingModal({ isOpen, onClose, onSubmit, editData = null, onDelete = null }) {
  const { getToken } = useUser();
  
  const [formData, setFormData] = useState({
    product_name: '',
    product_quantity: '',
    quantity_unit: 'kg',
    price_per_unit: '',
    currency: 'BDT',
    from: '',
    to: '',
    product_description: '',
    admin_deal: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bidUpdates, setBidUpdates] = useState([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidError, setBidError] = useState('');
  const [processingBids, setProcessingBids] = useState(new Set());
  
  // Confirmation dialog state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingBidAction, setPendingBidAction] = useState(null); // { bidId, action, bidDetails }
  
  // Success message state for bid actions
  const [bidActionSuccess, setBidActionSuccess] = useState('');

  const isEditMode = !!editData;

  // Function to fetch bid updates for the listing
  const fetchBidUpdates = async (productId) => {
    if (!productId) return;
    
    try {
      setLoadingBids(true);
      setBidError('');
      
      // Get token from user context
      const token = getToken();
      
      if (!token) {
        setBidError('Authentication token not found');
        return;
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/v1/buyer/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: productId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the correct API response structure: data.data.bids
        setBidUpdates(data.data?.bids || []);
      } else {
        setBidError('Failed to fetch bid updates');
      }
    } catch (error) {
      console.error('Error fetching bid updates:', error);
      setBidError('Network error while fetching bids');
    } finally {
      setLoadingBids(false);
    }
  };

  // Function to handle bid accept/reject - now shows confirmation dialog
  const handleBidAction = (bidId, action) => {
    // Find the bid details
    const bidDetails = bidUpdates.find(bid => bid._id === bidId);
    
    if (!bidDetails) {
      setBidError('Bid not found');
      return;
    }

    // Set pending action and show confirmation dialog
    setPendingBidAction({
      bidId,
      action,
      bidDetails
    });
    setShowConfirmationDialog(true);
  };

  // Function to handle confirmed bid action (actual processing)
  const handleConfirmedBidAction = async () => {
    if (!pendingBidAction) return;

    const { bidId, action, bidDetails } = pendingBidAction;

    try {
      setProcessingBids(prev => new Set(prev).add(bidId));
      
      const token = getToken();
      if (!token) {
        setBidError('Authentication token not found');
        return;
      }

      // First, update the bid status in the database
      const bidStatusResponse = await fetch(`http://127.0.0.1:8000/api/v1/buyer/bids`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: bidId,
          status: action === 'accept' ? 'Accepted' : 'Rejected'
        }),
      });

      if (!bidStatusResponse.ok) {
        setBidError(`Failed to update bid status`);
        return;
      }

      // If accepting bid, reduce product quantity
      if (action === 'accept' && editData?._id) {
        const newQuantity = Math.max(0, parseInt(formData.product_quantity) - parseInt(bidDetails.requested_quantity));
        
        // Update product quantity in database
        const productUpdateResponse = await fetch(`http://127.0.0.1:8000/api/v1/farmer/${editData._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_quantity: newQuantity
          }),
        });

        if (!productUpdateResponse.ok) {
          setBidError('Failed to update product quantity');
          return;
        }

        // Update form data to reflect the new quantity
        setFormData(prev => ({
          ...prev,
          product_quantity: newQuantity.toString()
        }));
      }

      // Close confirmation dialog
      setShowConfirmationDialog(false);
      setPendingBidAction(null);

      // Show success message
      setBidActionSuccess(`Bid ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setBidActionSuccess('');
      }, 3000);

      // Refresh bid updates after successful action
      if (editData?._id) {
        await fetchBidUpdates(editData._id);
      }

    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      setBidError(`Network error while ${action}ing bid`);
    } finally {
      setProcessingBids(prev => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  };

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        product_name: '',
        product_quantity: '',
        quantity_unit: 'kg',
        price_per_unit: '',
        currency: 'BDT',
        from: '',
        to: '',
        product_description: '',
        admin_deal: false
      });
      setErrors({});
      setShowDeleteModal(false);
      setBidUpdates([]);
      setBidError('');
      setBidActionSuccess('');
    } else if (isEditMode && editData) {
      // Pre-fill form with edit data
      setFormData({
        product_name: editData.product_name || '',
        product_quantity: editData.product_quantity || '',
        quantity_unit: editData.quantity_unit || 'kg',
        price_per_unit: editData.price_per_unit || '',
        currency: editData.currency || 'BDT',
        from: editData.from ? editData.from.split('T')[0] : '', // Convert to YYYY-MM-DD format
        to: editData.to ? editData.to.split('T')[0] : '', // Convert to YYYY-MM-DD format
        product_description: editData.product_descriptionn || editData.product_description || '',
        admin_deal: editData.admin_deal || false
      });
      setErrors({});
      
      // Fetch bid updates for this listing
      fetchBidUpdates(editData._id);
    }
  }, [isOpen, isEditMode, editData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    }
    
    if (!formData.product_quantity || formData.product_quantity <= 0) {
      newErrors.product_quantity = 'Product quantity must be greater than 0';
    }
    
    if (!formData.quantity_unit.trim()) {
      newErrors.quantity_unit = 'Quantity unit is required';
    }
    
    if (!formData.price_per_unit || formData.price_per_unit <= 0) {
      newErrors.price_per_unit = 'Price per unit must be greater than 0';
    }
    
    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.from) {
      newErrors.from = 'Start date is required';
    }
    
    if (!formData.to) {
      newErrors.to = 'End date is required';
    }
    
    if (formData.from && formData.to && new Date(formData.from) > new Date(formData.to)) {
      newErrors.to = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert form data to match API format
      const submitData = {
        ...formData,
        product_quantity: parseInt(formData.product_quantity),
        price_per_unit: parseFloat(formData.price_per_unit),
        product_descriptionn: formData.product_description // Note: API expects 'product_descriptionn' with double 'n'
      };
      
      // Remove the local product_description field since API expects product_descriptionn
      delete submitData.product_description;
      
      // If editing, include the product ID but don't include user_id
      if (isEditMode && editData) {
        submitData._id = editData._id;
        // For manage listing (edit mode), we don't need user_id
        // The data format should only include product fields
      }
      
      await onSubmit(submitData, isEditMode);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editData || !onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(editData._id);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Manage Listing' : 'Create New Listing'}
          </h2>
          <div className="flex items-center gap-2">
            {isEditMode && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting || isDeleting}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                title="Delete listing"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.product_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
                disabled={isSubmitting}
              />
            </div>
            {errors.product_name && (
              <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>
            )}
          </div>

          {/* Product Quantity and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="product_quantity"
                  value={formData.product_quantity}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.product_quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter quantity"
                  min="1"
                  step="1"
                  disabled={isSubmitting}
                />
              </div>
              {errors.product_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.product_quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                name="quantity_unit"
                value={formData.quantity_unit}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.quantity_unit ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="piece">Piece</option>
                <option value="gram">Gram (g)</option>
                <option value="liter">Liter (L)</option>
                <option value="ton">Ton</option>
                <option value="dozen">Dozen</option>
                <option value="bag">Bag</option>
                <option value="box">Box</option>
              </select>
              {errors.quantity_unit && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity_unit}</p>
              )}
            </div>
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.price_per_unit ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>
              {errors.price_per_unit && (
                <p className="mt-1 text-sm text-red-600">{errors.price_per_unit}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.currency ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="BDT">Bangladeshi Taka (BDT)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.from ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.from && (
                <p className="mt-1 text-sm text-red-600">{errors.from}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available To *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.to ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.to && (
                <p className="mt-1 text-sm text-red-600">{errors.to}</p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your product (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Admin Deal Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Admin Deal</h4>
              <p className="text-sm text-gray-600">Mark this as an admin-verified deal</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'admin_deal', type: 'checkbox', checked: !formData.admin_deal } })}
              disabled={isSubmitting}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                formData.admin_deal ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  formData.admin_deal ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Bid Updates Section - Only show in edit mode */}
          {isEditMode && (
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
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h4>
                  <p className="text-gray-600">No one has placed a bid on this listing yet.</p>
                </div>
              )}
              
              {!loadingBids && !bidError && bidUpdates.length > 0 && (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {bidUpdates.map((bid, index) => (
                    <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      bid.status === 'accepted' || bid.status === 'Accepted' ? 'bg-green-50 border-green-200' :
                      bid.status === 'rejected' || bid.status === 'Rejected' ? 'bg-red-50 border-red-200' :
                      'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{bid.consumer_id || 'Anonymous Bidder'}</h4>
                            <p className="text-sm text-gray-600 mt-1">{bid.message || 'No message provided'}</p>
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
                                <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bid.status === 'accepted' || bid.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                            bid.status === 'rejected' || bid.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bid.status || 'Pending'}
                          </span>
                          
                          {/* Action buttons - only show for pending bids */}
                          {(bid.status === 'Pending' || bid.status === 'pending' || !bid.status) && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleBidAction(bid._id, 'accept')}
                                disabled={processingBids.has(bid._id)}
                                className="flex items-center gap-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Accept bid"
                              >
                                <Check size={12} />
                                Accept
                              </button>
                              <button
                                onClick={() => handleBidAction(bid._id, 'reject')}
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

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Listing' : 'Create Listing')}
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          productName={formData.product_name}
          isDeleting={isDeleting}
        />

        {/* Bid Action Confirmation Dialog */}
        {showConfirmationDialog && pendingBidAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Confirm {pendingBidAction.action === 'accept' ? 'Accept' : 'Reject'} Bid
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
                    <h4 className="font-semibold text-gray-800 mb-2">Bid Details:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consumer ID:</span>
                        <span className="font-medium">{pendingBidAction.bidDetails.consumer_id || 'Anonymous'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bid Price:</span>
                        <span className="font-medium text-green-600">৳{pendingBidAction.bidDetails.bid_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{pendingBidAction.bidDetails.requested_quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-green-700">৳{(pendingBidAction.bidDetails.bid_price * pendingBidAction.bidDetails.requested_quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {pendingBidAction.action === 'accept' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Accepting this bid will reduce your product quantity by {pendingBidAction.bidDetails?.requested_quantity || 0} units.
                    </p>
                  </div>
                )}

                {pendingBidAction.action === 'reject' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Note:</strong> This action cannot be undone. The bidder will be notified of the rejection.
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
                    pendingBidAction.action === 'accept' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {processingBids.has(pendingBidAction.bidId) 
                    ? `${pendingBidAction.action === 'accept' ? 'Accepting' : 'Rejecting'}...` 
                    : `${pendingBidAction.action === 'accept' ? 'Accept' : 'Reject'} Bid`
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}