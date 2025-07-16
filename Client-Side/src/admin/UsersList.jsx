import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FiHome, FiUsers, FiShoppingBag, FiTruck, 
  FiPieChart, FiLogOut, FiSettings, FiEdit, 
  FiTrash2, FiEye, FiSearch, FiChevronLeft, 
  FiChevronRight, FiMenu, FiX, FiUser, 
  FiUserPlus, FiClock, FiCalendar 
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const UsersList = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    last30Days: 0,
    activeUsers: 0
  });
  const usersPerPage = 10;
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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

const fetchUsers = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");
  try {
    const usersRes = await axios.get("http://localhost:5001/api/admin/all-users", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // data validation
    if (!usersRes.data?.users) {
      throw new Error("Invalid API response structure");
    }

    const processedUsers = usersRes.data.users.map(user => ({
      ...user,
      // _id field normalization
      _id: user._id || user.id || user.custom_id || 'unknown'
    }));

    setUsers(processedUsers);
    // stats API call
    try {
      const statsRes = await axios.get("http://localhost:5001/api/admin/user-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
    } catch (statsErr) {
      console.error("Stats API error:", statsErr);
      // an alternative way to calculate stats
      setStats({
        totalUsers: processedUsers.length,
        newUsers: processedUsers.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length,
        activeUsers: processedUsers.filter(u => u.isActive).length,
        last30Days: processedUsers.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length
      });
    }

  } catch (err) {
    console.error("API Error:", err);
    setError(err.message);
    setUsers([]); 
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (!viewUser?.id) return;

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/admin/user-orders/${viewUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  fetchUserOrders();
}, [viewUser]);

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
        await axios.delete(`http://localhost:5001/api/admin/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const filteredUsers = (Array.isArray(users) ? users : [])
  .filter((user) => {
    if (!user) return false;
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const phone = user.phone?.toString() || "";
    return name.includes(search.toLowerCase()) || 
           email.includes(search.toLowerCase()) || 
           phone.includes(search);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
        <h1 className="text-xl font-bold">User Management</h1>
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
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} active />
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
          <h1 className="text-2xl lg:text-3xl font-bold hidden lg:block">User Management</h1>
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full lg:w-auto">
            <StatsCard title="Total Users" value={stats.totalUsers} icon={<FiUser />} />
            <StatsCard title="New Users" value={stats.newUsers} icon={<FiUserPlus />} color="text-green-500" />
            <StatsCard title="Last 30 Days" value={stats.last30Days} icon={<FiCalendar />} color="text-blue-500" />
            <StatsCard title="Active Users" value={stats.activeUsers} icon={<FiClock />} color="text-purple-500" />
          </div>
        </div>

        {/* Users Table */}
        <div className="card bg-gray-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="bg-gray-800 text-gray-400">User ID</th>
                  <th className="bg-gray-800 text-gray-400">User</th>
                  <th className="bg-gray-800 text-gray-400 hidden sm:table-cell">Email</th>
                  <th className="bg-gray-800 text-gray-400 hidden md:table-cell">Phone</th>
                  <th className="bg-gray-800 text-gray-400">Joined</th>
                  <th className="bg-gray-800 text-gray-400">Status</th>
                  <th className="bg-gray-800 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="font-medium">#{user._id.slice(-6)}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <img src={user.profileImage || "https://via.placeholder.com/40"} alt={user.name} />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-400 sm:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">{user.email}</td>
                      <td className="hidden md:table-cell">{user.phone || "N/A"}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-1 sm:space-x-2">
                          <button
                            onClick={() => {
                              setViewUser(user);
                              document.getElementById("view_user_modal").showModal();
                            }}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-info hover:bg-info/20"
                            title="View"
                          >
                            <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditUser(user);
                              document.getElementById("edit_user_modal").showModal();
                            }}
                            className="btn btn-xs sm:btn-sm btn-ghost btn-square text-warning hover:bg-warning/20"
                            title="Edit"
                          >
                            <FiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
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
                    <td colSpan="7" className="text-center py-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {currentUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t border-gray-700 gap-3">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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

        {/* View User Modal */}
        <dialog id="view_user_modal" className="modal">
          <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            
            {viewUser && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full">
                        <img src={viewUser.profileImage || "https://via.placeholder.com/64"} alt={viewUser.name} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{viewUser.name}</h3>
                      <p className="text-gray-400">
                        Member since {new Date(viewUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    viewUser.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                  }`}>
                    {viewUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* User Information */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
                    <h4 className="font-semibold text-lg mb-2 sm:mb-3">User Information</h4>
                    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <p><span className="text-gray-400">User ID:</span> {viewUser._id}</p>
                      <p><span className="text-gray-400">Email:</span> {viewUser.email}</p>
                      <p><span className="text-gray-400">Phone:</span> {viewUser.phone || "N/A"}</p>
                        <p><span className="text-gray-400">Joined:</span> {new Date(viewUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Order Stats */}
                  <div className="card bg-gray-700/50 p-3 sm:p-4">
  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Order Statistics</h4>
  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm sm:text-base">
    <div className="bg-gray-600/30 p-2 rounded">
      <p className="text-gray-400">Total Orders</p>
      <p className="font-bold">{userOrders.length}</p>
    </div>
    <div className="bg-gray-600/30 p-2 rounded">
      <p className="text-gray-400">Completed</p>
      <p className="font-bold text-green-500">
        {userOrders.filter(o => o.status === "Completed").length}
      </p>
    </div>
    <div className="bg-gray-600/30 p-2 rounded">
      <p className="text-gray-400">Pending</p>
      <p className="font-bold text-yellow-500">
        {userOrders.filter(o => o.status === "Pending").length}
      </p>
    </div>
    <div className="bg-gray-600/30 p-2 rounded">
      <p className="text-gray-400">Cancelled</p>
      <p className="font-bold text-red-500">
        {userOrders.filter(o => o.status === "Cancelled").length}
      </p>
    </div>
  </div>
</div>


                  {/* Home Address */}
                  {viewUser.home_address && (
                    <div className="card bg-gray-700/50 p-3 sm:p-4">
                      <h4 className="font-semibold text-lg mb-2 sm:mb-3">Home Address</h4>
                      <AddressDisplay address={viewUser.home_address} />
                    </div>
                  )}

                  {/* Office Address */}
                  {viewUser.office_address && (
                    <div className="card bg-gray-700/50 p-3 sm:p-4">
                      <h4 className="font-semibold text-lg mb-2 sm:mb-3">Office Address</h4>
                      <AddressDisplay address={viewUser.office_address} />
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
             <div className="card bg-gray-700/50 p-3 sm:p-4">
  <h4 className="font-semibold text-lg mb-2 sm:mb-3">Recent Orders</h4>
  <div className="overflow-x-auto">
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {userOrders.slice(0, 5).map(order => (
          <tr key={order.order_id}>
            <td>{order.order_id}</td>
            <td>{new Date(order.order_date).toLocaleDateString()}</td>
            <td>
              <span
                className={`badge ${
                  order.status === "Completed"
                    ? "badge-success"
                    : order.status === "Pending"
                    ? "badge-warning"
                    : "badge-error"
                }`}
              >
                {order.status}
              </span>
            </td>
            <td>৳{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

              </div>
            )}
          </div>
        </dialog>

        {/* Edit User Modal */}
        <dialog id="edit_user_modal" className="modal">
          <div className="modal-box max-w-2xl bg-gray-800 border border-gray-700">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            
            {editUser && (
              <div>
                <h3 className="text-xl font-bold mb-4 sm:mb-6">Edit User #{editUser._id.slice(-6)}</h3>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setUpdating(true);
                  const token = localStorage.getItem("token");

                  try {
                    const updatedUser = {
                      name: e.target.name.value,
                      email: e.target.email.value,
                      phone: e.target.phone.value,
                      isActive: e.target.isActive.checked,
                    };

                    await axios.put(
                      `http://localhost:5001/api/admin/user/${editUser._id}`,
                      updatedUser,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    Swal.fire({
                      title: "Success!",
                      text: "User updated successfully",
                      icon: "success",
                      confirmButtonColor: "#4f46e5",
                    });
                    
                    fetchUsers();
                    document.getElementById("edit_user_modal").close();
                  } catch (error) {
                    Swal.fire({
                      title: "Error!",
                      text: "Failed to update user",
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
                        <span className="label-text text-gray-300">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editUser.name}
                        className="input input-bordered w-full bg-gray-700 border-gray-600"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editUser.email}
                        className="input input-bordered w-full bg-gray-700 border-gray-600"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300">Phone</span>
                      </label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={editUser.phone || ""}
                        className="input input-bordered w-full bg-gray-700 border-gray-600"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input 
                          type="checkbox" 
                          name="isActive"
                          defaultChecked={editUser.isActive}
                          className="checkbox checkbox-primary" 
                        />
                        <span className="label-text text-gray-300">Active User</span>
                      </label>
                    </div>

                    <div className="modal-action mt-4 sm:mt-6">
                      <button
                        type="submit"
                        className={`btn btn-primary ${updating ? 'loading' : ''}`}
                        disabled={updating}
                      >
                        {updating ? 'Updating...' : 'Update User'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => document.getElementById("edit_user_modal").close()}
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
const SidebarLink = ({ to, icon, text, onClick, active = false }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg ${
        isActive || active ? "bg-primary text-white" : "hover:bg-gray-700"
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {text}
  </NavLink>
);

// Reusable StatsCard component
const StatsCard = ({ title, value, icon, color = "" }) => (
  <div className="card bg-gray-800 shadow-sm">
    <div className="card-body p-2 sm:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-xs sm:text-sm">{title}</h3>
        <span className={`text-lg ${color}`}>{icon}</span>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

// Address display component
const AddressDisplay = ({ address }) => {
  let addressObj;
  try {
    addressObj = typeof address === 'string' ? JSON.parse(address) : address;
  } catch (e) {
    console.error("Address JSON parse error:", address);
    return <p className="text-red-400">Invalid address format</p>;
  }

  return (
    <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
      {addressObj.full_address && <p>{addressObj.full_address}</p>}
      <div className="grid grid-cols-2 gap-1">
        {addressObj.houseNo && <p><span className="text-gray-400">House:</span> {addressObj.houseNo}</p>}
        {addressObj.roadNo && <p><span className="text-gray-400">Road:</span> {addressObj.roadNo}</p>}
        {addressObj.area && <p><span className="text-gray-400">Area:</span> {addressObj.area}</p>}
        {addressObj.thana && <p><span className="text-gray-400">Thana:</span> {addressObj.thana}</p>}
        {addressObj.district && <p><span className="text-gray-400">District:</span> {addressObj.district}</p>}
        {addressObj.division && <p><span className="text-gray-400">Division:</span> {addressObj.division}</p>}
      </div>
    </div>
  );
};

export default UsersList;