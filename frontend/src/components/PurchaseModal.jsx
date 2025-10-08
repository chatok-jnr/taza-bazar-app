import { useState } from "react";

export default function PurchaseModal({ isOpen, onClose, product, onSubmit }) {
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      quantity,
      location,
      dateNeeded,
      productId: product.id,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Purchase Request</h2>
        <p className="mb-4">
          Product: <span className="font-semibold">{product.productName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Available: {product.quantity})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              min="1"
              max={parseInt(product.quantity)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Needed
            </label>
            <input
              type="date"
              value={dateNeeded}
              onChange={(e) => setDateNeeded(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Request for Deal
            </button>
            <button
              type="button"
              onClick={() =>
                (window.location.href = `/messages/${product.farmerId}`)
              }
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Message Farmer
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
