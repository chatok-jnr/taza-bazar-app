import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, Type, Hash, Save, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import FarmerSidebar from '../components/FarmerSidebar';

export default function FarmerNewListing() {
  const navigate = useNavigate();
  const { user, getToken } = useUser();
  
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

  const quantityUnits = ['kg', 'gram', 'liter', 'ml', 'pieces', 'dozens', 'bags', 'tons'];
  const currencies = ['BDT', 'USD', 'EUR'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    }
    
    if (!formData.product_quantity || formData.product_quantity <= 0) {
      newErrors.product_quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.price_per_unit || formData.price_per_unit <= 0) {
      newErrors.price_per_unit = 'Price must be greater than 0';
    }
    
    if (!formData.from) {
      newErrors.from = 'Start date is required';
    }
    
    if (!formData.to) {
      newErrors.to = 'End date is required';
    }
    
    if (formData.from && formData.to && new Date(formData.from) >= new Date(formData.to)) {
      newErrors.to = 'End date must be after start date';
    }
    
    if (!formData.product_description.trim()) {
      newErrors.product_description = 'Product description is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = getToken();
      
      if (!token) {
        alert('Please login to create a listing');
        navigate('/login');
        return;
      }

      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        product_quantity: parseFloat(formData.product_quantity),
        price_per_unit: parseFloat(formData.price_per_unit),
        farmer_id: user?.user_id
      };

      const response = await fetch('http://127.0.0.1:8000/api/v1/farmers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Listing created successfully:', result);
        
        // Reset form
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
        
        alert('Listing created successfully!');
        navigate('/farmer'); // Navigate back to dashboard
      } else {
        const errorData = await response.json();
        console.error('Error creating listing:', errorData);
        alert(errorData.message || 'Failed to create listing. Please try again.');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <FarmerSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Listing</h1>
                <p className="text-gray-600">Add a new product to your marketplace listings</p>
              </div>
              <button
                onClick={() => navigate('/farmer')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type className="inline w-4 h-4 mr-2" />
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  placeholder="Enter product name (e.g., Fresh Organic Tomatoes)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.product_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.product_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline w-4 h-4 mr-2" />
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.product_quantity}
                  onChange={(e) => handleInputChange('product_quantity', e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.product_quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.product_quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.product_quantity}</p>
                )}
              </div>

              {/* Quantity Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.quantity_unit}
                  onChange={(e) => handleInputChange('quantity_unit', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                >
                  {quantityUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Price per Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Price per Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price_per_unit}
                  onChange={(e) => handleInputChange('price_per_unit', e.target.value)}
                  placeholder="Enter price per unit"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.price_per_unit ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price_per_unit && (
                  <p className="text-red-500 text-sm mt-1">{errors.price_per_unit}</p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              {/* Available From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Available From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.from ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.from && (
                  <p className="text-red-500 text-sm mt-1">{errors.from}</p>
                )}
              </div>

              {/* Available To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Available To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${
                    errors.to ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.to && (
                  <p className="text-red-500 text-sm mt-1">{errors.to}</p>
                )}
              </div>

              {/* Product Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-2" />
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.product_description}
                  onChange={(e) => handleInputChange('product_description', e.target.value)}
                  placeholder="Describe your product, quality, growing conditions, etc."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none ${
                    errors.product_description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.product_description && (
                  <p className="text-red-500 text-sm mt-1">{errors.product_description}</p>
                )}
              </div>

              {/* Total Value Display */}
              {formData.product_quantity && formData.price_per_unit && (
                <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Listing Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">Quantity:</span>
                      <p className="text-green-800">{formData.product_quantity} {formData.quantity_unit}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Price per Unit:</span>
                      <p className="text-green-800">{formData.price_per_unit} {formData.currency}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Total Value:</span>
                      <p className="text-green-800 font-bold">
                        {(parseFloat(formData.product_quantity) * parseFloat(formData.price_per_unit)).toLocaleString()} {formData.currency}
                      </p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Duration:</span>
                      <p className="text-green-800">
                        {formData.from && formData.to 
                          ? `${Math.ceil((new Date(formData.to) - new Date(formData.from)) / (1000 * 60 * 60 * 24))} days`
                          : 'Not set'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/farmer')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}