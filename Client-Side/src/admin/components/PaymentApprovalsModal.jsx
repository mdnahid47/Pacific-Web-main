import React from 'react';
import { FiX, FiCheck, FiCreditCard } from 'react-icons/fi';
import { formatBDT, formatDateTime } from '../../utils/formatters';

const PaymentApprovalsModal = ({
  isOpen,
  onClose,
  payments,
  stats,
  loading,
  onApprove,
  onReject
}) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Payment Approvals</h3>
            <p className="text-xs text-gray-400">Approve or reject vendor payments</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-white"
          >
            <FiX />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-blue-500/10 p-3 rounded-lg">
            <p className="text-xs text-blue-400">Total</p>
            <p className="text-xl font-bold text-blue-400">{stats.total || 0}</p>
          </div>
          <div className="bg-yellow-500/10 p-3 rounded-lg">
            <p className="text-xs text-yellow-400">Pending</p>
            <p className="text-xl font-bold text-yellow-400">{stats.pending || 0}</p>
            <p className="text-xs text-yellow-300">{formatBDT(stats.totalPendingAmount)}</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg">
            <p className="text-xs text-green-400">Approved</p>
            <p className="text-xl font-bold text-green-400">{stats.approved || 0}</p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg">
            <p className="text-xs text-red-400">Rejected</p>
            <p className="text-xl font-bold text-red-400">{stats.rejected || 0}</p>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <FiCreditCard size={48} className="mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400">No payments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(payment => (
              <div
                key={payment.id}
                className={`bg-gray-700/50 p-4 rounded-lg border ${
                  payment.status === 'pending' ? 'border-yellow-500/30' :
                  payment.status === 'approved' ? 'border-green-500/30' :
                  'border-red-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-white">
                        {payment.vendor_name || 'Unknown'}
                      </p>
                      <span className={`badge badge-xs ${
                        payment.status === 'pending' ? 'badge-warning' :
                        payment.status === 'approved' ? 'badge-success' :
                        'badge-error'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{payment.vendor_phone}</p>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="text-gray-400">Method:</span>
                        <span className="ml-1 font-medium text-white">
                          {payment.payment_method?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">TXN:</span>
                        <span className="ml-1 font-mono text-white">
                          {payment.transaction_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sender:</span>
                        <span className="ml-1 text-white">{payment.sender_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Date:</span>
                        <span className="ml-1 text-white">
                          {formatDateTime(payment.created_at)}
                        </span>
                      </div>
                    </div>

                    {payment.rejection_reason && (
                      <p className="text-xs text-red-400 mt-2">
                        ❌ {payment.rejection_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    <p className="text-2xl font-bold text-green-400">
                      {formatBDT(payment.amount)}
                    </p>

                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onApprove(payment)}
                          className="btn btn-xs btn-success gap-1"
                        >
                          <FiCheck size={12} /> Approve
                        </button>
                        <button
                          onClick={() => onReject(payment)}
                          className="btn btn-xs btn-error gap-1"
                        >
                          <FiX size={12} /> Reject
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
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default PaymentApprovalsModal;