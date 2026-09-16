import React from 'react';
import {
  FiUsers, FiUserCheck, FiAlertCircle, FiShoppingBag,
  FiDollarSign, FiStar, FiCreditCard, FiTrendingUp
} from 'react-icons/fi';
import { formatBDT } from '../../utils/formatters';

const StatCards = ({
  stats,
  paymentsStats,
  profitData,
  onStatClick,
  onPaymentsClick,
  onProfitClick
}) => {
  return (
    <>
      {/* ✅ Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {/* Total Vendors */}
        <button
          onClick={() => onStatClick('vendors', 'All Vendors', null)}
          className="card bg-blue-500/10 hover:bg-blue-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-blue-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-400 text-xs">Total Vendors</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-500 mt-1">
                {stats.totalVendors}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-500/20">
              <FiUsers className="text-blue-400" size={20} />
            </div>
          </div>
        </button>

        {/* Active */}
        <button
          onClick={() => onStatClick('vendors', 'Active Vendors', { status: 'active' })}
          className="card bg-green-500/10 hover:bg-green-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-green-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-400 text-xs">Active</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-500 mt-1">
                {stats.activeVendors}
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-500/20">
              <FiUserCheck className="text-green-400" size={20} />
            </div>
          </div>
        </button>

        {/* Pending */}
        <button
          onClick={() => onStatClick('vendors', 'Pending Vendors', { status: 'pending' })}
          className="card bg-yellow-500/10 hover:bg-yellow-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-yellow-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-yellow-400 text-xs">Pending</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-500 mt-1">
                {stats.pendingVendors}
              </p>
            </div>
            <div className="p-2 rounded-full bg-yellow-500/20">
              <FiAlertCircle className="text-yellow-400" size={20} />
            </div>
          </div>
        </button>

        {/* Total Orders */}
        <button
          onClick={() => onStatClick('orders', 'All Orders', null)}
          className="card bg-purple-500/10 hover:bg-purple-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-purple-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-400 text-xs">Total Orders</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-500 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-500/20">
              <FiShoppingBag className="text-purple-400" size={20} />
            </div>
          </div>
        </button>

        {/* Revenue */}
        <button
          onClick={() => onStatClick('revenue', 'Total Revenue', null)}
          className="card bg-emerald-500/10 hover:bg-emerald-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-emerald-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-400 text-xs">Revenue</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-emerald-500 mt-1 truncate">
                {formatBDT(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-2 rounded-full bg-emerald-500/20">
              <FiDollarSign className="text-emerald-400" size={20} />
            </div>
          </div>
        </button>

        {/* Avg Rating */}
        <button
          onClick={() => onStatClick('rating', 'Vendors by Rating', null)}
          className="card bg-amber-500/10 hover:bg-amber-500/20 shadow-lg p-3 sm:p-4 text-left transition-all transform hover:scale-[1.02] border border-amber-500/30"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-400 text-xs">Avg Rating</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-500 mt-1">
                {stats.averageRating} ⭐
              </p>
            </div>
            <div className="p-2 rounded-full bg-amber-500/20">
              <FiStar className="text-amber-400" size={20} />
            </div>
          </div>
        </button>
      </div>

      {/* ✅ Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Payment Approvals */}
        <button
          onClick={onPaymentsClick}
          className="card bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg p-4 text-left transition-all transform hover:scale-[1.02] text-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-xs">Payment Approvals</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {paymentsStats.pending || 0} Pending
              </p>
              <p className="text-blue-100 text-xs mt-1">
                Total: {formatBDT(paymentsStats.totalPendingAmount)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <FiCreditCard className="text-white" size={24} />
            </div>
          </div>
        </button>

        {/* Profit */}
        <button
          onClick={onProfitClick}
          className="card bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg p-4 text-left transition-all transform hover:scale-[1.02] text-white"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-xs">Platform Profit (30%)</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">
                {formatBDT(profitData.totalProfit)}
              </p>
              <p className="text-green-100 text-xs mt-1">
                Due: {formatBDT(profitData.dueProfit)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <FiTrendingUp className="text-white" size={24} />
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default StatCards;