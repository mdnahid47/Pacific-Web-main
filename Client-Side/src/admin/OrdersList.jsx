import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FiHome, FiUsers, FiShoppingBag, FiTruck, 
  FiPieChart, FiLogOut, FiSettings, FiEdit, 
  FiTrash2, FiEye, FiSearch, FiChevronLeft, 
  FiChevronRight, FiMenu, FiX 
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editOrder, setEditOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ordersPerPage = 10;
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-500",
    Processing: "bg-blue-500/20 text-blue-500",
    Shipped: "bg-purple-500/20 text-purple-500",
    Completed: "bg-green-500/20 text-green-500",
    Cancelled: "bg-red-500/20 text-red-500"
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Check if the click is not on the hamburger button
        const hamburgerButton = document.querySelector('.hamburger-button');
        if (!hamburgerButton || !hamburgerButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5001/api/admin/all-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5001/api/admin/order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        fetchOrders();
      } catch (err) {
        Swal.fire("Error", "Failed to delete order", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders?.filter((order) => {
    const name = order?.customer_name?.toLowerCase() || "";
    const id = order?.order_id?.toString() || "";
    return name.includes(search.toLowerCase()) || id.includes(search);
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="alert alert-error shadow-lg max-w-2xl">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="hamburger-button btn btn-sm btn-outline"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold">Order Management</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: '0', left: '0' }}
      >
        <h1 className="text-xl font-bold text-center py-4 border-b border-gray-700 hidden lg:block">Admin Panel</h1>
        <nav className="mt-4 space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 text-red-400"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
             onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 lg:ml-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold hidden lg:block">Order Management</h1>
          <div className="badge badge-primary gap-2 mt-2 lg:mt-0">
            Last Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="relative w-full lg:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full lg:w-auto">
            <StatsCard title="Total" value={orders.length} />
            <StatsCard title="Pending" value={orders.filter(o => o.status === 'Pending').length} color="text-yellow-500" />
            <StatsCard title="Completed" value={orders.filter(o => o.status === 'Completed').length} color="text-green-500" />
            <StatsCard title="Cancelled" value={orders.filter(o => o.status === 'Cancelled').length} color="text-red-500" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="card bg-gray-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="bg-gray-800 text-gray-400">Order ID</th>
                  <th className="bg-gray-800 text-gray-400 hidden sm:table-cell">Customer</th>
                  <th className="bg-gray-800 text-gray-400">Date</th>
                  <th className="bg-gray-800 text-gray-400">Status</th>
                  <th className="bg-gray-800 text-gray-400">Total</th>
                  <th className="bg-gray-800 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.order_id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="font-medium">#{order.order_id}</td>
                      <td className="hidden sm:table-cell">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-400">{order.customer_email}</p>
                        </div>
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-500'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="font-bold">৳{order.total}</td>
                      <td>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setViewOrder(order);
                              document.getElementById("view_order_modal").showModal();
                            }}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-info hover:bg-info/20"
                            title="View"
                          >
                            <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditOrder(order);
                              document.getElementById("edit_order_modal").showModal();
                            }}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-warning hover:bg-warning/20"
                            title="Edit"
                          >
                            <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.order_id)}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-error hover:bg-error/20"
                            title="Delete"
                          >
                            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {currentOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t border-gray-700 gap-3">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-xs sm:btn-sm btn-ghost disabled:opacity-50"
                >
                  <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                {[...Array(totalPages).keys()].map(page => (
                  <button
                    key={page + 1}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`btn btn-xs sm:btn-sm ${currentPage === page + 1 ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {page + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-xs sm:btn-sm btn-ghost disabled:opacity-50"
                >
                  <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Order Modal */}
         <dialog id="view_order_modal" className="modal">
          {viewOrder && console.log(viewOrder)}

        <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          {viewOrder && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-xl font-bold">Order #{viewOrder.order_id}</h3>
                  <p className="text-gray-400">
                    Placed on {new Date(viewOrder.order_date).toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[viewOrder.status]}`}>
                  {viewOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Customer Information (unchanged) */}
                <div className="card bg-gray-700/50 p-3 sm:p-4">
                  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Customer Information</h4>
                  <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <p><span className="text-gray-400">Name:</span> {viewOrder.customer_name}</p>
                    <p><span className="text-gray-400">Email:</span> {viewOrder.customer_email}</p>
                    <p><span className="text-gray-400">Phone:</span> {viewOrder.customer_phone}</p>
                  </div>
                </div>

                {/* Order Summary (unchanged) */}
                <div className="card bg-gray-700/50 p-3 sm:p-4">
                  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Summary</h4>
                  <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <p><span className="text-gray-400">Subtotal:</span> ৳{viewOrder.total}</p>
                    <p><span className="text-gray-400">Delivery Fee:</span> ৳{viewOrder.delivery_fee || 0}</p>
                    <p><span className="text-gray-400">Total:</span> ৳{viewOrder.total + (viewOrder.delivery_fee || 0)}</p>
                    <p><span className="text-gray-400">Payment Method:</span> {viewOrder.payment_method || 'N/A'}</p>
                  </div>
                </div>

{/* Delivery Information Section */}
<div className="card bg-gray-700/50 p-3 sm:p-4">
  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Delivery Information</h4>

  {viewOrder.address_type === 'another' ? (
    // Handle temp address (from order table)
    (() => {
      let addressObj;
      try {
        addressObj = typeof viewOrder.temp_address === 'string' 
          ? JSON.parse(viewOrder.temp_address) 
          : viewOrder.temp_address || {};
      } catch (e) {
        console.error("Address JSON parse error:", viewOrder.temp_address);
        return <p className="text-red-400">Invalid address format</p>;
      }

      return (
        <div className="space-y-2 text-sm sm:text-base">
          <h5 className="font-medium text-gray-300">Recipient & Delivery Address</h5>
          <p><span className="text-gray-400">Name:</span> {viewOrder.recipient_name || 'N/A'}</p>
          <p><span className="text-gray-400">Phone:</span> {viewOrder.recipient_phone || 'N/A'}</p>
          <p>
            <span className="text-gray-400">Address:</span>{" "}
            {[
              addressObj.full_address,
              addressObj.houseNo && `House: ${addressObj.houseNo}`,
              addressObj.roadNo && `Road: ${addressObj.roadNo}`,
              addressObj.area && `Area: ${addressObj.area}`,
              addressObj.thana && `Thana: ${addressObj.thana}`,
              addressObj.district && `District: ${addressObj.district}`,
              addressObj.division && `Division: ${addressObj.division}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      );
    })()
  ) : (
    // For home/office addresses (from user table)
    (() => {
      const addressField = viewOrder.address_type === 'home' 
        ? 'home_address' 
        : viewOrder.address_type === 'office' 
          ? 'office_address' 
          : null;

      if (!addressField) return <p className="text-red-400">No address type specified</p>;

      let addressObj;
      try {
        addressObj = typeof viewOrder[addressField] === 'string' 
          ? JSON.parse(viewOrder[addressField]) 
          : viewOrder[addressField] || {};
      } catch (e) {
        console.error("Address JSON parse error:", viewOrder[addressField]);
        return <p className="text-red-400">Invalid address format</p>;
      }

      return (
        <div className="space-y-2 text-sm sm:text-base">
          <h5 className="font-medium text-gray-300">
            {viewOrder.address_type === 'home' && 'Home Address'}
            {viewOrder.address_type === 'office' && 'Office Address'}
          </h5>
          <p>
            <span className="text-gray-400">Address:</span>{" "}
            {[
              addressObj.full_address,
              addressObj.houseNo && `House: ${addressObj.houseNo}`,
              addressObj.roadNo && `Road: ${addressObj.roadNo}`,
              addressObj.area && `Area: ${addressObj.area}`,
              addressObj.thana && `Thana: ${addressObj.thana}`,
              addressObj.district && `District: ${addressObj.district}`,
              addressObj.division && `Division: ${addressObj.division}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      );
    })()
  )}
</div>


                {/* Order Items (unchanged) */}
                <div className="card bg-gray-700/50 p-3 sm:p-4">
                  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewOrder.cart_items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.name}</td>
                            <td>৳{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>৳{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {viewOrder.status === 'Cancelled' && (
                <div className="card bg-red-900/20 p-3 sm:p-4 border border-red-900/50">
                  <h4 className="font-semibold text-lg mb-1 sm:mb-2 text-red-400">Cancellation Details</h4>
                  <div className="text-sm sm:text-base">
                    <p><span className="text-gray-400">Reason:</span> {viewOrder.cancel_reason || 'Not specified'}</p>
                    {viewOrder.cancelled_at && (
                      <p><span className="text-gray-400">Cancelled at:</span> {new Date(viewOrder.cancelled_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </dialog>

        {/* Edit Order Modal */}
        <dialog id="edit_order_modal" className="modal">
          <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            
            {editOrder && (
              <div>
                <h3 className="text-xl font-bold mb-4 sm:mb-6">Edit Order #{editOrder.order_id}</h3>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setUpdating(true);
                  const token = localStorage.getItem("token");

                  try {
                    const updatedOrder = {
                      status: e.target.status.value,
                      notes: e.target.notes.value,
                      vendor_id: e.target.vendor_id.value,
                    };

                    await axios.put(
                      `http://localhost:5001/api/admin/order/${editOrder.order_id}`,
                      updatedOrder,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    Swal.fire({
                      title: "Success!",
                      text: "Order updated successfully",
                      icon: "success",
                      confirmButtonColor: "#4f46e5",
                    });
                    
                    fetchOrders();
                    document.getElementById("edit_order_modal").close();
                  } catch (error) {
                    Swal.fire({
                      title: "Error!",
                      text: "Failed to update order",
                      icon: "error",
                      confirmButtonColor: "#dc2626",
                    });
                  } finally {
                    setUpdating(false);
                  }
                }}>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Order Status</span>
                      </label>
                      <select
                        name="status"
                        defaultValue={editOrder.status}
                        className="select select-bordered w-full bg-gray-700 border-gray-600"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Notes</span>
                      </label>
                      <textarea
                        name="notes"
                        defaultValue={editOrder.notes || ""}
                        className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
                        rows={3}
                        placeholder="Add any notes about this order..."
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Assign Vendor</span>
                      </label>
                      <select
                        name="vendor_id"
                        defaultValue={editOrder.vendor_id || ""}
                        className="select select-bordered w-full bg-gray-700 border-gray-600"
                      >
                        <option value="">-- Select Vendor --</option>
                        <option value="1">Vendor 1</option>
                        <option value="2">Vendor 2</option>
                        <option value="3">Vendor 3</option>
                      </select>
                    </div>

                    <div className="modal-action mt-4 sm:mt-6">
                      <button
                        type="submit"
                        className={`btn btn-primary ${updating ? 'loading' : ''}`}
                        disabled={updating}
                      >
                        {updating ? 'Updating...' : 'Update Order'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => document.getElementById("edit_order_modal").close()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </dialog>
      </main>
    </div>
  );
};

// Reusable SidebarLink component
const SidebarLink = ({ to, icon, text, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg ${
        isActive ? "bg-primary text-white" : "hover:bg-gray-700"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {text}
  </NavLink>
);

// Reusable StatsCard component
const StatsCard = ({ title, value, color = "" }) => (
  <div className="card bg-gray-800 shadow-sm">
    <div className="card-body p-2 sm:p-3">
      <h3 className="text-gray-400 text-xs sm:text-sm">{title}</h3>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default OrdersList;