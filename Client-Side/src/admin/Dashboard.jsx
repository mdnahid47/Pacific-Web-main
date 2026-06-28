// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate, NavLink } from "react-router-dom";
// import { FiHome, FiUsers, FiShoppingBag, FiTruck, FiPieChart, FiLogOut, FiSettings, FiMenu, FiX, FiPackage } from "react-icons/fi";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     completedOrders: 0,
//     canceledOrders: 0,
//     activeVendors: 0,
//     totalUsers: 0,
//     completionRate: "0.00",
//   });
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();

//   // Close sidebar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         // Check if the click is not on the hamburger button
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

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("No authentication token");

//         const response = await axios.get("http://localhost:5001/api/admin/dashboard", {
//           headers: { Authorization: `Bearer ${token}` },
//           timeout: 10000,
//         });

//         if (!response.data.success) {
//           throw new Error(response.data.message || "Invalid response format");
//         }

//         setStats(response.data.stats);
//         setRecentActivity(response.data.recentActivity || []);
//         setError(null);
//       } catch (err) {
//         let errorMessage = "Failed to load dashboard";
//         if (err.response) {
//           errorMessage = err.response.data?.message || `Server error (${err.response.status})`;
//         } else if (err.request) {
//           errorMessage = "No response from server";
//         } else {
//           errorMessage = err.message;
//         }

//         setError(errorMessage);

//         if (err.response?.status === 401) {
//           localStorage.removeItem("token");
//           navigate("/login", { state: { from: location.pathname } });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       // Optional: Make API call to invalidate token on server
//       const token = localStorage.getItem("token");
//       if (token) {
//         await axios.post('http://localhost:5001/api/auth/logout', {}, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//       }

//       // Clear all client-side storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // Show logout notification
//       await Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Logout successful',
//         showConfirmButton: false,
//         timer: 1000
//       });

//       // Redirect and refresh
//       navigate("/", { replace: true });
//       setTimeout(() => {
//         window.location.reload();
//       }, 100);

//     } catch (error) {
//       console.error('Logout error:', error);
//       // Proceed with client-side cleanup even if server logout fails
//       localStorage.clear();
//       navigate("/");
//       window.location.reload();
//     }
//   };

//   if (loading) {
//     return <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         <div>
//           <h2 className="text-2xl text-red-400">{error}</h2>
//           <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Reload</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
//       {/* Mobile Sidebar Toggle */}
//       <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="hamburger-button btn btn-sm btn-outline"
//         >
//           {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>
//         <h1 className="text-xl font-bold">Admin Dashboard</h1>
//         <div className="w-10"></div> {/* Spacer for alignment */}
//       </div>

//       {/* Mobile Sidebar Toggle */}
//       <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="hamburger-button btn btn-sm btn-ghost"
//         >
//           {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
//         </button>
//         <h1 className="text-xl font-bold">Dashboard</h1>
//         <div className="w-10"></div>
//       </div>

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
//                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
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

//       {/* Main Content */}
//       <main className="flex-1 p-6 lg:ml-0">
//         <h1 className="text-3xl font-bold mb-6 hidden lg:block">Admin Dashboard</h1>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           <DashboardCard title="Total Orders" value={stats.totalOrders} icon="📦" color="primary" />
//           <DashboardCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="warning" />
//           <DashboardCard title="Completed" value={stats.completedOrders} icon="✅" color="success" />
//           <DashboardCard title="Canceled" value={stats.canceledOrders} icon="❌" color="error" />
//           <DashboardCard title="Active Vendors" value={stats.activeVendors} icon="🏪" color="accent" />
//           <DashboardCard title="Total Users" value={stats.totalUsers} icon="👥" color="info" />
//           <DashboardCard title="Completion Rate" value={`${stats.completionRate}%`} icon="📊" color="secondary" />
//           <DashboardCard
//             title="Cancellation Rate"
//             value={`${((stats.canceledOrders / stats.totalOrders) * 100 || 0).toFixed(2)}%`}
//             icon="⚠️"
//             color="error"
//           />
//         </div>

//         {/* Analytics Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
//           <div className="card bg-gray-800 hover:bg-gray-700 transition-colors">
//             <div className="card-body">
//               <h2 className="card-title">Order Completion Rate</h2>
//               <div className="flex flex-col sm:flex-row items-center">
//                 <div
//                   className="radial-progress text-primary mb-4 sm:mb-0"
//                   style={{ "--value": stats.completionRate, "--size": "8rem" }}
//                 >
//                   {stats.completionRate}%
//                 </div>
//                 <div className="sm:ml-4 text-center sm:text-left">
//                   <p className="text-sm text-gray-400">
//                     {stats.totalOrders - stats.pendingOrders - stats.canceledOrders} of {stats.totalOrders} orders completed
//                   </p>
//                   <p className="text-sm text-gray-400 mt-2">
//                     {stats.pendingOrders} pending • {stats.canceledOrders} canceled
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card bg-gray-800">
//             <div className="card-body">
//               <h2 className="card-title">Order Status Distribution</h2>
//               <div className="h-64 flex items-center justify-center">
//                 <div className="w-full max-w-md">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm text-gray-400">Completed</span>
//                     <span className="text-sm font-medium">{stats.completedOrders}</span>
//                   </div>
//                   <progress
//                     className="progress progress-success w-full"
//                     value={stats.completedOrders}
//                     max={stats.totalOrders}>
//                   </progress>

//                   <div className="flex items-center justify-between mb-2 mt-4">
//                     <span className="text-sm text-gray-400">Pending</span>
//                     <span className="text-sm font-medium">{stats.pendingOrders}</span>
//                   </div>
//                   <progress
//                     className="progress progress-warning w-full"
//                     value={stats.pendingOrders}
//                     max={stats.totalOrders}>
//                   </progress>

//                   <div className="flex items-center justify-between mb-2 mt-4">
//                     <span className="text-sm text-gray-400">Canceled</span>
//                     <span className="text-sm font-medium">{stats.canceledOrders}</span>
//                   </div>
//                   <progress
//                     className="progress progress-error w-full"
//                     value={stats.canceledOrders}
//                     max={stats.totalOrders}>
//                   </progress>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="card bg-gray-800 mt-4 sm:mt-6">
//           <div className="card-body">
//             <h2 className="card-title">Recent Activity</h2>
//             <div className="overflow-x-auto">
//               <table className="table w-full">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Updated</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentActivity.length > 0 ? recentActivity.map((item) => (
//                     <tr key={item.order_id}>
//                       <td>#{item.order_id || "N/A"}</td>
//                       <td>
//                         {item.updated_at && !isNaN(new Date(item.updated_at).getTime()) ?
//                           new Date(item.updated_at).toLocaleString() :
//                           "No Date"}
//                       </td>
//                       <td>
//                         <span className={`badge ${item.status.toLowerCase() === 'pending' ? 'badge-warning' :
//                           item.status.toLowerCase() === 'completed' ? 'badge-success' :
//                             'badge-error'
//                           }`}>
//                           {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                         </span>
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr><td colSpan={3} className="text-center">No activity</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// const SidebarLink = ({ to, icon, text, onClick }) => (
//   <NavLink
//     to={to}
//     onClick={onClick}
//     className={({ isActive }) =>
//       `flex items-center p-3 rounded-lg ${isActive ? "bg-primary text-white" : "hover:bg-gray-700"
//       }`
//     }
//   >
//     <span className="mr-3">{icon}</span>
//     {text}
//   </NavLink>
// );

// const DashboardCard = ({ title, value, icon, color }) => (
//   <div className="card bg-gray-800 hover:bg-gray-700 transition-colors shadow-md">
//     <div className="card-body p-4 sm:p-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-sm font-semibold text-white">{title}</h2>
//         <span className="text-xl">{icon}</span>
//       </div>
//       <p className={`text-2xl sm:text-3xl font-bold text-${color}`}>{value}</p>
//     </div>
//   </div>
// );

// export default AdminDashboard;

import { useEffect, useState, useRef } from "react";
import api from "../../api"; // Import the configured axios instance
import { useNavigate, NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiShoppingBag, FiTruck, FiPieChart, FiLogOut, FiSettings, FiMenu, FiX, FiPackage } from "react-icons/fi";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
    activeVendors: 0,
    totalUsers: 0,
    completionRate: "0.00",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token");

        const response = await api.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Invalid response format");
        }

        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity || []);
        setError(null);
      } catch (err) {
        let errorMessage = "Failed to load dashboard";
        if (err.response) {
          errorMessage = err.response.data?.message || `Server error (${err.response.status})`;
        } else if (err.request) {
          errorMessage = "No response from server";
        } else {
          errorMessage = err.message;
        }

        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { state: { from: window.location.pathname } });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Optional: Make API call to invalidate token on server
      const token = localStorage.getItem("token");
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      // Clear all client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Show logout notification
      await Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logout successful',
        showConfirmButton: false,
        timer: 1000
      });

      // Redirect and refresh
      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('Logout error:', error);
      // Proceed with client-side cleanup even if server logout fails
      localStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-xl max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-red-400 mb-4">{error}</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reload Page
          </button>
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
          className="hamburger-button btn btn-sm btn-ghost text-white"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full overflow-y-auto
               ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: '0', left: '0' }}
      >
        <div className="text-center py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Order Management</p>
        </div>
        <nav className="mt-4 space-y-1">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} active />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/services" icon={<FiPackage />} text="Service Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
            <p className="text-sm text-gray-300">Total Orders</p>
            <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.completedOrders} completed</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 hidden lg:block text-white">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard title="Total Orders" value={stats.totalOrders} icon="📦" color="primary" />
          <DashboardCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="warning" />
          <DashboardCard title="Completed" value={stats.completedOrders} icon="✅" color="success" />
          <DashboardCard title="Canceled" value={stats.canceledOrders} icon="❌" color="error" />
          <DashboardCard title="Active Vendors" value={stats.activeVendors} icon="🏪" color="accent" />
          <DashboardCard title="Total Users" value={stats.totalUsers} icon="👥" color="info" />
          <DashboardCard title="Completion Rate" value={`${stats.completionRate}%`} icon="📊" color="secondary" />
          <DashboardCard
            title="Cancellation Rate"
            value={`${((stats.canceledOrders / stats.totalOrders) * 100 || 0).toFixed(2)}%`}
            icon="⚠️"
            color="error"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
          <div className="card bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-xl border border-gray-700">
            <div className="card-body">
              <h2 className="card-title text-white text-xl font-semibold mb-4">Order Completion Rate</h2>
              <div className="flex flex-col sm:flex-row items-center">
                <div
                  className="radial-progress text-blue-500 mb-4 sm:mb-0"
                  style={{ 
                    "--value": stats.completionRate, 
                    "--size": "8rem",
                    "--thickness": "0.5rem"
                  }}
                >
                  <span className="text-2xl font-bold text-white">{stats.completionRate}%</span>
                </div>
                <div className="sm:ml-4 text-center sm:text-left">
                  <p className="text-sm text-gray-400">
                    {stats.totalOrders - stats.pendingOrders - stats.canceledOrders} of {stats.totalOrders} orders completed
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {stats.pendingOrders} pending • {stats.canceledOrders} canceled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="card-body">
              <h2 className="card-title text-white text-xl font-semibold mb-4">Order Status Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Completed</span>
                    <span className="text-sm font-medium text-white">{stats.completedOrders}</span>
                  </div>
                  <progress
                    className="progress progress-success w-full h-3 rounded-full"
                    value={stats.completedOrders}
                    max={stats.totalOrders || 1}>
                  </progress>

                  <div className="flex items-center justify-between mb-2 mt-4">
                    <span className="text-sm text-gray-400">Pending</span>
                    <span className="text-sm font-medium text-white">{stats.pendingOrders}</span>
                  </div>
                  <progress
                    className="progress progress-warning w-full h-3 rounded-full"
                    value={stats.pendingOrders}
                    max={stats.totalOrders || 1}>
                  </progress>

                  <div className="flex items-center justify-between mb-2 mt-4">
                    <span className="text-sm text-gray-400">Canceled</span>
                    <span className="text-sm font-medium text-white">{stats.canceledOrders}</span>
                  </div>
                  <progress
                    className="progress progress-error w-full h-3 rounded-full"
                    value={stats.canceledOrders}
                    max={stats.totalOrders || 1}>
                  </progress>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-gray-800 p-6 rounded-xl border border-gray-700 mt-4 sm:mt-6">
          <div className="card-body">
            <h2 className="card-title text-white text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentActivity.length > 0 ? recentActivity.map((item) => (
                    <tr key={item.order_id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">#{item.order_id || "N/A"}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {item.updated_at && !isNaN(new Date(item.updated_at).getTime()) ?
                          new Date(item.updated_at).toLocaleString() :
                          "No Date"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          item.status.toLowerCase() === 'completed' ? 'bg-green-500/20 text-green-400' :
                          item.status.toLowerCase() === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400">No recent activity</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, onClick, active }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors ${
        isActive || active
          ? "bg-blue-600 text-white" 
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`
    }
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

const DashboardCard = ({ title, value, icon, color }) => {
  const colorMap = {
    primary: "text-blue-400",
    warning: "text-yellow-400",
    success: "text-green-400",
    error: "text-red-400",
    accent: "text-purple-400",
    info: "text-cyan-400",
    secondary: "text-indigo-400"
  };

  return (
    <div className="card bg-gray-800 hover:bg-gray-700 transition-colors shadow-md rounded-xl border border-gray-700 p-4 sm:p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-300">{title}</h2>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold ${colorMap[color] || 'text-white'}`}>
        {value}
      </p>
    </div>
  );
};

export default AdminDashboard;