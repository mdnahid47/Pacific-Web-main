// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const VendorsPage = () => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

// const fetchVendors = async () => {
//   setLoading(true);
//   try {
//     const res = await axios.get("/api/admin/vendors");
//     setVendors(res.data.vendors ?? []);
//   } catch (error) {
//     console.error("Error fetching vendors:", error);
//     setVendors([]); // Error হলে empty array সেট করে দাও
//   }
//   setLoading(false);
// };

// const filteredVendors = (vendors ?? []).filter(
//   (v) =>
//     (v.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//     (v.phone || "").includes(searchTerm) ||
//     (v.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//     (v.address?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
//     (v.nid || "").includes(searchTerm)
// );


//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const handleApprove = async (id) => {
//     try {
//       await axios.patch(`/api/admin/vendors/${id}/approve`);
//       fetchVendors();
//     } catch (error) {
//       console.error("Error approving vendor:", error);
//     }
//   };

//   const handleBlockToggle = async (id, currentStatus) => {
//     try {
//       await axios.patch(`/api/admin/vendors/${id}/block`, {
//         block: !currentStatus,
//       });
//       fetchVendors();
//     } catch (error) {
//       console.error("Error toggling block:", error);
//     }
//   };


//   return (
//     <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white">
//       <h2 className="text-4xl font-bold mb-6 text-center md:text-left">
//         Vendor Management
//       </h2>

//       <input
//         type="text"
//         placeholder="Search by name, phone, email, address, or NID"
//         className="input input-bordered w-full max-w-xl mb-8 text-black mx-auto block md:mx-0"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {loading ? (
//         <p className="text-center">Loading vendors...</p>
//       ) : (
//         <div className="overflow-x-auto rounded-lg border border-gray-700">
//           <table className="table w-full min-w-[900px]">
//             <thead>
//               <tr className="bg-gray-700 text-gray-300">
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Email</th>
//                 <th>Address</th>
//                 <th>DOB</th>
//                 <th>NID</th>
//                 <th>Verified</th>
//                 <th>Blocked</th>
//                 <th>Completed Orders</th>
//                 <th>Total Earnings</th>
//                 <th>Pending Payment</th>
//                 <th className="min-w-[140px]">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVendors.length === 0 ? (
//                 <tr>
//                   <td colSpan="12" className="text-center text-gray-400 py-8">
//                     No vendors found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredVendors.map((vendor) => (
//                   <tr key={vendor.id} className="hover:bg-gray-800">
//                     <td>{vendor.name}</td>
//                     <td>{vendor.phone}</td>
//                     <td>{vendor.email}</td>
//                     <td
//                       className="max-w-xs truncate"
//                       title={vendor.address || "N/A"}
//                     >
//                       {vendor.address || "N/A"}
//                     </td>
//                     <td>{vendor.dob || "N/A"}</td>
//                     <td>{vendor.nid || "N/A"}</td>
//                     <td>
//                       {vendor.is_verified ? (
//                         <span className="badge badge-success">Yes</span>
//                       ) : (
//                         <span className="badge badge-warning">No</span>
//                       )}
//                     </td>
//                     <td>
//                       {vendor.is_blocked ? (
//                         <span className="badge badge-error">Blocked</span>
//                       ) : (
//                         <span className="badge badge-info">Active</span>
//                       )}
//                     </td>
//                     <td>{vendor.completed_orders || 0}</td>
//                     <td>৳{vendor.total_earnings?.toFixed(2) || "0.00"}</td>
//                     <td>৳{vendor.pending_payment?.toFixed(2) || "0.00"}</td>
//                     <td className="space-x-2 whitespace-nowrap">
//                       {!vendor.is_verified && (
//                         <button
//                           onClick={() => handleApprove(vendor.id)}
//                           className="btn btn-sm btn-success"
//                         >
//                           Approve
//                         </button>
//                       )}
//                       <button
//                         onClick={() =>
//                           handleBlockToggle(vendor.id, vendor.is_blocked)
//                         }
//                         className={`btn btn-sm ${
//                           vendor.is_blocked ? "btn-info" : "btn-error"
//                         }`}
//                       >
//                         {vendor.is_blocked ? "Unblock" : "Block"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorsPage;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiHome, FiUsers, FiShoppingBag, FiTruck,
  FiPieChart, FiLogOut, FiSettings, FiEdit,
  FiTrash2, FiEye, FiSearch, FiChevronLeft,
  FiChevronRight, FiMenu, FiX, FiUser,
  FiUserPlus, FiClock, FiCalendar, FiDollarSign,
  FiCheckCircle, FiAlertCircle, FiUserCheck,
  FiUserX, FiUpload, FiDownload, FiFileText
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalVendors: 0,
    pendingApproval: 0,
    activeVendors: 0,
    blockedVendors: 0,
    totalEarnings: 0,
    pendingPayments: 0
  });
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    nid: "",
    password: "",
    confirmPassword: ""
  });
  const [verificationStep, setVerificationStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [nidFront, setNidFront] = useState(null);
  const [nidBack, setNidBack] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const vendorsPerPage = 10;
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = {
        data: {
          vendors: [],
          stats: {
            totalVendors: 0,
            pendingApproval: 0,
            activeVendors: 0,
            blockedVendors: 0,
            totalEarnings: 0,
            pendingPayments: 0
          }
        }
      };
      setVendors(res.data.vendors || []);
      setStats(res.data.stats || {});
    } catch (err) {
      setError(err.message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = (vendors || []).filter(vendor => {
    if (!vendor) return false;
    const name = vendor.name?.toLowerCase() || "";
    const email = vendor.email?.toLowerCase() || "";
    const phone = vendor.phone?.toString() || "";
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search)
    );
  });

  const handleNextStep = () => {
  if (verificationStep === 1) {
    // Basic validation 
    if (
      !newVendor.name ||
      !newVendor.email ||
      !newVendor.phone ||
      !newVendor.dob ||
      !newVendor.nid
    ) {
      Swal.fire("Error", "Please fill all basic information.", "error");
      return;
    }
    // move to OTP step
    setVerificationStep(2);
  } else if (verificationStep === 2) {
    if (otp.length !== 6) {
      Swal.fire("Error", "Invalid OTP code.", "error");
      return;
    }
    // move to KYC uploads
    setVerificationStep(3);
  } else if (verificationStep === 3) {
    if (!nidFront || !nidBack || !selfie) {
      Swal.fire("Error", "Please upload all KYC documents.", "error");
      return;
    }
    // move to password step
    setVerificationStep(4);
  } else if (verificationStep === 4) {
    if (
      !newVendor.password ||
      newVendor.password.length < 6 ||
      newVendor.password !== newVendor.confirmPassword
    ) {
      Swal.fire("Error", "Passwords must match and be at least 6 characters.", "error");
      return;
    }

  // Final step - submit registration
    const formData = new FormData();
    formData.append("name", newVendor.name);
    formData.append("email", newVendor.email);
    formData.append("phone", newVendor.phone);
    formData.append("dob", newVendor.dob);
    formData.append("nid", newVendor.nid);
    formData.append("password", newVendor.password);
    formData.append("nidFront", nidFront);
    formData.append("nidBack", nidBack);
    formData.append("selfie", selfie);

    axios.post("/api/admin/register-vendor", formData)
      .then(res => {
        Swal.fire("Success", "Vendor registered successfully!", "success");
        fetchVendors(); // refresh list
        setVerificationStep(5); // go to success page
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "Failed to register vendor.", "error");
      });
  }
};


  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / vendorsPerPage));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-base-200 min-h-screen fixed hidden lg:block">
        <div className="p-4 text-lg font-bold">Admin Panel</div>
        <ul className="menu p-4 text-base-content">
          <li><NavLink to="/admin/dashboard"><FiHome /> Dashboard</NavLink></li>
          <li><NavLink to="/admin/orders"><FiShoppingBag /> Orders</NavLink></li>
          <li><NavLink to="/admin/vendors" className="active"><FiUsers /> Vendors</NavLink></li>
          <li><NavLink to="/admin/settings"><FiSettings /> Settings</NavLink></li>
          <li><NavLink to="/logout"><FiLogOut /> Logout</NavLink></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <button
            onClick={() => setShowAddVendorModal(true)}
            className="btn btn-primary"
          >
            <FiUserPlus className="mr-2" /> Add Vendor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h3 className="text-sm text-gray-500">Total Vendors</h3>
                <FiUsers className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{stats.totalVendors}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h3 className="text-sm text-gray-500">Pending Approval</h3>
                <FiAlertCircle className="text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{stats.pendingApproval}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h3 className="text-sm text-gray-500">Total Earnings</h3>
                <FiDollarSign className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">${stats.totalEarnings?.toFixed(2) || 0}</p>
            </div>
          </div>
        </div>

        {/* Search + Table */}
        <div className="bg-white rounded shadow p-4">
          <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2 w-full md:w-1/3">
              <FiSearch />
              <input
                type="text"
                className="grow"
                placeholder="Search vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Earnings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVendors.length > 0 ? (
                  currentVendors.map(vendor => (
                    <tr key={vendor.id || vendor._id}>
                      <td>{vendor.name}</td>
                      <td>{vendor.email}</td>
                      <td>{vendor.phone}</td>
                      <td><span className="badge badge-info">Pending</span></td>
                      <td>${vendor.earnings?.toFixed(2) || 0}</td>
                      <td>
                        <button className="btn btn-xs btn-outline mr-1"><FiEye /></button>
                        <button className="btn btn-xs btn-outline"><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      <FiUserX className="mx-auto text-4xl mb-2" />
                      No vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="btn btn-sm"
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="btn btn-sm"
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Vendor</h2>
              <button 
                onClick={() => {
                  setShowAddVendorModal(false);
                  setVerificationStep(1);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* KYC Verification Steps */}
            {verificationStep === 1 && (
              <div>
                <h3 className="font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded"
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      value={newVendor.dob}
                      onChange={(e) => setNewVendor({...newVendor, dob: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NID Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newVendor.nid}
                      onChange={(e) => setNewVendor({...newVendor, nid: e.target.value})}
                      placeholder="10, 13 or 17 digits"
                    />
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 2 && (
              <div>
                <h3 className="font-medium mb-4">OTP Verification</h3>
                <p className="mb-4">An OTP has been sent to {newVendor.phone}. Please enter it below:</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                  />
                </div>
                <button className="text-blue-500 text-sm">Resend OTP</button>
              </div>
            )}

            {verificationStep === 3 && (
              <div>
                <h3 className="font-medium mb-4">KYC Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border-2 border-dashed rounded p-4 text-center">
                    <label className="block mb-2">NID Front Side</label>
                    {nidFront ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(nidFront)} 
                          alt="NID Front" 
                          className="h-32 mx-auto mb-2"
                        />
                        <button 
                          onClick={() => setNidFront(null)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e, "nidFront")}
                          className="hidden"
                          accept="image/*"
                        />
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="btn btn-outline btn-sm"
                        >
                          Upload
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="border-2 border-dashed rounded p-4 text-center">
                    <label className="block mb-2">NID Back Side</label>
                    {nidBack ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(nidBack)} 
                          alt="NID Back" 
                          className="h-32 mx-auto mb-2"
                        />
                        <button 
                          onClick={() => setNidBack(null)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e, "nidBack")}
                          className="hidden"
                          accept="image/*"
                        />
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="btn btn-outline btn-sm"
                        >
                          Upload
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="border-2 border-dashed rounded p-4 text-center md:col-span-2">
                    <label className="block mb-2">Selfie with NID</label>
                    {selfie ? (
                      <div>
                        <img 
                          src={URL.createObjectURL(selfie)} 
                          alt="Selfie" 
                          className="h-32 mx-auto mb-2"
                        />
                        <button 
                          onClick={() => setSelfie(null)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e, "selfie")}
                          className="hidden"
                          accept="image/*"
                        />
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="btn btn-outline btn-sm"
                        >
                          Upload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 4 && (
              <div>
                <h3 className="font-medium mb-4">Set Password</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    value={newVendor.password}
                    onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    value={newVendor.confirmPassword}
                    onChange={(e) => setNewVendor({...newVendor, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
            )}

            {verificationStep === 5 && (
              <div className="text-center">
                <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                <h3 className="font-medium mb-2">Vendor Registration Complete!</h3>
                <p className="mb-4">The vendor has been successfully registered.</p>
                <div className="bg-gray-100 p-4 rounded mb-4">
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ul className="text-left list-disc pl-5">
                    <li>Vendor will receive confirmation SMS and Email</li>
                    <li>Admin approval required for full access</li>
                    <li>Vendor can now login to the mobile app</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {verificationStep > 1 && verificationStep < 5 && (
                <button
                  onClick={() => setVerificationStep(verificationStep - 1)}
                  className="btn btn-outline"
                >
                  Back
                </button>
              )}
              {verificationStep < 5 ? (
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary ml-auto"
                >
                  {verificationStep === 4 ? 'Complete Registration' : 'Next'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAddVendorModal(false);
                    setVerificationStep(1);
                    setNewVendor({
                      name: "",
                      email: "",
                      phone: "",
                      dob: "",
                      nid: "",
                      password: "",
                      confirmPassword: ""
                    });
                    setNidFront(null);
                    setNidBack(null);
                    setSelfie(null);
                  }}
                  className="btn btn-primary ml-auto"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;