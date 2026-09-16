import React from 'react';
import { FiX, FiInfo } from 'react-icons/fi';
import { formatBDT } from '../../utils/formatters';

const ProfitModal = ({ isOpen, onClose, profitData }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Platform Profit</h3>
            <p className="text-xs text-gray-400">30% of total revenue</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-white"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-3">
          {/* Total Profit */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 rounded-lg">
            <p className="text-green-100 text-sm">Total Profit (30%)</p>
            <p className="text-3xl font-bold text-white">
              {formatBDT(profitData.totalProfit)}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
              <p className="text-xs text-green-400">Paid</p>
              <p className="text-xl font-bold text-green-400">
                {formatBDT(profitData.paidProfit)}
              </p>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
              <p className="text-xs text-yellow-400">Pending</p>
              <p className="text-xl font-bold text-yellow-400">
                {formatBDT(profitData.pendingProfit)}
              </p>
            </div>
          </div>

          {/* Due */}
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <p className="text-sm text-red-400">⚠️ Remaining Due</p>
            <p className="text-2xl font-bold text-red-400">
              {formatBDT(profitData.dueProfit)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Not yet paid by vendors</p>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
            <div className="flex gap-2">
              <FiInfo className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="text-xs text-blue-300">
                <p className="font-medium mb-1">How profit is calculated:</p>
                <p>Total Revenue × 30% = Platform Profit</p>
                <p>Vendors pay this as "Due" via payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ProfitModal;