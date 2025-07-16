import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("active");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sortedOrders = [...res.data.orders].sort((a, b) => {
        if (a.status === "Cancelled") return 1;
        if (b.status === "Cancelled") return -1;
        return 0;
      });

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
      await axios.post(
        "http://localhost:5001/api/place-order",
        {
          category: order.order_id.split("#")[1].replace(/\d+/g, ""),
          cart: typeof order.cart_items === "string" ? JSON.parse(order.cart_items) : order.cart_items,
          selectedDate: order.order_date.split("T")[0],
          selectedSlot: order.time_slot,
          notes: order.notes,
          address: typeof order.address === "string" ? JSON.parse(order.address) : order.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order placed again successfully!',
      });
      fetchOrders();
    } catch (err) {
      console.error("Reorder failed:", err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Reorder failed.',
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterType === "pending") return order.status === "Pending";
    if (filterType === "active") return order.status !== "Pending" && order.status !== "Cancelled";
    if (filterType === "cancelled") return order.status === "Cancelled";
    return true;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterType("active")}
          className={`btn ${filterType === "active" ? "btn-primary" : "btn-ghost"}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterType("pending")}
          className={`btn ${filterType === "pending" ? "btn-primary" : "btn-ghost"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterType("cancelled")}
          className={`btn ${filterType === "cancelled" ? "btn-primary" : "btn-ghost"}`}
        >
          Cancelled
        </button>
        <button
          onClick={() => setFilterType("all")}
          className={`btn ${filterType === "all" ? "btn-primary" : "btn-ghost"}`}
        >
          All
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found in this category
        </div>
      ) : (
        filteredOrders.map((order) => {
          const address = typeof order.address === "string" ? JSON.parse(order.address || '{}') : order.address || {};
          const isCancelled = order.status === "Cancelled";

          return (
            <div
              key={order.order_id}
              className={`border p-4 rounded-xl mb-4 shadow-md ${
                isCancelled ? "bg-red-50" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div>
                  <h3 className="font-semibold">Order: {order.order_id}</h3>
                  <p className="text-sm mt-1">Date: {order.order_date?.split("T")[0]}</p>
                  <p className="text-sm">Time Slot: {order.time_slot}</p>
                  <p className="text-sm">
                    Area: {address?.areaName || "-"}, Road: {address?.roadNo || "-"}
                  </p>
                </div>
                <span className={`text-sm mt-2 sm:mt-0 ${isCancelled ? "text-red-500" : "text-green-600"}`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {!isCancelled && (
                  <button
                    onClick={() => openCancelModal(order)}
                    className="btn btn-error"
                  >
                    Cancel Order
                  </button>
                )}

                {isCancelled && !order.reordered && (
                  <button
                    onClick={() => handleReorder(order)}
                    className="btn btn-info"
                  >
                    Reorder
                  </button>
                )}

                {!isCancelled && (
                  <button className="btn btn-success">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* DaisyUI Modal with Dropdown */}
      <dialog open={showCancelModal} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cancel Order</h3>
          <div className="py-4 space-y-4">
            <p>Order ID: <span className="font-semibold">{selectedOrder?.order_id}</span></p>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Select cancellation reason</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="">Please select a reason</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found better price">Found better price</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={closeCancelModal} className="btn">
              Close
            </button>
            <button 
              onClick={handleCancelOrder} 
              className="btn btn-error"
              disabled={loading || !cancelReason}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Cancelling...
                </>
              ) : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default OrdersPage;