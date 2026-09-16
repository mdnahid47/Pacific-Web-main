import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FiHome, FiUsers, FiShoppingBag, FiTruck, FiPieChart,
  FiLogOut, FiSettings, FiMenu, FiX, FiPackage,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign,
  FiCheck, FiRefreshCw
} from "react-icons/fi";
import Swal from "sweetalert2";

const MasterServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", category: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", price: "", category: "", description: "" });

  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const btn = document.querySelector('.hamburger-button');
        if (!btn || !btn.contains(event.target)) setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/master-services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setServices(res.data.services || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.price) {
      Swal.fire({ icon: "warning", title: "Name and price required" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await api.post("/master-services", addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Service added!", timer: 1500, showConfirmButton: false });
      setShowAddForm(false);
      setAddForm({ name: "", price: "", category: "", description: "" });
      fetchServices();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/master-services/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed" });
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: `Delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/master-services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
      fetchServices();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed" });
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?", icon: "question", showCancelButton: true, confirmButtonText: "Logout"
    });
    if (result.isConfirmed) {
      localStorage.clear();
      navigate("/");
    }
  };

  const filteredServices = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hamburger-button btn btn-sm btn-ghost text-white">
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold">Master Services</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full overflow-y-auto
               ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ top: "0", left: "0" }}
      >
        <div className="text-center py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Order Management</p>
        </div>
        <nav className="mt-4 space-y-1">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/master-services" icon={<FiPackage />} text="Master Services" onClick={() => setSidebarOpen(false)} active />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
            <p className="text-sm text-gray-300">Total Services</p>
            <p className="text-2xl font-bold text-blue-400">{services.length}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 bg-gray-900 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Master Services</h1>
            <p className="text-gray-400 text-sm mt-1">
              Services that vendors can add to orders
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchServices} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
              <FiRefreshCw /> Refresh
            </button>
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              <FiPlus /> Add Service
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-800 p-6 rounded-xl mb-6 border-2 border-blue-500/50">
            <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Service Name *"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white"
              />
              <input
                type="number"
                placeholder="Price (৳) *"
                value={addForm.price}
                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white"
              />
              <input
                type="text"
                placeholder="Category (optional)"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
                <FiCheck /> Save
              </button>
              <button onClick={() => { setShowAddForm(false); setAddForm({ name: "", price: "", category: "", description: "" }); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Service Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center text-gray-400">
                      <FiPackage size={60} className="mx-auto mb-4 text-gray-600" />
                      <p>No services yet. Click "Add Service" to create one.</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-700/30 transition">
                      <td className="px-4 py-3">
                        {editingId === service.id ? (
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="px-2 py-1 bg-gray-700 border border-blue-500 rounded text-white w-full"
                          />
                        ) : (
                          <div>
                            <p className="font-medium">{service.name}</p>
                            {service.description && (
                              <p className="text-xs text-gray-400 mt-1">{service.description}</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === service.id ? (
                          <input
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="px-2 py-1 bg-gray-700 border border-blue-500 rounded text-white w-full"
                          />
                        ) : (
                          <span className="text-sm text-gray-300">{service.category || "-"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === service.id ? (
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="px-2 py-1 bg-gray-700 border border-blue-500 rounded text-white w-24"
                          />
                        ) : (
                          <span className="font-bold text-green-400">৳{service.price}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {editingId === service.id ? (
                            <>
                              <button onClick={handleSaveEdit} className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg">
                                <FiCheck size={18} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                                <FiX size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(service.id);
                                  setEditForm({ name: service.name, price: service.price, category: service.category || "" });
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(service.id, service.name)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                                <FiTrash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
        isActive || active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`
    }
  >
    <span className="mr-3 text-lg">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

export default MasterServicesPage;