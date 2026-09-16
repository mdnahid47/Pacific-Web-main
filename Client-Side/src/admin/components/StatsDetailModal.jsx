import React from 'react';
import { FiX } from 'react-icons/fi';
import { formatBDT } from '../../utils/formatters';

const StatsDetailModal = ({ statModal, onClose }) => {
  if (!statModal) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{statModal.title}</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-white"
          >
            <FiX />
          </button>
        </div>

        {statModal.type === 'vendors' && (
          <div className="space-y-2">
            {statModal.data.length === 0 ? (
              <p className="text-center py-8 text-gray-400">No vendors found</p>
            ) : (
              statModal.data.map(vendor => (
                <div key={vendor.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">{vendor.name}</p>
                    <p className="text-xs text-gray-400">{vendor.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge badge-sm ${
                      vendor.status === 'active' ? 'badge-success' :
                      vendor.status === 'pending' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {vendor.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">⭐ {vendor.average_rating || 0}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {statModal.type === 'orders' && (
          <div className="space-y-2">
            {statModal.data.map(vendor => (
              <div key={vendor.id} className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-white">{vendor.name}</p>
                  <p className="text-sm font-bold text-purple-400">{vendor.total_orders || 0} orders</p>
                </div>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-green-400">✓ {vendor.completed_orders || 0}</span>
                  <span className="text-yellow-400">⏳ {vendor.pending_orders || 0}</span>
                  <span className="text-red-400">✗ {vendor.canceled_orders || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {statModal.type === 'revenue' && (
          <div className="space-y-2">
            <div className="bg-emerald-500/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-emerald-400">
                {formatBDT(statModal.data.reduce((sum, v) => sum + (parseFloat(v.total_revenue) || 0), 0))}
              </p>
            </div>
            {statModal.data
              .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
              .map(vendor => (
                <div key={vendor.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                  <p className="font-medium text-white">{vendor.name}</p>
                  <p className="font-bold text-emerald-400">{formatBDT(vendor.total_revenue)}</p>
                </div>
              ))}
          </div>
        )}

        {statModal.type === 'rating' && (
          <div className="space-y-2">
            <div className="bg-amber-500/10 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold text-amber-400">
                {statModal.data.length > 0
                  ? (statModal.data.reduce((sum, v) => sum + (parseFloat(v.average_rating) || 0), 0) / statModal.data.length).toFixed(1)
                  : 0} ⭐
              </p>
            </div>
            {statModal.data.map(vendor => (
              <div key={vendor.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                <p className="font-medium text-white">{vendor.name}</p>
                <div className="text-right">
                  <p className="font-bold text-amber-400">{vendor.average_rating} ⭐</p>
                  <p className="text-xs text-gray-400">{vendor.total_reviews || 0} reviews</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default StatsDetailModal;