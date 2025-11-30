import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaShoppingBag, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFilter,
  FaUndo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBan,
  FaSearch
} from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("active");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sortedOrders = [...res.data.orders].sort((a, b) => 
        new Date(b.order_date) - new Date(a.order_date)
      );

      setOrders(sortedOrders);

      // Auto-detect default filter
      const activeCount = sortedOrders.filter(o => o.status !== "Cancelled" && o.status !== "Pending").length;
      const pendingCount = sortedOrders.filter(o => o.status === "Pending").length;
      const cancelledCount = sortedOrders.filter(o => o.status === "Cancelled").length;

      if (activeCount) setFilterType("active");
      else if (pendingCount) setFilterType("pending");
      else if (cancelledCount) setFilterType("cancelled");
      else setFilterType("all");

    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a cancel reason!',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5001/api/orders/${encodeURIComponent(selectedOrder.order_id)}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await Swal.fire({
        icon: 'success',
        title: 'Cancelled!',
        text: 'Order has been cancelled successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchOrders();
      closeCancelModal();
    } catch (error) {
      console.error("Cancel error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to cancel order.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order) => {
    const token = localStorage.getItem("token");
    try {
      // Parse order data
      const cartItems = typeof order.cart_items === "string" 
        ? JSON.parse(order.cart_items) 
        : order.cart_items;

      const address = typeof order.home_address === "string" 
        ? JSON.parse(order.home_address || '{}') 
        : typeof order.office_address === "string" 
          ? JSON.parse(order.office_address || '{}') 
          : typeof order.temp_address === "string" 
            ? JSON.parse(order.temp_address || '{}') 
            : order.home_address || order.office_address || order.temp_address || {};

      // Determine address type
      let addressType = "home";
      if (order.office_address && order.office_address !== "null") addressType = "office";
      if (order.temp_address && order.temp_address !== "null") addressType = "another";

      // Prepare reorder data with all required fields
      const reorderData = {
        category: order.order_id.split("#")[1].replace(/\d+/g, "") || "General",
        cart: cartItems,
        selectedDate: new Date().toISOString().split('T')[0], // Today's date
        selectedSlot: order.time_slot,
        notes: order.notes || "",
        addressType: addressType,
        address: JSON.stringify(address),
        recipientName: order.recipient_name || "Customer",
        recipientPhone: order.recipient_phone || ""
      };

      console.log("Reorder data:", reorderData);

      const response = await axios.post(
        "http://localhost:5001/api/place-order",
        reorderData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Order placed successfully! Order ID: ${response.data.orderId}`,
        });
        fetchOrders();
      }
    } catch (err) {
      console.error("Reorder failed:", err.response?.data || err);
      Swal.fire({
        icon: 'error',
        title: 'Reorder Failed',
        text: err.response?.data?.message || 'Failed to reorder. Please try again.',
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FaClock className="text-yellow-500" />;
      case "Completed": return <FaCheckCircle className="text-green-500" />;
      case "Cancelled": return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by type
    let typeMatch = true;
    if (filterType === "pending") typeMatch = order.status === "Pending";
    else if (filterType === "active") typeMatch = order.status !== "Pending" && order.status !== "Cancelled";
    else if (filterType === "cancelled") typeMatch = order.status === "Cancelled";

    // Filter by search term
    const searchMatch = order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      order.status.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && searchMatch;
  });

  const getTotalItems = (order) => {
    try {
      const cart = typeof order.cart_items === "string" ? JSON.parse(order.cart_items) : order.cart_items;
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch {
      return 0;
    }
  };

  const getTotalPrice = (order) => {
    try {
      const cart = typeof order.cart_items === "string" ? JSON.parse(order.cart_items) : order.cart_items;
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-olympic rounded-xl">
                <FaShoppingBag className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
                <p className="text-gray-600">Manage and track your orders</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative lg:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="input input-bordered w-full pl-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-olympic" />
            <h3 className="font-semibold text-lg">Filter Orders</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[
              { key: "active", label: "Active", icon: FaCheckCircle, count: orders.filter(o => o.status !== "Pending" && o.status !== "Cancelled").length },
              { key: "pending", label: "Pending", icon: FaClock, count: orders.filter(o => o.status === "Pending").length },
              { key: "cancelled", label: "Cancelled", icon: FaTimesCircle, count: orders.filter(o => o.status === "Cancelled").length },
              { key: "all", label: "All Orders", icon: FaShoppingBag, count: orders.length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filterType === filter.key 
                    ? 'bg-olympic text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <filter.icon />
                <span>{filter.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  filterType === filter.key ? 'bg-white text-olympic' : 'bg-gray-200 text-gray-700'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olympic"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No orders match your search criteria" : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const address = typeof order.home_address === "string" 
                ? JSON.parse(order.home_address || '{}') 
                : typeof order.office_address === "string" 
                  ? JSON.parse(order.office_address || '{}') 
                  : typeof order.temp_address === "string" 
                    ? JSON.parse(order.temp_address || '{}') 
                    : order.home_address || order.office_address || order.temp_address || {};
              
              const isCancelled = order.status === "Cancelled";
              const totalItems = getTotalItems(order);
              const totalPrice = getTotalPrice(order);

              return (
                <div
                  key={order.order_id}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                    isCancelled ? 'border-red-500' : 'border-olympic'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-black text-gray-900">{order.order_id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-olympic" />
                          <span>{new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-olympic" />
                          <span>{order.time_slot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-olympic" />
                          <span>{address.areaName || "Address not specified"}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Items:</span>
                          <span className="font-semibold ml-1">{totalItems}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold ml-1">৳{totalPrice}</span>
                        </div>
                        {order.cancel_reason && (
                          <div>
                            <span className="text-gray-600">Cancel Reason:</span>
                            <span className="font-semibold ml-1 text-red-600">{order.cancel_reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {!isCancelled && (
                        <button
                          onClick={() => openCancelModal(order)}
                          className="btn btn-error btn-outline flex items-center gap-2"
                        >
                          <FaBan />
                          Cancel
                        </button>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="btn btn-info flex items-center gap-2"
                        >
                          <FaUndo />
                          Reorder
                        </button>
                      )}

                      {!isCancelled && (
                        <button className="btn btn-success flex items-center gap-2">
                          <FaCheckCircle />
                          Track
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Order Modal */}
        <dialog open={showCancelModal} className="modal modal-middle">
          <div className="modal-box bg-white p-0 rounded-2xl max-w-md">
            <div className="bg-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <FaTimesCircle className="text-2xl" />
                <h3 className="font-bold text-lg">Cancel Order</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to cancel order <span className="font-semibold">{selectedOrder?.order_id}</span>?
              </p>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">Cancellation Reason</span>
                </label>
                <select
                  className="select select-bordered w-full rounded-xl"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found better price">Found better price</option>
                  <option value="Delivery time too long">Delivery time too long</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>
            </div>

            <div className="modal-action p-6 pt-0">
              <button 
                onClick={closeCancelModal} 
                className="btn btn-ghost rounded-xl"
                disabled={loading}
              >
                Close
              </button>
              <button 
                onClick={handleCancelOrder} 
                className="btn btn-error rounded-xl flex items-center gap-2"
                disabled={loading || !cancelReason}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaBan />
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default OrdersPage;