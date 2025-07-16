import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiShoppingBag, FiTruck, FiPieChart, FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";

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

        const response = await axios.get("http://localhost:5001/api/admin/dashboard", {
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
          navigate("/login", { state: { from: location.pathname } });
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
      await axios.post('http://localhost:5001/api/auth/logout', {}, {
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
    return <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div>
          <h2 className="text-2xl text-red-400">{error}</h2>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Reload</button>
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
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
      <main className="flex-1 p-6 lg:ml-0">
        <h1 className="text-3xl font-bold mb-6 hidden lg:block">Admin Dashboard</h1>

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
          <div className="card bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="card-body">
              <h2 className="card-title">Order Completion Rate</h2>
              <div className="flex flex-col sm:flex-row items-center">
                <div
                  className="radial-progress text-primary mb-4 sm:mb-0"
                  style={{ "--value": stats.completionRate, "--size": "8rem" }}
                >
                  {stats.completionRate}%
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

          <div className="card bg-gray-800">
            <div className="card-body">
              <h2 className="card-title">Order Status Distribution</h2>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Completed</span>
                    <span className="text-sm font-medium">{stats.completedOrders}</span>
                  </div>
                  <progress 
                    className="progress progress-success w-full" 
                    value={stats.completedOrders} 
                    max={stats.totalOrders}>
                  </progress>
                  
                  <div className="flex items-center justify-between mb-2 mt-4">
                    <span className="text-sm text-gray-400">Pending</span>
                    <span className="text-sm font-medium">{stats.pendingOrders}</span>
                  </div>
                  <progress 
                    className="progress progress-warning w-full" 
                    value={stats.pendingOrders} 
                    max={stats.totalOrders}>
                  </progress>
                  
                  <div className="flex items-center justify-between mb-2 mt-4">
                    <span className="text-sm text-gray-400">Canceled</span>
                    <span className="text-sm font-medium">{stats.canceledOrders}</span>
                  </div>
                  <progress 
                    className="progress progress-error w-full" 
                    value={stats.canceledOrders} 
                    max={stats.totalOrders}>
                  </progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card bg-gray-800 mt-4 sm:mt-6">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Updated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? recentActivity.map((item) => (
                    <tr key={item.order_id}>
                      <td>#{item.order_id || "N/A"}</td>
                      <td>
                        {item.updated_at && !isNaN(new Date(item.updated_at).getTime()) ?
                          new Date(item.updated_at).toLocaleString() :
                          "No Date"}
                      </td>
                      <td>
                        <span className={`badge ${
                          item.status.toLowerCase() === 'pending' ? 'badge-warning' :
                            item.status.toLowerCase() === 'completed' ? 'badge-success' :
                              'badge-error'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center">No activity</td></tr>
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

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="card bg-gray-800 hover:bg-gray-700 transition-colors shadow-md">
    <div className="card-body p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold text-${color}`}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;