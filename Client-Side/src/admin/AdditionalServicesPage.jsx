import React, { useEffect, useState } from 'react';
import api from '../api';
import Swal from 'sweetalert2';
import {
  FiCheck, FiX, FiEdit2, FiTrash2, FiRefreshCw,
  FiFilter, FiSearch, FiDollarSign, FiClock,
  FiCheckCircle, FiXCircle, FiPackage
} from 'react-icons/fi';

const AdditionalServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // ✅ Get all services (need to add this endpoint)
      const response = await api.get('/admin/additional-services');
      if (response.data.success) {
        setServices(response.data.services || []);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve Service
  const handleApprove = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: 'Approve Service?',
      text: `Approve "${serviceName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve!',
    });

    if (!result.isConfirmed) return;

    try {
      await api.patch(`/services/${serviceId}/approve`);
      Swal.fire({
        icon: 'success',
        title: 'Approved!',
        text: 'Service has been approved',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchServices();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to approve',
      });
    }
  };

  // ✅ Reject Service
  const handleReject = async (serviceId, serviceName) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Service',
      text: `Reject "${serviceName}"? Provide a reason:`,
      input: 'textarea',
      inputPlaceholder: 'Reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Reject',
      inputValidator: (value) => {
        if (!value) return 'Please provide a reason!';
      },
    });

    if (!reason) return;

    try {
      await api.patch(`/services/${serviceId}/reject`, { reason });
      Swal.fire({
        icon: 'success',
        title: 'Rejected',
        text: 'Service has been rejected',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchServices();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to reject',
      });
    }
  };

  // ✅ Edit Price
  const handleEditPrice = (service) => {
    setEditingId(service.id);
    setEditingPrice(service.price.toString());
  };

  const handleSavePrice = async (serviceId) => {
    const price = parseFloat(editingPrice);
    if (isNaN(price) || price < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Price',
        text: 'Please enter a valid price',
      });
      return;
    }

    try {
      await api.patch(`/services/${serviceId}/price`, { price });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Price updated to ৳${price}`,
        timer: 1500,
        showConfirmButton: false,
      });
      setEditingId(null);
      setEditingPrice('');
      fetchServices();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to update price',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingPrice('');
  };

  // ✅ Delete Service
  const handleDelete = async (serviceId, serviceName) => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      text: `Delete "${serviceName}"? This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/services/${serviceId}`);
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Service deleted successfully',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchServices();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete',
      });
    }
  };

  // ✅ Filter
  const filteredServices = services.filter((service) => {
    // Status filter
    if (filter !== 'all' && service.status !== filter) return false;

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      return (
        service.service_name?.toLowerCase().includes(s) ||
        service.order_id?.toLowerCase().includes(s) ||
        service.vendor_name?.toLowerCase().includes(s)
      );
    }

    return true;
  });

  // ✅ Stats
  const stats = {
    total: services.length,
    pending: services.filter((s) => s.status === 'pending').length,
    approved: services.filter((s) => s.status === 'approved').length,
    rejected: services.filter((s) => s.status === 'rejected').length,
    totalValue: services
      .filter((s) => s.status === 'approved')
      .reduce((sum, s) => sum + parseFloat(s.price) * (s.quantity || 1), 0)
      .toFixed(2),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheckCircle />;
      case 'pending':
        return <FiClock />;
      case 'rejected':
        return <FiXCircle />;
      default:
        return <FiPackage />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Additional Services</h1>
          <p className="text-gray-400 text-sm mt-1">
            Approve, edit, or reject vendor-added services
          </p>
        </div>
        <button
          onClick={fetchServices}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div
          onClick={() => setFilter('all')}
          className={`cursor-pointer bg-gray-800 p-4 rounded-xl border-2 transition ${
            filter === 'all' ? 'border-blue-500' : 'border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FiPackage className="text-blue-400" size={24} />
          </div>
        </div>

        <div
          onClick={() => setFilter('pending')}
          className={`cursor-pointer bg-yellow-500/10 p-4 rounded-xl border-2 transition ${
            filter === 'pending' ? 'border-yellow-500' : 'border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-xs">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <FiClock className="text-yellow-400" size={24} />
          </div>
        </div>

        <div
          onClick={() => setFilter('approved')}
          className={`cursor-pointer bg-green-500/10 p-4 rounded-xl border-2 transition ${
            filter === 'approved' ? 'border-green-500' : 'border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-xs">Approved</p>
              <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
            </div>
            <FiCheckCircle className="text-green-400" size={24} />
          </div>
        </div>

        <div
          onClick={() => setFilter('rejected')}
          className={`cursor-pointer bg-red-500/10 p-4 rounded-xl border-2 transition ${
            filter === 'rejected' ? 'border-red-500' : 'border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-xs">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <FiXCircle className="text-red-400" size={24} />
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total Value</p>
              <p className="text-xl font-bold text-green-400">৳{stats.totalValue}</p>
            </div>
            <FiDollarSign className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service name, order ID, or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage size={60} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No services found
            </h3>
            <p className="text-gray-400 text-sm">
              {search || filter !== 'all'
                ? 'Try changing your filters'
                : 'Services will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-700/30">
                    {/* Service Name */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{service.service_name}</p>
                        {service.service_description && (
                          <p className="text-xs text-gray-400 mt-1">
                            {service.service_description}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {service.quantity || 1}
                        </p>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono">
                        #{service.order_id?.replace('#', '') || 'N/A'}
                      </span>
                    </td>

                    {/* Vendor */}
                    <td className="px-4 py-3">
                      <p className="text-sm">
                        {service.vendor_name || `ID: ${service.vendor_id}`}
                      </p>
                    </td>

                    {/* Price - Edit inline */}
                    <td className="px-4 py-3">
                      {editingId === service.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-24 px-2 py-1 bg-gray-700 border border-blue-500 rounded text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(service.id)}
                            className="p-1 text-green-400 hover:bg-green-500/20 rounded"
                            title="Save"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                            title="Cancel"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-400">
                            ৳{service.price}
                          </span>
                          {service.status === 'pending' && (
                            <button
                              onClick={() => handleEditPrice(service)}
                              className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
                              title="Edit price"
                            >
                              <FiEdit2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusIcon(service.status)}
                        {service.status}
                      </span>
                      {service.rejection_reason && (
                        <p className="text-xs text-red-400 mt-1">
                          {service.rejection_reason}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {service.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(service.id, service.service_name)
                              }
                              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition"
                              title="Approve"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleReject(service.id, service.service_name)
                              }
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                              title="Reject"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            handleDelete(service.id, service.service_name)
                          }
                          className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalServicesPage;