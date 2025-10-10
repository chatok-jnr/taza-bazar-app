import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, productName, isDeleting = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{productName}"? This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}