// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   FiHome, FiUsers, FiShoppingBag, FiTruck,
//   FiPieChart, FiLogOut, FiSettings, FiEdit,
//   FiTrash2, FiEye, FiSearch, FiChevronLeft,
//   FiChevronRight, FiMenu, FiX, FiUserCheck,
//   FiCheckCircle, FiAlertCircle, FiClock,
//   FiRefreshCw, FiFilter, FiUser, FiMapPin,
//   FiPlayCircle, FiDollarSign, FiXCircle,
//   FiPackage
// } from "react-icons/fi";
// import { NavLink, useNavigate } from "react-router-dom";

// // API Configuration
// const API_CONFIG = {
//   BASE_URL: "http://localhost:5001/api",
//   ENDPOINTS: {
//     GET_ALL_ORDERS: "/admin/all-orders",
//     UPDATE_ORDER_STATUS: (orderId) => `/orders/${encodeURIComponent(orderId)}/status`,
//     ASSIGN_VENDOR: (orderId) => `/orders/${encodeURIComponent(orderId)}/assign`,
//     UPDATE_ORDER: (orderId) => `/order/${encodeURIComponent(orderId)}`,
//     GET_VENDORS: "/admin/vendors",
//     CANCEL_CHECK: (orderId) => `/orders/${encodeURIComponent(orderId)}/cancel-check`,
//     CANCEL_ORDER: (orderId) => `/orders/${encodeURIComponent(orderId)}/cancel`,
//   }
// };

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [vendorsLoading, setVendorsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [editOrder, setEditOrder] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [viewOrder, setViewOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showCancellationModal, setShowCancellationModal] = useState(false);
//   const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
//   const [cancelCheckData, setCancelCheckData] = useState(null);
//   const [cancelling, setCancelling] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');

//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     processing: 0,
//     started: 0,
//     active: 0,
//     completed: 0,
//     cancelled: 0,
//     assigned: 0,
//     totalPenalty: 0,
//     cancelledWithPenalty: 0
//   });

//   // New state for assign vendor modal
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
//   const [searchVendor, setSearchVendor] = useState("");
//   const [filteredVendors, setFilteredVendors] = useState([]);

//   const ordersPerPage = 10;
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   const statusColors = {
//     Pending: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
//     Processing: "bg-blue-500/20 text-blue-500 border border-blue-500/30",
//     Started: "bg-indigo-500/20 text-indigo-500 border border-indigo-500/30",
//     Shipped: "bg-purple-500/20 text-purple-500 border border-purple-500/30",
//     Active: "bg-green-500/20 text-green-500 border border-green-500/30",
//     Completed: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
//     Cancelled: "bg-red-500/20 text-red-500 border border-red-500/30",
//     'Assigned to Vendor': "bg-violet-500/20 text-violet-500 border border-violet-500/30"
//   };

//   // Close sidebar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         const hamburgerButton = document.querySelector('.hamburger-button');
//         if (!hamburgerButton || !hamburgerButton.contains(event.target)) {
//           setSidebarOpen(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [sidebarOpen]);

//   // Filter vendors based on search
//   useEffect(() => {
//     if (searchVendor.trim() === "") {
//       setFilteredVendors(vendors);
//     } else {
//       const filtered = vendors.filter(vendor =>
//         vendor.name?.toLowerCase().includes(searchVendor.toLowerCase()) ||
//         vendor.email?.toLowerCase().includes(searchVendor.toLowerCase()) ||
//         vendor.phone?.toLowerCase().includes(searchVendor.toLowerCase()) ||
//         vendor.id?.toString().includes(searchVendor)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchVendor, vendors]);

//   // API call helper
//   const apiCall = async (endpoint, method = 'GET', data = null) => {
//     const token = localStorage.getItem("token");
//     const url = `${API_CONFIG.BASE_URL}${endpoint}`;

//     const config = {
//       method,
//       url,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };

//     if (data) {
//       config.data = data;
//     }

//     try {
//       const response = await axios(config);
//       return response.data;
//     } catch (error) {
//       console.error(`API Error (${endpoint}):`, error);
//       throw error;
//     }
//   };

//   // Fetch vendors from API
//   const fetchVendors = async () => {
//     setVendorsLoading(true);
//     try {
//       const data = await apiCall(API_CONFIG.ENDPOINTS.GET_VENDORS);

//       if (data.success && Array.isArray(data.vendors)) {
//         setVendors(data.vendors);
//         setFilteredVendors(data.vendors);

//         // Debug: Log vendor count
//         console.log(`✅ Loaded ${data.vendors.length} vendors`);
//         console.log('📋 Vendors:', data.vendors.map(v => ({ id: v.id, name: v.name, status: v.status })));
//       } else {
//         console.warn('⚠️ No vendors array in response:', data);
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch vendors:", err);
//       setVendors([]);
//       setFilteredVendors([]);
//     } finally {
//       setVendorsLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await apiCall(API_CONFIG.ENDPOINTS.GET_ALL_ORDERS);

//       const ordersData = data.orders || [];
//       console.log('Total orders:', ordersData.length);

//       // Debug: Check vendor IDs in orders
//       const ordersWithVendors = ordersData.filter(o => o.vendor_id);
//       console.log('Orders with vendor IDs:', ordersWithVendors.length);

//       setOrders(ordersData);
//       calculateStats(ordersData);
//     } catch (err) {
//       setError("Failed to fetch orders");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (ordersData) => {
//     const statsData = {
//       total: ordersData.length,
//       pending: ordersData.filter(o => o.status === 'Pending').length,
//       processing: ordersData.filter(o => o.status === 'Processing').length,
//       started: ordersData.filter(o => o.status === 'Started').length,
//       active: ordersData.filter(o => o.status === 'Active').length,
//       completed: ordersData.filter(o => o.status === 'Completed').length,
//       cancelled: ordersData.filter(o => o.status === 'Cancelled').length,
//       assigned: ordersData.filter(o => o.vendor_id).length,
//       totalPenalty: ordersData.reduce((sum, order) => sum + (order.penalty_fee || 0), 0),
//       cancelledWithPenalty: ordersData.filter(o => o.status === 'Cancelled' && o.penalty_fee > 0).length
//     };
//     setStats(statsData);
//   };

//   const handleUpdateStatus = async (orderId, newStatus, serviceStarted = false) => {
//     const result = await Swal.fire({
//       title: "Update Status",
//       text: `Change order status to "${newStatus}"?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, update it!",
//       cancelButtonText: "Cancel"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = localStorage.getItem("token");

//       console.log('🔄 Updating order status:', {
//         orderId: orderId,
//         newStatus,
//         serviceStarted
//       });

//       const encodedOrderId = encodeURIComponent(orderId);

//       const response = await axios.patch(
//         `${API_CONFIG.BASE_URL}/orders/${encodedOrderId}/status`,
//         {
//           status: newStatus,
//           service_started: serviceStarted
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('✅ Status update response:', response.data);

//       Swal.fire({
//         title: "Updated!",
//         text: "Order status updated successfully.",
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchOrders();

//     } catch (err) {
//       console.error('❌ Status update error:', err.response?.data || err.message);

//       Swal.fire({
//         title: "Error!",
//         text: err.response?.data?.message || "Failed to update status",
//         icon: "error",
//         footer: `Status: ${err.response?.status}`
//       });
//     }
//   };

//   const handleAssignVendor = async (orderId, vendorId, vendorName) => {
//     const result = await Swal.fire({
//       title: "Assign to Vendor",
//       text: `Are you sure you want to assign this order to ${vendorName}?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#4f46e5",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, assign it!",
//       cancelButtonText: "Cancel"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const token = localStorage.getItem("token");

//       console.log('🚀 Assigning order to vendor:', {
//         orderId: orderId,
//         vendorId,
//         vendorName
//       });

//       const encodedOrderId = encodeURIComponent(orderId);

//       const response = await axios.patch(
//         `${API_CONFIG.BASE_URL}/orders/${encodedOrderId}/assign`,
//         {
//           vendor_id: vendorId,
//           status: 'Assigned to Vendor'
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log('✅ Assign vendor response:', response);

//       Swal.fire({
//         title: "Assigned!",
//         text: `Order has been assigned to ${vendorName}`,
//         icon: "success",
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchOrders();
//       setShowAssignModal(false);
//       setSelectedOrderForAssign(null);

//     } catch (err) {
//       console.error('❌ Assign vendor error details:');
//       console.error('Error:', err.response?.data || err.message);
//       console.error('Status:', err.response?.status);

//       Swal.fire({
//         title: "Error!",
//         text: err.response?.data?.message || "Failed to assign vendor",
//         icon: "error",
//         footer: `Status: ${err.response?.status}`
//       });
//     }
//   };

//   // Cancel check function
//   const checkCancelEligibility = async (orderId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${API_CONFIG.BASE_URL}/orders/${encodeURIComponent(orderId)}/cancel-check`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         return response.data.data;
//       }
//       return null;
//     } catch (error) {
//       console.error('Cancel check error:', error);
//       return null;
//     }
//   };

//   // Handle order cancellation
//   const handleOrderCancellation = async (orderId) => {
//     const cancelData = await checkCancelEligibility(orderId);

//     if (!cancelData) {
//       Swal.fire({
//         title: "Error!",
//         text: "Could not check cancellation eligibility",
//         icon: "error"
//       });
//       return;
//     }

//     if (!cancelData.canCancel) {
//       Swal.fire({
//         title: "Cannot Cancel!",
//         text: `This order is already ${cancelData.currentStatus.toLowerCase()}`,
//         icon: "warning"
//       });
//       return;
//     }

//     setSelectedOrderForCancel({
//       order_id: orderId,
//       ...cancelData
//     });
//     setCancelCheckData(cancelData);
//     setCancelReason('');
//     setShowCancellationModal(true);
//   };

//   // Confirm cancellation
//   const confirmCancellation = async () => {
//     if (!selectedOrderForCancel) return;

//     const penaltyFee = cancelCheckData?.requiresPenalty ? 300 : 0;

//     const result = await Swal.fire({
//       title: "Confirm Cancellation",
//       html: `Are you sure you want to cancel order #${selectedOrderForCancel.order_id}?<br>
//              ${cancelCheckData?.requiresPenalty ?
//           `<span class="text-red-500">This will incur a penalty fee of ৳${penaltyFee}</span>` :
//           "No penalty fee will be charged."}`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, cancel it!",
//       cancelButtonText: "Cancel"
//     });

//     if (!result.isConfirmed) return;

//     setCancelling(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.patch(
//         `${API_CONFIG.BASE_URL}/orders/${encodeURIComponent(selectedOrderForCancel.order_id)}/cancel`,
//         {
//           reason: cancelReason,
//           penaltyFee: penaltyFee
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           title: "Cancelled!",
//           text: response.data.message,
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false
//         });

//         fetchOrders();
//         setShowCancellationModal(false);
//         setSelectedOrderForCancel(null);
//         setCancelCheckData(null);
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Error!",
//         text: error.response?.data?.message || "Failed to cancel order",
//         icon: "error"
//       });
//     } finally {
//       setCancelling(false);
//     }
//   };

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Logout?",
//       text: "Are you sure you want to logout?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, logout!"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.removeItem("token");
//         navigate("/");
//       }
//     });
//   };

//   useEffect(() => {
//     fetchOrders();
//     fetchVendors();
//   }, []);

//   const filteredOrders = orders?.filter((order) => {
//     const name = order?.customer_name?.toLowerCase() || "";
//     const id = order?.order_id?.toString() || "";
//     const phone = order?.customer_phone?.toString() || "";
//     const vendorName = order?.vendor_name?.toLowerCase() || "";
//     const status = order?.status?.toLowerCase() || "";
//     const cancelReason = order?.cancel_reason?.toLowerCase() || "";

//     // স্ট্যাটাস ফিল্টার
//     const statusMatch = statusFilter === "All" || order.status === statusFilter;

//     const searchMatch = name.includes(search.toLowerCase()) ||
//       id.includes(search) ||
//       phone.includes(search) ||
//       vendorName.includes(search.toLowerCase()) ||
//       status.includes(search.toLowerCase()) ||
//       cancelReason.includes(search.toLowerCase());

//     return statusMatch && searchMatch;
//   });

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'Pending': return <FiAlertCircle className="text-yellow-500" />;
//       case 'Processing': return <FiClock className="text-blue-500" />;
//       case 'Started': return <FiPlayCircle className="text-indigo-500" />;
//       case 'Shipped': return <FiTruck className="text-purple-500" />;
//       case 'Active': return <FiCheckCircle className="text-green-500" />;
//       case 'Completed': return <FiCheckCircle className="text-emerald-500" />;
//       case 'Cancelled': return <FiAlertCircle className="text-red-500" />;
//       case 'Assigned to Vendor': return <FiUserCheck className="text-violet-500" />;
//       default: return <FiAlertCircle className="text-gray-500" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
//         <p className="text-gray-400">Loading orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
//         <div className="alert alert-error shadow-lg max-w-2xl">
//           <div className="flex items-start">
//             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <div className="ml-3">
//               <h3 className="font-bold">Error Loading Orders</h3>
//               <div className="text-xs">{error}</div>
//             </div>
//           </div>
//           <div className="mt-4">
//             <button
//               onClick={fetchOrders}
//               className="btn btn-sm btn-outline"
//             >
//               <FiRefreshCw className="mr-2" /> Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
//       {/* Mobile Sidebar Toggle */}
//       <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="hamburger-button btn btn-sm btn-ghost"
//         >
//           {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>
//         <h1 className="text-xl font-bold">Order Management</h1>
//         <div className="w-10"></div>
//       </div>

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//         style={{ top: '0', left: '0' }}
//       >
//         <div className="text-center py-4 border-b border-gray-700">
//           <h1 className="text-xl font-bold">Admin Panel</h1>
//           <p className="text-xs text-gray-400 mt-1">Order Management</p>
//         </div>
//         <nav className="mt-4 space-y-2">
//           <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} active />
//           <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/services" icon={<FiPackage />} text="Service Managment" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
//         </nav>
//         <div className="mt-6 pt-4 border-t border-gray-700">
//           <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
//             <p className="text-sm text-gray-300">Total Orders</p>
//             <p className="text-2xl font-bold">{stats.total}</p>
//             <p className="text-xs text-gray-400 mt-1">{stats.assigned} assigned</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
//           >
//             <FiLogOut className="mr-3" /> Logout
//           </button>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setSidebarOpen(false)}></div>
//       )}

//       {/* Main Content */}
//       <main className="flex-1 p-4 lg:p-6 lg:ml-0">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">Order Management</h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Manage all orders, assign to vendors, and track status
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <div className="badge badge-primary gap-2">
//               <FiShoppingBag /> Total: {orders.length}
//             </div>
//             <button
//               onClick={fetchOrders}
//               className="btn btn-outline btn-sm"
//             >
//               <FiRefreshCw className="mr-2" /> Refresh
//             </button>
//             {statusFilter !== "All" && (
//               <button
//                 onClick={() => setStatusFilter("All")}
//                 className="btn btn-sm btn-error"
//               >
//                 Clear Filter
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats Dashboard - ক্লিকেবল ফিল্টার বাটন */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mb-6">
//           <button
//             onClick={() => setStatusFilter("All")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary" : "bg-gray-800"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">All Orders</h3>
//                   <p className="text-lg font-bold mt-1">{stats.total}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-gray-700">
//                   <FiShoppingBag className="text-white" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Pending")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Pending</h3>
//                   <p className="text-lg font-bold mt-1 text-yellow-500">{stats.pending}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-yellow-500/20">
//                   <FiAlertCircle className="text-yellow-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Processing")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Processing" ? "ring-2 ring-blue-500" : "bg-blue-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Processing</h3>
//                   <p className="text-lg font-bold mt-1 text-blue-500">{stats.processing}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-blue-500/20">
//                   <FiClock className="text-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Started")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Started" ? "ring-2 ring-indigo-500" : "bg-indigo-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Started</h3>
//                   <p className="text-lg font-bold mt-1 text-indigo-500">{stats.started}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-indigo-500/20">
//                   <FiPlayCircle className="text-indigo-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Active")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Active" ? "ring-2 ring-green-500" : "bg-green-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Active</h3>
//                   <p className="text-lg font-bold mt-1 text-green-500">{stats.active}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-green-500/20">
//                   <FiCheckCircle className="text-green-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Completed")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Completed" ? "ring-2 ring-emerald-500" : "bg-emerald-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Completed</h3>
//                   <p className="text-lg font-bold mt-1 text-emerald-500">{stats.completed}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-emerald-500/20">
//                   <FiCheckCircle className="text-emerald-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => setStatusFilter("Cancelled")}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Cancelled" ? "ring-2 ring-red-500" : "bg-red-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Cancelled</h3>
//                   <p className="text-lg font-bold mt-1 text-red-500">{stats.cancelled}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-red-500/20">
//                   <FiAlertCircle className="text-red-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => {
//               setStatusFilter("Cancelled");
//               setSearch('penalty');
//             }}
//             className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Cancelled" && search.includes('penalty') ? "ring-2 ring-orange-500" : "bg-orange-500/10"}`}
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">With Penalty</h3>
//                   <p className="text-lg font-bold mt-1 text-orange-500">
//                     {stats.cancelledWithPenalty}
//                   </p>
//                 </div>
//                 <div className="p-2 rounded-full bg-orange-500/20">
//                   <FiDollarSign className="text-orange-500" />
//                 </div>
//               </div>
//             </div>
//           </button>

//           <button
//             onClick={() => {
//               Swal.fire({
//                 title: 'Penalty Summary',
//                 html: `
//                   <div class="text-left">
//                     <p><strong>Total Penalty Collected:</strong> ৳${stats.totalPenalty.toFixed(2)}</p>
//                     <p><strong>Cancelled with Penalty:</strong> ${stats.cancelledWithPenalty} orders</p>
//                     <p><strong>Average Penalty per Order:</strong> ৳${stats.cancelledWithPenalty > 0 ? (stats.totalPenalty / stats.cancelledWithPenalty).toFixed(2) : '0.00'}</p>
//                     <hr class="my-2 border-gray-600">
//                     <p class="text-sm text-gray-400">Note: ৳300 penalty applied when service has started</p>
//                   </div>
//                 `,
//                 icon: 'info',
//                 confirmButtonText: 'OK'
//               });
//             }}
//             className="card bg-gray-800 shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
//           >
//             <div className="card-body p-3">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="text-gray-400 text-xs">Total Penalty</h3>
//                   <p className="text-lg font-bold mt-1 text-gray-300">৳{stats.totalPenalty.toFixed(2)}</p>
//                 </div>
//                 <div className="p-2 rounded-full bg-gray-700">
//                   <FiDollarSign className="text-gray-300" />
//                 </div>
//               </div>
//             </div>
//           </button>
//         </div>

//         {/* Search */}
//         <div className="card bg-gray-800 shadow-lg mb-6">
//           <div className="card-body p-4">
//             <div className="flex flex-col lg:flex-row gap-4 items-center">
//               <div className="flex-1">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search orders by ID, customer name, phone, vendor, status, or reason..."
//                     value={search}
//                     onChange={(e) => {
//                       setSearch(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600 focus:border-primary"
//                   />
//                 </div>
//               </div>
//               <div className="text-sm text-gray-400">
//                 Showing {filteredOrders.length} of {orders.length} orders
//                 {statusFilter !== "All" && (
//                   <span className="ml-2 badge badge-sm badge-info">
//                     Filtered: {statusFilter}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="card bg-gray-800 shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead>
//                 <tr className="border-b border-gray-700 bg-gray-900/50">
//                   <th className="text-gray-400 font-medium">Order Details</th>
//                   <th className="text-gray-400 font-medium hidden md:table-cell">Customer</th>
//                   <th className="text-gray-400 font-medium">Status</th>
//                   <th className="text-gray-400 font-medium hidden sm:table-cell">Vendor</th>
//                   <th className="text-gray-400 font-medium hidden lg:table-cell">Penalty Info</th>
//                   <th className="text-gray-400 font-medium">Total</th>
//                   <th className="text-gray-400 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentOrders.length > 0 ? (
//                   currentOrders.map((order) => {
//                     const isCancelled = order.status === 'Cancelled';
//                     const hasPenalty = order.penalty_fee > 0;

//                     return (
//                       <tr key={order.order_id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
//                         <td>
//                           <div>
//                             <p className="font-medium">#{order.order_id}</p>
//                             <p className="text-xs text-gray-400">
//                               {new Date(order.order_date).toLocaleDateString()}
//                             </p>
//                             {isCancelled && order.cancelled_date && (
//                               <p className="text-xs text-red-400">
//                                 Cancelled: {new Date(order.cancelled_date).toLocaleDateString()}
//                               </p>
//                             )}
//                             <div className="flex flex-wrap gap-1 mt-1">
//                               {order.cart_items?.map((item, idx) => (
//                                 <span key={idx} className="badge badge-xs badge-outline">
//                                   {item.name} x{item.quantity}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="hidden md:table-cell">
//                           <div>
//                             <p className="font-medium">{order.customer_name}</p>
//                             <p className="text-sm text-gray-400">{order.customer_email}</p>
//                             <p className="text-sm text-gray-400">{order.customer_phone}</p>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex items-center gap-2">
//                             {getStatusIcon(order.status)}
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-500'}`}>
//                               {order.status}
//                             </span>
//                             {/* Show service started only for ACTIVE orders, not for PENDING */}
//                             {order.status === 'Active' && order.service_started_date && (
//                               <span className="badge badge-xs badge-success">
//                                 Service Started
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="hidden sm:table-cell">
//                           {/* Check if vendor is assigned */}
//                           {order.vendor_id ? (
//                             (() => {
//                               // Try to find vendor from vendors list
//                               const vendorInfo = vendors.find(v => v.id === order.vendor_id);

//                               if (vendorInfo) {
//                                 // Vendor found in list
//                                 return (
//                                   <div>
//                                     <p className="font-medium">{vendorInfo.name}</p>
//                                     <p className="text-xs text-gray-400">{vendorInfo.phone}</p>
//                                     <div className="flex items-center gap-1 mt-1">
//                                       <span className="text-xs">⭐ {vendorInfo.average_rating || 'N/A'}</span>
//                                       {vendorInfo.status !== 'active' && (
//                                         <span className="badge badge-xs badge-warning ml-1">
//                                           {vendorInfo.status}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 );
//                               } else {
//                                 // Vendor not found in list
//                                 return (
//                                   <div className="space-y-1">
//                                     <div className="flex items-center gap-2">
//                                       <p className="font-medium text-yellow-400">Vendor ID: {order.vendor_id}</p>
//                                       <span className="badge badge-xs badge-warning">Not Found</span>
//                                     </div>
//                                     <p className="text-xs text-gray-400">
//                                       {order.vendor_name ? `Name in order: ${order.vendor_name}` : 'Name not available'}
//                                     </p>
//                                     <button
//                                       onClick={() => {
//                                         setSelectedOrderForAssign(order);
//                                         setShowAssignModal(true);
//                                       }}
//                                       className="btn btn-xs btn-primary mt-1"
//                                     >
//                                       Re-assign Vendor
//                                     </button>
//                                   </div>
//                                 );
//                               }
//                             })()
//                           ) : (
//                             // No vendor assigned
//                             <div className="space-y-1">
//                               <p className="text-gray-400 text-sm">Not assigned</p>
//                               {order.status !== 'Completed' && order.status !== 'Cancelled' && (
//                                 <button
//                                   onClick={() => {
//                                     setSelectedOrderForAssign(order);
//                                     setShowAssignModal(true);
//                                   }}
//                                   className="btn btn-xs btn-primary"
//                                 >
//                                   Assign Vendor
//                                 </button>
//                               )}
//                             </div>
//                           )}
//                         </td>
//                         <td className="hidden lg:table-cell">
//                           {order.status === 'Cancelled' ? (
//                             <div>
//                               {order.penalty_fee > 0 ? (
//                                 <div className="text-red-400">
//                                   <p className="font-bold">৳{order.penalty_fee}</p>
//                                   <p className="text-xs text-gray-400">Penalty Applied</p>
//                                   {order.cancel_reason && (
//                                     <p className="text-xs text-gray-400 truncate max-w-[150px]" title={order.cancel_reason}>
//                                       {order.cancel_reason}
//                                     </p>
//                                   )}
//                                 </div>
//                               ) : (
//                                 <div className="text-gray-400">
//                                   <p className="text-sm">No Penalty</p>
//                                   {order.cancel_reason && (
//                                     <p className="text-xs truncate max-w-[150px]" title={order.cancel_reason}>
//                                       {order.cancel_reason}
//                                     </p>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="text-gray-400 text-sm">
//                               {/* Only show penalty warning for Active orders with service started */}
//                               {order.status === 'Active' && order.service_started_date ? (
//                                 <span className="text-orange-500">Penalty: ৳300 if cancelled</span>
//                               ) : (
//                                 'No penalty'
//                               )}
//                             </div>
//                           )}
//                         </td>
//                         <td className="font-bold">
//                           <div>
//                             ৳{order.total}
//                             {hasPenalty && (
//                               <div className="text-xs text-red-400">
//                                 +৳{order.penalty_fee} penalty
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="flex flex-wrap gap-1">
//                             <button
//                               onClick={() => {
//                                 setViewOrder(order);
//                                 document.getElementById("view_order_modal").showModal();
//                               }}
//                               className="btn btn-xs btn-ghost btn-square text-info hover:bg-info/20"
//                               title="View Details"
//                             >
//                               <FiEye className="w-4 h-4" />
//                             </button>

//                             {/* Cancel Order Button */}
//                             {order.status !== 'Cancelled' && order.status !== 'Completed' && (
//                               <button
//                                 onClick={() => handleOrderCancellation(order.order_id)}
//                                 className="btn btn-xs btn-ghost btn-square text-red-500 hover:bg-red-500/20"
//                                 title="Cancel Order"
//                               >
//                                 <FiXCircle className="w-4 h-4" />
//                               </button>
//                             )}

//                             {/* Assign Vendor Button */}
//                             {vendors.length > 0 && order.status !== 'Completed' && order.status !== 'Cancelled' && (
//                               <button
//                                 onClick={() => {
//                                   setSelectedOrderForAssign(order);
//                                   setShowAssignModal(true);
//                                 }}
//                                 className="btn btn-xs btn-ghost btn-square text-primary hover:bg-primary/20"
//                                 title="Assign Vendor"
//                               >
//                                 <FiUserCheck className="w-4 h-4" />
//                               </button>
//                             )}

//                             {/* Status Actions Dropdown */}
//                             <div className="dropdown dropdown-end">
//                               <button tabIndex={0} className="btn btn-xs btn-ghost btn-square text-warning hover:bg-warning/20" title="Change Status">
//                                 <FiEdit className="w-4 h-4" />
//                               </button>
//                               <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
//                                 <li className="menu-title text-xs text-gray-400 mb-1">Change Status</li>

//                                 {/* Service Started Toggle */}
//                                 {order.status === 'Active' && !order.service_started_date && (
//                                   <li>
//                                     <button
//                                       onClick={() => handleUpdateStatus(order.order_id, 'Active', true)}
//                                       className="text-green-500 hover:bg-green-500/10"
//                                     >
//                                       <FiPlayCircle /> Mark Service Started
//                                     </button>
//                                   </li>
//                                 )}

//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Pending')}
//                                     className="text-yellow-500 hover:bg-yellow-500/10"
//                                   >
//                                     <FiAlertCircle /> Pending
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Processing')}
//                                     className="text-blue-500 hover:bg-blue-500/10"
//                                   >
//                                     <FiClock /> Processing
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Started')}
//                                     className="text-indigo-500 hover:bg-indigo-500/10"
//                                   >
//                                     <FiPlayCircle /> Started
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Active')}
//                                     className="text-green-500 hover:bg-green-500/10"
//                                   >
//                                     <FiCheckCircle /> Active
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Completed')}
//                                     className="text-emerald-500 hover:bg-emerald-500/10"
//                                   >
//                                     <FiCheckCircle /> Complete
//                                   </button>
//                                 </li>
//                                 <li>
//                                   <button
//                                     onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
//                                     className="text-red-500 hover:bg-red-500/10"
//                                   >
//                                     <FiAlertCircle /> Cancel
//                                   </button>
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-12">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiShoppingBag className="text-4xl text-gray-500 mb-4" />
//                         <h3 className="text-lg font-medium text-gray-300 mb-2">No orders found</h3>
//                         <p className="text-gray-400 mb-4">
//                           {search || statusFilter !== "All"
//                             ? 'Try changing your search criteria'
//                             : 'No orders have been placed yet'
//                           }
//                         </p>
//                         {(search || statusFilter !== "All") && (
//                           <button
//                             onClick={() => {
//                               setSearch('');
//                               setStatusFilter("All");
//                             }}
//                             className="btn btn-sm btn-outline"
//                           >
//                             Clear Filters
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {currentOrders.length > 0 && (
//             <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-700 gap-4">
//               <div className="text-sm text-gray-400">
//                 Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
//                 {statusFilter !== "All" && (
//                   <span className="ml-2 badge badge-xs badge-info">
//                     {statusFilter}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="btn btn-sm btn-ghost disabled:opacity-50"
//                 >
//                   <FiChevronLeft /> Previous
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {[...Array(Math.min(5, totalPages)).keys()].map((_, idx) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = idx + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = idx + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + idx;
//                     } else {
//                       pageNum = currentPage - 2 + idx;
//                     }

//                     if (pageNum < 1 || pageNum > totalPages) return null;

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}

//                   {totalPages > 5 && currentPage < totalPages - 2 && (
//                     <>
//                       <span className="px-2 text-gray-400">...</span>
//                       <button
//                         onClick={() => setCurrentPage(totalPages)}
//                         className="btn btn-sm btn-ghost"
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="btn btn-sm btn-ghost disabled:opacity-50"
//                 >
//                   Next <FiChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* View Order Modal */}
//         <dialog id="view_order_modal" className="modal modal-bottom sm:modal-middle">
//           <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
//             <form method="dialog">
//               <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
//             </form>

//             {viewOrder && (
//               <div className="space-y-6">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                   <div>
//                     <h3 className="text-xl font-bold">Order #{viewOrder.order_id}</h3>
//                     <p className="text-gray-400">
//                       Placed on {new Date(viewOrder.order_date).toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     {getStatusIcon(viewOrder.status)}
//                     <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[viewOrder.status]}`}>
//                       {viewOrder.status}
//                     </span>
//                     {/* Show service started only for ACTIVE status */}
//                     {viewOrder?.status === 'Active' && viewOrder?.service_started_date && (
//                       <span className="badge badge-success badge-sm">
//                         Service Started
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Service Started Warning - Only show for Active status */}
//                 {viewOrder?.status === 'Active' && viewOrder?.service_started_date && (
//                   <div className="card bg-orange-900/20 p-4 border border-orange-900/50">
//                     <h4 className="font-semibold text-lg mb-2 text-orange-400">Service Information</h4>
//                     <div>
//                       <p><span className="text-gray-400">Service Started:</span> {new Date(viewOrder.service_started_date).toLocaleString()}</p>
//                       <p className="text-sm text-orange-300 mt-1">
//                         <FiAlertCircle className="inline mr-1" />
//                         Cancellation now will incur a ৳300 penalty fee
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//                   {/* Customer Information */}
//                   <div className="card bg-gray-700/50 p-3 sm:p-4">
//                     <h4 className="font-semibold text-lg mb-2 sm:mb-3">Customer Information</h4>
//                     <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
//                       <p><span className="text-gray-400">Name:</span> {viewOrder.customer_name}</p>
//                       <p><span className="text-gray-400">Email:</span> {viewOrder.customer_email}</p>
//                       <p><span className="text-gray-400">Phone:</span> {viewOrder.customer_phone}</p>
//                     </div>
//                   </div>

//                   {/* Vendor Information */}
//                   <div className="card bg-gray-700/50 p-3 sm:p-4">
//                     <h4 className="font-semibold text-lg mb-2 sm:mb-3">Vendor Information</h4>
//                     {viewOrder.vendor_id ? (
//                       (() => {
//                         const vendorInfo = vendors.find(v => v.id === viewOrder.vendor_id);
//                         if (vendorInfo) {
//                           return (
//                             <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
//                               <p><span className="text-gray-400">Name:</span> {vendorInfo.name}</p>
//                               <p><span className="text-gray-400">Phone:</span> {vendorInfo.phone}</p>
//                               <p><span className="text-gray-400">Email:</span> {vendorInfo.email}</p>
//                               <p><span className="text-gray-400">Rating:</span> ⭐ {vendorInfo.average_rating || 'N/A'}</p>
//                               <p><span className="text-gray-400">Status:</span>
//                                 <span className={`ml-2 badge badge-xs ${vendorInfo.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
//                                   {vendorInfo.status}
//                                 </span>
//                               </p>
//                               <div className="mt-2">
//                                 <button
//                                   onClick={() => {
//                                     setSelectedOrderForAssign(viewOrder);
//                                     setShowAssignModal(true);
//                                     document.getElementById("view_order_modal").close();
//                                   }}
//                                   className="btn btn-xs btn-primary"
//                                 >
//                                   Re-assign Vendor
//                                 </button>
//                               </div>
//                             </div>
//                           );
//                         } else {
//                           return (
//                             <div className="space-y-2">
//                               <div className="alert alert-warning">
//                                 <FiAlertCircle />
//                                 <span>Vendor not found in current list</span>
//                               </div>
//                               <p><span className="text-gray-400">Vendor ID:</span> {viewOrder.vendor_id}</p>
//                               {viewOrder.vendor_name && (
//                                 <p><span className="text-gray-400">Name in order:</span> {viewOrder.vendor_name}</p>
//                               )}
//                               <button
//                                 onClick={() => {
//                                   setSelectedOrderForAssign(viewOrder);
//                                   setShowAssignModal(true);
//                                   document.getElementById("view_order_modal").close();
//                                 }}
//                                 className="btn btn-xs btn-primary mt-2"
//                               >
//                                 Assign New Vendor
//                               </button>
//                             </div>
//                           );
//                         }
//                       })()
//                     ) : (
//                       <div>
//                         <p className="text-gray-400 mb-2">No vendor assigned</p>
//                         {viewOrder.status !== 'Completed' && viewOrder.status !== 'Cancelled' && (
//                           <button
//                             onClick={() => {
//                               setSelectedOrderForAssign(viewOrder);
//                               setShowAssignModal(true);
//                               document.getElementById("view_order_modal").close();
//                             }}
//                             className="btn btn-xs btn-primary"
//                           >
//                             Assign Vendor
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   {/* Order Summary */}
//                   <div className="card bg-gray-700/50 p-3 sm:p-4">
//                     <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Summary</h4>
//                     <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
//                       <p><span className="text-gray-400">Subtotal:</span> ৳{viewOrder.total}</p>
//                       <p><span className="text-gray-400">Payment Method:</span> {viewOrder.payment_method || 'N/A'}</p>
//                       {viewOrder.penalty_fee > 0 && (
//                         <p><span className="text-gray-400">Penalty Fee:</span> ৳{viewOrder.penalty_fee}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Delivery Information */}
//                   <div className="card bg-gray-700/50 p-3 sm:p-4">
//                     <h4 className="font-semibold text-lg mb-2 sm:mb-3">Address Information</h4>
//                     {viewOrder.address_type === 'another' ? (
//                       (() => {
//                         let addressObj;
//                         try {
//                           addressObj = typeof viewOrder.temp_address === 'string'
//                             ? JSON.parse(viewOrder.temp_address)
//                             : viewOrder.temp_address || {};
//                         } catch (e) {
//                           console.error("Address JSON parse error:", viewOrder.temp_address);
//                           return <p className="text-red-400">Invalid address format</p>;
//                         }

//                         return (
//                           <div className="space-y-2 text-sm sm:text-base">
//                             <h5 className="font-medium text-gray-300">Recipient & Delivery Address</h5>
//                             <p><span className="text-gray-400">Name:</span> {viewOrder.recipient_name || 'N/A'}</p>
//                             <p><span className="text-gray-400">Phone:</span> {viewOrder.recipient_phone || 'N/A'}</p>
//                             <p>
//                               <span className="text-gray-400">Address:</span>{" "}
//                               {[
//                                 addressObj.full_address,
//                                 addressObj.houseNo && `House: ${addressObj.houseNo}`,
//                                 addressObj.roadNo && `Road: ${addressObj.roadNo}`,
//                                 addressObj.area && `Area: ${addressObj.area}`,
//                                 addressObj.thana && `Thana: ${addressObj.thana}`,
//                                 addressObj.district && `District: ${addressObj.district}`,
//                                 addressObj.division && `Division: ${addressObj.division}`,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           </div>
//                         );
//                       })()
//                     ) : (
//                       (() => {
//                         const addressField = viewOrder.address_type === 'home'
//                           ? 'home_address'
//                           : viewOrder.address_type === 'office'
//                             ? 'office_address'
//                             : null;

//                         if (!addressField) return <p className="text-red-400">No address type specified</p>;

//                         let addressObj;
//                         try {
//                           addressObj = typeof viewOrder[addressField] === 'string'
//                             ? JSON.parse(viewOrder[addressField])
//                             : viewOrder[addressField] || {};
//                         } catch (e) {
//                           console.error("Address JSON parse error:", viewOrder[addressField]);
//                           return <p className="text-red-400">Invalid address format</p>;
//                         }

//                         return (
//                           <div className="space-y-2 text-sm sm:text-base">
//                             <h5 className="font-medium text-gray-300">
//                               {viewOrder.address_type === 'home' && 'Home Address'}
//                               {viewOrder.address_type === 'office' && 'Office Address'}
//                             </h5>
//                             <p>
//                               <span className="text-gray-400">Address:</span>{" "}
//                               {[
//                                 addressObj.full_address,
//                                 addressObj.houseNo && `House: ${addressObj.houseNo}`,
//                                 addressObj.roadNo && `Road: ${addressObj.roadNo}`,
//                                 addressObj.area && `Area: ${addressObj.area}`,
//                                 addressObj.thana && `Thana: ${addressObj.thana}`,
//                                 addressObj.district && `District: ${addressObj.district}`,
//                                 addressObj.division && `Division: ${addressObj.division}`,
//                               ]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           </div>
//                         );
//                       })()
//                     )}
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="card bg-gray-700/50 p-3 sm:p-4">
//                   <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Items</h4>
//                   <div className="overflow-x-auto">
//                     <table className="table table-compact w-full">
//                       <thead>
//                         <tr>
//                           <th>Item</th>
//                           <th>Price</th>
//                           <th>Qty</th>
//                           <th>Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {viewOrder.cart_items?.map((item, idx) => (
//                           <tr key={idx}>
//                             <td>{item.name}</td>
//                             <td>৳{item.price}</td>
//                             <td>{item.quantity}</td>
//                             <td>৳{(item.price * item.quantity).toFixed(2)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                       <tfoot>
//                         <tr>
//                           <td colSpan="3" className="text-right font-bold">Subtotal:</td>
//                           <td className="font-bold">৳{viewOrder.total}</td>
//                         </tr>
//                         {viewOrder.penalty_fee > 0 && (
//                           <tr>
//                             <td colSpan="3" className="text-right font-bold text-red-400">Penalty Fee:</td>
//                             <td className="font-bold text-red-400">+৳{viewOrder.penalty_fee}</td>
//                           </tr>
//                         )}
//                         <tr>
//                           <td colSpan="3" className="text-right font-bold text-lg">Total:</td>
//                           <td className="font-bold text-lg">৳{(parseFloat(viewOrder.total) + (viewOrder.penalty_fee || 0)).toFixed(2)}</td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Cancellation Details */}
//                 {viewOrder.status === 'Cancelled' && (
//                   <div className="card bg-red-900/20 p-4 border border-red-900/50">
//                     <h4 className="font-semibold text-lg mb-2 text-red-400">Cancellation Details</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p><span className="text-gray-400">Reason:</span> {viewOrder.cancel_reason || 'Not specified'}</p>
//                         <p><span className="text-gray-400">Cancelled Date:</span> {new Date(viewOrder.cancelled_date).toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <p><span className="text-gray-400">Penalty Fee:</span>
//                           <span className={`font-bold ${viewOrder.penalty_fee > 0 ? 'text-red-500' : 'text-green-500'}`}>
//                             {viewOrder.penalty_fee > 0 ? ` ৳${viewOrder.penalty_fee}` : ' No Penalty'}
//                           </span>
//                         </p>
//                         {viewOrder.service_started_date && (
//                           <p><span className="text-gray-400">Service Started:</span> {new Date(viewOrder.service_started_date).toLocaleString()}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-700">
//                   {viewOrder.status !== 'Completed' && viewOrder.status !== 'Cancelled' && vendors.length > 0 && (
//                     <button
//                       onClick={() => {
//                         document.getElementById("view_order_modal").close();
//                         setSelectedOrderForAssign(viewOrder);
//                         setShowAssignModal(true);
//                       }}
//                       className="btn btn-primary"
//                     >
//                       <FiUserCheck className="mr-2" /> Assign/Change Vendor
//                     </button>
//                   )}
//                   {viewOrder.status !== 'Cancelled' && viewOrder.status !== 'Completed' && (
//                     <button
//                       onClick={() => {
//                         document.getElementById("view_order_modal").close();
//                         handleOrderCancellation(viewOrder.order_id);
//                       }}
//                       className="btn btn-error"
//                     >
//                       <FiXCircle className="mr-2" /> Cancel Order
//                     </button>
//                   )}
//                   <button
//                     onClick={() => {
//                       document.getElementById("view_order_modal").close();
//                       setEditOrder(viewOrder);
//                       document.getElementById("edit_order_modal").showModal();
//                     }}
//                     className="btn btn-warning"
//                   >
//                     <FiEdit className="mr-2" /> Edit Order
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button>close</button>
//           </form>
//         </dialog>

//         {/* Edit Order Modal */}
//         <dialog id="edit_order_modal" className="modal modal-bottom sm:modal-middle">
//           <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
//             <form method="dialog">
//               <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
//             </form>

//             {editOrder && (
//               <div>
//                 <h3 className="text-xl font-bold mb-4 sm:mb-6">Edit Order #{editOrder.order_id}</h3>

//                 <form onSubmit={async (e) => {
//                   e.preventDefault();
//                   setUpdating(true);

//                   try {
//                     const updatedOrder = {
//                       status: e.target.status.value,
//                       notes: e.target.notes.value,
//                       vendor_id: e.target.vendor_id.value || null,
//                     };

//                     await apiCall(
//                       API_CONFIG.ENDPOINTS.UPDATE_ORDER(editOrder.order_id),
//                       'PUT',
//                       updatedOrder
//                     );

//                     Swal.fire({
//                       title: "Success!",
//                       text: "Order updated successfully",
//                       icon: "success",
//                       timer: 2000,
//                       showConfirmButton: false
//                     });

//                     fetchOrders();
//                     document.getElementById("edit_order_modal").close();
//                   } catch (error) {
//                     Swal.fire({
//                       title: "Error!",
//                       text: error.response?.data?.message || "Failed to update order",
//                       icon: "error"
//                     });
//                   } finally {
//                     setUpdating(false);
//                   }
//                 }}>
//                   <div className="space-y-3 sm:space-y-4">
//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-300">Order Status</span>
//                       </label>
//                       <select
//                         name="status"
//                         defaultValue={editOrder.status}
//                         className="select select-bordered w-full bg-gray-700 border-gray-600"
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Processing">Processing</option>
//                         <option value="Started">Started</option>
//                         <option value="Active">Active</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Cancelled">Cancelled</option>
//                         <option value="Assigned to Vendor">Assigned to Vendor</option>
//                       </select>
//                     </div>

//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-300">Assign Vendor</span>
//                       </label>
//                       <select
//                         name="vendor_id"
//                         defaultValue={editOrder.vendor_id || ""}
//                         className="select select-bordered w-full bg-gray-700 border-gray-600"
//                         disabled={vendorsLoading}
//                       >
//                         <option value="">-- Select Vendor --</option>
//                         {vendors.map((vendor) => (
//                           <option key={vendor.id} value={vendor.id}>
//                             {vendor.name} ({vendor.phone}) ⭐ {vendor.average_rating || 'N/A'}
//                           </option>
//                         ))}
//                       </select>
//                       {vendorsLoading && (
//                         <div className="text-sm text-gray-400 mt-1">Loading vendors...</div>
//                       )}
//                       {vendors.length === 0 && !vendorsLoading && (
//                         <div className="text-sm text-red-400 mt-1">No active vendors available</div>
//                       )}
//                     </div>

//                     <div className="form-control">
//                       <label className="label">
//                         <span className="label-text text-gray-300">Notes</span>
//                       </label>
//                       <textarea
//                         name="notes"
//                         defaultValue={editOrder.notes || ""}
//                         className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
//                         rows={3}
//                         placeholder="Add any notes about this order..."
//                       />
//                     </div>

//                     <div className="modal-action mt-4 sm:mt-6">
//                       <button
//                         type="submit"
//                         className={`btn btn-primary ${updating ? 'loading' : ''}`}
//                         disabled={updating || vendorsLoading}
//                       >
//                         {updating ? 'Updating...' : 'Update Order'}
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-ghost"
//                         onClick={() => document.getElementById("edit_order_modal").close()}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             )}
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button>close</button>
//           </form>
//         </dialog>

//         {/* Assign Vendor Modal */}
//         {showAssignModal && selectedOrderForAssign && (
//           <div className="modal modal-open">
//             <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-xl font-bold">
//                     Assign Vendor to Order #{selectedOrderForAssign.order_id}
//                   </h3>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Current Vendor: {selectedOrderForAssign.vendor_id ?
//                       `ID: ${selectedOrderForAssign.vendor_id}${selectedOrderForAssign.vendor_name ? ` (${selectedOrderForAssign.vendor_name})` : ''}` :
//                       'Not assigned'}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowAssignModal(false);
//                     setSelectedOrderForAssign(null);
//                     setSearchVendor("");
//                   }}
//                   className="btn btn-sm btn-circle btn-ghost"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search vendors by name, email, phone, or ID..."
//                     value={searchVendor}
//                     onChange={(e) => setSearchVendor(e.target.value)}
//                     className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600"
//                   />
//                 </div>
//                 <div className="flex justify-between items-center mt-2">
//                   <p className="text-sm text-gray-400">
//                     {filteredVendors.length} vendor(s) found
//                   </p>
//                   {vendorsLoading && (
//                     <span className="text-sm text-blue-400">Loading vendors...</span>
//                   )}
//                 </div>
//               </div>

//               <div className="max-h-[400px] overflow-y-auto">
//                 {filteredVendors.length > 0 ? (
//                   <div className="space-y-3">
//                     {filteredVendors.map((vendor) => (
//                       <div
//                         key={vendor.id}
//                         className="card bg-gray-700/50 p-4 hover:bg-gray-700 transition-colors cursor-pointer"
//                         onClick={() => handleAssignVendor(
//                           selectedOrderForAssign.order_id,
//                           vendor.id,
//                           vendor.name
//                         )}
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className="avatar">
//                             <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
//                               {vendor.photo ? (
//                                 <img
//                                   src={vendor.photo.startsWith('/')
//                                     ? `http://localhost:5001${vendor.photo}`
//                                     : vendor.photo
//                                   }
//                                   alt={vendor.name}
//                                   className="w-full h-full object-cover rounded-full"
//                                   onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.parentElement.innerHTML = '<FiUser className="w-6 h-6 text-gray-400" />';
//                                   }}
//                                 />
//                               ) : (
//                                 <FiUser className="w-6 h-6 text-gray-400" />
//                               )}
//                             </div>
//                           </div>

//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h4 className="font-semibold text-lg">{vendor.name}</h4>
//                                 <p className="text-sm text-gray-400">{vendor.email}</p>
//                                 <p className="text-sm text-gray-400">{vendor.phone}</p>
//                               </div>
//                               <div className="text-right">
//                                 <div className="badge badge-primary">
//                                   ⭐ {vendor.average_rating || 'N/A'}
//                                 </div>
//                                 <div className="text-xs text-gray-400 mt-1">
//                                   ID: {vendor.id}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-3 flex flex-wrap gap-2">
//                               <span className={`badge badge-sm ${vendor.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
//                                 {vendor.status}
//                               </span>
//                               <span className="badge badge-sm badge-outline">
//                                 Orders: {vendor.completed_orders || 0}
//                               </span>
//                               {vendor.id === selectedOrderForAssign.vendor_id && (
//                                 <span className="badge badge-sm badge-info">
//                                   Currently Assigned
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : vendorsLoading ? (
//                   <div className="text-center py-8">
//                     <div className="loading loading-spinner loading-lg text-primary"></div>
//                     <p className="mt-4 text-gray-400">Loading vendors...</p>
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <FiUsers className="text-4xl text-gray-500 mx-auto mb-4" />
//                     <h4 className="text-lg font-medium text-gray-300 mb-2">
//                       No vendors found
//                     </h4>
//                     <p className="text-gray-400">
//                       {searchVendor
//                         ? 'Try changing your search criteria'
//                         : 'No vendors available. Please add vendors first.'
//                       }
//                     </p>
//                     {searchVendor && (
//                       <button
//                         onClick={() => setSearchVendor("")}
//                         className="btn btn-sm btn-outline mt-4"
//                       >
//                         Clear Search
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="modal-action mt-6">
//                 <button
//                   onClick={() => {
//                     setShowAssignModal(false);
//                     setSelectedOrderForAssign(null);
//                     setSearchVendor("");
//                   }}
//                   className="btn btn-ghost"
//                 >
//                   Cancel
//                 </button>
//                 {selectedOrderForAssign.vendor_id && (
//                   <button
//                     onClick={async () => {
//                       const result = await Swal.fire({
//                         title: "Remove Vendor?",
//                         text: "Are you sure you want to remove the current vendor assignment?",
//                         icon: "warning",
//                         showCancelButton: true,
//                         confirmButtonColor: "#dc2626",
//                         cancelButtonColor: "#6b7280",
//                         confirmButtonText: "Yes, remove it!"
//                       });

//                       if (result.isConfirmed) {
//                         try {
//                           const token = localStorage.getItem("token");
//                           const response = await axios.patch(
//                             `${API_CONFIG.BASE_URL}/orders/${encodeURIComponent(selectedOrderForAssign.order_id)}/assign`,
//                             {
//                               vendor_id: null,
//                               status: 'Pending'
//                             },
//                             {
//                               headers: {
//                                 'Authorization': `Bearer ${token}`,
//                                 'Content-Type': 'application/json'
//                               }
//                             }
//                           );

//                           if (response.data.success) {
//                             Swal.fire({
//                               title: "Removed!",
//                               text: "Vendor assignment removed successfully.",
//                               icon: "success",
//                               timer: 2000,
//                               showConfirmButton: false
//                             });

//                             fetchOrders();
//                             setShowAssignModal(false);
//                             setSelectedOrderForAssign(null);
//                           }
//                         } catch (err) {
//                           Swal.fire({
//                             title: "Error!",
//                             text: err.response?.data?.message || "Failed to remove vendor",
//                             icon: "error"
//                           });
//                         }
//                       }
//                     }}
//                     className="btn btn-error"
//                   >
//                     Remove Current Vendor
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div
//               className="modal-backdrop"
//               onClick={() => {
//                 setShowAssignModal(false);
//                 setSelectedOrderForAssign(null);
//                 setSearchVendor("");
//               }}
//             ></div>
//           </div>
//         )}

//         {/* Cancellation Modal */}
//         {showCancellationModal && selectedOrderForCancel && (
//           <div className="modal modal-open">
//             <div className="modal-box max-w-md bg-gray-800 border border-gray-700">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">
//                   Cancel Order #{selectedOrderForCancel.order_id}
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowCancellationModal(false);
//                     setSelectedOrderForCancel(null);
//                     setCancelCheckData(null);
//                   }}
//                   className="btn btn-sm btn-circle btn-ghost"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <div className="alert alert-info mb-4">
//                   <div>
//                     <FiAlertCircle className="text-lg" />
//                     <div>
//                       <h4 className="font-bold">Cancellation Policy</h4>
//                       <div className="text-sm">
//                         {cancelCheckData?.requiresPenalty ? (
//                           <p>Service has started. Cancellation requires <span className="font-bold text-red-500">৳300 penalty fee</span>.</p>
//                         ) : (
//                           <p>No penalty fee required for cancellation.</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-control mb-4">
//                   <label className="label">
//                     <span className="label-text text-gray-300">Cancellation Reason</span>
//                   </label>
//                   <textarea
//                     value={cancelReason}
//                     onChange={(e) => setCancelReason(e.target.value)}
//                     className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
//                     rows={3}
//                     placeholder="Please provide reason for cancellation..."
//                   />
//                 </div>

//                 {cancelCheckData?.requiresPenalty && (
//                   <div className="form-control mb-4">
//                     <label className="label">
//                       <span className="label-text text-gray-300">Penalty Fee</span>
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <div className="input input-bordered w-full bg-gray-700 border-gray-600">
//                         ৳300 (Required)
//                       </div>
//                       <span className="text-xs text-red-400">*Mandatory</span>
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">
//                       This fee compensates the vendor as service has already started.
//                     </p>
//                   </div>
//                 )}

//                 <div className="modal-action">
//                   <button
//                     onClick={confirmCancellation}
//                     disabled={cancelling || (cancelCheckData?.requiresPenalty && !cancelReason)}
//                     className={`btn btn-error ${cancelling ? 'loading' : ''}`}
//                   >
//                     {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowCancellationModal(false);
//                       setSelectedOrderForCancel(null);
//                       setCancelCheckData(null);
//                     }}
//                     className="btn btn-ghost"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div
//               className="modal-backdrop"
//               onClick={() => {
//                 setShowCancellationModal(false);
//                 setSelectedOrderForCancel(null);
//                 setCancelCheckData(null);
//               }}
//             ></div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// // Reusable SidebarLink component
// const SidebarLink = ({ to, icon, text, onClick, active }) => (
//   <NavLink
//     to={to}
//     onClick={onClick}
//     className={({ isActive }) =>
//       `flex items-center p-3 rounded-lg transition-colors ${isActive || active
//         ? "bg-primary text-white shadow-lg"
//         : "hover:bg-gray-700 text-gray-300"
//       }`
//     }
//   >
//     <span className="mr-3">{icon}</span>
//     {text}
//   </NavLink>
// );

// export default OrdersList;

import { useEffect, useState, useRef } from "react";
import api from "../api"; // Import the configured axios instance
import Swal from "sweetalert2";
import {
  FiHome, FiUsers, FiShoppingBag, FiTruck,
  FiPieChart, FiLogOut, FiSettings, FiEdit,
  FiTrash2, FiEye, FiSearch, FiChevronLeft,
  FiChevronRight, FiMenu, FiX, FiUserCheck,
  FiCheckCircle, FiAlertCircle, FiClock,
  FiRefreshCw, FiFilter, FiUser, FiMapPin,
  FiPlayCircle, FiDollarSign, FiXCircle,
  FiPackage
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

// API Configuration - Base URL removed, using api instance instead
const API_CONFIG = {
  ENDPOINTS: {
    GET_ALL_ORDERS: "/api/admin/all-orders",
    UPDATE_ORDER_STATUS: (orderId) => `/api/orders/${encodeURIComponent(orderId)}/status`,
    ASSIGN_VENDOR: (orderId) => `/api/orders/${encodeURIComponent(orderId)}/assign`,
    UPDATE_ORDER: (orderId) => `/api/order/${encodeURIComponent(orderId)}`,
    GET_VENDORS: "/api/admin/vendors",
    CANCEL_CHECK: (orderId) => `/api/orders/${encodeURIComponent(orderId)}/cancel-check`,
    CANCEL_ORDER: (orderId) => `/api/orders/${encodeURIComponent(orderId)}/cancel`,
  }
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editOrder, setEditOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelCheckData, setCancelCheckData] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    started: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    assigned: 0,
    totalPenalty: 0,
    cancelledWithPenalty: 0
  });

  // New state for assign vendor modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
  const [searchVendor, setSearchVendor] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);

  const ordersPerPage = 10;
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
    Processing: "bg-blue-500/20 text-blue-500 border border-blue-500/30",
    Started: "bg-indigo-500/20 text-indigo-500 border border-indigo-500/30",
    Shipped: "bg-purple-500/20 text-purple-500 border border-purple-500/30",
    Active: "bg-green-500/20 text-green-500 border border-green-500/30",
    Completed: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
    Cancelled: "bg-red-500/20 text-red-500 border border-red-500/30",
    'Assigned to Vendor': "bg-violet-500/20 text-violet-500 border border-violet-500/30"
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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

  // Filter vendors based on search
  useEffect(() => {
    if (searchVendor.trim() === "") {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        vendor.phone?.toLowerCase().includes(searchVendor.toLowerCase()) ||
        vendor.id?.toString().includes(searchVendor)
      );
      setFilteredVendors(filtered);
    }
  }, [searchVendor, vendors]);

  // API call helper - using api instance
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem("token");
    
    const config = {
      method,
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    if (data) {
      config.data = data;
    }

    try {
      const response = await api(config);
      return response.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Fetch vendors from API
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const data = await apiCall(API_CONFIG.ENDPOINTS.GET_VENDORS);

      if (data.success && Array.isArray(data.vendors)) {
        setVendors(data.vendors);
        setFilteredVendors(data.vendors);

        // Debug: Log vendor count
        console.log(`✅ Loaded ${data.vendors.length} vendors`);
        console.log('📋 Vendors:', data.vendors.map(v => ({ id: v.id, name: v.name, status: v.status })));
      } else {
        console.warn('⚠️ No vendors array in response:', data);
        setVendors([]);
        setFilteredVendors([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch vendors:", err);
      setVendors([]);
      setFilteredVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiCall(API_CONFIG.ENDPOINTS.GET_ALL_ORDERS);

      const ordersData = data.orders || [];
      console.log('Total orders:', ordersData.length);

      // Debug: Check vendor IDs in orders
      const ordersWithVendors = ordersData.filter(o => o.vendor_id);
      console.log('Orders with vendor IDs:', ordersWithVendors.length);

      setOrders(ordersData);
      calculateStats(ordersData);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const statsData = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'Pending').length,
      processing: ordersData.filter(o => o.status === 'Processing').length,
      started: ordersData.filter(o => o.status === 'Started').length,
      active: ordersData.filter(o => o.status === 'Active').length,
      completed: ordersData.filter(o => o.status === 'Completed').length,
      cancelled: ordersData.filter(o => o.status === 'Cancelled').length,
      assigned: ordersData.filter(o => o.vendor_id).length,
      totalPenalty: ordersData.reduce((sum, order) => sum + (order.penalty_fee || 0), 0),
      cancelledWithPenalty: ordersData.filter(o => o.status === 'Cancelled' && o.penalty_fee > 0).length
    };
    setStats(statsData);
  };

  const handleUpdateStatus = async (orderId, newStatus, serviceStarted = false) => {
    const result = await Swal.fire({
      title: "Update Status",
      text: `Change order status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      console.log('🔄 Updating order status:', {
        orderId: orderId,
        newStatus,
        serviceStarted
      });

      const encodedOrderId = encodeURIComponent(orderId);

      const response = await api.patch(
        `/api/orders/${encodedOrderId}/status`,
        {
          status: newStatus,
          service_started: serviceStarted
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Status update response:', response.data);

      Swal.fire({
        title: "Updated!",
        text: "Order status updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      fetchOrders();

    } catch (err) {
      console.error('❌ Status update error:', err.response?.data || err.message);

      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update status",
        icon: "error",
        footer: `Status: ${err.response?.status}`
      });
    }
  };

  const handleAssignVendor = async (orderId, vendorId, vendorName) => {
    const result = await Swal.fire({
      title: "Assign to Vendor",
      text: `Are you sure you want to assign this order to ${vendorName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, assign it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      console.log('🚀 Assigning order to vendor:', {
        orderId: orderId,
        vendorId,
        vendorName
      });

      const encodedOrderId = encodeURIComponent(orderId);

      const response = await api.patch(
        `/api/orders/${encodedOrderId}/assign`,
        {
          vendor_id: vendorId,
          status: 'Assigned to Vendor'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Assign vendor response:', response);

      Swal.fire({
        title: "Assigned!",
        text: `Order has been assigned to ${vendorName}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      fetchOrders();
      setShowAssignModal(false);
      setSelectedOrderForAssign(null);

    } catch (err) {
      console.error('❌ Assign vendor error details:');
      console.error('Error:', err.response?.data || err.message);
      console.error('Status:', err.response?.status);

      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to assign vendor",
        icon: "error",
        footer: `Status: ${err.response?.status}`
      });
    }
  };

  // Cancel check function
  const checkCancelEligibility = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `/api/orders/${encodeURIComponent(orderId)}/cancel-check`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Cancel check error:', error);
      return null;
    }
  };

  // Handle order cancellation
  const handleOrderCancellation = async (orderId) => {
    const cancelData = await checkCancelEligibility(orderId);

    if (!cancelData) {
      Swal.fire({
        title: "Error!",
        text: "Could not check cancellation eligibility",
        icon: "error"
      });
      return;
    }

    if (!cancelData.canCancel) {
      Swal.fire({
        title: "Cannot Cancel!",
        text: `This order is already ${cancelData.currentStatus.toLowerCase()}`,
        icon: "warning"
      });
      return;
    }

    setSelectedOrderForCancel({
      order_id: orderId,
      ...cancelData
    });
    setCancelCheckData(cancelData);
    setCancelReason('');
    setShowCancellationModal(true);
  };

  // Confirm cancellation
  const confirmCancellation = async () => {
    if (!selectedOrderForCancel) return;

    const penaltyFee = cancelCheckData?.requiresPenalty ? 300 : 0;

    const result = await Swal.fire({
      title: "Confirm Cancellation",
      html: `Are you sure you want to cancel order #${selectedOrderForCancel.order_id}?<br>
             ${cancelCheckData?.requiresPenalty ?
          `<span class="text-red-500">This will incur a penalty fee of ৳${penaltyFee}</span>` :
          "No penalty fee will be charged."}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    setCancelling(true);

    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `/api/orders/${encodeURIComponent(selectedOrderForCancel.order_id)}/cancel`,
        {
          reason: cancelReason,
          penaltyFee: penaltyFee
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Cancelled!",
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        fetchOrders();
        setShowCancellationModal(false);
        setSelectedOrderForCancel(null);
        setCancelCheckData(null);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to cancel order",
        icon: "error"
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  useEffect(() => {
    fetchOrders();
    fetchVendors();
  }, []);

  const filteredOrders = orders?.filter((order) => {
    const name = order?.customer_name?.toLowerCase() || "";
    const id = order?.order_id?.toString() || "";
    const phone = order?.customer_phone?.toString() || "";
    const vendorName = order?.vendor_name?.toLowerCase() || "";
    const status = order?.status?.toLowerCase() || "";
    const cancelReason = order?.cancel_reason?.toLowerCase() || "";

    // স্ট্যাটাস ফিল্টার
    const statusMatch = statusFilter === "All" || order.status === statusFilter;

    const searchMatch = name.includes(search.toLowerCase()) ||
      id.includes(search) ||
      phone.includes(search) ||
      vendorName.includes(search.toLowerCase()) ||
      status.includes(search.toLowerCase()) ||
      cancelReason.includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiAlertCircle className="text-yellow-500" />;
      case 'Processing': return <FiClock className="text-blue-500" />;
      case 'Started': return <FiPlayCircle className="text-indigo-500" />;
      case 'Shipped': return <FiTruck className="text-purple-500" />;
      case 'Active': return <FiCheckCircle className="text-green-500" />;
      case 'Completed': return <FiCheckCircle className="text-emerald-500" />;
      case 'Cancelled': return <FiAlertCircle className="text-red-500" />;
      case 'Assigned to Vendor': return <FiUserCheck className="text-violet-500" />;
      default: return <FiAlertCircle className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
        <div className="alert alert-error shadow-lg max-w-2xl">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="font-bold">Error Loading Orders</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchOrders}
              className="btn btn-sm btn-outline"
            >
              <FiRefreshCw className="mr-2" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hamburger-button btn btn-sm btn-ghost"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold">Order Management</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: '0', left: '0' }}
      >
        <div className="text-center py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Order Management</p>
        </div>
        <nav className="mt-4 space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} active />
          <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/services" icon={<FiPackage />} text="Service Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
            <p className="text-sm text-gray-300">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.assigned} assigned</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Order Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage all orders, assign to vendors, and track status
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-primary gap-2">
              <FiShoppingBag /> Total: {orders.length}
            </div>
            <button
              onClick={fetchOrders}
              className="btn btn-outline btn-sm"
            >
              <FiRefreshCw className="mr-2" /> Refresh
            </button>
            {statusFilter !== "All" && (
              <button
                onClick={() => setStatusFilter("All")}
                className="btn btn-sm btn-error"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Stats Dashboard - ক্লিকেবল ফিল্টার বাটন */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 mb-6">
          <button
            onClick={() => setStatusFilter("All")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary" : "bg-gray-800"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">All Orders</h3>
                  <p className="text-lg font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-full bg-gray-700">
                  <FiShoppingBag className="text-white" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Pending")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Pending" ? "ring-2 ring-yellow-500" : "bg-yellow-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Pending</h3>
                  <p className="text-lg font-bold mt-1 text-yellow-500">{stats.pending}</p>
                </div>
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <FiAlertCircle className="text-yellow-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Processing")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Processing" ? "ring-2 ring-blue-500" : "bg-blue-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Processing</h3>
                  <p className="text-lg font-bold mt-1 text-blue-500">{stats.processing}</p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <FiClock className="text-blue-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Started")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Started" ? "ring-2 ring-indigo-500" : "bg-indigo-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Started</h3>
                  <p className="text-lg font-bold mt-1 text-indigo-500">{stats.started}</p>
                </div>
                <div className="p-2 rounded-full bg-indigo-500/20">
                  <FiPlayCircle className="text-indigo-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Active")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Active" ? "ring-2 ring-green-500" : "bg-green-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Active</h3>
                  <p className="text-lg font-bold mt-1 text-green-500">{stats.active}</p>
                </div>
                <div className="p-2 rounded-full bg-green-500/20">
                  <FiCheckCircle className="text-green-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Completed")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Completed" ? "ring-2 ring-emerald-500" : "bg-emerald-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Completed</h3>
                  <p className="text-lg font-bold mt-1 text-emerald-500">{stats.completed}</p>
                </div>
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <FiCheckCircle className="text-emerald-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter("Cancelled")}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Cancelled" ? "ring-2 ring-red-500" : "bg-red-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Cancelled</h3>
                  <p className="text-lg font-bold mt-1 text-red-500">{stats.cancelled}</p>
                </div>
                <div className="p-2 rounded-full bg-red-500/20">
                  <FiAlertCircle className="text-red-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setStatusFilter("Cancelled");
              setSearch('penalty');
            }}
            className={`card shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer ${statusFilter === "Cancelled" && search.includes('penalty') ? "ring-2 ring-orange-500" : "bg-orange-500/10"}`}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">With Penalty</h3>
                  <p className="text-lg font-bold mt-1 text-orange-500">
                    {stats.cancelledWithPenalty}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-orange-500/20">
                  <FiDollarSign className="text-orange-500" />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              Swal.fire({
                title: 'Penalty Summary',
                html: `
                  <div class="text-left">
                    <p><strong>Total Penalty Collected:</strong> ৳${stats.totalPenalty.toFixed(2)}</p>
                    <p><strong>Cancelled with Penalty:</strong> ${stats.cancelledWithPenalty} orders</p>
                    <p><strong>Average Penalty per Order:</strong> ৳${stats.cancelledWithPenalty > 0 ? (stats.totalPenalty / stats.cancelledWithPenalty).toFixed(2) : '0.00'}</p>
                    <hr class="my-2 border-gray-600">
                    <p class="text-sm text-gray-400">Note: ৳300 penalty applied when service has started</p>
                  </div>
                `,
                icon: 'info',
                confirmButtonText: 'OK'
              });
            }}
            className="card bg-gray-800 shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-400 text-xs">Total Penalty</h3>
                  <p className="text-lg font-bold mt-1 text-gray-300">৳{stats.totalPenalty.toFixed(2)}</p>
                </div>
                <div className="p-2 rounded-full bg-gray-700">
                  <FiDollarSign className="text-gray-300" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="card bg-gray-800 shadow-lg mb-6">
          <div className="card-body p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer name, phone, vendor, status, or reason..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600 focus:border-primary"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
                {statusFilter !== "All" && (
                  <span className="ml-2 badge badge-sm badge-info">
                    Filtered: {statusFilter}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card bg-gray-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/50">
                  <th className="text-gray-400 font-medium">Order Details</th>
                  <th className="text-gray-400 font-medium hidden md:table-cell">Customer</th>
                  <th className="text-gray-400 font-medium">Status</th>
                  <th className="text-gray-400 font-medium hidden sm:table-cell">Vendor</th>
                  <th className="text-gray-400 font-medium hidden lg:table-cell">Penalty Info</th>
                  <th className="text-gray-400 font-medium">Total</th>
                  <th className="text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => {
                    const isCancelled = order.status === 'Cancelled';
                    const hasPenalty = order.penalty_fee > 0;

                    return (
                      <tr key={order.order_id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                        <td>
                          <div>
                            <p className="font-medium">#{order.order_id}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                            {isCancelled && order.cancelled_date && (
                              <p className="text-xs text-red-400">
                                Cancelled: {new Date(order.cancelled_date).toLocaleDateString()}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {order.cart_items?.map((item, idx) => (
                                <span key={idx} className="badge badge-xs badge-outline">
                                  {item.name} x{item.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">
                          <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-gray-400">{order.customer_email}</p>
                            <p className="text-sm text-gray-400">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-500'}`}>
                              {order.status}
                            </span>
                            {/* Show service started only for ACTIVE orders, not for PENDING */}
                            {order.status === 'Active' && order.service_started_date && (
                              <span className="badge badge-xs badge-success">
                                Service Started
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          {/* Check if vendor is assigned */}
                          {order.vendor_id ? (
                            (() => {
                              // Try to find vendor from vendors list
                              const vendorInfo = vendors.find(v => v.id === order.vendor_id);

                              if (vendorInfo) {
                                // Vendor found in list
                                return (
                                  <div>
                                    <p className="font-medium">{vendorInfo.name}</p>
                                    <p className="text-xs text-gray-400">{vendorInfo.phone}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-xs">⭐ {vendorInfo.average_rating || 'N/A'}</span>
                                      {vendorInfo.status !== 'active' && (
                                        <span className="badge badge-xs badge-warning ml-1">
                                          {vendorInfo.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              } else {
                                // Vendor not found in list
                                return (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-yellow-400">Vendor ID: {order.vendor_id}</p>
                                      <span className="badge badge-xs badge-warning">Not Found</span>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                      {order.vendor_name ? `Name in order: ${order.vendor_name}` : 'Name not available'}
                                    </p>
                                    <button
                                      onClick={() => {
                                        setSelectedOrderForAssign(order);
                                        setShowAssignModal(true);
                                      }}
                                      className="btn btn-xs btn-primary mt-1"
                                    >
                                      Re-assign Vendor
                                    </button>
                                  </div>
                                );
                              }
                            })()
                          ) : (
                            // No vendor assigned
                            <div className="space-y-1">
                              <p className="text-gray-400 text-sm">Not assigned</p>
                              {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => {
                                    setSelectedOrderForAssign(order);
                                    setShowAssignModal(true);
                                  }}
                                  className="btn btn-xs btn-primary"
                                >
                                  Assign Vendor
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="hidden lg:table-cell">
                          {order.status === 'Cancelled' ? (
                            <div>
                              {order.penalty_fee > 0 ? (
                                <div className="text-red-400">
                                  <p className="font-bold">৳{order.penalty_fee}</p>
                                  <p className="text-xs text-gray-400">Penalty Applied</p>
                                  {order.cancel_reason && (
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]" title={order.cancel_reason}>
                                      {order.cancel_reason}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="text-gray-400">
                                  <p className="text-sm">No Penalty</p>
                                  {order.cancel_reason && (
                                    <p className="text-xs truncate max-w-[150px]" title={order.cancel_reason}>
                                      {order.cancel_reason}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">
                              {/* Only show penalty warning for Active orders with service started */}
                              {order.status === 'Active' && order.service_started_date ? (
                                <span className="text-orange-500">Penalty: ৳300 if cancelled</span>
                              ) : (
                                'No penalty'
                              )}
                            </div>
                          )}
                        </td>
                        <td className="font-bold">
                          <div>
                            ৳{order.total}
                            {hasPenalty && (
                              <div className="text-xs text-red-400">
                                +৳{order.penalty_fee} penalty
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => {
                                setViewOrder(order);
                                document.getElementById("view_order_modal").showModal();
                              }}
                              className="btn btn-xs btn-ghost btn-square text-info hover:bg-info/20"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>

                            {/* Cancel Order Button */}
                            {order.status !== 'Cancelled' && order.status !== 'Completed' && (
                              <button
                                onClick={() => handleOrderCancellation(order.order_id)}
                                className="btn btn-xs btn-ghost btn-square text-red-500 hover:bg-red-500/20"
                                title="Cancel Order"
                              >
                                <FiXCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Assign Vendor Button */}
                            {vendors.length > 0 && order.status !== 'Completed' && order.status !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  setSelectedOrderForAssign(order);
                                  setShowAssignModal(true);
                                }}
                                className="btn btn-xs btn-ghost btn-square text-primary hover:bg-primary/20"
                                title="Assign Vendor"
                              >
                                <FiUserCheck className="w-4 h-4" />
                              </button>
                            )}

                            {/* Status Actions Dropdown */}
                            <div className="dropdown dropdown-end">
                              <button tabIndex={0} className="btn btn-xs btn-ghost btn-square text-warning hover:bg-warning/20" title="Change Status">
                                <FiEdit className="w-4 h-4" />
                              </button>
                              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
                                <li className="menu-title text-xs text-gray-400 mb-1">Change Status</li>

                                {/* Service Started Toggle */}
                                {order.status === 'Active' && !order.service_started_date && (
                                  <li>
                                    <button
                                      onClick={() => handleUpdateStatus(order.order_id, 'Active', true)}
                                      className="text-green-500 hover:bg-green-500/10"
                                    >
                                      <FiPlayCircle /> Mark Service Started
                                    </button>
                                  </li>
                                )}

                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Pending')}
                                    className="text-yellow-500 hover:bg-yellow-500/10"
                                  >
                                    <FiAlertCircle /> Pending
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Processing')}
                                    className="text-blue-500 hover:bg-blue-500/10"
                                  >
                                    <FiClock /> Processing
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Started')}
                                    className="text-indigo-500 hover:bg-indigo-500/10"
                                  >
                                    <FiPlayCircle /> Started
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Active')}
                                    className="text-green-500 hover:bg-green-500/10"
                                  >
                                    <FiCheckCircle /> Active
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Completed')}
                                    className="text-emerald-500 hover:bg-emerald-500/10"
                                  >
                                    <FiCheckCircle /> Complete
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
                                    className="text-red-500 hover:bg-red-500/10"
                                  >
                                    <FiAlertCircle /> Cancel
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <FiShoppingBag className="text-4xl text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No orders found</h3>
                        <p className="text-gray-400 mb-4">
                          {search || statusFilter !== "All"
                            ? 'Try changing your search criteria'
                            : 'No orders have been placed yet'
                          }
                        </p>
                        {(search || statusFilter !== "All") && (
                          <button
                            onClick={() => {
                              setSearch('');
                              setStatusFilter("All");
                            }}
                            className="btn btn-sm btn-outline"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {currentOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-700 gap-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                {statusFilter !== "All" && (
                  <span className="ml-2 badge badge-xs badge-info">
                    {statusFilter}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-sm btn-ghost disabled:opacity-50"
                >
                  <FiChevronLeft /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages)).keys()].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="btn btn-sm btn-ghost"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm btn-ghost disabled:opacity-50"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Order Modal */}
        <dialog id="view_order_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
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
                  <div className="flex items-center gap-2">
                    {getStatusIcon(viewOrder.status)}
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[viewOrder.status]}`}>
                      {viewOrder.status}
                    </span>
                    {/* Show service started only for ACTIVE status */}
                    {viewOrder?.status === 'Active' && viewOrder?.service_started_date && (
                      <span className="badge badge-success badge-sm">
                        Service Started
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Started Warning - Only show for Active status */}
                {viewOrder?.status === 'Active' && viewOrder?.service_started_date && (
                  <div className="card bg-orange-900/20 p-4 border border-orange-900/50">
                    <h4 className="font-semibold text-lg mb-2 text-orange-400">Service Information</h4>
                    <div>
                      <p><span className="text-gray-400">Service Started:</span> {new Date(viewOrder.service_started_date).toLocaleString()}</p>
                      <p className="text-sm text-orange-300 mt-1">
                        <FiAlertCircle className="inline mr-1" />
                        Cancellation now will incur a ৳300 penalty fee
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Customer Information */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-3">Customer Information</h4>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <p><span className="text-gray-400">Name:</span> {viewOrder.customer_name}</p>
                      <p><span className="text-gray-400">Email:</span> {viewOrder.customer_email}</p>
                      <p><span className="text-gray-400">Phone:</span> {viewOrder.customer_phone}</p>
                    </div>
                  </div>

                  {/* Vendor Information */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-3">Vendor Information</h4>
                    {viewOrder.vendor_id ? (
                      (() => {
                        const vendorInfo = vendors.find(v => v.id === viewOrder.vendor_id);
                        if (vendorInfo) {
                          return (
                            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                              <p><span className="text-gray-400">Name:</span> {vendorInfo.name}</p>
                              <p><span className="text-gray-400">Phone:</span> {vendorInfo.phone}</p>
                              <p><span className="text-gray-400">Email:</span> {vendorInfo.email}</p>
                              <p><span className="text-gray-400">Rating:</span> ⭐ {vendorInfo.average_rating || 'N/A'}</p>
                              <p><span className="text-gray-400">Status:</span>
                                <span className={`ml-2 badge badge-xs ${vendorInfo.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                  {vendorInfo.status}
                                </span>
                              </p>
                              <div className="mt-2">
                                <button
                                  onClick={() => {
                                    setSelectedOrderForAssign(viewOrder);
                                    setShowAssignModal(true);
                                    document.getElementById("view_order_modal").close();
                                  }}
                                  className="btn btn-xs btn-primary"
                                >
                                  Re-assign Vendor
                                </button>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="space-y-2">
                              <div className="alert alert-warning">
                                <FiAlertCircle />
                                <span>Vendor not found in current list</span>
                              </div>
                              <p><span className="text-gray-400">Vendor ID:</span> {viewOrder.vendor_id}</p>
                              {viewOrder.vendor_name && (
                                <p><span className="text-gray-400">Name in order:</span> {viewOrder.vendor_name}</p>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedOrderForAssign(viewOrder);
                                  setShowAssignModal(true);
                                  document.getElementById("view_order_modal").close();
                                }}
                                className="btn btn-xs btn-primary mt-2"
                              >
                                Assign New Vendor
                              </button>
                            </div>
                          );
                        }
                      })()
                    ) : (
                      <div>
                        <p className="text-gray-400 mb-2">No vendor assigned</p>
                        {viewOrder.status !== 'Completed' && viewOrder.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setSelectedOrderForAssign(viewOrder);
                              setShowAssignModal(true);
                              document.getElementById("view_order_modal").close();
                            }}
                            className="btn btn-xs btn-primary"
                          >
                            Assign Vendor
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Order Summary */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Summary</h4>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <p><span className="text-gray-400">Subtotal:</span> ৳{viewOrder.total}</p>
                      <p><span className="text-gray-400">Payment Method:</span> {viewOrder.payment_method || 'N/A'}</p>
                      {viewOrder.penalty_fee > 0 && (
                        <p><span className="text-gray-400">Penalty Fee:</span> ৳{viewOrder.penalty_fee}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-3">Address Information</h4>
                    {viewOrder.address_type === 'another' ? (
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
                </div>

                {/* Order Items */}
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
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-right font-bold">Subtotal:</td>
                          <td className="font-bold">৳{viewOrder.total}</td>
                        </tr>
                        {viewOrder.penalty_fee > 0 && (
                          <tr>
                            <td colSpan="3" className="text-right font-bold text-red-400">Penalty Fee:</td>
                            <td className="font-bold text-red-400">+৳{viewOrder.penalty_fee}</td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan="3" className="text-right font-bold text-lg">Total:</td>
                          <td className="font-bold text-lg">৳{(parseFloat(viewOrder.total) + (viewOrder.penalty_fee || 0)).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Cancellation Details */}
                {viewOrder.status === 'Cancelled' && (
                  <div className="card bg-red-900/20 p-4 border border-red-900/50">
                    <h4 className="font-semibold text-lg mb-2 text-red-400">Cancellation Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><span className="text-gray-400">Reason:</span> {viewOrder.cancel_reason || 'Not specified'}</p>
                        <p><span className="text-gray-400">Cancelled Date:</span> {new Date(viewOrder.cancelled_date).toLocaleString()}</p>
                      </div>
                      <div>
                        <p><span className="text-gray-400">Penalty Fee:</span>
                          <span className={`font-bold ${viewOrder.penalty_fee > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {viewOrder.penalty_fee > 0 ? ` ৳${viewOrder.penalty_fee}` : ' No Penalty'}
                          </span>
                        </p>
                        {viewOrder.service_started_date && (
                          <p><span className="text-gray-400">Service Started:</span> {new Date(viewOrder.service_started_date).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-700">
                  {viewOrder.status !== 'Completed' && viewOrder.status !== 'Cancelled' && vendors.length > 0 && (
                    <button
                      onClick={() => {
                        document.getElementById("view_order_modal").close();
                        setSelectedOrderForAssign(viewOrder);
                        setShowAssignModal(true);
                      }}
                      className="btn btn-primary"
                    >
                      <FiUserCheck className="mr-2" /> Assign/Change Vendor
                    </button>
                  )}
                  {viewOrder.status !== 'Cancelled' && viewOrder.status !== 'Completed' && (
                    <button
                      onClick={() => {
                        document.getElementById("view_order_modal").close();
                        handleOrderCancellation(viewOrder.order_id);
                      }}
                      className="btn btn-error"
                    >
                      <FiXCircle className="mr-2" /> Cancel Order
                    </button>
                  )}
                  <button
                    onClick={() => {
                      document.getElementById("view_order_modal").close();
                      setEditOrder(viewOrder);
                      document.getElementById("edit_order_modal").showModal();
                    }}
                    className="btn btn-warning"
                  >
                    <FiEdit className="mr-2" /> Edit Order
                  </button>
                </div>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* Edit Order Modal */}
        <dialog id="edit_order_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
            </form>

            {editOrder && (
              <div>
                <h3 className="text-xl font-bold mb-4 sm:mb-6">Edit Order #{editOrder.order_id}</h3>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setUpdating(true);

                  try {
                    const updatedOrder = {
                      status: e.target.status.value,
                      notes: e.target.notes.value,
                      vendor_id: e.target.vendor_id.value || null,
                    };

                    await apiCall(
                      API_CONFIG.ENDPOINTS.UPDATE_ORDER(editOrder.order_id),
                      'PUT',
                      updatedOrder
                    );

                    Swal.fire({
                      title: "Success!",
                      text: "Order updated successfully",
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false
                    });

                    fetchOrders();
                    document.getElementById("edit_order_modal").close();
                  } catch (error) {
                    Swal.fire({
                      title: "Error!",
                      text: error.response?.data?.message || "Failed to update order",
                      icon: "error"
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
                        <option value="Started">Started</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Assigned to Vendor">Assigned to Vendor</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Assign Vendor</span>
                      </label>
                      <select
                        name="vendor_id"
                        defaultValue={editOrder.vendor_id || ""}
                        className="select select-bordered w-full bg-gray-700 border-gray-600"
                        disabled={vendorsLoading}
                      >
                        <option value="">-- Select Vendor --</option>
                        {vendors.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {vendor.name} ({vendor.phone}) ⭐ {vendor.average_rating || 'N/A'}
                          </option>
                        ))}
                      </select>
                      {vendorsLoading && (
                        <div className="text-sm text-gray-400 mt-1">Loading vendors...</div>
                      )}
                      {vendors.length === 0 && !vendorsLoading && (
                        <div className="text-sm text-red-400 mt-1">No active vendors available</div>
                      )}
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

                    <div className="modal-action mt-4 sm:mt-6">
                      <button
                        type="submit"
                        className={`btn btn-primary ${updating ? 'loading' : ''}`}
                        disabled={updating || vendorsLoading}
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
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* Assign Vendor Modal */}
        {showAssignModal && selectedOrderForAssign && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">
                    Assign Vendor to Order #{selectedOrderForAssign.order_id}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Current Vendor: {selectedOrderForAssign.vendor_id ?
                      `ID: ${selectedOrderForAssign.vendor_id}${selectedOrderForAssign.vendor_name ? ` (${selectedOrderForAssign.vendor_name})` : ''}` :
                      'Not assigned'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedOrderForAssign(null);
                    setSearchVendor("");
                  }}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search vendors by name, email, phone, or ID..."
                    value={searchVendor}
                    onChange={(e) => setSearchVendor(e.target.value)}
                    className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-400">
                    {filteredVendors.length} vendor(s) found
                  </p>
                  {vendorsLoading && (
                    <span className="text-sm text-blue-400">Loading vendors...</span>
                  )}
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {filteredVendors.length > 0 ? (
                  <div className="space-y-3">
                    {filteredVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="card bg-gray-700/50 p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleAssignVendor(
                          selectedOrderForAssign.order_id,
                          vendor.id,
                          vendor.name
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                              {vendor.photo ? (
                                <img
                                  src={vendor.photo.startsWith('/')
                                    ? `${import.meta.env.VITE_API_URL}${vendor.photo}`
                                    : vendor.photo
                                  }
                                  alt={vendor.name}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.innerHTML = '<FiUser className="w-6 h-6 text-gray-400" />';
                                  }}
                                />
                              ) : (
                                <FiUser className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg">{vendor.name}</h4>
                                <p className="text-sm text-gray-400">{vendor.email}</p>
                                <p className="text-sm text-gray-400">{vendor.phone}</p>
                              </div>
                              <div className="text-right">
                                <div className="badge badge-primary">
                                  ⭐ {vendor.average_rating || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  ID: {vendor.id}
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className={`badge badge-sm ${vendor.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                                {vendor.status}
                              </span>
                              <span className="badge badge-sm badge-outline">
                                Orders: {vendor.completed_orders || 0}
                              </span>
                              {vendor.id === selectedOrderForAssign.vendor_id && (
                                <span className="badge badge-sm badge-info">
                                  Currently Assigned
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : vendorsLoading ? (
                  <div className="text-center py-8">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-gray-400">Loading vendors...</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiUsers className="text-4xl text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-300 mb-2">
                      No vendors found
                    </h4>
                    <p className="text-gray-400">
                      {searchVendor
                        ? 'Try changing your search criteria'
                        : 'No vendors available. Please add vendors first.'
                      }
                    </p>
                    {searchVendor && (
                      <button
                        onClick={() => setSearchVendor("")}
                        className="btn btn-sm btn-outline mt-4"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-action mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedOrderForAssign(null);
                    setSearchVendor("");
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                {selectedOrderForAssign.vendor_id && (
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: "Remove Vendor?",
                        text: "Are you sure you want to remove the current vendor assignment?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#dc2626",
                        cancelButtonColor: "#6b7280",
                        confirmButtonText: "Yes, remove it!"
                      });

                      if (result.isConfirmed) {
                        try {
                          const token = localStorage.getItem("token");
                          const response = await api.patch(
                            `/api/orders/${encodeURIComponent(selectedOrderForAssign.order_id)}/assign`,
                            {
                              vendor_id: null,
                              status: 'Pending'
                            },
                            {
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              }
                            }
                          );

                          if (response.data.success) {
                            Swal.fire({
                              title: "Removed!",
                              text: "Vendor assignment removed successfully.",
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false
                            });

                            fetchOrders();
                            setShowAssignModal(false);
                            setSelectedOrderForAssign(null);
                          }
                        } catch (err) {
                          Swal.fire({
                            title: "Error!",
                            text: err.response?.data?.message || "Failed to remove vendor",
                            icon: "error"
                          });
                        }
                      }
                    }}
                    className="btn btn-error"
                  >
                    Remove Current Vendor
                  </button>
                )}
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => {
                setShowAssignModal(false);
                setSelectedOrderForAssign(null);
                setSearchVendor("");
              }}
            ></div>
          </div>
        )}

        {/* Cancellation Modal */}
        {showCancellationModal && selectedOrderForCancel && (
          <div className="modal modal-open">
            <div className="modal-box max-w-md bg-gray-800 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  Cancel Order #{selectedOrderForCancel.order_id}
                </h3>
                <button
                  onClick={() => {
                    setShowCancellationModal(false);
                    setSelectedOrderForCancel(null);
                    setCancelCheckData(null);
                  }}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="alert alert-info mb-4">
                  <div>
                    <FiAlertCircle className="text-lg" />
                    <div>
                      <h4 className="font-bold">Cancellation Policy</h4>
                      <div className="text-sm">
                        {cancelCheckData?.requiresPenalty ? (
                          <p>Service has started. Cancellation requires <span className="font-bold text-red-500">৳300 penalty fee</span>.</p>
                        ) : (
                          <p>No penalty fee required for cancellation.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text text-gray-300">Cancellation Reason</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
                    rows={3}
                    placeholder="Please provide reason for cancellation..."
                  />
                </div>

                {cancelCheckData?.requiresPenalty && (
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text text-gray-300">Penalty Fee</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="input input-bordered w-full bg-gray-700 border-gray-600">
                        ৳300 (Required)
                      </div>
                      <span className="text-xs text-red-400">*Mandatory</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      This fee compensates the vendor as service has already started.
                    </p>
                  </div>
                )}

                <div className="modal-action">
                  <button
                    onClick={confirmCancellation}
                    disabled={cancelling || (cancelCheckData?.requiresPenalty && !cancelReason)}
                    className={`btn btn-error ${cancelling ? 'loading' : ''}`}
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCancellationModal(false);
                      setSelectedOrderForCancel(null);
                      setCancelCheckData(null);
                    }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => {
                setShowCancellationModal(false);
                setSelectedOrderForCancel(null);
                setCancelCheckData(null);
              }}
            ></div>
          </div>
        )}
      </main>
    </div>
  );
};

// Reusable SidebarLink component
const SidebarLink = ({ to, icon, text, onClick, active }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors ${isActive || active
        ? "bg-primary text-white shadow-lg"
        : "hover:bg-gray-700 text-gray-300"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {text}
  </NavLink>
);

export default OrdersList;