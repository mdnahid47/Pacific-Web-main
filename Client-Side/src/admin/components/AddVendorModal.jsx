import React, { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import api from '../../api';
import Swal from 'sweetalert2';

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

    try {
      await api.post('/admin/vendors', formData);
      Swal.fire({
        title: 'Success!',
        text: 'Vendor added successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      onSuccess();
    } catch (err) {
      console.error('Add vendor error:', err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to add vendor',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl w-[95vw] sm:w-full bg-gray-800 border border-gray-700">
        <h3 className="font-bold text-base xs:text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2 text-white">
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Email *</label>
              <input
                type="email"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Phone *</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Password *</label>
              <input
                type="password"
                className="input input-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label label-text text-gray-400 text-xs xs:text-sm">Status</label>
              <select
                className="select select-bordered w-full bg-gray-700 text-sm xs:text-base"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

export default AddVendorModal;