import React, { useState, useEffect } from 'react';
import {
  FiX, FiShield, FiCheckCircle, FiTrash2, FiMail, FiPhone,
  FiCreditCard, FiTrendingUp, FiTool, FiStar, FiMapPin,
  FiActivity, FiUserCheck, FiShoppingBag, FiFolder,
  FiFile, FiImage, FiExternalLink, FiEye, FiPauseCircle,
  FiXCircle, FiUserX
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { normalizeUrl } from '../../utils/formatters';

const VendorDetailsModal = ({
  vendor,
  onStatusChange,
  onVerify,
  onDelete,
  statusColors,
  getStatusIcon
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);

  // ✅ Open document in new tab
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
    console.log('📄 Opening document');

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
        if (areas.startsWith('[')) return JSON.parse(areas);
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
        if (services.startsWith('[')) return JSON.parse(services);
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
    { id: 'overview', label: 'Overview', icon: <FiActivity className="text-xs sm:text-sm" /> },
    { id: 'details', label: 'Details', icon: <FiUserCheck className="text-xs sm:text-sm" /> },
    { id: 'services', label: 'Services', icon: <FiTool className="text-xs sm:text-sm" /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag className="text-xs sm:text-sm" /> },
    { id: 'documents', label: `Docs (${documents.length})`, icon: <FiFolder className="text-xs sm:text-sm" /> }
  ];

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
                <span className="text-xl xs:text-2xl sm:text-3xl font-bold">
                  {vendor.name?.charAt(0)?.toUpperCase()}
                </span>
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
            <p className="text-xs xs:text-sm text-gray-400 truncate">
              {vendor.company_name || 'Individual Vendor'}
            </p>
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
            <span className="hidden xs:inline">
              {vendor.is_verified ? 'Verified' : 'Verify'}
            </span>
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

      {/* Tab Content */}
      <div className="mt-3 sm:mt-4 md:mt-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
            {/* Contact Info */}
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

            {/* Business Stats */}
            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <FiTrendingUp className="text-xs sm:text-sm" /> Business Stats
              </h4>
              <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-400">Total Orders</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                    {vendor.total_orders || 0}
                  </p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-green-400">Completed</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-green-500">
                    {vendor.completed_orders || 0}
                  </p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-yellow-400">Pending</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-yellow-500">
                    {vendor.pending_orders || 0}
                  </p>
                </div>
                <div className="bg-gray-800 p-1.5 xs:p-2 sm:p-3 rounded-lg">
                  <p className="text-[8px] xs:text-[10px] sm:text-xs text-red-400">Cancelled</p>
                  <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-red-500">
                    {vendor.canceled_orders || 0}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Success Rate:</span>
                  <span className="font-bold text-xs xs:text-sm sm:text-base">
                    {vendor.completed_orders && vendor.total_orders
                      ? Math.round((vendor.completed_orders / vendor.total_orders) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Average Rating:</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <FiStar className="text-yellow-500 text-xs sm:text-sm" />
                    <span className="font-bold text-xs xs:text-sm sm:text-base">
                      {vendor.average_rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Info */}
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
                  <span className="font-bold text-xs xs:text-sm">
                    {vendor.avg_response_time || 'N/A'} mins
                  </span>
                </div>
                {vendor.total_revenue && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Total Revenue:</span>
                    <span className="font-bold text-emerald-500 text-xs xs:text-sm">
                      ৳{(vendor.total_revenue || 0).toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                    Service Areas:
                  </p>
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

        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                  Personal Information
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Full Name</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Date of Birth</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base">
                      {vendor.dob
                        ? new Date(vendor.dob).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">NID Number</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base">
                      {vendor.nid_number || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                  Address Information
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Permanent Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.permanent_address || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Present Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.present_address || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Business Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                      {vendor.business_address || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                Company Information
              </h4>
              <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Company Name</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base break-words">
                    {vendor.company_name || 'Individual/Not registered'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Technicians</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base">
                    {vendor.technician_quantity || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                Services Offered
              </h4>
              <div className="grid grid-cols-1 2xs:grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3">
                {formatServices(vendor.services).map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl flex-shrink-0">
                      {serviceLabels[service]?.split(' ').pop() || '🔧'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate">
                        {serviceLabels[service]?.split(' ').slice(0, -1).join(' ') || service}
                      </p>
                      <p className="text-[8px] xs:text-[10px] text-gray-400">Service</p>
                    </div>
                  </div>
                ))}
              </div>
              {formatServices(vendor.services).length === 0 && (
                <p className="text-center text-gray-400 py-3 sm:py-4 text-xs sm:text-sm">
                  No services listed
                </p>
              )}
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                Service Areas
              </h4>
              <div className="flex flex-wrap gap-1.5 xs:gap-2">
                {formatServiceAreas(vendor.service_areas).map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 xs:gap-2 p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg"
                  >
                    <FiMapPin className="text-gray-400 text-xs xs:text-sm flex-shrink-0" />
                    <p className="font-medium text-[10px] xs:text-xs sm:text-sm break-words">
                      {area}
                    </p>
                  </div>
                ))}
                {formatServiceAreas(vendor.service_areas).length === 0 && (
                  <p className="text-center text-gray-400 py-3 sm:py-4 w-full text-xs sm:text-sm">
                    No service areas specified
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                  Order Statistics
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Total Orders</span>
                    <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                      {vendor.total_orders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Success Rate</span>
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-green-500">
                      {vendor.completed_orders && vendor.total_orders
                        ? Math.round((vendor.completed_orders / vendor.total_orders) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Avg Order Value</span>
                    <span className="text-sm xs:text-base sm:text-lg md:text-xl font-bold">
                      ৳{((vendor.total_revenue || 0) / (vendor.total_orders || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                  Order Status
                </h4>
                <div className="grid grid-cols-2 gap-1 xs:gap-1.5 sm:gap-2">
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-green-400">Completed</span>
                    <span className="font-medium text-xs xs:text-sm">
                      {vendor.completed_orders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-yellow-400">Pending</span>
                    <span className="font-medium text-xs xs:text-sm">
                      {vendor.pending_orders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-red-400">Cancelled</span>
                    <span className="font-medium text-xs xs:text-sm">
                      {vendor.canceled_orders || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4 col-span-1 2xs:col-span-2 lg:col-span-1">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                  Performance Metrics
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Response Time</span>
                    <span className="font-medium text-xs xs:text-sm">
                      {vendor.avg_response_time || 'N/A'} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs xs:text-sm text-gray-400">Customer Rating</span>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <FiStar className="text-yellow-500 text-xs sm:text-sm" />
                      <span className="font-medium text-xs xs:text-sm">
                        {vendor.average_rating || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3">
                Revenue Overview
              </h4>
              <div className="grid grid-cols-1 2xs:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3">
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Total Revenue</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-emerald-500">
                    ৳{(vendor.total_revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">This Month</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    ৳{(vendor.monthly_revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg">
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Last Month</span>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    ৳{(vendor.last_month_revenue || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* NID Documents */}
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              {/* NID Front */}
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiCreditCard className="text-purple-400 text-xs sm:text-sm" /> NID - Front
                </h4>
                {vendor.nid_front ? (
                  <div className="relative group">
                    <img
                      src={normalizeUrl(vendor.nid_front)}
                      alt="NID Front"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-gray-600 bg-gray-800"
                    />
                    <button
                      onClick={() => viewDocument(normalizeUrl(vendor.nid_front))}
                      className="absolute top-2 right-2 btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiExternalLink className="mr-1" /> Full Screen
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-600 min-h-[150px]">
                    <FiImage className="text-4xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">No NID Front uploaded</p>
                  </div>
                )}
              </div>

              {/* NID Back */}
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiCreditCard className="text-purple-400 text-xs sm:text-sm" /> NID - Back
                </h4>
                {vendor.nid_back ? (
                  <div className="relative group">
                    <img
                      src={normalizeUrl(vendor.nid_back)}
                      alt="NID Back"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-gray-600 bg-gray-800"
                    />
                    <button
                      onClick={() => viewDocument(normalizeUrl(vendor.nid_back))}
                      className="absolute top-2 right-2 btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiExternalLink className="mr-1" /> Full Screen
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-600 min-h-[150px]">
                    <FiImage className="text-4xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">No NID Back uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trade License & CV */}
            <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiFile className="text-amber-400 text-xs sm:text-sm" /> Trade License
                </h4>
                {vendor.trade_license ? (
                  <div className="relative group">
                    <img
                      src={normalizeUrl(vendor.trade_license)}
                      alt="Trade License"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-gray-600 bg-gray-800"
                    />
                    <button
                      onClick={() => viewDocument(normalizeUrl(vendor.trade_license))}
                      className="absolute top-2 right-2 btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiExternalLink className="mr-1" /> Full Screen
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-600 min-h-[150px]">
                    <FiFile className="text-4xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">No Trade License uploaded</p>
                  </div>
                )}
              </div>

              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiFile className="text-cyan-400 text-xs sm:text-sm" /> CV / Resume
                </h4>
                {vendor.cv ? (
                  <div className="relative group">
                    <img
                      src={normalizeUrl(vendor.cv)}
                      alt="CV / Resume"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-gray-600 bg-gray-800"
                    />
                    <button
                      onClick={() => viewDocument(normalizeUrl(vendor.cv))}
                      className="absolute top-2 right-2 btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiExternalLink className="mr-1" /> Full Screen
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg border border-gray-600 min-h-[150px]">
                    <FiFile className="text-4xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400">No CV uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image */}
            {(vendor.profile_image || vendor.photo) && (
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiImage className="text-blue-400 text-xs sm:text-sm" /> Profile Image
                </h4>
                <div className="relative group max-w-[300px]">
                  <img
                    src={normalizeUrl(vendor.profile_image || vendor.photo)}
                    alt="Profile"
                    className="w-full h-auto max-h-[300px] object-contain rounded-lg border border-gray-600 bg-gray-800"
                  />
                  <button
                    onClick={() => viewDocument(normalizeUrl(vendor.profile_image || vendor.photo))}
                    className="absolute top-2 right-2 btn btn-xs btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiExternalLink className="mr-1" /> Full Screen
                  </button>
                </div>
              </div>
            )}

            {/* All Documents List */}
            {documents.length > 0 && (
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiFile className="text-gray-400 text-xs sm:text-sm" /> All Documents ({documents.length})
                </h4>
                <div className="grid grid-cols-1 2xs:grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 xs:p-2 sm:p-3 bg-gray-800 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0">
                        <div className="p-1 xs:p-1.5 sm:p-2 bg-gray-700 rounded flex-shrink-0">
                          {doc.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[10px] xs:text-xs sm:text-sm truncate max-w-[70px] xs:max-w-[90px] sm:max-w-[150px]">
                            {doc.label}
                          </p>
                          <p className="text-[8px] xs:text-[10px] text-gray-400 truncate">
                            Click to view
                          </p>
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

            {/* No Documents Message */}
            {!documents.length && !vendor.nid_front && !vendor.nid_back &&
             !vendor.trade_license && !vendor.cv && !vendor.profile_image &&
             !vendor.photo && (
              <div className="card bg-gray-700/30 p-6 text-center">
                <FiFile className="text-5xl text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  No Documents Available
                </h3>
                <p className="text-gray-400 text-sm">
                  This vendor hasn't uploaded any documents yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
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

export default VendorDetailsModal;