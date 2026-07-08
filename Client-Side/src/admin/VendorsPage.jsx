import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../api";
import Swal from "sweetalert2";
import {
  FiHome, FiUsers, FiShoppingBag, FiTruck,
  FiPieChart, FiLogOut, FiSettings, FiEdit,
  FiTrash2, FiEye, FiSearch, FiChevronLeft,
  FiChevronRight, FiMenu, FiX, FiUserPlus,
  FiCheckCircle, FiAlertCircle, FiDollarSign,
  FiUserCheck, FiUserX, FiClock, FiCalendar,
  FiMail, FiPhone, FiMapPin, FiStar,
  FiCheck, FiXCircle, FiPauseCircle,
  FiActivity, FiTool, FiPercent, FiUpload,
  FiPlus, FiDownload, FiFilter, FiRotateCw,
  FiExternalLink, FiCreditCard, FiShield,
  FiTrendingUp, FiTrendingDown, FiPackage,
  FiFile, FiFolder, FiImage
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

// ✅ API বেস URL
const API_BASE_URL = 'https://pacific-web-main-production.up.railway.app';

// ✅ URL নরমালাইজ ফাংশন
const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  if (url.startsWith('uploads/')) {
    return `${API_BASE_URL}/${url}`;
  }
  return `${API_BASE_URL}/uploads/${url}`;
};

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editVendor, setEditVendor] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const [vendorsPerPage, setVendorsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingVendors: 0,
    suspendedVendors: 0,
    rejectedVendors: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    canceledOrders: 0,
    totalTechnicians: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const statusColors = {
    active: "bg-green-500/20 text-green-500 border border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
    rejected: "bg-red-500/20 text-red-500 border border-red-500/30",
    suspended: "bg-orange-500/20 text-orange-500 border border-orange-500/30",
    verified: "bg-blue-500/20 text-blue-500 border border-blue-500/30"
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FiCheckCircle className="text-green-500" />;
      case 'pending': return <FiAlertCircle className="text-yellow-500" />;
      case 'rejected': return <FiXCircle className="text-red-500" />;
      case 'suspended': return <FiPauseCircle className="text-orange-500" />;
      case 'verified': return <FiShield className="text-blue-500" />;
      default: return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status", color: "text-gray-400" },
    { value: "active", label: "Active", color: "text-green-500" },
    { value: "pending", label: "Pending", color: "text-yellow-500" },
    { value: "suspended", label: "Suspended", color: "text-orange-500" },
    { value: "rejected", label: "Rejected", color: "text-red-500" },
    { value: "verified", label: "Verified", color: "text-blue-500" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "rating", label: "Highest Rating" },
    { value: "orders", label: "Most Orders" },
    { value: "revenue", label: "Highest Revenue" }
  ];

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

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      console.log("🚀 Fetching vendors data...");
      const res = await api.get("/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Vendors data received:", res.data);

      let vendorsData = [];
      if (res.data.success && res.data.vendors) {
        vendorsData = res.data.vendors;
      } else if (Array.isArray(res.data)) {
        vendorsData = res.data;
      } else if (res.data.vendors && Array.isArray(res.data.vendors)) {
        vendorsData = res.data.vendors;
      } else {
        vendorsData = [];
        console.warn("⚠️ Unexpected data format:", res.data);
      }

      if (vendorsData.length > 0) {
        console.log("🔍 Sample vendor data:", vendorsData[0]);
      }

      setVendors(vendorsData);
      calculateStats(vendorsData);

    } catch (err) {
      console.error("❌ Fetch vendors error:", err);
      setError(err.response?.data?.message || "Failed to fetch vendors. Please try again.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to load vendors',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (vendorsData) => {
    const statsData = {
      totalVendors: vendorsData.length,
      activeVendors: vendorsData.filter(v => v.status === 'active').length,
      pendingVendors: vendorsData.filter(v => v.status === 'pending').length,
      suspendedVendors: vendorsData.filter(v => v.status === 'suspended').length,
      rejectedVendors: vendorsData.filter(v => v.status === 'rejected').length,
      verifiedVendors: vendorsData.filter(v => v.is_verified).length,
      totalOrders: vendorsData.reduce((sum, v) => sum + (v.total_orders || 0), 0),
      completedOrders: vendorsData.reduce((sum, v) => sum + (v.completed_orders || 0), 0),
      pendingOrders: vendorsData.reduce((sum, v) => sum + (v.pending_orders || 0), 0),
      canceledOrders: vendorsData.reduce((sum, v) => sum + (v.canceled_orders || 0), 0),
      totalTechnicians: vendorsData.reduce((sum, v) => sum + (v.technician_quantity || 0), 0),
      totalRevenue: vendorsData.reduce((sum, v) => sum + (v.total_revenue || 0), 0),
      averageRating: calculateAverageRating(vendorsData)
    };

    setStats(statsData);
  };

  const calculateAverageRating = (vendorsData) => {
    const vendorsWithRating = vendorsData.filter(v => v.average_rating > 0);
    if (vendorsWithRating.length === 0) return 0;
    const totalRating = vendorsWithRating.reduce((sum, v) => sum + (v.average_rating || 0), 0);
    return (totalRating / vendorsWithRating.length).toFixed(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Vendor?",
      text: "This will permanently remove the vendor and all associated data. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      try {
        const response = await api.delete(`/admin/vendors/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.data.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Vendor has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          
          await fetchVendors();
        } else {
          throw new Error(response.data.message || "Failed to delete vendor");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || err.message || "Failed to delete vendor",
          icon: "error"
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    const statusLabels = {
      active: "Active",
      pending: "Pending",
      suspended: "Suspended",
      rejected: "Rejected",
      verified: "Verified"
    };

    const result = await Swal.fire({
      title: "Change Status",
      text: `Change vendor status to "${statusLabels[newStatus]}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await api.patch(
          `/admin/vendors/${vendorId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          title: "Success!",
          text: "Vendor status updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        fetchVendors();
      } catch (err) {
        console.error("Status change error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to update vendor status",
          icon: "error"
        });
      }
    }
  };

  const handleVerifyVendor = async (vendorId) => {
    const result = await Swal.fire({
      title: "Verify Vendor",
      text: "This will mark the vendor as verified. Verified vendors receive priority in search results.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Verify Vendor",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await api.patch(
          `/admin/vendors/${vendorId}/verify`,
          { is_verified: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          title: "Verified!",
          text: "Vendor has been verified successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });

        fetchVendors();
      } catch (err) {
        console.error("Verification error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to verify vendor",
          icon: "error"
        });
      }
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
    fetchVendors();
  }, [fetchVendors]);

  const filterAndSortVendors = () => {
    let filtered = vendors;

    if (filterStatus !== "all") {
      filtered = filtered.filter(vendor => vendor.status === filterStatus);
    }

    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter((vendor) => {
        return (
          (vendor.name?.toLowerCase() || "").includes(searchTerm) ||
          (vendor.email?.toLowerCase() || "").includes(searchTerm) ||
          (vendor.phone?.toString() || "").includes(search) ||
          (vendor.nid_number?.toString() || "").includes(search) ||
          (vendor.company_name?.toLowerCase() || "").includes(searchTerm) ||
          (vendor.service_areas?.some(area => area.toLowerCase().includes(searchTerm)) || false)
        );
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || b.join_date) - new Date(a.created_at || a.join_date);
        case "oldest":
          return new Date(a.created_at || a.join_date) - new Date(b.created_at || b.join_date);
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "rating":
          return (b.average_rating || 0) - (a.average_rating || 0);
        case "orders":
          return (b.total_orders || 0) - (a.total_orders || 0);
        case "revenue":
          return (b.total_revenue || 0) - (a.total_revenue || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredVendors = filterAndSortVendors();
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage) || 1;

  const exportVendorsData = () => {
    const dataToExport = filteredVendors.map(vendor => ({
      ID: vendor.id,
      Name: vendor.name,
      Email: vendor.email,
      Phone: vendor.phone,
      Status: vendor.status,
      'Total Orders': vendor.total_orders || 0,
      'Completed Orders': vendor.completed_orders || 0,
      'Pending Orders': vendor.pending_orders || 0,
      Rating: vendor.average_rating || 'N/A',
      'Join Date': new Date(vendor.created_at || vendor.join_date).toLocaleDateString(),
      'Technicians': vendor.technician_quantity || 0
    }));

    const headers = Object.keys(dataToExport[0] || {});
    const csv = [
      headers.join(','),
      ...dataToExport.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    Swal.fire({
      title: "Exported!",
      text: `Exported ${dataToExport.length} vendors to CSV`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Loading vendors data...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch vendor information</p>
      </div>
    );
  }

  if (error && vendors.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
        <div className="alert alert-error shadow-lg max-w-2xl">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="font-bold">Error Loading Vendors</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchVendors}
              className="btn btn-sm btn-outline"
            >
              <FiRotateCw className="mr-2" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hamburger-button btn btn-sm btn-ghost"
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold">Vendor Management</h1>
        <div className="w-10"></div>
      </div>

      <div
        ref={sidebarRef}
        className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ top: '0', left: '0' }}
      >
        <div className="text-center py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Vendor Management</p>
        </div>
        <nav className="mt-4 space-y-2">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/vendors" icon={<FiUsers />} text="Vendor List" onClick={() => setSidebarOpen(false)} active />
          <SidebarLink to="/admin/users" icon={<FiTruck />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/services" icon={<FiPackage />} text="Service Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
            <p className="text-sm text-gray-300">Total Vendors</p>
            <p className="text-2xl font-bold">{stats.totalVendors}</p>
            <p className="text-xs text-gray-400 mt-1">{stats.activeVendors} active</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="flex-1 p-4 lg:p-6 lg:ml-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Vendor Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage all vendors, view statistics, and monitor performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-primary gap-2">
              <FiUsers /> Total: {vendors.length}
            </div>
            <button
              onClick={exportVendorsData}
              className="btn btn-outline btn-sm"
            >
              <FiDownload className="mr-2" /> Export
            </button>
            <button
              onClick={() => fetchVendors()}
              className="btn btn-outline btn-sm"
            >
              <FiRotateCw className="mr-2" /> Refresh
            </button>
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="btn btn-primary btn-sm"
            >
              <FiUserPlus className="mr-2" /> Add Vendor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          <StatsCard
            title="Total Vendors"
            value={stats.totalVendors}
            icon={<FiUsers />}
            trend={stats.totalVendors > 0 ? "+12%" : "0%"}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          <StatsCard
            title="Active"
            value={stats.activeVendors}
            icon={<FiUserCheck />}
            trend={`${((stats.activeVendors / stats.totalVendors) * 100 || 0).toFixed(0)}%`}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingVendors}
            icon={<FiAlertCircle />}
            trend={stats.pendingVendors > 0 ? "Needs attention" : "All clear"}
            color="text-yellow-500"
            bgColor="bg-yellow-500/10"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<FiShoppingBag />}
            trend="+24%"
            color="text-purple-500"
            bgColor="bg-purple-500/10"
          />
          <StatsCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<FiDollarSign />}
            trend="+18%"
            color="text-emerald-500"
            bgColor="bg-emerald-500/10"
          />
          <StatsCard
            title="Avg Rating"
            value={stats.averageRating}
            icon={<FiStar />}
            trend="4.2/5"
            color="text-amber-500"
            bgColor="bg-amber-500/10"
          />
        </div>

        <div className="card bg-gray-800 shadow-lg mb-6">
          <div className="card-body p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search vendors by name, email, phone, NID, company, or service area..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-outline btn-sm">
                    <FiFilter className="mr-2" /> Status: {statusOptions.find(s => s.value === filterStatus)?.label}
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
                    {statusOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={() => {
                            setFilterStatus(option.value);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center gap-2 ${option.color} ${filterStatus === option.value ? 'bg-gray-700' : ''}`}
                        >
                          <span className="text-xs">{option.label}</span>
                          {filterStatus === option.value && <FiCheck className="ml-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-outline btn-sm">
                    <FiTrendingUp className="mr-2" /> Sort: {sortOptions.find(s => s.value === sortBy)?.label}
                  </button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
                    {sortOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={() => {
                            setSortBy(option.value);
                            setCurrentPage(1);
                          }}
                          className={`${sortBy === option.value ? 'bg-gray-700' : ''}`}
                        >
                          {option.label}
                          {sortBy === option.value && <FiCheck className="ml-auto" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
              <div className="text-sm text-gray-400">
                Showing {filteredVendors.length} of {vendors.length} vendors
                {filterStatus !== 'all' && ` (Filtered by: ${statusOptions.find(s => s.value === filterStatus)?.label})`}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Items per page:</span>
                <select
                  className="select select-sm select-bordered bg-gray-700"
                  value={vendorsPerPage}
                  onChange={(e) => {
                    setVendorsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gray-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/50">
                  <th className="text-gray-400 font-medium">Vendor Info</th>
                  <th className="text-gray-400 font-medium hidden lg:table-cell">Contact & Details</th>
                  <th className="text-gray-400 font-medium">Status & Rating</th>
                  <th className="text-gray-400 font-medium hidden md:table-cell">Orders</th>
                  <th className="text-gray-400 font-medium hidden sm:table-cell">Performance</th>
                  <th className="text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVendors.length > 0 ? (
                  currentVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors group">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-gray-700 group-hover:border-primary/30 transition-colors">
                              {vendor.profile_image || vendor.photo ? (
                                <img
                                  src={normalizeUrl(vendor.profile_image || vendor.photo)}
                                  alt={vendor.name}
                                  className="rounded-full w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span className="text-lg font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-lg font-bold">{vendor.name?.charAt(0)?.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate max-w-[180px]">{vendor.name}</p>
                              {vendor.is_verified && (
                                <span className="badge badge-xs badge-info" title="Verified Vendor">
                                  <FiShield size={10} />
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">ID: {vendor.id}</p>
                            {vendor.company_name && (
                              <p className="text-xs text-gray-400 truncate max-w-[180px]" title={vendor.company_name}>
                                🏢 {vendor.company_name}
                              </p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <FiCalendar size={12} className="text-gray-500" />
                              <span className="text-xs text-gray-500">
                                Joined: {new Date(vendor.created_at || vendor.join_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FiMail className="text-gray-400 text-sm" />
                            <span className="text-sm truncate max-w-[200px]" title={vendor.email}>
                              {vendor.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-gray-400 text-sm" />
                            <span className="text-sm">{vendor.phone}</span>
                          </div>
                          {vendor.service_areas && Array.isArray(vendor.service_areas) && vendor.service_areas.length > 0 && (
                            <div className="flex items-start gap-2">
                              <FiMapPin className="text-gray-400 text-sm mt-1" />
                              <div>
                                <span className="text-xs text-gray-400">Service Areas:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {vendor.service_areas.slice(0, 2).map((area, idx) => (
                                    <span key={idx} className="badge badge-xs badge-outline">
                                      {area.split(',')[0]}
                                    </span>
                                  ))}
                                  {vendor.service_areas.length > 2 && (
                                    <span className="badge badge-xs">+{vendor.service_areas.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(vendor.status)}
                            <div className="flex flex-col">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vendor.status] || 'bg-gray-500/20 text-gray-500'}`}>
                                {vendor.status?.toUpperCase()}
                              </span>
                              {vendor.is_verified && vendor.status === 'active' && (
                                <span className="text-xs text-blue-400 mt-1">✓ Verified</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiStar className="text-amber-500 text-sm" />
                            <span className="text-sm font-medium">{vendor.average_rating || "N/A"}</span>
                            <span className="text-xs text-gray-400">({vendor.total_reviews || 0} reviews)</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Total:</span>
                            <span className="font-medium">{vendor.total_orders || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-400">Completed:</span>
                            <span>{vendor.completed_orders || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-yellow-400">Pending:</span>
                            <span>{vendor.pending_orders || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-red-400">Canceled:</span>
                            <span>{vendor.canceled_orders || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Success Rate:</span>
                            <span className="font-medium">
                              {vendor.completed_orders && vendor.total_orders ?
                                Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Technicians:</span>
                            <div className="flex items-center gap-1">
                              <FiTool className="text-purple-500 text-sm" />
                              <span className="font-medium">{vendor.technician_quantity || 0}</span>
                            </div>
                          </div>
                          {vendor.total_revenue && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Revenue:</span>
                              <span className="font-medium text-emerald-500">
                                ${(vendor.total_revenue || 0).toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Response Time:</span>
                            <span className="font-medium">{vendor.avg_response_time || "N/A"} mins</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => {
                              setViewVendor(vendor);
                              document.getElementById("view_vendor_modal").showModal();
                            }}
                            className="btn btn-xs btn-ghost btn-square text-info hover:bg-info/20 tooltip"
                            data-tip="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditVendor(vendor);
                            }}
                            className="btn btn-xs btn-ghost btn-square text-warning hover:bg-warning/20 tooltip"
                            data-tip="Edit Vendor"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>

                          <div className="dropdown dropdown-end">
                            <button tabIndex={0} className="btn btn-xs btn-ghost btn-square text-primary hover:bg-primary/20 tooltip" data-tip="Change Status">
                              <FiActivity className="w-4 h-4" />
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-40">
                              <li className="menu-title text-xs text-gray-400 mb-1">Change Status</li>
                              <li>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'active')}
                                  className="text-green-500 hover:bg-green-500/10"
                                >
                                  <FiCheckCircle /> Active
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'pending')}
                                  className="text-yellow-500 hover:bg-yellow-500/10"
                                >
                                  <FiAlertCircle /> Pending
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'suspended')}
                                  className="text-orange-500 hover:bg-orange-500/10"
                                >
                                  <FiPauseCircle /> Suspend
                                </button>
                              </li>
                              <li>
                                <button
                                  onClick={() => handleStatusChange(vendor.id, 'rejected')}
                                  className="text-red-500 hover:bg-red-500/10"
                                >
                                  <FiXCircle /> Reject
                                </button>
                              </li>
                              <div className="divider my-1"></div>
                              <li>
                                <button
                                  onClick={() => handleVerifyVendor(vendor.id)}
                                  className="text-blue-500 hover:bg-blue-500/10"
                                  disabled={vendor.is_verified}
                                >
                                  <FiShield /> {vendor.is_verified ? 'Verified' : 'Verify'}
                                </button>
                              </li>
                            </ul>
                          </div>

                          <button
                            onClick={() => handleDelete(vendor.id)}
                            disabled={deletingId === vendor.id}
                            className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/20 tooltip"
                            data-tip="Delete Vendor"
                          >
                            {deletingId === vendor.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <FiTrash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <FiUserX className="text-4xl text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No vendors found</h3>
                        <p className="text-gray-400 mb-4">
                          {search || filterStatus !== 'all'
                            ? 'Try changing your search or filter criteria'
                            : 'No vendors have been registered yet'}
                        </p>
                        <button
                          onClick={() => {
                            setSearch('');
                            setFilterStatus('all');
                            setSortBy('newest');
                          }}
                          className="btn btn-sm btn-outline"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {currentVendors.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-700 gap-4">
              <div className="text-sm text-gray-400">
                Showing {indexOfFirstVendor + 1} to {Math.min(indexOfLastVendor, filteredVendors.length)} of {filteredVendors.length} vendors
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

        <dialog id="view_vendor_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-6xl w-[98vw] sm:w-[95vw] md:w-[90vw] lg:w-full max-h-[95vh] sm:max-h-[92vh] md:max-h-[90vh] bg-gray-800 border border-gray-700 overflow-y-auto p-3 sm:p-4 md:p-6 m-0 sm:m-2 md:m-4">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-4 top-2 sm:top-4 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>

            {viewVendor && (
              <FullyResponsiveVendorDetails
                vendor={viewVendor}
                onStatusChange={handleStatusChange}
                onVerify={handleVerifyVendor}
                onDelete={handleDelete}
                statusColors={statusColors}
                getStatusIcon={getStatusIcon}
              />
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {showAddVendorModal && (
          <AddVendorModal
            onClose={() => setShowAddVendorModal(false)}
            onSuccess={() => {
              setShowAddVendorModal(false);
              fetchVendors();
            }}
          />
        )}
      </main>
    </div>
  );
};

// ============================================
// Fully Responsive Vendor Details Component
// ============================================
const FullyResponsiveVendorDetails = ({
  vendor,
  onStatusChange,
  onVerify,
  onDelete,
  statusColors,
  getStatusIcon
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState([]);

  // ✅ সরাসরি নতুন ট্যাবে ডকুমেন্ট ওপেন করুন
  const viewDocument = (url) => {
    if (!url) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Document URL is not available',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const fullUrl = normalizeUrl(url);
    console.log("📄 Opening document:", fullUrl);
    
    if (!fullUrl) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid document URL',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // ✅ নতুন ট্যাবে ওপেন করুন
    window.open(fullUrl, '_blank');
  };

  useEffect(() => {
    const docs = [];
    
    if (vendor.profile_image || vendor.photo) {
      docs.push({
        type: 'image',
        label: 'Profile Image',
        url: vendor.profile_image || vendor.photo,
        icon: <FiImage className="text-blue-400 text-base sm:text-lg" />
      });
    }
    
    if (vendor.nid_front) {
      docs.push({
        type: 'image',
        label: 'NID - Front',
        url: vendor.nid_front,
        icon: <FiCreditCard className="text-purple-400 text-base sm:text-lg" />
      });
    }
    
    if (vendor.nid_back) {
      docs.push({
        type: 'image',
        label: 'NID - Back',
        url: vendor.nid_back,
        icon: <FiCreditCard className="text-purple-400 text-base sm:text-lg" />
      });
    }
    
    if (vendor.trade_license) {
      docs.push({
        type: 'document',
        label: 'Trade License',
        url: vendor.trade_license,
        icon: <FiFile className="text-amber-400 text-base sm:text-lg" />
      });
    }
    
    if (vendor.cv) {
      docs.push({
        type: 'document',
        label: 'CV / Resume',
        url: vendor.cv,
        icon: <FiFile className="text-cyan-400 text-base sm:text-lg" />
      });
    }
    
    setDocuments(docs);
  }, [vendor]);

  const formatServiceAreas = (areas) => {
    if (!areas) return [];
    if (Array.isArray(areas)) return areas;
    try {
      if (typeof areas === 'string') {
        if (areas.startsWith('[')) {
          return JSON.parse(areas);
        }
        return areas.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    } catch (e) {
      return typeof areas === 'string' ? [areas] : [];
    }
  };

  const formatServices = (services) => {
    if (!services) return [];
    if (Array.isArray(services)) return services;
    try {
      if (typeof services === 'string') {
        if (services.startsWith('[')) {
          return JSON.parse(services);
        }
        return services.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    } catch (e) {
      return typeof services === 'string' ? [services] : [];
    }
  };

  const serviceLabels = {
    'ac_service': 'AC Service ❄️',
    'fridge_service': 'Fridge Service 🧊',
    'tv_service': 'TV Service 📺',
    'oven_service': 'Oven Service 🔥',
    'washing_machine': 'Washing Machine 🧺',
    'hvac_vrf': 'HVAC/VRF 🌡️',
    'geyser': 'Geyser ♨️',
    'water_purifier': 'Water Purifier 💧',
    'electrical': 'Electrical ⚡',
    'plumbing': 'Plumbing 🔧',
    'carpentry': 'Carpentry 🪚',
    'painting': 'Painting 🎨'
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiActivity className="text-xs sm:text-sm" /> },
    { id: "details", label: "Details", icon: <FiUserCheck className="text-xs sm:text-sm" /> },
    { id: "services", label: "Services", icon: <FiTool className="text-xs sm:text-sm" /> },
    { id: "orders", label: "Orders", icon: <FiShoppingBag className="text-xs sm:text-sm" /> },
    { id: "documents", label: `Docs (${documents.length})`, icon: <FiFolder className="text-xs sm:text-sm" /> }
  ];

  const hasDocuments = documents.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Vendor Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-6 items-start xs:items-center pb-4 sm:pb-6 border-b border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto">
          <div className="avatar flex-shrink-0">
            <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-gray-700">
              {vendor.profile_image || vendor.photo ? (
                <img
                  src={normalizeUrl(vendor.profile_image || vendor.photo)}
                  alt={vendor.name}
                  className="rounded-full w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span className="text-xl xs:text-2xl sm:text-3xl font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
                  }}
                />
              ) : (
                <span className="text-xl xs:text-2xl sm:text-3xl font-bold">{vendor.name?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold truncate max-w-[180px] xs:max-w-[200px] sm:max-w-[300px]">
                {vendor.name}
              </h3>
              {vendor.is_verified && (
                <span className="badge badge-info gap-1 flex-shrink-0 text-xs">
                  <FiShield size={12} /> Verified
                </span>
              )}
            </div>
            <p className="text-xs xs:text-sm text-gray-400">Vendor ID: {vendor.id}</p>
            <p className="text-xs xs:text-sm text-gray-400 truncate">{vendor.company_name || "Individual Vendor"}</p>
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs font-medium flex items-center gap-0.5 sm:gap-1 ${statusColors[vendor.status]}`}>
                {getStatusIcon(vendor.status)}
                {vendor.status?.toUpperCase()}
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-gray-700 text-gray-300">
                Joined: {new Date(vendor.created_at || vendor.join_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full xs:w-auto justify-start xs:justify-end mt-2 xs:mt-0">
          <button
            onClick={() => onVerify?.(vendor.id)}
            className={`btn btn-xs xs:btn-sm ${vendor.is_verified ? 'btn-disabled opacity-50' : 'btn-info'} flex-1 xs:flex-none min-w-[60px]`}
            disabled={vendor.is_verified}
          >
            <FiShield className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">{vendor.is_verified ? 'Verified' : 'Verify'}</span>
            <span className="xs:hidden">{vendor.is_verified ? '✓' : '✔'}</span>
          </button>
          <button
            onClick={() => onStatusChange?.(vendor.id, 'active')}
            className={`btn btn-xs xs:btn-sm ${vendor.status === 'active' ? 'btn-disabled opacity-50' : 'btn-success'} flex-1 xs:flex-none min-w-[60px]`}
            disabled={vendor.status === 'active'}
          >
            <FiCheckCircle className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">Activate</span>
            <span className="xs:hidden">▶</span>
          </button>
          <button
            onClick={() => onDelete?.(vendor.id)}
            className="btn btn-xs xs:btn-sm btn-error flex-1 xs:flex-none min-w-[60px]"
          >
            <FiTrash2 className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">Delete</span>
            <span className="xs:hidden">✕</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-gray-700/50 p-1 overflow-x-auto flex-nowrap gap-0.5 sm:gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active bg-gray-800' : ''} flex items-center gap-0.5 sm:gap-1.5 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm px-1.5 xs:px-2 sm:px-3 md:px-4 py-1 xs:py-1.5 flex-shrink-0`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="hidden 2xs:inline">{tab.label}</span>
            <span className="2xs:hidden">{tab.id.charAt(0).toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Tab Content - সংক্ষিপ্ত করা হয়েছে */}
      <div className="mt-3 sm:mt-4 md:mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <FiMail className="text-xs sm:text-sm" /> Contact Info
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg">
                    <FiMail className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs text-gray-400">Email</p>
                    <p className="font-medium text-xs xs:text-sm break-all">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg">
                    <FiPhone className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs text-gray-400">Phone</p>
                    <p className="font-medium text-xs xs:text-sm">{vendor.phone}</p>
                  </div>
                </div>
                {vendor.nid_number && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg">
                      <FiCreditCard className="text-gray-400 text-xs sm:text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] xs:text-xs text-gray-400">NID Number</p>
                      <p className="font-medium text-xs xs:text-sm">{vendor.nid_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <FiTrendingUp className="text-xs sm:text-sm" /> Business Stats
              </h4>
              <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-400">Total Orders</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">{vendor.total_orders || 0}</p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-green-400">Completed</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-green-500">{vendor.completed_orders || 0}</p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-yellow-400">Pending</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-yellow-500">{vendor.pending_orders || 0}</p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-red-400">Cancelled</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-red-500">{vendor.canceled_orders || 0}</p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Success Rate:</span>
                  <span className="font-bold text-xs xs:text-sm sm:text-base">
                    {vendor.completed_orders && vendor.total_orders ?
                      Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Average Rating:</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <FiStar className="text-yellow-500 text-xs sm:text-sm" />
                    <span className="font-bold text-xs xs:text-sm sm:text-base">{vendor.average_rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4 col-span-1 2xs:col-span-2 lg:col-span-1">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <FiTool className="text-xs sm:text-sm" /> Service Info
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs xs:text-sm text-gray-400">Technicians:</span>
                  <span className="font-bold flex items-center gap-1 text-xs xs:text-sm">
                    <FiTool className="text-purple-500" />
                    {vendor.technician_quantity || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs xs:text-sm text-gray-400">Response Time:</span>
                  <span className="font-bold text-xs xs:text-sm">{vendor.avg_response_time || "N/A"} mins</span>
                </div>
                {vendor.total_revenue && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Total Revenue:</span>
                    <span className="font-bold text-emerald-500 text-xs xs:text-sm">
                      ${(vendor.total_revenue || 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Service Areas:</p>
                  <div className="flex flex-wrap gap-0.5 sm:gap-1">
                    {formatServiceAreas(vendor.service_areas).slice(0, 3).map((area, idx) => (
                      <span key={idx} className="badge badge-outline text-[8px] xs:text-[10px] sm:text-xs">
                        {area.length > 15 ? area.substring(0, 15) + '...' : area}
                      </span>
                    ))}
                    {formatServiceAreas(vendor.service_areas).length > 3 && (
                      <span className="badge text-[8px] xs:text-[10px] sm:text-xs">
                        +{formatServiceAreas(vendor.service_areas).length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Personal Information</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Full Name</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Date of Birth</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base">
                      {vendor.dob ? new Date(vendor.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">NID Number</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base">{vendor.nid_number || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Address Information</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Permanent Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.permanent_address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Present Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.present_address || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Business Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.business_address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Company Information</h4>
              <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Company Name</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.company_name || "Individual/Not registered"}</p>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Technicians</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base">{vendor.technician_quantity || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Services Offered</h4>
              <div className="grid grid-cols-1 2xs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3">
                {formatServices(vendor.services).map((service, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl flex-shrink-0">
                      {serviceLabels[service]?.split(' ').pop() || '🔧'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate">{serviceLabels[service]?.split(' ').slice(0, -1).join(' ') || service}</p>
                      <p className="text-[8px] xs:text-[10px] text-gray-400">Service</p>
                    </div>
                  </div>
                ))}
              </div>
              {formatServices(vendor.services).length === 0 && (
                <p className="text-center text-gray-400 py-3 sm:py-4 text-xs sm:text-sm">No services listed</p>
              )}
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Service Areas</h4>
              <div className="flex flex-wrap gap-1.5 xs:gap-2">
                {formatServiceAreas(vendor.service_areas).map((area, idx) => (
                  <div key={idx} className="flex items-center gap-1 xs:gap-2 p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                    <FiMapPin className="text-gray-400 text-xs xs:text-sm flex-shrink-0" />
                    <p className="font-medium text-[10px] xs:text-xs sm:text-sm break-words">{area}</p>
                  </div>
                ))}
                {formatServiceAreas(vendor.service_areas).length === 0 && (
                  <p className="text-center text-gray-400 py-3 sm:py-4 w-full text-xs sm:text-sm">No service areas specified</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Order Statistics</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Total Orders</span>
                    <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">{vendor.total_orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Success Rate</span>
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-green-500">
                      {vendor.completed_orders && vendor.total_orders ?
                        Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Avg Order Value</span>
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-bold">
                      ${((vendor.total_revenue || 0) / (vendor.total_orders || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Order Status</h4>
                <div className="grid grid-cols-2 gap-1 xs:gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-green-400">Completed</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.completed_orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-yellow-400">Pending</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.pending_orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-red-400">Cancelled</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.canceled_orders || 0}</span>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4 col-span-1 2xs:col-span-2 lg:col-span-1">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Performance Metrics</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Response Time</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.avg_response_time || "N/A"} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Customer Rating</span>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <FiStar className="text-yellow-500 text-xs sm:text-sm" />
                      <span className="font-medium text-xs xs:text-sm">{vendor.average_rating || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">Revenue Overview</h4>
              <div className="grid grid-cols-1 2xs:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3">
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Total Revenue</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-emerald-500">
                    ${(vendor.total_revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">This Month</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    ${(vendor.monthly_revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Last Month</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    ${(vendor.last_month_revenue || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiCreditCard className="text-purple-400 text-xs sm:text-sm" /> Identity Documents
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {vendor.nid_front && (
                    <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          <FiCreditCard className="text-purple-400 text-xs sm:text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">NID Front</p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">Identity</p>
                        </div>
                      </div>
                      <button
                        onClick={() => viewDocument(vendor.nid_front)}
                        className="btn btn-xs btn-primary flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiEye className="text-[10px] xs:text-xs mr-1" /> View
                      </button>
                    </div>
                  )}
                  {vendor.nid_back && (
                    <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          <FiCreditCard className="text-purple-400 text-xs sm:text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">NID Back</p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">Identity</p>
                        </div>
                      </div>
                      <button
                        onClick={() => viewDocument(vendor.nid_back)}
                        className="btn btn-xs btn-primary flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiEye className="text-[10px] xs:text-xs mr-1" /> View
                      </button>
                    </div>
                  )}
                  {!vendor.nid_front && !vendor.nid_back && (
                    <div className="text-center text-gray-400 py-2 xs:py-3 sm:py-4">
                      <p className="text-[10px] xs:text-xs sm:text-sm">No identity documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiFolder className="text-amber-400 text-xs sm:text-sm" /> Business Documents
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {vendor.trade_license && (
                    <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          <FiFile className="text-amber-400 text-xs sm:text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">Trade License</p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">Business Reg.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => viewDocument(vendor.trade_license)}
                        className="btn btn-xs btn-primary flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiEye className="text-[10px] xs:text-xs mr-1" /> View
                      </button>
                    </div>
                  )}
                  {vendor.cv && (
                    <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          <FiFile className="text-cyan-400 text-xs sm:text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">CV/Resume</p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">Professional</p>
                        </div>
                      </div>
                      <button
                        onClick={() => viewDocument(vendor.cv)}
                        className="btn btn-xs btn-primary flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiEye className="text-[10px] xs:text-xs mr-1" /> View
                      </button>
                    </div>
                  )}
                  {!vendor.trade_license && !vendor.cv && (
                    <div className="text-center text-gray-400 py-2 xs:py-3 sm:py-4">
                      <p className="text-[10px] xs:text-xs sm:text-sm">No business documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(vendor.profile_image || vendor.photo) && (
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiImage className="text-blue-400 text-xs sm:text-sm" /> Profile Image
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div className="relative group">
                    <img
                      src={normalizeUrl(vendor.profile_image || vendor.photo)}
                      alt="Profile"
                      className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg border-2 border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => viewDocument(vendor.profile_image || vendor.photo)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <FiExternalLink className="text-white text-base xs:text-lg sm:text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasDocuments && (
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiFile className="text-gray-400 text-xs sm:text-sm" /> All Documents ({documents.length})
                </h4>
                <div className="grid grid-cols-1 2xs:grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          {doc.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[70px] xs:max-w-[90px] sm:max-w-[150px]">{doc.label}</p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">Click to view</p>
                        </div>
                      </div>
                      <button
                        onClick={() => viewDocument(doc.url)}
                        className="btn btn-xs btn-primary flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiEye className="text-[10px] xs:text-xs mr-1" /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!hasDocuments && !vendor.nid_front && !vendor.nid_back && 
             !vendor.trade_license && !vendor.cv && !vendor.profile_image && 
             !vendor.photo && (
              <div className="card bg-gray-700/30 p-6 text-center">
                <FiFile className="text-5xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No Documents Available</h3>
                <p className="text-gray-400 text-sm">
                  This vendor hasn't uploaded any documents yet.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="badge badge-outline">📁 NID Required</span>
                  <span className="badge badge-outline">📄 Trade License Required</span>
                  <span className="badge badge-outline">📋 CV Required</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-end pt-3 sm:pt-4 md:pt-6 border-t border-gray-700">
        <button
          onClick={() => onStatusChange?.(vendor.id, 'suspended')}
          className="btn btn-xs xs:btn-sm sm:btn-md btn-warning flex-1 xs:flex-none"
        >
          <FiPauseCircle className="text-xs xs:text-sm" /> 
          <span className="hidden 2xs:inline">Suspend</span>
          <span className="2xs:hidden">⏸</span>
        </button>
        <button
          onClick={() => onStatusChange?.(vendor.id, 'rejected')}
          className="btn btn-xs xs:btn-sm sm:btn-md btn-error flex-1 xs:flex-none"
        >
          <FiXCircle className="text-xs xs:text-sm" /> 
          <span className="hidden 2xs:inline">Reject</span>
          <span className="2xs:hidden">✕</span>
        </button>
        <button
          onClick={() => {}}
          className="btn btn-xs xs:btn-sm sm:btn-md btn-primary flex-1 xs:flex-none"
        >
          <FiShoppingBag className="text-xs xs:text-sm" /> 
          <span className="hidden 2xs:inline">View Orders</span>
          <span className="2xs:hidden">📦</span>
        </button>
      </div>
    </div>
  );
};

// ============================================
// SidebarLink Component
// ============================================
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

// ============================================
// StatsCard Component
// ============================================
const StatsCard = ({ title, value, icon, trend, color = "text-white", bgColor = "bg-gray-800" }) => (
  <div className={`card ${bgColor} shadow-lg hover:shadow-xl transition-shadow`}>
    <div className="card-body p-2 xs:p-3 sm:p-4">
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <h3 className="text-gray-400 text-[10px] xs:text-xs sm:text-sm font-medium truncate">{title}</h3>
          <p className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold mt-0.5 xs:mt-1 sm:mt-2 ${color} truncate`}>{value}</p>
        </div>
        <div className={`p-1.5 xs:p-2 sm:p-3 rounded-full ${color.replace('text-', 'bg-')}/10 flex-shrink-0 ml-1 xs:ml-2`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-0.5 xs:gap-1 mt-1 xs:mt-1.5 sm:mt-2">
          {trend.includes('+') ? (
            <FiTrendingUp className="text-green-500 text-[10px] xs:text-xs sm:text-sm" />
          ) : trend.includes('-') ? (
            <FiTrendingDown className="text-red-500 text-[10px] xs:text-xs sm:text-sm" />
          ) : null}
          <span className={`text-[8px] xs:text-[10px] sm:text-xs ${trend.includes('+') ? 'text-green-500' : trend.includes('-') ? 'text-red-500' : 'text-gray-400'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============================================
// AddVendorModal Component
// ============================================
const AddVendorModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    company_name: '',
    status: 'pending',
    service_areas: [],
    technician_quantity: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      await api.post("/admin/vendors", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      Swal.fire({
        title: "Success!",
        text: "Vendor added successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
      onSuccess();
    } catch (err) {
      console.error("Add vendor error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to add vendor",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl w-[95vw] sm:w-full bg-gray-800 border border-gray-700">
        <h3 className="font-bold text-base xs:text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
          <FiUserPlus /> Add New Vendor
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Full Name *</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Email *</label>
              <input
                type="email"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Phone *</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Password *</label>
              <input
                type="password"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Company Name</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Status</label>
              <select
                className="select select-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end mt-4 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm xs:btn-md flex-1 2xs:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm xs:btn-md flex-1 2xs:flex-none"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default VendorsList;