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
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   FiHome, FiUsers, FiShoppingBag, FiTruck,
//   FiPieChart, FiLogOut, FiSettings, FiEdit,
//   FiTrash2, FiEye, FiSearch, FiChevronLeft,
//   FiChevronRight, FiMenu, FiX, FiUser,
//   FiUserPlus, FiClock, FiCalendar, FiDollarSign,
//   FiCheckCircle, FiAlertCircle, FiUserCheck,
//   FiUserX, FiUpload, FiDownload, FiFileText
// } from "react-icons/fi";
// import { NavLink, useNavigate } from "react-router-dom";

// const VendorsPage = () => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [stats, setStats] = useState({
//     totalVendors: 0,
//     pendingApproval: 0,
//     activeVendors: 0,
//     blockedVendors: 0,
//     totalEarnings: 0,
//     pendingPayments: 0
//   });
//   const [showAddVendorModal, setShowAddVendorModal] = useState(false);
//   const [newVendor, setNewVendor] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     dob: "",
//     nid: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [verificationStep, setVerificationStep] = useState(1);
//   const [otp, setOtp] = useState("");
//   const [nidFront, setNidFront] = useState(null);
//   const [nidBack, setNidBack] = useState(null);
//   const [selfie, setSelfie] = useState(null);

//   const vendorsPerPage = 10;
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const fetchVendors = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = {
//         data: {
//           vendors: [],
//           stats: {
//             totalVendors: 0,
//             pendingApproval: 0,
//             activeVendors: 0,
//             blockedVendors: 0,
//             totalEarnings: 0,
//             pendingPayments: 0
//           }
//         }
//       };
//       setVendors(res.data.vendors || []);
//       setStats(res.data.stats || {});
//     } catch (err) {
//       setError(err.message);
//       setVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const filteredVendors = (vendors || []).filter(vendor => {
//     if (!vendor) return false;
//     const name = vendor.name?.toLowerCase() || "";
//     const email = vendor.email?.toLowerCase() || "";
//     const phone = vendor.phone?.toString() || "";
//     return (
//       name.includes(search.toLowerCase()) ||
//       email.includes(search.toLowerCase()) ||
//       phone.includes(search)
//     );
//   });

//   const handleNextStep = () => {
//   if (verificationStep === 1) {
//     // Basic validation 
//     if (
//       !newVendor.name ||
//       !newVendor.email ||
//       !newVendor.phone ||
//       !newVendor.dob ||
//       !newVendor.nid
//     ) {
//       Swal.fire("Error", "Please fill all basic information.", "error");
//       return;
//     }
//     // move to OTP step
//     setVerificationStep(2);
//   } else if (verificationStep === 2) {
//     if (otp.length !== 6) {
//       Swal.fire("Error", "Invalid OTP code.", "error");
//       return;
//     }
//     // move to KYC uploads
//     setVerificationStep(3);
//   } else if (verificationStep === 3) {
//     if (!nidFront || !nidBack || !selfie) {
//       Swal.fire("Error", "Please upload all KYC documents.", "error");
//       return;
//     }
//     // move to password step
//     setVerificationStep(4);
//   } else if (verificationStep === 4) {
//     if (
//       !newVendor.password ||
//       newVendor.password.length < 6 ||
//       newVendor.password !== newVendor.confirmPassword
//     ) {
//       Swal.fire("Error", "Passwords must match and be at least 6 characters.", "error");
//       return;
//     }

//   // Final step - submit registration
//     const formData = new FormData();
//     formData.append("name", newVendor.name);
//     formData.append("email", newVendor.email);
//     formData.append("phone", newVendor.phone);
//     formData.append("dob", newVendor.dob);
//     formData.append("nid", newVendor.nid);
//     formData.append("password", newVendor.password);
//     formData.append("nidFront", nidFront);
//     formData.append("nidBack", nidBack);
//     formData.append("selfie", selfie);

//     axios.post("/api/admin/register-vendor", formData)
//       .then(res => {
//         Swal.fire("Success", "Vendor registered successfully!", "success");
//         fetchVendors(); // refresh list
//         setVerificationStep(5); // go to success page
//       })
//       .catch(err => {
//         console.error(err);
//         Swal.fire("Error", "Failed to register vendor.", "error");
//       });
//   }
// };


//   const indexOfLastVendor = currentPage * vendorsPerPage;
//   const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
//   const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
//   const totalPages = Math.max(1, Math.ceil(filteredVendors.length / vendorsPerPage));

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <span className="loading loading-ring loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="flex bg-gray-100 min-h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-base-200 min-h-screen fixed hidden lg:block">
//         <div className="p-4 text-lg font-bold">Admin Panel</div>
//         <ul className="menu p-4 text-base-content">
//           <li><NavLink to="/admin/dashboard"><FiHome /> Dashboard</NavLink></li>
//           <li><NavLink to="/admin/orders"><FiShoppingBag /> Orders</NavLink></li>
//           <li><NavLink to="/admin/vendors" className="active"><FiUsers /> Vendors</NavLink></li>
//           <li><NavLink to="/admin/settings"><FiSettings /> Settings</NavLink></li>
//           <li><NavLink to="/logout"><FiLogOut /> Logout</NavLink></li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 lg:ml-64 p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Vendor Management</h1>
//           <button
//             onClick={() => setShowAddVendorModal(true)}
//             className="btn btn-primary"
//           >
//             <FiUserPlus className="mr-2" /> Add Vendor
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-sm text-gray-500">Total Vendors</h3>
//                 <FiUsers className="text-blue-500" />
//               </div>
//               <p className="text-2xl font-bold">{stats.totalVendors}</p>
//             </div>
//           </div>
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-sm text-gray-500">Pending Approval</h3>
//                 <FiAlertCircle className="text-yellow-500" />
//               </div>
//               <p className="text-2xl font-bold">{stats.pendingApproval}</p>
//             </div>
//           </div>
//           <div className="card bg-base-100 shadow">
//             <div className="card-body">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-sm text-gray-500">Total Earnings</h3>
//                 <FiDollarSign className="text-green-500" />
//               </div>
//               <p className="text-2xl font-bold">${stats.totalEarnings?.toFixed(2) || 0}</p>
//             </div>
//           </div>
//         </div>

//         {/* Search + Table */}
//         <div className="bg-white rounded shadow p-4">
//           <div className="mb-4">
//             <label className="input input-bordered flex items-center gap-2 w-full md:w-1/3">
//               <FiSearch />
//               <input
//                 type="text"
//                 className="grow"
//                 placeholder="Search vendor..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </label>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Vendor</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Status</th>
//                   <th>Earnings</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentVendors.length > 0 ? (
//                   currentVendors.map(vendor => (
//                     <tr key={vendor.id || vendor._id}>
//                       <td>{vendor.name}</td>
//                       <td>{vendor.email}</td>
//                       <td>{vendor.phone}</td>
//                       <td><span className="badge badge-info">Pending</span></td>
//                       <td>${vendor.earnings?.toFixed(2) || 0}</td>
//                       <td>
//                         <button className="btn btn-xs btn-outline mr-1"><FiEye /></button>
//                         <button className="btn btn-xs btn-outline"><FiTrash2 /></button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-8 text-gray-400">
//                       <FiUserX className="mx-auto text-4xl mb-2" />
//                       No vendors found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
//                 className="btn btn-sm"
//                 disabled={currentPage === 1}
//               >
//                 <FiChevronLeft />
//               </button>
//               <span>Page {currentPage} of {totalPages}</span>
//               <button
//                 onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
//                 className="btn btn-sm"
//                 disabled={currentPage === totalPages}
//               >
//                 <FiChevronRight />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Vendor Modal */}
//       {showAddVendorModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Add New Vendor</h2>
//               <button 
//                 onClick={() => {
//                   setShowAddVendorModal(false);
//                   setVerificationStep(1);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>

//             {/* KYC Verification Steps */}
//             {verificationStep === 1 && (
//               <div>
//                 <h3 className="font-medium mb-4">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                     <input
//                       type="text"
//                       className="w-full p-2 border rounded"
//                       value={newVendor.name}
//                       onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                     <input
//                       type="email"
//                       className="w-full p-2 border rounded"
//                       value={newVendor.email}
//                       onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                     <input
//                       type="tel"
//                       className="w-full p-2 border rounded"
//                       value={newVendor.phone}
//                       onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                     <input
//                       type="date"
//                       className="w-full p-2 border rounded"
//                       value={newVendor.dob}
//                       onChange={(e) => setNewVendor({...newVendor, dob: e.target.value})}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">NID Number</label>
//                     <input
//                       type="text"
//                       className="w-full p-2 border rounded"
//                       value={newVendor.nid}
//                       onChange={(e) => setNewVendor({...newVendor, nid: e.target.value})}
//                       placeholder="10, 13 or 17 digits"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {verificationStep === 2 && (
//               <div>
//                 <h3 className="font-medium mb-4">OTP Verification</h3>
//                 <p className="mb-4">An OTP has been sent to {newVendor.phone}. Please enter it below:</p>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border rounded"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="6-digit OTP"
//                   />
//                 </div>
//                 <button className="text-blue-500 text-sm">Resend OTP</button>
//               </div>
//             )}

//             {verificationStep === 3 && (
//               <div>
//                 <h3 className="font-medium mb-4">KYC Verification</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div className="border-2 border-dashed rounded p-4 text-center">
//                     <label className="block mb-2">NID Front Side</label>
//                     {nidFront ? (
//                       <div>
//                         <img 
//                           src={URL.createObjectURL(nidFront)} 
//                           alt="NID Front" 
//                           className="h-32 mx-auto mb-2"
//                         />
//                         <button 
//                           onClick={() => setNidFront(null)}
//                           className="text-red-500 text-sm"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ) : (
//                       <div>
//                         <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={(e) => handleFileUpload(e, "nidFront")}
//                           className="hidden"
//                           accept="image/*"
//                         />
//                         <button
//                           onClick={() => fileInputRef.current.click()}
//                           className="btn btn-outline btn-sm"
//                         >
//                           Upload
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="border-2 border-dashed rounded p-4 text-center">
//                     <label className="block mb-2">NID Back Side</label>
//                     {nidBack ? (
//                       <div>
//                         <img 
//                           src={URL.createObjectURL(nidBack)} 
//                           alt="NID Back" 
//                           className="h-32 mx-auto mb-2"
//                         />
//                         <button 
//                           onClick={() => setNidBack(null)}
//                           className="text-red-500 text-sm"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ) : (
//                       <div>
//                         <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={(e) => handleFileUpload(e, "nidBack")}
//                           className="hidden"
//                           accept="image/*"
//                         />
//                         <button
//                           onClick={() => fileInputRef.current.click()}
//                           className="btn btn-outline btn-sm"
//                         >
//                           Upload
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="border-2 border-dashed rounded p-4 text-center md:col-span-2">
//                     <label className="block mb-2">Selfie with NID</label>
//                     {selfie ? (
//                       <div>
//                         <img 
//                           src={URL.createObjectURL(selfie)} 
//                           alt="Selfie" 
//                           className="h-32 mx-auto mb-2"
//                         />
//                         <button 
//                           onClick={() => setSelfie(null)}
//                           className="text-red-500 text-sm"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ) : (
//                       <div>
//                         <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                         <input
//                           type="file"
//                           ref={fileInputRef}
//                           onChange={(e) => handleFileUpload(e, "selfie")}
//                           className="hidden"
//                           accept="image/*"
//                         />
//                         <button
//                           onClick={() => fileInputRef.current.click()}
//                           className="btn btn-outline btn-sm"
//                         >
//                           Upload
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {verificationStep === 4 && (
//               <div>
//                 <h3 className="font-medium mb-4">Set Password</h3>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                   <input
//                     type="password"
//                     className="w-full p-2 border rounded"
//                     value={newVendor.password}
//                     onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                   <input
//                     type="password"
//                     className="w-full p-2 border rounded"
//                     value={newVendor.confirmPassword}
//                     onChange={(e) => setNewVendor({...newVendor, confirmPassword: e.target.value})}
//                   />
//                 </div>
//               </div>
//             )}

//             {verificationStep === 5 && (
//               <div className="text-center">
//                 <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
//                 <h3 className="font-medium mb-2">Vendor Registration Complete!</h3>
//                 <p className="mb-4">The vendor has been successfully registered.</p>
//                 <div className="bg-gray-100 p-4 rounded mb-4">
//                   <h4 className="font-medium mb-2">Next Steps:</h4>
//                   <ul className="text-left list-disc pl-5">
//                     <li>Vendor will receive confirmation SMS and Email</li>
//                     <li>Admin approval required for full access</li>
//                     <li>Vendor can now login to the mobile app</li>
//                   </ul>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between mt-6">
//               {verificationStep > 1 && verificationStep < 5 && (
//                 <button
//                   onClick={() => setVerificationStep(verificationStep - 1)}
//                   className="btn btn-outline"
//                 >
//                   Back
//                 </button>
//               )}
//               {verificationStep < 5 ? (
//                 <button
//                   onClick={handleNextStep}
//                   className="btn btn-primary ml-auto"
//                 >
//                   {verificationStep === 4 ? 'Complete Registration' : 'Next'}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setShowAddVendorModal(false);
//                     setVerificationStep(1);
//                     setNewVendor({
//                       name: "",
//                       email: "",
//                       phone: "",
//                       dob: "",
//                       nid: "",
//                       password: "",
//                       confirmPassword: ""
//                     });
//                     setNidFront(null);
//                     setNidBack(null);
//                     setSelfie(null);
//                   }}
//                   className="btn btn-primary ml-auto"
//                 >
//                   Close
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { 
//   FiHome, FiUsers, FiShoppingBag, FiTruck, 
//   FiPieChart, FiLogOut, FiSettings, FiEdit, 
//   FiTrash2, FiEye, FiSearch, FiChevronLeft, 
//   FiChevronRight, FiMenu, FiX, FiUserPlus,
//   FiCheckCircle, FiAlertCircle, FiDollarSign,
//   FiUserCheck, FiUserX, FiClock, FiCalendar,
//   FiMail, FiPhone, FiMapPin, FiStar,
//   FiCheck, FiXCircle, FiPauseCircle,
//   FiActivity, FiTool, FiPercent, FiUpload,FiPlus 
// } from "react-icons/fi";
// import { NavLink, useNavigate } from "react-router-dom";
// import ThanaDistrictlist from "../components/divison&thanalist/ThanaDistrictlist";

// const VendorsList = () => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [editVendor, setEditVendor] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [viewVendor, setViewVendor] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showAddVendorModal, setShowAddVendorModal] = useState(false);
//   const vendorsPerPage = 10;
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   const statusColors = {
//     active: "bg-green-500/20 text-green-500 border border-green-500/30",
//     pending: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
//     rejected: "bg-red-500/20 text-red-500 border border-red-500/30",
//     suspended: "bg-orange-500/20 text-orange-500 border border-orange-500/30"
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

//   const fetchVendors = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     try {
//       const res = await axios.get("http://localhost:5001/api/admin/vendors", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Vendors data:", res.data);
//       setVendors(res.data.vendors || []);
//     } catch (err) {
//       console.error("Fetch vendors error:", err);
//       setError("Failed to fetch vendors");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!"
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         await axios.delete(`http://localhost:5001/api/admin/vendors/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         Swal.fire("Deleted!", "Vendor has been deleted.", "success");
//         fetchVendors();
//       } catch (err) {
//         Swal.fire("Error", "Failed to delete vendor", "error");
//       }
//     }
//   };

//   const handleStatusChange = async (vendorId, newStatus) => {
//     const result = await Swal.fire({
//       title: "Change Status",
//       text: `Are you sure you want to change vendor status to ${newStatus}?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, change it!"
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         await axios.patch(
//           `http://localhost:5001/api/admin/vendors/${vendorId}/status`,
//           { status: newStatus },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         Swal.fire("Success!", "Vendor status updated successfully.", "success");
//         fetchVendors();
//       } catch (err) {
//         console.error("Status change error:", err);
//         Swal.fire("Error", "Failed to update vendor status", "error");
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);

//   const filteredVendors = vendors?.filter((vendor) => {
//     const name = vendor?.name?.toLowerCase() || "";
//     const email = vendor?.email?.toLowerCase() || "";
//     const phone = vendor?.phone?.toString() || "";
//     const nid = vendor?.nid_number?.toString() || "";
//     return name.includes(search.toLowerCase()) || 
//            email.includes(search.toLowerCase()) || 
//            phone.includes(search) ||
//            nid.includes(search);
//   });

//   const indexOfLastVendor = currentPage * vendorsPerPage;
//   const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
//   const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
//   const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage) || 1;

//   // Calculate stats
//   const stats = {
//     totalVendors: vendors.length,
//     activeVendors: vendors.filter(v => v.status === 'active').length,
//     pendingVendors: vendors.filter(v => v.status === 'pending').length,
//     suspendedVendors: vendors.filter(v => v.status === 'suspended').length,
//     rejectedVendors: vendors.filter(v => v.status === 'rejected').length,
//     totalOrders: vendors.reduce((sum, v) => sum + (v.total_orders || 0), 0),
//     completedOrders: vendors.reduce((sum, v) => sum + (v.completed_orders || 0), 0),
//     pendingOrders: vendors.reduce((sum, v) => sum + (v.pending_orders || 0), 0),
//     canceledOrders: vendors.reduce((sum, v) => sum + (v.canceled_orders || 0), 0),
//     totalTechnicians: vendors.reduce((sum, v) => sum + (v.technician_quantity || 0), 0)
//   };

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'active': return <FiCheckCircle className="text-green-500" />;
//       case 'pending': return <FiAlertCircle className="text-yellow-500" />;
//       case 'rejected': return <FiXCircle className="text-red-500" />;
//       case 'suspended': return <FiPauseCircle className="text-orange-500" />;
//       default: return <FiAlertCircle className="text-gray-500" />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-900">
//         <div className="alert alert-error shadow-lg max-w-2xl">
//           <div>
//             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span>{error}</span>
//           </div>
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
//         <h1 className="text-xl font-bold">Vendor Management</h1>
//         <div className="w-10"></div>
//       </div>

//       {/* Sidebar */}
//       <div 
//         ref={sidebarRef}
//         className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//         style={{ top: '0', left: '0' }}
//       >
//         <h1 className="text-xl font-bold text-center py-4 border-b border-gray-700 hidden lg:block">Admin Panel</h1>
//         <nav className="mt-4 space-y-2">
//           <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/vendors" icon={<FiUsers />} text="Vendor List" onClick={() => setSidebarOpen(false)} active />
//           <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
//         </nav>
//         <div className="mt-6 pt-4 border-t border-gray-700">
//           <button 
//             onClick={handleLogout} 
//             className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 text-red-400"
//           >
//             <FiLogOut className="mr-3" /> Logout
//           </button>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
//              onClick={() => setSidebarOpen(false)}></div>
//       )}

//       {/* Main Content */}
//       <main className="flex-1 p-4 lg:p-6 lg:ml-0">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
//           <h1 className="text-2xl lg:text-3xl font-bold hidden lg:block">Vendor Management</h1>
//           <div className="flex gap-2">
//             <div className="badge badge-primary gap-2 mt-2 lg:mt-0">
//               <FiUsers /> Total: {vendors.length}
//             </div>
//             <button 
//               onClick={() => setShowAddVendorModal(true)}
//               className="btn btn-primary btn-sm"
//             >
//               <FiUserPlus className="mr-2" /> Add Vendor
//             </button>
//           </div>
//         </div>

//         {/* Search and Stats */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//           <div className="relative w-full lg:w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search vendors by name, email, phone or NID..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="input input-bordered w-full pl-10 bg-gray-800 border-gray-700 focus:border-primary"
//             />
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full lg:w-auto">
//             <StatsCard 
//               title="Active" 
//               value={stats.activeVendors} 
//               color="text-green-500" 
//               icon={<FiUserCheck />} 
//               bgColor="bg-green-500/10"
//             />
//             <StatsCard 
//               title="Pending" 
//               value={stats.pendingVendors} 
//               color="text-yellow-500" 
//               icon={<FiAlertCircle />} 
//               bgColor="bg-yellow-500/10"
//             />
//             <StatsCard 
//               title="Suspended" 
//               value={stats.suspendedVendors} 
//               color="text-orange-500" 
//               icon={<FiPauseCircle />} 
//               bgColor="bg-orange-500/10"
//             />
//             <StatsCard 
//               title="Total Orders" 
//               value={stats.totalOrders} 
//               color="text-blue-500" 
//               icon={<FiShoppingBag />} 
//               bgColor="bg-blue-500/10"
//             />
//             <StatsCard 
//               title="Technicians" 
//               value={stats.totalTechnicians} 
//               color="text-purple-500" 
//               icon={<FiTool />} 
//               bgColor="bg-purple-500/10"
//             />
//           </div>
//         </div>

//         {/* Vendors Table */}
//         <div className="card bg-gray-800 shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead>
//                 <tr className="border-b border-gray-700">
//                   <th className="bg-gray-800 text-gray-400">Vendor Info</th>
//                   <th className="bg-gray-800 text-gray-400 hidden lg:table-cell">Contact</th>
//                   <th className="bg-gray-800 text-gray-400">Status</th>
//                   <th className="bg-gray-800 text-gray-400 hidden md:table-cell">Orders</th>
//                   <th className="bg-gray-800 text-gray-400 hidden sm:table-cell">Performance</th>
//                   <th className="bg-gray-800 text-gray-400">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentVendors.length > 0 ? (
//                   currentVendors.map((vendor) => (
//                     <tr key={vendor.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
//                       <td>
//                         <div className="flex items-center gap-3">
//                           <div className="avatar">
//                             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
//                               {vendor.photo ? (
//                                 <img 
//                                   src={vendor.photo} 
//                                   alt={vendor.name} 
//                                   className="rounded-full w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${vendor.name?.charAt(0)}</span>`;
//                                   }}
//                                 />
//                               ) : (
//                                 <span className="text-lg font-bold">{vendor.name?.charAt(0)}</span>
//                               )}
//                             </div>
//                           </div>
//                           <div>
//                             <p className="font-medium truncate max-w-[150px]">{vendor.name}</p>
//                             <p className="text-xs text-gray-400">ID: {vendor.id}</p>
//                             {vendor.nid_number && (
//                               <p className="text-xs text-gray-400">NID: {vendor.nid_number}</p>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="hidden lg:table-cell">
//                         <div className="space-y-1">
//                           <p className="text-sm flex items-center gap-2">
//                             <FiMail className="text-gray-400 text-xs" />
//                             <span className="truncate max-w-[180px]">{vendor.email}</span>
//                           </p>
//                           <p className="text-sm flex items-center gap-2">
//                             <FiPhone className="text-gray-400 text-xs" />
//                             {vendor.phone}
//                           </p>
//                           {vendor.address && (
//                             <p className="text-sm flex items-center gap-2">
//                               <FiMapPin className="text-gray-400 text-xs" />
//                               <span className="truncate max-w-[180px]">{vendor.address}</span>
//                             </p>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex flex-col gap-1">
//                           <div className="flex items-center gap-2">
//                             {getStatusIcon(vendor.status)}
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vendor.status] || 'bg-gray-500/20 text-gray-500'}`}>
//                               {vendor.status?.toUpperCase()}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-400">
//                             Joined: {new Date(vendor.join_date || vendor.created_at).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="hidden md:table-cell">
//                         <div className="space-y-1">
//                           <div className="flex justify-between text-sm">
//                             <span className="text-gray-400">Total:</span>
//                             <span className="font-medium">{vendor.total_orders || 0}</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-green-400">Completed:</span>
//                             <span>{vendor.completed_orders || 0}</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-yellow-400">Pending:</span>
//                             <span>{vendor.pending_orders || 0}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="hidden sm:table-cell">
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-1">
//                             <FiStar className="text-yellow-500 text-sm" />
//                             <span className="font-medium">{vendor.average_rating || "N/A"}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <FiTool className="text-purple-500 text-sm" />
//                             <span className="text-sm">{vendor.technician_quantity || 0} Techs</span>
//                           </div>
//                           {vendor.average_rating && (
//                             <div className="flex items-center gap-1">
//                               <FiPercent className="text-blue-500 text-sm" />
//                               <span className="text-sm">
//                                 {vendor.completed_orders && vendor.total_orders ? 
//                                   Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}% Success
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex space-x-1 sm:space-x-2">
//                           <button
//                             onClick={() => {
//                               setViewVendor(vendor);
//                               document.getElementById("view_vendor_modal").showModal();
//                             }}
//                             className="btn btn-xs sm:btn-sm btn-ghost btn-square text-info hover:bg-info/20"
//                             title="View Details"
//                           >
//                             <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
//                           </button>

//                           {/* Status Actions Dropdown */}
//                           <div className="dropdown dropdown-end">
//                             <button tabIndex={0} className="btn btn-xs sm:btn-sm btn-ghost btn-square text-warning hover:bg-warning/20" title="Change Status">
//                               <FiActivity className="w-3 h-3 sm:w-4 sm:h-4" />
//                             </button>
//                             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-32">
//                               <li>
//                                 <button 
//                                   onClick={() => handleStatusChange(vendor.id, 'active')}
//                                   className="text-green-500 hover:bg-green-500/10"
//                                 >
//                                   <FiCheckCircle /> Active
//                                 </button>
//                               </li>
//                               <li>
//                                 <button 
//                                   onClick={() => handleStatusChange(vendor.id, 'pending')}
//                                   className="text-yellow-500 hover:bg-yellow-500/10"
//                                 >
//                                   <FiAlertCircle /> Pending
//                                 </button>
//                               </li>
//                               <li>
//                                 <button 
//                                   onClick={() => handleStatusChange(vendor.id, 'suspended')}
//                                   className="text-orange-500 hover:bg-orange-500/10"
//                                 >
//                                   <FiPauseCircle /> Suspend
//                                 </button>
//                               </li>
//                               <li>
//                                 <button 
//                                   onClick={() => handleStatusChange(vendor.id, 'rejected')}
//                                   className="text-red-500 hover:bg-red-500/10"
//                                 >
//                                   <FiXCircle /> Reject
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>

//                           <button
//                             onClick={() => handleDelete(vendor.id)}
//                             className="btn btn-xs sm:btn-sm btn-ghost btn-square text-error hover:bg-error/20"
//                             title="Delete Vendor"
//                           >
//                             <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-8 text-gray-400">
//                       <FiUserX className="mx-auto text-3xl mb-2" />
//                       No vendors found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {currentVendors.length > 0 && (
//             <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 border-t border-gray-700 gap-3">
//               <div className="text-sm text-gray-400">
//                 Showing {indexOfFirstVendor + 1} to {Math.min(indexOfLastVendor, filteredVendors.length)} of {filteredVendors.length} vendors
//               </div>
//               <div className="flex space-x-1 sm:space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="btn btn-xs sm:btn-sm btn-ghost disabled:opacity-50"
//                 >
//                   <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>

//                 {[...Array(totalPages).keys()].map(page => (
//                   <button
//                     key={page + 1}
//                     onClick={() => setCurrentPage(page + 1)}
//                     className={`btn btn-xs sm:btn-sm ${currentPage === page + 1 ? 'btn-primary' : 'btn-ghost'}`}
//                   >
//                     {page + 1}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="btn btn-xs sm:btn-sm btn-ghost disabled:opacity-50"
//                 >
//                   <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* View Vendor Modal */}
//         <dialog id="view_vendor_modal" className="modal">
//           <div className="modal-box max-w-4xl bg-gray-800 border border-gray-700">
//             <form method="dialog">
//               <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//             </form>

//             {viewVendor && (
//               <div className="space-y-6">
//                 {/* Vendor Header */}
//                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//                   <div className="flex items-center gap-4">
//                     <div className="avatar">
//                       <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-gray-700">
//                         {viewVendor.photo ? (
//                           <img 
//                             src={viewVendor.photo} 
//                             alt={viewVendor.name} 
//                             className="rounded-full w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.parentElement.innerHTML = `<span class="text-3xl font-bold">${viewVendor.name?.charAt(0)}</span>`;
//                             }}
//                           />
//                         ) : (
//                           <span className="text-3xl font-bold">{viewVendor.name?.charAt(0)}</span>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold">{viewVendor.name}</h3>
//                       <p className="text-gray-400">Vendor ID: {viewVendor.id}</p>
//                       <div className="flex gap-2 mt-2">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColors[viewVendor.status]}`}>
//                           {getStatusIcon(viewVendor.status)}
//                           {viewVendor.status?.toUpperCase()}
//                         </span>
//                         <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
//                           Joined: {new Date(viewVendor.join_date || viewVendor.created_at).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Main Content Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Contact Information */}
//                   <div className="card bg-gray-700/50 p-4">
//                     <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                       <FiMail /> Contact Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-800 rounded-lg">
//                           <FiMail className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-400">Email</p>
//                           <p className="font-medium">{viewVendor.email}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-800 rounded-lg">
//                           <FiPhone className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-400">Phone</p>
//                           <p className="font-medium">{viewVendor.phone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-800 rounded-lg">
//                           <FiMapPin className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-400">Address</p>
//                           <p className="font-medium">{viewVendor.address || "Not specified"}</p>
//                         </div>
//                       </div>
//                       {viewVendor.nid_number && (
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-gray-800 rounded-lg">
//                             <FiUserCheck className="text-gray-400" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-400">NID Number</p>
//                             <p className="font-medium">{viewVendor.nid_number}</p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Business Stats */}
//                   <div className="card bg-gray-700/50 p-4">
//                     <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                       <FiActivity /> Business Statistics
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-gray-800 p-3 rounded-lg">
//                         <p className="text-sm text-gray-400">Total Orders</p>
//                         <p className="text-2xl font-bold">{viewVendor.total_orders || 0}</p>
//                       </div>
//                       <div className="bg-gray-800 p-3 rounded-lg">
//                         <p className="text-sm text-green-400">Completed</p>
//                         <p className="text-2xl font-bold text-green-500">{viewVendor.completed_orders || 0}</p>
//                       </div>
//                       <div className="bg-gray-800 p-3 rounded-lg">
//                         <p className="text-sm text-yellow-400">Pending</p>
//                         <p className="text-2xl font-bold text-yellow-500">{viewVendor.pending_orders || 0}</p>
//                       </div>
//                       <div className="bg-gray-800 p-3 rounded-lg">
//                         <p className="text-sm text-red-400">Cancelled</p>
//                         <p className="text-2xl font-bold text-red-500">{viewVendor.canceled_orders || 0}</p>
//                       </div>
//                     </div>
//                     <div className="mt-4 space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">Success Rate:</span>
//                         <span className="font-bold">
//                           {viewVendor.completed_orders && viewVendor.total_orders ? 
//                             Math.round((viewVendor.completed_orders / viewVendor.total_orders) * 100) : 0}%
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">Technicians:</span>
//                         <span className="font-bold">{viewVendor.technician_quantity || 0}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-400">Average Rating:</span>
//                         <div className="flex items-center gap-1">
//                           <FiStar className="text-yellow-500" />
//                           <span className="font-bold">{viewVendor.average_rating || "N/A"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2 justify-end">
//                   <button
//                     onClick={() => {
//                       document.getElementById("view_vendor_modal").close();
//                       handleStatusChange(viewVendor.id, 'active');
//                     }}
//                     className={`btn btn-sm ${viewVendor.status === 'active' ? 'btn-disabled' : 'btn-success'}`}
//                     disabled={viewVendor.status === 'active'}
//                   >
//                     <FiCheckCircle /> Approve
//                   </button>
//                   <button
//                     onClick={() => {
//                       document.getElementById("view_vendor_modal").close();
//                       handleStatusChange(viewVendor.id, 'suspended');
//                     }}
//                     className="btn btn-sm btn-warning"
//                   >
//                     <FiPauseCircle /> Suspend
//                   </button>
//                   <button
//                     onClick={() => {
//                       document.getElementById("view_vendor_modal").close();
//                       handleStatusChange(viewVendor.id, 'rejected');
//                     }}
//                     className="btn btn-sm btn-error"
//                   >
//                     <FiXCircle /> Reject
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </dialog>

//         {/* Add Vendor Modal */}
//         {showAddVendorModal && (
//           <AddVendorModal
//             onClose={() => setShowAddVendorModal(false)}
//             onSuccess={() => {
//               setShowAddVendorModal(false);
//               fetchVendors();
//             }}
//           />
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
//       `flex items-center p-3 rounded-lg ${
//         isActive || active ? "bg-primary text-white" : "hover:bg-gray-700"
//       }`
//     }
//   >
//     <span className="mr-3">{icon}</span>
//     {text}
//   </NavLink>
// );

// // Reusable StatsCard component
// const StatsCard = ({ title, value, color = "", icon, bgColor = "bg-gray-800" }) => (
//   <div className={`card ${bgColor} shadow-sm`}>
//     <div className="card-body p-3">
//       <div className="flex justify-between items-center">
//         <h3 className="text-gray-400 text-xs sm:text-sm">{title}</h3>
//         <span className={color}>{icon}</span>
//       </div>
//       <p className={`text-lg sm:text-xl font-bold ${color}`}>{value}</p>
//     </div>
//   </div>
// );

// // Add Vendor Modal Component - UPDATED VERSION with ThanaDistrictList
// const AddVendorModal = ({ onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     dob: '',
//     password: '',
//     confirmPassword: '',
//     nid_number: '',
//     permanent_address: '',
//     present_address: '',
//     technician_quantity: 0,
//     service_areas: [],
//     services: []
//   });
//   const [nidFront, setNidFront] = useState(null);
//   const [nidBack, setNidBack] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);
//   const [cvFile, setCvFile] = useState(null);
//   const [tradeLicense, setTradeLicense] = useState(null);
//   const [fileErrors, setFileErrors] = useState({});

//   // State for managing multiple service areas
//   const [serviceAreaSelections, setServiceAreaSelections] = useState([]);

//   // Service options
//   const serviceOptions = [
//     { id: 'ac_service', label: 'AC Service', icon: '❄️' },
//     { id: 'fridge_service', label: 'Fridge Service', icon: '🧊' },
//     { id: 'tv_service', label: 'TV Service', icon: '📺' },
//     { id: 'oven_service', label: 'Oven Service', icon: '🔥' },
//     { id: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
//     { id: 'hvac_vrf', label: 'HVAC/VRF', icon: '🌡️' },
//     { id: 'geyser', label: 'Geyser', icon: '♨️' },
//     { id: 'water_purifier', label: 'Water Purifier', icon: '💧' },
//     { id: 'electrical', label: 'Electrical', icon: '⚡' },
//     { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
//     { id: 'carpentry', label: 'Carpentry', icon: '🪚' },
//     { id: 'painting', label: 'Painting', icon: '🎨' }
//   ];

//   const validateFile = (file, fieldName) => {
//     const maxSize = 2 * 1024 * 1024; // 2MB
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];

//     if (file.size > maxSize) {
//       setFileErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 2MB' }));
//       return false;
//     }

//     if (!allowedTypes.includes(file.type)) {
//       setFileErrors(prev => ({ ...prev, [fieldName]: 'Only JPG, PNG, GIF, PDF files are allowed' }));
//       return false;
//     }

//     setFileErrors(prev => ({ ...prev, [fieldName]: '' }));
//     return true;
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (validateFile(file, field)) {
//         switch(field) {
//           case 'nidFront': setNidFront(file); break;
//           case 'nidBack': setNidBack(file); break;
//           case 'profileImage': setProfileImage(file); break;
//           case 'cvFile': setCvFile(file); break;
//           case 'tradeLicense': setTradeLicense(file); break;
//           default: break;
//         }
//       } else {
//         e.target.value = ''; // Clear the file input
//       }
//     }
//   };

//   const removeFile = (field) => {
//     switch(field) {
//       case 'nidFront': setNidFront(null); break;
//       case 'nidBack': setNidBack(null); break;
//       case 'profileImage': setProfileImage(null); break;
//       case 'cvFile': setCvFile(null); break;
//       case 'tradeLicense': setTradeLicense(null); break;
//       default: break;
//     }
//     setFileErrors(prev => ({ ...prev, [field]: '' }));
//   };

//   const handleServiceToggle = (serviceId) => {
//     setFormData(prev => ({
//       ...prev,
//       services: prev.services.includes(serviceId)
//         ? prev.services.filter(id => id !== serviceId)
//         : [...prev.services, serviceId]
//     }));
//   };

//   // Handle area selection change from ThanaDistrictList
//   const handleAreaChange = (index, areaData) => {
//     const updatedSelections = [...serviceAreaSelections];
//     updatedSelections[index] = areaData;
//     setServiceAreaSelections(updatedSelections);

//     // Update formData with string representation
//     const areaStrings = updatedSelections
//       .filter(area => area && area.division && area.district && area.policeStation)
//       .map(area => `${area.policeStation}, ${area.district}, ${area.division}`);

//     setFormData(prev => ({
//       ...prev,
//       service_areas: areaStrings
//     }));
//   };

//   // Add new service area field
//   const addServiceArea = () => {
//     if (serviceAreaSelections.length < 10) { // Limit to 10 areas
//       setServiceAreaSelections(prev => [...prev, null]);
//     }
//   };

//   // Remove service area field
//   const removeServiceArea = (index) => {
//     const updatedSelections = [...serviceAreaSelections];
//     updatedSelections.splice(index, 1);
//     setServiceAreaSelections(updatedSelections);

//     // Update formData
//     const areaStrings = updatedSelections
//       .filter(area => area && area.division && area.district && area.policeStation)
//       .map(area => `${area.policeStation}, ${area.district}, ${area.division}`);

//     setFormData(prev => ({
//       ...prev,
//       service_areas: areaStrings
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       Swal.fire('Error', 'Passwords do not match', 'error');
//       return;
//     }

//     // Validate required files
//     if (!nidFront || !nidBack) {
//       Swal.fire('Error', 'NID Front and Back photos are required', 'error');
//       return;
//     }

//     // Validate at least one service selected
//     if (formData.services.length === 0) {
//       Swal.fire('Error', 'Please select at least one service', 'error');
//       return;
//     }

//     // Validate at least one service area selected
//     const validAreas = serviceAreaSelections.filter(area => 
//       area && area.division && area.district && area.policeStation
//     );
//     if (validAreas.length === 0) {
//       Swal.fire('Error', 'Please select at least one service area with division, district, and thana', 'error');
//       return;
//     }

//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();

//       // Append form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'services' || key === 'service_areas') {
//           formDataToSend.append(key, JSON.stringify(formData[key]));
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       // Append files
//       if (nidFront) formDataToSend.append('nid_front', nidFront);
//       if (nidBack) formDataToSend.append('nid_back', nidBack);
//       if (profileImage) formDataToSend.append('profile_image', profileImage);
//       if (cvFile) formDataToSend.append('cv', cvFile);
//       if (tradeLicense) formDataToSend.append('trade_license', tradeLicense);

//       const response = await axios.post(
//         "http://localhost:5001/api/vendor/register",
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           title: "Success!",
//           text: response.data.message || "Vendor registered successfully",
//           icon: "success",
//           confirmButtonColor: "#4f46e5",
//         });
//         onSuccess();
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       Swal.fire({
//         title: "Error!",
//         text: error.response?.data?.message || error.message || "Failed to register vendor",
//         icon: "error",
//         confirmButtonColor: "#dc2626",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold">Register New Vendor</h3>
//           <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
//             <FiX />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Full Name *</span>
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Email *</span>
//               </label>
//               <input
//                 type="email"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Phone Number *</span>
//               </label>
//               <input
//                 type="tel"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Date of Birth *</span>
//               </label>
//               <input
//                 type="date"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.dob}
//                 onChange={(e) => setFormData({...formData, dob: e.target.value})}
//                 required
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Password *</span>
//               </label>
//               <input
//                 type="password"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.password}
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//                 required
//                 minLength={6}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Confirm Password *</span>
//               </label>
//               <input
//                 type="password"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                 required
//                 minLength={6}
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">NID Number *</span>
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.nid_number}
//                 onChange={(e) => setFormData({...formData, nid_number: e.target.value})}
//                 required
//                 placeholder="10, 13 or 17 digits"
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Technician Quantity</span>
//               </label>
//               <input
//                 type="number"
//                 min="0"
//                 className="input input-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.technician_quantity}
//                 onChange={(e) => setFormData({...formData, technician_quantity: parseInt(e.target.value) || 0})}
//               />
//             </div>
//           </div>

//           {/* Address Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Permanent Address *</span>
//               </label>
//               <textarea
//                 className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.permanent_address}
//                 onChange={(e) => setFormData({...formData, permanent_address: e.target.value})}
//                 rows={3}
//                 required
//                 placeholder="Full permanent address with house no, road no, area, thana, district"
//               />
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Present Address *</span>
//               </label>
//               <textarea
//                 className="textarea textarea-bordered w-full bg-gray-700 border-gray-600"
//                 value={formData.present_address}
//                 onChange={(e) => setFormData({...formData, present_address: e.target.value})}
//                 rows={3}
//                 required
//                 placeholder="Full present address (if different from permanent)"
//               />
//             </div>
//           </div>

//           {/* Service Areas - UPDATED with ThanaDistrictList */}
//           <div className="form-control">
//             <div className="flex justify-between items-center mb-3">
//               <label className="label">
//                 <span className="label-text text-white">Service Areas *</span>
//                 <span className="label-text-alt text-white">
//                   Select division, district, and thana where you provide service
//                 </span>
//               </label>
//               <button
//                 type="button"
//                 onClick={addServiceArea}
//                 className="btn btn-sm btn-primary"
//                 disabled={serviceAreaSelections.length >= 10}
//               >
//                 <FiPlus className="mr-1" /> Add Area
//               </button>
//             </div>

//             {serviceAreaSelections.map((area, index) => (
//               <div key={index} className="mb-4 p-4 bg-gray-700/30 rounded-lg border  border-gray-600">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="text-white font-medium">Service Area {index + 1}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeServiceArea(index)}
//                     className="btn btn-xs btn-error"
//                   >
//                     <FiX /> Remove
//                   </button>
//                 </div>
//                 <ThanaDistrictlist
//                   initialValues={area || {}}
//                   onChange={(areaData) => handleAreaChange(index, areaData)}
//                   uniqueKey={`service-area-${index}`}

//                 />
//                 {area && area.division && area.district && area.policeStation && (
//                   <div className="mt-2 p-2 bg-gray-800 rounded">
//                     <span className="text-sm text-white">
//                       Selected: {area.policeStation}, {area.district}, {area.division}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {formData.service_areas.length > 0 && (
//               <div className="mt-3">
//                 <div className="text-sm text-white mb-1">Selected Areas:</div>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.service_areas.map((area, index) => (
//                     <span key={index} className="badge badge-primary">
//                       {area}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {serviceAreaSelections.length === 0 && (
//               <div className="text-center py-6 border-2 border-dashed border-gray-600 rounded-lg">
//                 <FiMapPin className="mx-auto text-gray-400 mb-2" size={32} />
//                 <p className="text-gray-400">No service areas added yet</p>
//                 <p className="text-sm text-gray-500">Click "Add Area" to add service areas</p>
//               </div>
//             )}
//           </div>

//           {/* Services Provided */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text text-white">Services Provided *</span>
//               <span className="label-text-alt text-white">Select services you offer</span>
//             </label>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 bg-gray-700/50 rounded-lg">
//               {serviceOptions.map((service) => (
//                 <div key={service.id} className="form-control text-white">
//                   <label className="label cursor-pointer justify-start gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.services.includes(service.id)}
//                       onChange={() => handleServiceToggle(service.id)}
//                       className="checkbox checkbox-primary checkbox-sm"
//                     />
//                     <span className="label-text flex items-center gap-1">
//                       <span>{service.icon}</span>
//                       <span className="text-xs text-white">{service.label}</span>
//                     </span>
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {formData.services.length > 0 && (
//               <div className="mt-2">
//                 <span className="text-sm text-gray-400">Selected: </span>
//                 <span className="text-sm">
//                   {formData.services.length} service{formData.services.length > 1 ? 's' : ''}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* File Uploads */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* NID Front */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">NID Front *</span>
//                 <span className="label-text-alt text-error">{fileErrors.nidFront}</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
//                 {nidFront ? (
//                   <div>
//                     <img 
//                       src={URL.createObjectURL(nidFront)} 
//                       alt="NID Front" 
//                       className="h-32 mx-auto mb-2 object-contain"
//                     />
//                     <p className="text-xs text-gray-400 truncate">{nidFront.name}</p>
//                     <button 
//                       type="button"
//                       onClick={() => removeFile('nidFront')}
//                       className="btn btn-xs btn-error mt-2"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileChange(e, 'nidFront')}
//                       className="hidden"
//                       id="nidFront"
//                       accept="image/*"
//                       required
//                     />
//                     <label htmlFor="nidFront" className="btn btn-outline btn-sm cursor-pointer">
//                       Upload
//                     </label>
//                     <p className="text-xs text-gray-400 mt-2">Max 2MB, JPG/PNG</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* NID Back */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">NID Back *</span>
//                 <span className="label-text-alt text-error">{fileErrors.nidBack}</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
//                 {nidBack ? (
//                   <div>
//                     <img 
//                       src={URL.createObjectURL(nidBack)} 
//                       alt="NID Back" 
//                       className="h-32 mx-auto mb-2 object-contain"
//                     />
//                     <p className="text-xs text-gray-400 truncate">{nidBack.name}</p>
//                     <button 
//                       type="button"
//                       onClick={() => removeFile('nidBack')}
//                       className="btn btn-xs btn-error mt-2"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileChange(e, 'nidBack')}
//                       className="hidden"
//                       id="nidBack"
//                       accept="image/*"
//                       required
//                     />
//                     <label htmlFor="nidBack" className="btn btn-outline btn-sm cursor-pointer">
//                       Upload
//                     </label>
//                     <p className="text-xs text-gray-400 mt-2">Max 2MB, JPG/PNG</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Profile Image */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Profile Image</span>
//                 <span className="label-text-alt text-error">{fileErrors.profileImage}</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
//                 {profileImage ? (
//                   <div>
//                     <img 
//                       src={URL.createObjectURL(profileImage)} 
//                       alt="Profile" 
//                       className="h-32 mx-auto mb-2 object-cover rounded-full"
//                     />
//                     <p className="text-xs text-gray-400 truncate">{profileImage.name}</p>
//                     <button 
//                       type="button"
//                       onClick={() => removeFile('profileImage')}
//                       className="btn btn-xs btn-error mt-2"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileChange(e, 'profileImage')}
//                       className="hidden"
//                       id="profileImage"
//                       accept="image/*"
//                     />
//                     <label htmlFor="profileImage" className="btn btn-outline btn-sm cursor-pointer">
//                       Upload
//                     </label>
//                     <p className="text-xs text-gray-400 mt-2">Max 2MB, JPG/PNG</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* CV */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">CV/Resume</span>
//                 <span className="label-text-alt text-error">{fileErrors.cvFile}</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
//                 {cvFile ? (
//                   <div>
//                     <div className="h-32 flex items-center justify-center mb-2">
//                       <span className="text-4xl">📄</span>
//                     </div>
//                     <p className="text-xs text-gray-400 truncate">{cvFile.name}</p>
//                     <button 
//                       type="button"
//                       onClick={() => removeFile('cvFile')}
//                       className="btn btn-xs btn-error mt-2"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileChange(e, 'cvFile')}
//                       className="hidden"
//                       id="cvFile"
//                       accept=".pdf,.doc,.docx"
//                     />
//                     <label htmlFor="cvFile" className="btn btn-outline btn-sm cursor-pointer">
//                       Upload CV
//                     </label>
//                     <p className="text-xs text-gray-400 mt-2">PDF/DOC, Max 2MB</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Trade License */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-gray-300">Trade License</span>
//                 <span className="label-text-alt text-error">{fileErrors.tradeLicense}</span>
//               </label>
//               <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
//                 {tradeLicense ? (
//                   <div>
//                     <div className="h-32 flex items-center justify-center mb-2">
//                       <span className="text-4xl">📋</span>
//                     </div>
//                     <p className="text-xs text-gray-400 truncate">{tradeLicense.name}</p>
//                     <button 
//                       type="button"
//                       onClick={() => removeFile('tradeLicense')}
//                       className="btn btn-xs btn-error mt-2"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
//                     <input
//                       type="file"
//                       onChange={(e) => handleFileChange(e, 'tradeLicense')}
//                       className="hidden"
//                       id="tradeLicense"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                     />
//                     <label htmlFor="tradeLicense" className="btn btn-outline btn-sm cursor-pointer">
//                       Upload
//                     </label>
//                     <p className="text-xs text-gray-400 mt-2">PDF/JPG/PNG, Max 2MB</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* File Size Notice */}
//           <div className="alert alert-info">
//             <div>
//               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               <span>Maximum file size: 2MB per file. Allowed formats: Images (JPG, PNG, GIF), PDF, DOC</span>
//             </div>
//           </div>

//           <div className="modal-action mt-6">
//             <button
//               type="submit"
//               className={`btn btn-primary ${loading ? 'loading' : ''}`}
//               disabled={loading}
//             >
//               {loading ? 'Registering...' : 'Register Vendor'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="btn btn-ghost"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VendorsList;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   FiHome, FiUsers, FiShoppingBag, FiTruck,
//   FiPieChart, FiLogOut, FiSettings, FiEdit,
//   FiTrash2, FiEye, FiSearch, FiChevronLeft,
//   FiChevronRight, FiMenu, FiX, FiUserPlus,
//   FiCheckCircle, FiAlertCircle, FiDollarSign,
//   FiUserCheck, FiUserX, FiClock, FiCalendar,
//   FiMail, FiPhone, FiMapPin, FiStar,
//   FiCheck, FiXCircle, FiPauseCircle,
//   FiActivity, FiTool, FiPercent, FiUpload,
//   FiPlus, FiDownload, FiFilter, FiRotateCw,
//   FiExternalLink, FiCreditCard, FiShield,
//   FiTrendingUp, FiTrendingDown, FiPackage
// } from "react-icons/fi";
// import { NavLink, useNavigate } from "react-router-dom";
// import ThanaDistrictlist from "../components/divison&thanalist/ThanaDistrictlist";

// const VendorsList = () => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [editVendor, setEditVendor] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [viewVendor, setViewVendor] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showAddVendorModal, setShowAddVendorModal] = useState(false);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [stats, setStats] = useState({
//     totalVendors: 0,
//     activeVendors: 0,
//     pendingVendors: 0,
//     suspendedVendors: 0,
//     rejectedVendors: 0,
//     totalOrders: 0,
//     completedOrders: 0,
//     pendingOrders: 0,
//     canceledOrders: 0,
//     totalTechnicians: 0,
//     totalRevenue: 0,
//     averageRating: 0
//   });

//   const vendorsPerPage = 10;
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   const statusColors = {
//     active: "bg-green-500/20 text-green-500 border border-green-500/30",
//     pending: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
//     rejected: "bg-red-500/20 text-red-500 border border-red-500/30",
//     suspended: "bg-orange-500/20 text-orange-500 border border-orange-500/30",
//     verified: "bg-blue-500/20 text-blue-500 border border-blue-500/30"
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'active': return <FiCheckCircle className="text-green-500" />;
//       case 'pending': return <FiAlertCircle className="text-yellow-500" />;
//       case 'rejected': return <FiXCircle className="text-red-500" />;
//       case 'suspended': return <FiPauseCircle className="text-orange-500" />;
//       case 'verified': return <FiShield className="text-blue-500" />;
//       default: return <FiAlertCircle className="text-gray-500" />;
//     }
//   };

//   const statusOptions = [
//     { value: "all", label: "All Status", color: "text-gray-400" },
//     { value: "active", label: "Active", color: "text-green-500" },
//     { value: "pending", label: "Pending", color: "text-yellow-500" },
//     { value: "suspended", label: "Suspended", color: "text-orange-500" },
//     { value: "rejected", label: "Rejected", color: "text-red-500" },
//     { value: "verified", label: "Verified", color: "text-blue-500" }
//   ];

//   const sortOptions = [
//     { value: "newest", label: "Newest First" },
//     { value: "oldest", label: "Oldest First" },
//     { value: "name_asc", label: "Name (A-Z)" },
//     { value: "name_desc", label: "Name (Z-A)" },
//     { value: "rating", label: "Highest Rating" },
//     { value: "orders", label: "Most Orders" },
//     { value: "revenue", label: "Highest Revenue" }
//   ];

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

//   const fetchVendors = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem("token");

//     try {
//       console.log("Fetching vendors data...");
//       const res = await axios.get("http://localhost:5001/api/admin/vendors", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           include_stats: true,
//           include_details: true
//         }
//       });

//       console.log("Vendors data received:", res.data);

//       // Check if data is in the expected format
//       if (res.data.success && res.data.vendors) {
//         const vendorsData = res.data.vendors;
//         setVendors(vendorsData);

//         // Calculate detailed statistics
//         calculateStats(vendorsData);
//       } else if (Array.isArray(res.data)) {
//         // If response is directly an array
//         setVendors(res.data);
//         calculateStats(res.data);
//       } else if (res.data.vendors && Array.isArray(res.data.vendors)) {
//         setVendors(res.data.vendors);
//         calculateStats(res.data.vendors);
//       } else {
//         setVendors([]);
//         console.warn("Unexpected data format:", res.data);
//       }

//     } catch (err) {
//       console.error("Fetch vendors error:", err);
//       setError(err.response?.data?.message || "Failed to fetch vendors. Please try again.");

//       // Show error toast
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: err.response?.data?.message || 'Failed to load vendors',
//         timer: 3000,
//         showConfirmButton: false
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const calculateStats = (vendorsData) => {
//     const statsData = {
//       totalVendors: vendorsData.length,
//       activeVendors: vendorsData.filter(v => v.status === 'active').length,
//       pendingVendors: vendorsData.filter(v => v.status === 'pending').length,
//       suspendedVendors: vendorsData.filter(v => v.status === 'suspended').length,
//       rejectedVendors: vendorsData.filter(v => v.status === 'rejected').length,
//       verifiedVendors: vendorsData.filter(v => v.is_verified).length,
//       totalOrders: vendorsData.reduce((sum, v) => sum + (v.total_orders || 0), 0),
//       completedOrders: vendorsData.reduce((sum, v) => sum + (v.completed_orders || 0), 0),
//       pendingOrders: vendorsData.reduce((sum, v) => sum + (v.pending_orders || 0), 0),
//       canceledOrders: vendorsData.reduce((sum, v) => sum + (v.canceled_orders || 0), 0),
//       totalTechnicians: vendorsData.reduce((sum, v) => sum + (v.technician_quantity || 0), 0),
//       totalRevenue: vendorsData.reduce((sum, v) => sum + (v.total_revenue || 0), 0),
//       averageRating: calculateAverageRating(vendorsData)
//     };

//     setStats(statsData);
//   };

//   const calculateAverageRating = (vendorsData) => {
//     const vendorsWithRating = vendorsData.filter(v => v.average_rating > 0);
//     if (vendorsWithRating.length === 0) return 0;

//     const totalRating = vendorsWithRating.reduce((sum, v) => sum + (v.average_rating || 0), 0);
//     return (totalRating / vendorsWithRating.length).toFixed(1);
//   };

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Delete Vendor?",
//       text: "This will permanently remove the vendor and all associated data. This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       reverseButtons: true
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         await axios.delete(`http://localhost:5001/api/admin/vendors/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         Swal.fire({
//           title: "Deleted!",
//           text: "Vendor has been deleted successfully.",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false
//         });

//         fetchVendors();
//       } catch (err) {
//         console.error("Delete error:", err);
//         Swal.fire({
//           title: "Error!",
//           text: err.response?.data?.message || "Failed to delete vendor",
//           icon: "error"
//         });
//       }
//     }
//   };

//   const handleStatusChange = async (vendorId, newStatus) => {
//     const statusLabels = {
//       active: "Active",
//       pending: "Pending",
//       suspended: "Suspended",
//       rejected: "Rejected",
//       verified: "Verified"
//     };

//     const result = await Swal.fire({
//       title: "Change Status",
//       text: `Change vendor status to "${statusLabels[newStatus]}"?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#4f46e5",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, change it!",
//       cancelButtonText: "Cancel"
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         await axios.patch(
//           `http://localhost:5001/api/admin/vendors/${vendorId}/status`,
//           { status: newStatus },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         Swal.fire({
//           title: "Success!",
//           text: "Vendor status updated successfully.",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false
//         });

//         fetchVendors();
//       } catch (err) {
//         console.error("Status change error:", err);
//         Swal.fire({
//           title: "Error!",
//           text: err.response?.data?.message || "Failed to update vendor status",
//           icon: "error"
//         });
//       }
//     }
//   };

//   const handleVerifyVendor = async (vendorId) => {
//     const result = await Swal.fire({
//       title: "Verify Vendor",
//       text: "This will mark the vendor as verified. Verified vendors receive priority in search results.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonColor: "#10b981",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Verify Vendor",
//       cancelButtonText: "Cancel"
//     });

//     if (result.isConfirmed) {
//       const token = localStorage.getItem("token");
//       try {
//         await axios.patch(
//           `http://localhost:5001/api/admin/vendors/${vendorId}/verify`,
//           { is_verified: true },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         Swal.fire({
//           title: "Verified!",
//           text: "Vendor has been verified successfully.",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false
//         });

//         fetchVendors();
//       } catch (err) {
//         console.error("Verification error:", err);
//         Swal.fire({
//           title: "Error!",
//           text: err.response?.data?.message || "Failed to verify vendor",
//           icon: "error"
//         });
//       }
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
//     fetchVendors();
//   }, [fetchVendors]);

//   const filterAndSortVendors = () => {
//     let filtered = vendors;

//     // Apply status filter
//     if (filterStatus !== "all") {
//       filtered = filtered.filter(vendor => vendor.status === filterStatus);
//     }

//     // Apply search filter
//     if (search.trim()) {
//       const searchTerm = search.toLowerCase();
//       filtered = filtered.filter((vendor) => {
//         return (
//           (vendor.name?.toLowerCase() || "").includes(searchTerm) ||
//           (vendor.email?.toLowerCase() || "").includes(searchTerm) ||
//           (vendor.phone?.toString() || "").includes(search) ||
//           (vendor.nid_number?.toString() || "").includes(search) ||
//           (vendor.company_name?.toLowerCase() || "").includes(searchTerm) ||
//           (vendor.service_areas?.some(area => area.toLowerCase().includes(searchTerm)) || false)
//         );
//       });
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return new Date(b.created_at || b.join_date) - new Date(a.created_at || a.join_date);
//         case "oldest":
//           return new Date(a.created_at || a.join_date) - new Date(b.created_at || b.join_date);
//         case "name_asc":
//           return (a.name || "").localeCompare(b.name || "");
//         case "name_desc":
//           return (b.name || "").localeCompare(a.name || "");
//         case "rating":
//           return (b.average_rating || 0) - (a.average_rating || 0);
//         case "orders":
//           return (b.total_orders || 0) - (a.total_orders || 0);
//         case "revenue":
//           return (b.total_revenue || 0) - (a.total_revenue || 0);
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   };

//   const filteredVendors = filterAndSortVendors();
//   const indexOfLastVendor = currentPage * vendorsPerPage;
//   const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
//   const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
//   const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage) || 1;


//   const exportVendorsData = () => {
//     const dataToExport = filteredVendors.map(vendor => ({
//       ID: vendor.id,
//       Name: vendor.name,
//       Email: vendor.email,
//       Phone: vendor.phone,
//       Status: vendor.status,
//       'Total Orders': vendor.total_orders || 0,
//       'Completed Orders': vendor.completed_orders || 0,
//       'Pending Orders': vendor.pending_orders || 0,
//       Rating: vendor.average_rating || 'N/A',
//       'Join Date': new Date(vendor.created_at || vendor.join_date).toLocaleDateString(),
//       'Technicians': vendor.technician_quantity || 0
//     }));

//     // Convert to CSV
//     const headers = Object.keys(dataToExport[0] || {});
//     const csv = [
//       headers.join(','),
//       ...dataToExport.map(row => headers.map(header => `"${row[header]}"`).join(','))
//     ].join('\n');

//     // Download CSV
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();

//     Swal.fire({
//       title: "Exported!",
//       text: `Exported ${dataToExport.length} vendors to CSV`,
//       icon: "success",
//       timer: 2000,
//       showConfirmButton: false
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
//         <p className="text-gray-400">Loading vendors data...</p>
//         <p className="text-sm text-gray-500 mt-2">Please wait while we fetch vendor information</p>
//       </div>
//     );
//   }

//   if (error && vendors.length === 0) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen bg-gray-900 p-4">
//         <div className="alert alert-error shadow-lg max-w-2xl">
//           <div className="flex items-start">
//             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <div className="ml-3">
//               <h3 className="font-bold">Error Loading Vendors</h3>
//               <div className="text-xs">{error}</div>
//             </div>
//           </div>
//           <div className="mt-4">
//             <button
//               onClick={fetchVendors}
//               className="btn btn-sm btn-outline"
//             >
//               <FiRotateCw className="mr-2" /> Retry
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
//         <h1 className="text-xl font-bold">Vendor Management</h1>
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
//           <p className="text-xs text-gray-400 mt-1">Vendor Management</p>
//         </div>
//         <nav className="mt-4 space-y-2">
//           <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/vendors" icon={<FiUsers />} text="Vendor List" onClick={() => setSidebarOpen(false)} active />
//           <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
//           <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
//         </nav>
//         <div className="mt-6 pt-4 border-t border-gray-700">
//           <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
//             <p className="text-sm text-gray-300">Total Vendors</p>
//             <p className="text-2xl font-bold">{stats.totalVendors}</p>
//             <p className="text-xs text-gray-400 mt-1">{stats.activeVendors} active</p>
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
//         {/* Header Section */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold">Vendor Management</h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Manage all vendors, view statistics, and monitor performance
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <div className="badge badge-primary gap-2">
//               <FiUsers /> Total: {vendors.length}
//             </div>
//             <button
//               onClick={exportVendorsData}
//               className="btn btn-outline btn-sm"
//             >
//               <FiDownload className="mr-2" /> Export
//             </button>
//             <button
//               onClick={() => fetchVendors()}
//               className="btn btn-outline btn-sm"
//             >
//               <FiRotateCw className="mr-2" /> Refresh
//             </button>
//             <button
//               onClick={() => setShowAddVendorModal(true)}
//               className="btn btn-primary btn-sm"
//             >
//               <FiUserPlus className="mr-2" /> Add Vendor
//             </button>
//           </div>
//         </div>

//         {/* Stats Dashboard */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
//           <StatsCard
//             title="Total Vendors"
//             value={stats.totalVendors}
//             icon={<FiUsers />}
//             trend={stats.totalVendors > 0 ? "+12%" : "0%"}
//             color="text-blue-500"
//             bgColor="bg-blue-500/10"
//           />
//           <StatsCard
//             title="Active"
//             value={stats.activeVendors}
//             icon={<FiUserCheck />}
//             trend={`${((stats.activeVendors / stats.totalVendors) * 100 || 0).toFixed(0)}%`}
//             color="text-green-500"
//             bgColor="bg-green-500/10"
//           />
//           <StatsCard
//             title="Pending"
//             value={stats.pendingVendors}
//             icon={<FiAlertCircle />}
//             trend={stats.pendingVendors > 0 ? "Needs attention" : "All clear"}
//             color="text-yellow-500"
//             bgColor="bg-yellow-500/10"
//           />
//           <StatsCard
//             title="Total Orders"
//             value={stats.totalOrders}
//             icon={<FiShoppingBag />}
//             trend="+24%"
//             color="text-purple-500"
//             bgColor="bg-purple-500/10"
//           />
//           <StatsCard
//             title="Revenue"
//             value={`$${stats.totalRevenue.toLocaleString()}`}
//             icon={<FiDollarSign />}
//             trend="+18%"
//             color="text-emerald-500"
//             bgColor="bg-emerald-500/10"
//           />
//           <StatsCard
//             title="Avg Rating"
//             value={stats.averageRating}
//             icon={<FiStar />}
//             trend="4.2/5"
//             color="text-amber-500"
//             bgColor="bg-amber-500/10"
//           />
//         </div>

//         {/* Filters and Search */}
//         <div className="card bg-gray-800 shadow-lg mb-6">
//           <div className="card-body p-4">
//             <div className="flex flex-col lg:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiSearch className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search vendors by name, email, phone, NID, company, or service area..."
//                     value={search}
//                     onChange={(e) => {
//                       setSearch(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     className="input input-bordered w-full pl-10 bg-gray-700 border-gray-600 focus:border-primary"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <div className="dropdown dropdown-end">
//                   <button tabIndex={0} className="btn btn-outline btn-sm">
//                     <FiFilter className="mr-2" /> Status: {statusOptions.find(s => s.value === filterStatus)?.label}
//                   </button>
//                   <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
//                     {statusOptions.map((option) => (
//                       <li key={option.value}>
//                         <button
//                           onClick={() => {
//                             setFilterStatus(option.value);
//                             setCurrentPage(1);
//                           }}
//                           className={`flex items-center gap-2 ${option.color} ${filterStatus === option.value ? 'bg-gray-700' : ''}`}
//                         >
//                           <span className="text-xs">{option.label}</span>
//                           {filterStatus === option.value && <FiCheck className="ml-auto" />}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="dropdown dropdown-end">
//                   <button tabIndex={0} className="btn btn-outline btn-sm">
//                     <FiTrendingUp className="mr-2" /> Sort: {sortOptions.find(s => s.value === sortBy)?.label}
//                   </button>
//                   <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-48">
//                     {sortOptions.map((option) => (
//                       <li key={option.value}>
//                         <button
//                           onClick={() => {
//                             setSortBy(option.value);
//                             setCurrentPage(1);
//                           }}
//                           className={`${sortBy === option.value ? 'bg-gray-700' : ''}`}
//                         >
//                           {option.label}
//                           {sortBy === option.value && <FiCheck className="ml-auto" />}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
//               <div className="text-sm text-gray-400">
//                 Showing {filteredVendors.length} of {vendors.length} vendors
//                 {filterStatus !== 'all' && ` (Filtered by: ${statusOptions.find(s => s.value === filterStatus)?.label})`}
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-400">Items per page:</span>
//                 <select
//                   className="select select-sm select-bordered bg-gray-700"
//                   value={vendorsPerPage}
//                   onChange={(e) => {
//                     // Handle per page change if needed
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Vendors Table */}
//         <div className="card bg-gray-800 shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead>
//                 <tr className="border-b border-gray-700 bg-gray-900/50">
//                   <th className="text-gray-400 font-medium">Vendor Info</th>
//                   <th className="text-gray-400 font-medium hidden lg:table-cell">Contact & Details</th>
//                   <th className="text-gray-400 font-medium">Status & Rating</th>
//                   <th className="text-gray-400 font-medium hidden md:table-cell">Orders</th>
//                   <th className="text-gray-400 font-medium hidden sm:table-cell">Performance</th>
//                   <th className="text-gray-400 font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentVendors.length > 0 ? (
//                   currentVendors.map((vendor) => (
//                     <tr key={vendor.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors group">
//                       <td>
//                         <div className="flex items-center gap-3">
//                           <div className="avatar">
//                             <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-gray-700 group-hover:border-primary/30 transition-colors">
//                               {vendor.profile_image || vendor.photo ? (
//                                 <img
//                                   src={vendor.profile_image || vendor.photo}
//                                   alt={vendor.name}
//                                   className="rounded-full w-full h-full object-cover"
//                                   onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
//                                   }}
//                                 />
//                               ) : (
//                                 <span className="text-lg font-bold">{vendor.name?.charAt(0)?.toUpperCase()}</span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="min-w-0">
//                             <div className="flex items-center gap-2">
//                               <p className="font-medium truncate max-w-[180px]">{vendor.name}</p>
//                               {vendor.is_verified && (
//                                 <span className="badge badge-xs badge-info" title="Verified Vendor">
//                                   <FiShield size={10} />
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-xs text-gray-400 mt-1">ID: {vendor.id}</p>
//                             {vendor.company_name && (
//                               <p className="text-xs text-gray-400 truncate max-w-[180px]" title={vendor.company_name}>
//                                 🏢 {vendor.company_name}
//                               </p>
//                             )}
//                             <div className="flex items-center gap-1 mt-1">
//                               <FiCalendar size={12} className="text-gray-500" />
//                               <span className="text-xs text-gray-500">
//                                 Joined: {new Date(vendor.created_at || vendor.join_date).toLocaleDateString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="hidden lg:table-cell">
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             <FiMail className="text-gray-400 text-sm" />
//                             <span className="text-sm truncate max-w-[200px]" title={vendor.email}>
//                               {vendor.email}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <FiPhone className="text-gray-400 text-sm" />
//                             <span className="text-sm">{vendor.phone}</span>
//                           </div>
//                           {vendor.service_areas && Array.isArray(vendor.service_areas) && vendor.service_areas.length > 0 && (
//                             <div className="flex items-start gap-2">
//                               <FiMapPin className="text-gray-400 text-sm mt-1" />
//                               <div>
//                                 <span className="text-xs text-gray-400">Service Areas:</span>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                   {vendor.service_areas.slice(0, 2).map((area, idx) => (
//                                     <span key={idx} className="badge badge-xs badge-outline">
//                                       {area.split(',')[0]}
//                                     </span>
//                                   ))}
//                                   {vendor.service_areas.length > 2 && (
//                                     <span className="badge badge-xs">+{vendor.service_areas.length - 2}</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div className="space-y-2">
//                           <div className="flex items-center gap-2">
//                             {getStatusIcon(vendor.status)}
//                             <div className="flex flex-col">
//                               <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vendor.status] || 'bg-gray-500/20 text-gray-500'}`}>
//                                 {vendor.status?.toUpperCase()}
//                               </span>
//                               {vendor.is_verified && vendor.status === 'active' && (
//                                 <span className="text-xs text-blue-400 mt-1">✓ Verified</span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <FiStar className="text-amber-500 text-sm" />
//                             <span className="text-sm font-medium">{vendor.average_rating || "N/A"}</span>
//                             <span className="text-xs text-gray-400">({vendor.total_reviews || 0} reviews)</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="hidden md:table-cell">
//                         <div className="space-y-2">
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-gray-400">Total:</span>
//                             <span className="font-medium">{vendor.total_orders || 0}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-green-400">Completed:</span>
//                             <span>{vendor.completed_orders || 0}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-yellow-400">Pending:</span>
//                             <span>{vendor.pending_orders || 0}</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="text-sm text-red-400">Canceled:</span>
//                             <span>{vendor.canceled_orders || 0}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="hidden sm:table-cell">
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-400">Success Rate:</span>
//                             <span className="font-medium">
//                               {vendor.completed_orders && vendor.total_orders ?
//                                 Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-400">Technicians:</span>
//                             <div className="flex items-center gap-1">
//                               <FiTool className="text-purple-500 text-sm" />
//                               <span className="font-medium">{vendor.technician_quantity || 0}</span>
//                             </div>
//                           </div>
//                           {vendor.total_revenue && (
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm text-gray-400">Revenue:</span>
//                               <span className="font-medium text-emerald-500">
//                                 ${(vendor.total_revenue || 0).toLocaleString()}
//                               </span>
//                             </div>
//                           )}
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-400">Response Time:</span>
//                             <span className="font-medium">{vendor.avg_response_time || "N/A"} mins</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="flex flex-wrap gap-1">
//                           <button
//                             onClick={() => {
//                               setViewVendor(vendor);
//                               document.getElementById("view_vendor_modal").showModal();
//                             }}
//                             className="btn btn-xs btn-ghost btn-square text-info hover:bg-info/20 tooltip"
//                             data-tip="View Details"
//                           >
//                             <FiEye className="w-4 h-4" />
//                           </button>

//                           <button
//                             onClick={() => {
//                               // Edit functionality
//                               setEditVendor(vendor);
//                               // You can implement edit modal here
//                             }}
//                             className="btn btn-xs btn-ghost btn-square text-warning hover:bg-warning/20 tooltip"
//                             data-tip="Edit Vendor"
//                           >
//                             <FiEdit className="w-4 h-4" />
//                           </button>

//                           {/* Status Actions Dropdown */}
//                           <div className="dropdown dropdown-end">
//                             <button tabIndex={0} className="btn btn-xs btn-ghost btn-square text-primary hover:bg-primary/20 tooltip" data-tip="Change Status">
//                               <FiActivity className="w-4 h-4" />
//                             </button>
//                             <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-40">
//                               <li className="menu-title text-xs text-gray-400 mb-1">Change Status</li>
//                               <li>
//                                 <button
//                                   onClick={() => handleStatusChange(vendor.id, 'active')}
//                                   className="text-green-500 hover:bg-green-500/10"
//                                 >
//                                   <FiCheckCircle /> Active
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   onClick={() => handleStatusChange(vendor.id, 'pending')}
//                                   className="text-yellow-500 hover:bg-yellow-500/10"
//                                 >
//                                   <FiAlertCircle /> Pending
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   onClick={() => handleStatusChange(vendor.id, 'suspended')}
//                                   className="text-orange-500 hover:bg-orange-500/10"
//                                 >
//                                   <FiPauseCircle /> Suspend
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   onClick={() => handleStatusChange(vendor.id, 'rejected')}
//                                   className="text-red-500 hover:bg-red-500/10"
//                                 >
//                                   <FiXCircle /> Reject
//                                 </button>
//                               </li>
//                               <div className="divider my-1"></div>
//                               <li>
//                                 <button
//                                   onClick={() => handleVerifyVendor(vendor.id)}
//                                   className="text-blue-500 hover:bg-blue-500/10"
//                                   disabled={vendor.is_verified}
//                                 >
//                                   <FiShield /> {vendor.is_verified ? 'Verified' : 'Verify'}
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>

//                           <button
//                             onClick={() => handleDelete(vendor.id)}
//                             className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/20 tooltip"
//                             data-tip="Delete Vendor"
//                           >
//                             <FiTrash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center py-12">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiUserX className="text-4xl text-gray-500 mb-4" />
//                         <h3 className="text-lg font-medium text-gray-300 mb-2">No vendors found</h3>
//                         <p className="text-gray-400 mb-4">
//                           {search || filterStatus !== 'all'
//                             ? 'Try changing your search or filter criteria'
//                             : 'No vendors have been registered yet'}
//                         </p>
//                         <button
//                           onClick={() => {
//                             setSearch('');
//                             setFilterStatus('all');
//                             setSortBy('newest');
//                           }}
//                           className="btn btn-sm btn-outline"
//                         >
//                           Clear Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {currentVendors.length > 0 && (
//             <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-700 gap-4">
//               <div className="text-sm text-gray-400">
//                 Showing {indexOfFirstVendor + 1} to {Math.min(indexOfLastVendor, filteredVendors.length)} of {filteredVendors.length} vendors
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

//         {/* View Vendor Modal - Enhanced */}
//         <dialog id="view_vendor_modal" className="modal modal-bottom sm:modal-middle">
//           <div className="modal-box max-w-5xl bg-gray-800 border border-gray-700 max-h-[90vh] overflow-y-auto">
//             <form method="dialog">
//               <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
//             </form>

//             {viewVendor && (
//               <EnhancedVendorDetails
//                 vendor={viewVendor}
//                 onStatusChange={handleStatusChange}
//                 onVerify={handleVerifyVendor}
//                 statusColors={statusColors} // এই props টি যোগ করুন
//                 getStatusIcon={getStatusIcon} // এই props টি যোগ করুন
//               />
//             )}
//           </div>
//           <form method="dialog" className="modal-backdrop">
//             <button>close</button>
//           </form>
//         </dialog>

//         {/* Add Vendor Modal */}
//         {showAddVendorModal && (
//           <AddVendorModal
//             onClose={() => setShowAddVendorModal(false)}
//             onSuccess={() => {
//               setShowAddVendorModal(false);
//               fetchVendors();
//             }}
//           />
//         )}
//       </main>
//     </div>
//   );
// };

// // Enhanced Vendor Details Component
// const EnhancedVendorDetails = ({
//   vendor,
//   onStatusChange,
//   onVerify,
//   statusColors, // props হিসেবে গ্রহণ করুন
//   getStatusIcon // props হিসেবে গ্রহণ করুন
// }) => {
//   const [activeTab, setActiveTab] = useState("overview");

//   const formatServiceAreas = (areas) => {
//     if (!areas) return [];
//     if (Array.isArray(areas)) return areas;
//     try {
//       return JSON.parse(areas);
//     } catch (e) {
//       return areas.split ? [areas] : [];
//     }
//   };

//   const formatServices = (services) => {
//     if (!services) return [];
//     if (Array.isArray(services)) return services;
//     try {
//       return JSON.parse(services);
//     } catch (e) {
//       return services.split ? services.split(',').map(s => s.trim()) : [];
//     }
//   };

//   const serviceLabels = {
//     'ac_service': 'AC Service ❄️',
//     'fridge_service': 'Fridge Service 🧊',
//     'tv_service': 'TV Service 📺',
//     'oven_service': 'Oven Service 🔥',
//     'washing_machine': 'Washing Machine 🧺',
//     'hvac_vrf': 'HVAC/VRF 🌡️',
//     'geyser': 'Geyser ♨️',
//     'water_purifier': 'Water Purifier 💧',
//     'electrical': 'Electrical ⚡',
//     'plumbing': 'Plumbing 🔧',
//     'carpentry': 'Carpentry 🪚',
//     'painting': 'Painting 🎨'
//   };

//   const tabs = [
//     { id: "overview", label: "Overview", icon: <FiActivity /> },
//     { id: "details", label: "Details", icon: <FiUserCheck /> },
//     { id: "services", label: "Services", icon: <FiTool /> },
//     { id: "orders", label: "Orders", icon: <FiShoppingBag /> },
//     { id: "documents", label: "Documents", icon: <FiFile /> }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Vendor Header */}
//       <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-6 border-b border-gray-700">
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-gray-700">
//               {vendor.profile_image || vendor.photo ? (
//                 <img
//                   src={vendor.profile_image || vendor.photo}
//                   alt={vendor.name}
//                   className="rounded-full w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.parentElement.innerHTML = `<span class="text-3xl font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
//                   }}
//                 />
//               ) : (
//                 <span className="text-3xl font-bold">{vendor.name?.charAt(0)?.toUpperCase()}</span>
//               )}
//             </div>
//           </div>
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <h3 className="text-2xl font-bold">{vendor.name}</h3>
//               {vendor.is_verified && (
//                 <span className="badge badge-info gap-1">
//                   <FiShield size={14} /> Verified
//                 </span>
//               )}
//             </div>
//             <p className="text-gray-400">Vendor ID: {vendor.id}</p>
//             <p className="text-gray-400">{vendor.company_name || "Individual Vendor"}</p>
//             <div className="flex gap-2 mt-3">
//               <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColors[vendor.status]}`}>
//                 {getStatusIcon(vendor.status)}
//                 {vendor.status?.toUpperCase()}
//               </span>
//               <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
//                 Joined: {new Date(vendor.created_at || vendor.join_date).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
//           <button
//             onClick={() => {
//               document.getElementById("view_vendor_modal").close();
//               onVerify(vendor.id);
//             }}
//             className={`btn btn-sm ${vendor.is_verified ? 'btn-disabled' : 'btn-info'}`}
//             disabled={vendor.is_verified}
//           >
//             <FiShield /> {vendor.is_verified ? 'Verified' : 'Verify Vendor'}
//           </button>
//           <button
//             onClick={() => {
//               document.getElementById("view_vendor_modal").close();
//               onStatusChange(vendor.id, 'active');
//             }}
//             className={`btn btn-sm ${vendor.status === 'active' ? 'btn-disabled' : 'btn-success'}`}
//             disabled={vendor.status === 'active'}
//           >
//             <FiCheckCircle /> Approve
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="tabs tabs-boxed bg-gray-700/50 p-1">
//         {tabs.map(tab => (
//           <button
//             key={tab.id}
//             className={`tab ${activeTab === tab.id ? 'tab-active bg-gray-800' : ''} flex items-center gap-2`}
//             onClick={() => setActiveTab(tab.id)}
//           >
//             {tab.icon}
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content */}
//       <div className="mt-6">
//         {activeTab === "overview" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                 <FiMail /> Contact Info
//               </h4>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-gray-800 rounded-lg">
//                     <FiMail className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Email</p>
//                     <p className="font-medium">{vendor.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-gray-800 rounded-lg">
//                     <FiPhone className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Phone</p>
//                     <p className="font-medium">{vendor.phone}</p>
//                   </div>
//                 </div>
//                 {vendor.nid_number && (
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-gray-800 rounded-lg">
//                       <FiCreditCard className="text-gray-400" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-400">NID Number</p>
//                       <p className="font-medium">{vendor.nid_number}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                 <FiTrendingUp /> Business Stats
//               </h4>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gray-800 p-3 rounded-lg">
//                   <p className="text-sm text-gray-400">Total Orders</p>
//                   <p className="text-2xl font-bold">{vendor.total_orders || 0}</p>
//                 </div>
//                 <div className="bg-gray-800 p-3 rounded-lg">
//                   <p className="text-sm text-green-400">Completed</p>
//                   <p className="text-2xl font-bold text-green-500">{vendor.completed_orders || 0}</p>
//                 </div>
//                 <div className="bg-gray-800 p-3 rounded-lg">
//                   <p className="text-sm text-yellow-400">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-500">{vendor.pending_orders || 0}</p>
//                 </div>
//                 <div className="bg-gray-800 p-3 rounded-lg">
//                   <p className="text-sm text-red-400">Cancelled</p>
//                   <p className="text-2xl font-bold text-red-500">{vendor.canceled_orders || 0}</p>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Success Rate:</span>
//                   <span className="font-bold">
//                     {vendor.completed_orders && vendor.total_orders ?
//                       Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Average Rating:</span>
//                   <div className="flex items-center gap-1">
//                     <FiStar className="text-yellow-500" />
//                     <span className="font-bold">{vendor.average_rating || "N/A"}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
//                 <FiTool /> Service Info
//               </h4>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Technicians:</span>
//                   <span className="font-bold flex items-center gap-1">
//                     <FiTool className="text-purple-500" />
//                     {vendor.technician_quantity || 0}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Response Time:</span>
//                   <span className="font-bold">{vendor.avg_response_time || "N/A"} mins</span>
//                 </div>
//                 {vendor.total_revenue && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Total Revenue:</span>
//                     <span className="font-bold text-emerald-500">
//                       ${(vendor.total_revenue || 0).toLocaleString()}
//                     </span>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-sm text-gray-400 mb-2">Service Areas:</p>
//                   <div className="flex flex-wrap gap-1">
//                     {formatServiceAreas(vendor.service_areas).slice(0, 3).map((area, idx) => (
//                       <span key={idx} className="badge badge-outline text-xs">
//                         {area}
//                       </span>
//                     ))}
//                     {formatServiceAreas(vendor.service_areas).length > 3 && (
//                       <span className="badge text-xs">
//                         +{formatServiceAreas(vendor.service_areas).length - 3} more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "details" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Personal Information</h4>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-gray-400">Full Name</p>
//                     <p className="font-medium">{vendor.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Date of Birth</p>
//                     <p className="font-medium">{vendor.dob ? new Date(vendor.dob).toLocaleDateString() : "Not provided"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">NID Number</p>
//                     <p className="font-medium">{vendor.nid_number || "Not provided"}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Address Information</h4>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-sm text-gray-400">Permanent Address</p>
//                     <p className="font-medium">{vendor.permanent_address || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Present Address</p>
//                     <p className="font-medium">{vendor.present_address || "Not provided"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-400">Business Address</p>
//                     <p className="font-medium">{vendor.business_address || "Not provided"}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3">Company Information</h4>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-400">Company Name</p>
//                   <p className="font-medium">{vendor.company_name || "Individual/Not registered"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Registration Date</p>
//                   <p className="font-medium">
//                     {vendor.registration_date ? new Date(vendor.registration_date).toLocaleDateString() : "N/A"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-400">Business Type</p>
//                   <p className="font-medium">{vendor.business_type || "Service Provider"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "services" && (
//           <div className="space-y-6">
//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3">Services Offered</h4>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                 {formatServices(vendor.services).map((service, idx) => (
//                   <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
//                     <div className="text-2xl">
//                       {serviceLabels[service]?.split(' ').pop() || '🔧'}
//                     </div>
//                     <div>
//                       <p className="font-medium">{serviceLabels[service]?.split(' ').slice(0, -1).join(' ') || service}</p>
//                       <p className="text-xs text-gray-400">Service Category</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {formatServices(vendor.services).length === 0 && (
//                 <p className="text-center text-gray-400 py-4">No services listed</p>
//               )}
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3">Service Areas</h4>
//               <div className="space-y-3">
//                 {formatServiceAreas(vendor.service_areas).map((area, idx) => (
//                   <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
//                     <FiMapPin className="text-gray-400" />
//                     <p className="font-medium">{area}</p>
//                   </div>
//                 ))}
//                 {formatServiceAreas(vendor.service_areas).length === 0 && (
//                   <p className="text-center text-gray-400 py-4">No service areas specified</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "orders" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Order Statistics</h4>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Total Orders</span>
//                     <span className="text-2xl font-bold">{vendor.total_orders || 0}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Success Rate</span>
//                     <span className="text-xl font-bold text-green-500">
//                       {vendor.completed_orders && vendor.total_orders ?
//                         Math.round((vendor.completed_orders / vendor.total_orders) * 100) : 0}%
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Avg Order Value</span>
//                     <span className="text-xl font-bold">
//                       ${((vendor.total_revenue || 0) / (vendor.total_orders || 1)).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Order Status</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-green-400">Completed</span>
//                     <span className="font-medium">{vendor.completed_orders || 0}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-yellow-400">Pending</span>
//                     <span className="font-medium">{vendor.pending_orders || 0}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-red-400">Cancelled</span>
//                     <span className="font-medium">{vendor.canceled_orders || 0}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-blue-400">In Progress</span>
//                     <span className="font-medium">{vendor.in_progress_orders || 0}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Performance Metrics</h4>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Response Time</span>
//                     <span className="font-medium">{vendor.avg_response_time || "N/A"} mins</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Completion Time</span>
//                     <span className="font-medium">{vendor.avg_completion_time || "N/A"} hours</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Customer Rating</span>
//                     <div className="flex items-center gap-1">
//                       <FiStar className="text-yellow-500" />
//                       <span className="font-medium">{vendor.average_rating || "N/A"}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3">Revenue Overview</h4>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Total Revenue</span>
//                   <span className="text-2xl font-bold text-emerald-500">
//                     ${(vendor.total_revenue || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">This Month</span>
//                   <span className="text-xl font-bold">
//                     ${(vendor.monthly_revenue || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Last Month</span>
//                   <span className="text-xl font-bold">
//                     ${(vendor.last_month_revenue || 0).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "documents" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Identity Documents</h4>
//                 <div className="space-y-3">
//                   {vendor.nid_front && (
//                     <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-700 rounded">
//                           <FiCreditCard className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="font-medium">NID Front</p>
//                           <p className="text-xs text-gray-400">Identity Document</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => window.open(vendor.nid_front, '_blank')}
//                         className="btn btn-xs btn-outline"
//                       >
//                         <FiExternalLink /> View
//                       </button>
//                     </div>
//                   )}
//                   {vendor.nid_back && (
//                     <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-700 rounded">
//                           <FiCreditCard className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="font-medium">NID Back</p>
//                           <p className="text-xs text-gray-400">Identity Document</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => window.open(vendor.nid_back, '_blank')}
//                         className="btn btn-xs btn-outline"
//                       >
//                         <FiExternalLink /> View
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="card bg-gray-700/30 p-4">
//                 <h4 className="font-semibold text-lg mb-3">Business Documents</h4>
//                 <div className="space-y-3">
//                   {vendor.trade_license && (
//                     <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-700 rounded">
//                           <FiFile className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Trade License</p>
//                           <p className="text-xs text-gray-400">Business Registration</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => window.open(vendor.trade_license, '_blank')}
//                         className="btn btn-xs btn-outline"
//                       >
//                         <FiExternalLink /> View
//                       </button>
//                     </div>
//                   )}
//                   {vendor.cv && (
//                     <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gray-700 rounded">
//                           <FiFile className="text-gray-400" />
//                         </div>
//                         <div>
//                           <p className="font-medium">CV/Resume</p>
//                           <p className="text-xs text-gray-400">Professional Profile</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => window.open(vendor.cv, '_blank')}
//                         className="btn btn-xs btn-outline"
//                       >
//                         <FiExternalLink /> View
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-gray-700/30 p-4">
//               <h4 className="font-semibold text-lg mb-3">Additional Information</h4>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Account Created</span>
//                   <span className="font-medium">
//                     {new Date(vendor.created_at || vendor.join_date).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Last Updated</span>
//                   <span className="font-medium">
//                     {vendor.updated_at ? new Date(vendor.updated_at).toLocaleDateString() : "Never"}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-400">Last Login</span>
//                   <span className="font-medium">
//                     {vendor.last_login ? new Date(vendor.last_login).toLocaleString() : "Never"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-2 justify-end pt-6 border-t border-gray-700">
//         <button
//           onClick={() => {
//             document.getElementById("view_vendor_modal").close();
//             onStatusChange(vendor.id, 'suspended');
//           }}
//           className="btn btn-warning"
//         >
//           <FiPauseCircle /> Suspend
//         </button>
//         <button
//           onClick={() => {
//             document.getElementById("view_vendor_modal").close();
//             onStatusChange(vendor.id, 'rejected');
//           }}
//           className="btn btn-error"
//         >
//           <FiXCircle /> Reject
//         </button>
//         <button
//           onClick={() => {
//             // Navigate to vendor's order history
//             // navigate(`/admin/orders?vendor=${vendor.id}`);
//           }}
//           className="btn btn-primary"
//         >
//           <FiShoppingBag /> View Orders
//         </button>
//       </div>
//     </div>
//   );
// };

// // Add FiFile icon import if not already included
// const FiFile = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//   </svg>
// );

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

// // Enhanced StatsCard component
// const StatsCard = ({ title, value, icon, trend, color = "text-white", bgColor = "bg-gray-800" }) => (
//   <div className={`card ${bgColor} shadow-lg hover:shadow-xl transition-shadow`}>
//     <div className="card-body p-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
//           <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
//         </div>
//         <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')}/10`}>
//           {icon}
//         </div>
//       </div>
//       {trend && (
//         <div className="flex items-center gap-1 mt-3">
//           {trend.includes('+') ? (
//             <FiTrendingUp className="text-green-500" />
//           ) : trend.includes('-') ? (
//             <FiTrendingDown className="text-red-500" />
//           ) : null}
//           <span className={`text-xs ${trend.includes('+') ? 'text-green-500' : trend.includes('-') ? 'text-red-500' : 'text-gray-400'}`}>
//             {trend}
//           </span>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // Keep your existing AddVendorModal component (same as before)
// const AddVendorModal = ({ onClose, onSuccess }) => {
//   // ... (same AddVendorModal component code from your original)
// };

// export default VendorsList;


import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
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

  const vendorsPerPage = 10;
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
      console.log("Fetching vendors data...");
      const res = await axios.get("http://localhost:5001/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          include_stats: true,
          include_details: true
        }
      });

      console.log("Vendors data received:", res.data);

      if (res.data.success && res.data.vendors) {
        const vendorsData = res.data.vendors;
        setVendors(vendorsData);
        calculateStats(vendorsData);
      } else if (Array.isArray(res.data)) {
        setVendors(res.data);
        calculateStats(res.data);
      } else if (res.data.vendors && Array.isArray(res.data.vendors)) {
        setVendors(res.data.vendors);
        calculateStats(res.data.vendors);
      } else {
        setVendors([]);
        console.warn("Unexpected data format:", res.data);
      }

    } catch (err) {
      console.error("Fetch vendors error:", err);
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
        const response = await axios.delete(`http://localhost:5001/api/admin/vendors/${id}`, {
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
        await axios.patch(
          `http://localhost:5001/api/admin/vendors/${vendorId}/status`,
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
        await axios.patch(
          `http://localhost:5001/api/admin/vendors/${vendorId}/verify`,
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
      {/* Mobile Sidebar Toggle */}
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

      {/* Sidebar */}
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

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 lg:ml-0">
        {/* Header Section */}
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

        {/* Stats Dashboard */}
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

        {/* Filters and Search */}
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

        {/* Vendors Table */}
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
                                  src={vendor.profile_image || vendor.photo}
                                  alt={vendor.name}
                                  className="rounded-full w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `<span class="text-lg font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
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

                          {/* Status Actions Dropdown */}
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

          {/* Pagination */}
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

        {/* View Vendor Modal - Fully Responsive */}
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

        {/* Add Vendor Modal */}
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

// Fully Responsive Vendor Details Component
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

  // Collect all vendor documents
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
    
    if (vendor.documents && Array.isArray(vendor.documents)) {
      vendor.documents.forEach((doc, idx) => {
        docs.push({
          type: 'document',
          label: doc.name || `Document ${idx + 1}`,
          url: doc.url,
          icon: <FiFile className="text-gray-400 text-base sm:text-lg" />
        });
      });
    }
    
    setDocuments(docs);
  }, [vendor]);

  const formatServiceAreas = (areas) => {
    if (!areas) return [];
    if (Array.isArray(areas)) return areas;
    try {
      return JSON.parse(areas);
    } catch (e) {
      return areas.split ? [areas] : [];
    }
  };

  const formatServices = (services) => {
    if (!services) return [];
    if (Array.isArray(services)) return services;
    try {
      return JSON.parse(services);
    } catch (e) {
      return services.split ? services.split(',').map(s => s.trim()) : [];
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

  const viewDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleActiveAction = async (action, actionType) => {
    if (actionType === 'status') {
      await onStatusChange(vendor.id, action);
    } else if (actionType === 'verify') {
      await onVerify(vendor.id);
    } else if (actionType === 'delete') {
      await onDelete(vendor.id);
      if (document.getElementById("view_vendor_modal")) {
        document.getElementById("view_vendor_modal").close();
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Vendor Header - Fully Responsive */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-6 items-start xs:items-center pb-4 sm:pb-6 border-b border-gray-700">
        <div className="flex items-center gap-3 sm:gap-4 w-full xs:w-auto">
          <div className="avatar flex-shrink-0">
            <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-gray-700">
              {vendor.profile_image || vendor.photo ? (
                <img
                  src={vendor.profile_image || vendor.photo}
                  alt={vendor.name}
                  className="rounded-full w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-xl xs:text-2xl sm:text-3xl font-bold">${vendor.name?.charAt(0)?.toUpperCase()}</span>`;
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

        {/* Action Buttons - Fully Responsive */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full xs:w-auto justify-start xs:justify-end mt-2 xs:mt-0">
          <button
            onClick={() => handleActiveAction('verify', 'verify')}
            className={`btn btn-xs xs:btn-sm ${vendor.is_verified ? 'btn-disabled opacity-50' : 'btn-info'} flex-1 xs:flex-none min-w-[60px]`}
            disabled={vendor.is_verified}
          >
            <FiShield className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">{vendor.is_verified ? 'Verified' : 'Verify'}</span>
            <span className="xs:hidden">{vendor.is_verified ? '✓' : '✔'}</span>
          </button>
          <button
            onClick={() => handleActiveAction('active', 'status')}
            className={`btn btn-xs xs:btn-sm ${vendor.status === 'active' ? 'btn-disabled opacity-50' : 'btn-success'} flex-1 xs:flex-none min-w-[60px]`}
            disabled={vendor.status === 'active'}
          >
            <FiCheckCircle className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">Activate</span>
            <span className="xs:hidden">▶</span>
          </button>
          <button
            onClick={() => handleActiveAction('delete', 'delete')}
            className="btn btn-xs xs:btn-sm btn-error flex-1 xs:flex-none min-w-[60px]"
          >
            <FiTrash2 className="text-xs xs:text-sm" /> 
            <span className="hidden xs:inline">Delete</span>
            <span className="xs:hidden">✕</span>
          </button>
        </div>
      </div>

      {/* Tabs - Fully Responsive with Scroll */}
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

      {/* Tab Content - Fully Responsive */}
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
                    <p className="font-medium text-xs xs:text-sm truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">{vendor.email}</p>
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
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Date of Birth</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base">{vendor.dob ? new Date(vendor.dob).toLocaleDateString() : "Not provided"}</p>
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
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.permanent_address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Present Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.present_address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Business Address</p>
                    <p className="font-medium text-xs xs:text-sm sm:text-base break-words">{vendor.business_address || "Not provided"}</p>
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
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Registration Date</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base">
                    {vendor.registration_date ? new Date(vendor.registration_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Business Type</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base">{vendor.business_type || "Service Provider"}</p>
                </div>
                <div>
                  <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400">Business Phone</p>
                  <p className="font-medium text-xs xs:text-sm sm:text-base">{vendor.business_phone || "N/A"}</p>
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
                  <div className="flex items-center justify-between p-1 xs:p-1.5 sm:p-2 bg-gray-800 rounded">
                    <span className="text-[8px] xs:text-[10px] sm:text-xs text-blue-400">In Progress</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.in_progress_orders || 0}</span>
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
                    <span className="text-xs xs:text-sm text-gray-400">Completion Time</span>
                    <span className="font-medium text-xs xs:text-sm">{vendor.avg_completion_time || "N/A"} hours</span>
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
                        className="btn btn-xs btn-outline flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiExternalLink className="text-[10px] xs:text-xs" /> View
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
                        className="btn btn-xs btn-outline flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiExternalLink className="text-[10px] xs:text-xs" /> View
                      </button>
                    </div>
                  )}
                  {!vendor.nid_front && !vendor.nid_back && (
                    <p className="text-center text-gray-400 py-2 xs:py-3 sm:py-4 text-[10px] xs:text-xs sm:text-sm">No identity documents uploaded</p>
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
                        className="btn btn-xs btn-outline flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiExternalLink className="text-[10px] xs:text-xs" /> View
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
                        className="btn btn-xs btn-outline flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiExternalLink className="text-[10px] xs:text-xs" /> View
                      </button>
                    </div>
                  )}
                  {!vendor.trade_license && !vendor.cv && (
                    <p className="text-center text-gray-400 py-2 xs:py-3 sm:py-4 text-[10px] xs:text-xs sm:text-sm">No business documents uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Image Section */}
            {(vendor.profile_image || vendor.photo) && (
              <div className="card bg-gray-700/30 p-2 xs:p-3 sm:p-4">
                <h4 className="font-semibold text-xs xs:text-sm sm:text-base mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <FiImage className="text-blue-400 text-xs sm:text-sm" /> Profile Image
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div className="relative group">
                    <img
                      src={vendor.profile_image || vendor.photo}
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

            {/* All Documents Section */}
            {documents.length > 0 && (
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
                        className="btn btn-xs btn-outline flex-shrink-0 ml-1 xs:ml-2"
                      >
                        <FiExternalLink className="text-[10px] xs:text-xs" /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons - Fully Responsive */}
      <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-end pt-3 sm:pt-4 md:pt-6 border-t border-gray-700">
        <button
          onClick={() => {
            if (document.getElementById("view_vendor_modal")) {
              document.getElementById("view_vendor_modal").close();
            }
            onStatusChange(vendor.id, 'suspended');
          }}
          className="btn btn-xs xs:btn-sm sm:btn-md btn-warning flex-1 xs:flex-none"
        >
          <FiPauseCircle className="text-xs xs:text-sm" /> 
          <span className="hidden 2xs:inline">Suspend</span>
          <span className="2xs:hidden">⏸</span>
        </button>
        <button
          onClick={() => {
            if (document.getElementById("view_vendor_modal")) {
              document.getElementById("view_vendor_modal").close();
            }
            onStatusChange(vendor.id, 'rejected');
          }}
          className="btn btn-xs xs:btn-sm sm:btn-md btn-error flex-1 xs:flex-none"
        >
          <FiXCircle className="text-xs xs:text-sm" /> 
          <span className="hidden 2xs:inline">Reject</span>
          <span className="2xs:hidden">✕</span>
        </button>
        <button
          onClick={() => {
            // Navigate to vendor's order history
          }}
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

// Enhanced StatsCard component
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

// AddVendorModal component
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
      await axios.post("http://localhost:5001/api/admin/vendors", formData, {
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