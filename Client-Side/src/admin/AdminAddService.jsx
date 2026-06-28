// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const API_BASE = 'http://localhost:5001/api';

// const AdminServiceManager = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState(''); // 'success' or 'error'

//   // Form state
//   const [form, setForm] = useState({
//     _id: '',
//     name: '',
//     category: '',
//     price: '',
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [editingServiceId, setEditingServiceId] = useState(null);

//   // Fetch all services from backend
//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/services`);
//       setServices(res.data); // adjust if your backend returns {services: [...]}
//     } catch (err) {
//       setMessage('Failed to load services');
//       setStatus('error');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // Form input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'image') {
//       const file = files[0];
//       setForm((prev) => ({ ...prev, image: file }));
//       if (file) setImagePreview(URL.createObjectURL(file));
//       else setImagePreview(null);
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Start editing a service
//   const startEdit = (service) => {
//     setEditingServiceId(service._id);
//     setForm({
//       _id: service._id,
//       name: service.name,
//       category: service.category,
//       price: service.price,
//       image: null, // new image upload optional on edit
//     });
//     setImagePreview(service.image); // show current image URL as preview
//     setMessage('');
//     setStatus('');
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingServiceId(null);
//     setForm({ _id: '', name: '', category: '', price: '', image: null });
//     setImagePreview(null);
//     setMessage('');
//     setStatus('');
//   };

//   // Delete service
//   const handleDelete = async (_id) => {
//     if (!window.confirm('Are you sure you want to delete this service?')) return;

//     try {
//       await axios.delete(`${API_BASE}/services/${_id}`);
//       setMessage('Service deleted successfully');
//       setStatus('success');
//       fetchServices();
//     } catch (err) {
//       setMessage('Delete failed');
//       setStatus('error');
//     }
//   };

//   // Submit add or update
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { _id, name, category, price, image } = form;
//     if (!_id || !name || !category || !price) {
//       setMessage('All fields except image are required');
//       setStatus('error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('_id', _id);
//     formData.append('name', name);
//     formData.append('category', category);
//     formData.append('price', price);
//     if (image) formData.append('image', image);

//     try {
//       let res;
//       if (editingServiceId) {
//         // Update existing service
//         res = await axios.put(`${API_BASE}/services/${editingServiceId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         // Add new service
//         res = await axios.post(`${API_BASE}/services`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }

//       if (res.data.success) {
//         setMessage(editingServiceId ? 'Service updated successfully' : 'Service added successfully');
//         setStatus('success');
//         setForm({ _id: '', name: '', category: '', price: '', image: null });
//         setImagePreview(null);
//         setEditingServiceId(null);
//         fetchServices();
//       } else {
//         setMessage(res.data.message || 'Operation failed');
//         setStatus('error');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Server error');
//       setStatus('error');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 bg-base-200 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4 text-white">
//         {editingServiceId ? 'Edit Service' : 'Add New Service'}
//       </h2>

//       {message && (
//         <div
//           className={`mb-4 p-3 rounded text-white ${
//             status === 'success' ? 'bg-green-700' : 'bg-red-600'
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-6">
//         <label className="block mb-1 font-medium text-white">Service ID:</label>
//         <input
//           type="text"
//           name="_id"
//           value={form._id}
//           onChange={handleChange}
//           className="input input-bordered w-full mb-4"
//           placeholder="Unique ID (e.g. AcJetWash1)"
//           disabled={!!editingServiceId} // disallow changing ID on edit
//         />

//         <label className="block mb-1 font-medium text-white">Service Name:</label>
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           className="input input-bordered w-full mb-4"
//           placeholder="AC Jet Wash"
//         />

//         <label className="block mb-1 font-medium text-white">Category:</label>
//         <input
//           type="text"
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           className="input input-bordered w-full mb-4"
//           placeholder="AC Service"
//         />

//         <label className="block mb-1 font-medium text-white">Price (BDT):</label>
//         <input
//           type="number"
//           name="price"
//           value={form.price}
//           onChange={handleChange}
//           className="input input-bordered w-full mb-4"
//           placeholder="e.g. 1200"
//         />

//         <label className="block mb-2 font-medium text-white">Service Image:</label>
//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           accept="image/*"
//           className="file-input file-input-bordered w-full mb-4"
//         />

//         {imagePreview && (
//           <img
//             src={imagePreview}
//             alt="Preview"
//             className="w-full h-40 object-contain rounded mb-4 border border-gray-600"
//           />
//         )}

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className={`btn btn-primary flex-grow ${loading ? 'btn-disabled' : ''}`}
//             disabled={loading}
//           >
//             {loading ? 'Saving...' : editingServiceId ? 'Update Service' : 'Add Service'}
//           </button>

//           {editingServiceId && (
//             <button
//               type="button"
//               className="btn btn-secondary flex-grow"
//               onClick={cancelEdit}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Services List */}
//       <h3 className="text-xl font-semibold mb-2 text-white">All Services</h3>
//       {loading ? (
//         <p className="text-white">Loading...</p>
//       ) : services.length === 0 ? (
//         <p className="text-white">No services found.</p>
//       ) : (
//         <table className="table w-full text-white bg-gray-800 rounded">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Price (BDT)</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {services.map((service) => (
//               <tr key={service._id}>
//                 <td>{service._id}</td>
//                 <td>{service.name}</td>
//                 <td>{service.category}</td>
//                 <td>{service.price}</td>
//                 <td>
//                   <img
//                     src={service.image}
//                     alt={service.name}
//                     className="w-20 h-12 object-contain rounded"
//                   />
//                 </td>
//                 <td className="flex gap-2">
//                   <button
//                     className="btn btn-sm btn-info"
//                     onClick={() => startEdit(service)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-error"
//                     onClick={() => handleDelete(service._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminServiceManager;

// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, NavLink } from "react-router-dom";
// import axios from 'axios';
// import { Plus, X } from 'lucide-react';
// import { FiHome, FiLogOut, FiMenu, FiPackage, FiPieChart, FiSettings, FiShoppingBag, FiTruck, FiUsers } from 'react-icons/fi';

// const API_BASE = 'http://localhost:5001/api';

// const AdminServiceManager = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);

//   const [form, setForm] = useState({
//     _id: '',
//     name: '',
//     category: '',
//     price: '',
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [editingServiceId, setEditingServiceId] = useState(null);

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE}/services`);
//       setServices(res.data);
//     } catch (err) {
//       setMessage('Failed to load services');
//       setStatus('error');
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'image') {
//       const file = files[0];
//       setForm((prev) => ({ ...prev, image: file }));
//       if (file) setImagePreview(URL.createObjectURL(file));
//       else setImagePreview(null);
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     completedOrders: 0,
//     canceledOrders: 0,
//     activeVendors: 0,
//     totalUsers: 0,
//     completionRate: "0.00",
//   });

//   const startEdit = (service) => {
//     setEditingServiceId(service._id);
//     setForm({
//       _id: service._id,
//       name: service.name,
//       category: service.category,
//       price: service.price,
//       image: null,
//     });
//     setImagePreview(service.image);
//     setShowModal(true);
//     setMessage('');
//     setStatus('');
//   };

//   const cancelEdit = () => {
//     setEditingServiceId(null);
//     setForm({ _id: '', name: '', category: '', price: '', image: null });
//     setImagePreview(null);
//     setMessage('');
//     setStatus('');
//     setShowModal(false);
//   };

//   const handleDelete = async (_id) => {
//     if (!window.confirm('Are you sure you want to delete this service?')) return;

//     try {
//       await axios.delete(`${API_BASE}/services/${_id}`);
//       setMessage('Service deleted successfully');
//       setStatus('success');
//       fetchServices();
//     } catch (err) {
//       setMessage('Delete failed');
//       setStatus('error');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { _id, name, category, price, image } = form;
//     if (!_id || !name || !category || !price) {
//       setMessage('All fields except image are required');
//       setStatus('error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('_id', _id);
//     formData.append('name', name);
//     formData.append('category', category);
//     formData.append('price', price);
//     if (image) formData.append('image', image);

//     try {
//       let res;
//       if (editingServiceId) {
//         res = await axios.put(`${API_BASE}/services/${editingServiceId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         res = await axios.post(`${API_BASE}/services`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }

//       if (res.data.success) {
//         setMessage(editingServiceId ? 'Service updated successfully' : 'Service added successfully');
//         setStatus('success');
//         setForm({ _id: '', name: '', category: '', price: '', image: null });
//         setImagePreview(null);
//         setEditingServiceId(null);
//         setShowModal(false);
//         fetchServices();
//       } else {
//         setMessage(res.data.message || 'Operation failed');
//         setStatus('error');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Server error');
//       setStatus('error');
//     }
//   };
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
//         <h1 className="text-xl font-bold">Order Management</h1>
//         <div className="w-10"></div>
//       </div>

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`bg-gray-800 p-4 lg:w-64 w-64 fixed lg:static z-50 transition-transform duration-300 h-full
//                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//         style={{ top: '0', left: '0' }}
//       >
//         <div className="text-center py-4 border-b border-gray-700">
//           <h1 className="text-xl font-bold">Admin Panel</h1>
//           <p className="text-xs text-gray-400 mt-1">Service Managment</p>
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



//       <div className="">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl text-white font-bold">Service Manager</h2>
//           <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//             <Plus className="mr-2" /> Add Service
//           </button>
//         </div>

//         <div className="card bg-base-100 shadow-xl p-4">
//           <h3 className="text-black text-lg font-semibold mb-2">Total Services: {services.length}</h3>
//         </div>

//         {message && (
//           <div className={`p-3 rounded text-white ${status === 'success' ? 'bg-green-700' : 'bg-red-600'}`}>{message}</div>
//         )}

//         <table className="table w-full  ">
//           <thead className='bg-gray-800 text-white' >
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Price</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody className='text-white'>
//             {services.map((s) => (
//               <tr key={s._id}>
//                 <td>{s._id}</td>
//                 <td>{s.name}</td>
//                 <td>{s.category}</td>
//                 <td>{s.price}</td>
//                 <td>
//                   <img src={s.image} alt={s.name} className="w-20 h-14 object-contain rounded" />
//                 </td>
//                 <td className="flex gap-2">
//                   <button className="btn btn-sm btn-info" onClick={() => startEdit(s)}>Edit</button>
//                   <button className="btn btn-sm btn-error" onClick={() => handleDelete(s._id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <dialog className="modal modal-open">
//           <div className="modal-box bg-base-200">
//             <form onSubmit={handleSubmit}>
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-bold text-lg text-white">
//                   {editingServiceId ? 'Edit Service' : 'Add Service'}
//                 </h3>
//                 <button type="button" onClick={cancelEdit} className="btn btn-sm btn-circle">
//                   <X />
//                 </button>
//               </div>

//               <input type="text" name="_id" value={form._id} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Service ID" disabled={!!editingServiceId} />
//               <input type="text" name="name" value={form.name} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Service Name" />
//               <input type="text" name="category" value={form.category} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Category" />
//               <input type="number" name="price" value={form.price} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Price" />
//               <input type="file" name="image" onChange={handleChange} accept="image/*" className="file-input file-input-bordered w-full mb-3" />
//               {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain rounded mb-4" />}

//               <button type="submit" className="btn btn-primary w-full">
//                 {editingServiceId ? 'Update' : 'Add'} Service
//               </button>
//             </form>
//           </div>
//         </dialog>
//       )}
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

// export default AdminServiceManager;

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import api from '../../api'; // Import the configured axios instance
import { Plus, X } from 'lucide-react';
import { FiHome, FiLogOut, FiMenu, FiPackage, FiPieChart, FiSettings, FiShoppingBag, FiTruck, FiUsers } from 'react-icons/fi';
import Swal from 'sweetalert2';

const AdminServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    _id: '',
    name: '',
    category: '',
    price: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/services');
      setServices(res.data);
    } catch (err) {
      setMessage('Failed to load services');
      setStatus('error');
      console.error('Error fetching services:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      if (file) setImagePreview(URL.createObjectURL(file));
      else setImagePreview(null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startEdit = (service) => {
    setEditingServiceId(service._id);
    setForm({
      _id: service._id,
      name: service.name,
      category: service.category,
      price: service.price,
      image: null,
    });
    setImagePreview(service.image);
    setShowModal(true);
    setMessage('');
    setStatus('');
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setForm({ _id: '', name: '', category: '', price: '', image: null });
    setImagePreview(null);
    setMessage('');
    setStatus('');
    setShowModal(false);
  };

  const handleDelete = async (_id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/services/${_id}`);
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Service deleted successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      fetchServices();
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.response?.data?.message || 'Failed to delete service'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id, name, category, price, image } = form;
    if (!_id || !name || !category || !price) {
      setMessage('All fields except image are required');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('_id', _id);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
      let res;
      if (editingServiceId) {
        res = await api.put(`/api/services/${editingServiceId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/api/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: editingServiceId ? 'Updated!' : 'Added!',
          text: editingServiceId ? 'Service updated successfully' : 'Service added successfully',
          timer: 1500,
          showConfirmButton: false
        });
        
        setForm({ _id: '', name: '', category: '', price: '', image: null });
        setImagePreview(null);
        setEditingServiceId(null);
        setShowModal(false);
        fetchServices();
      } else {
        setMessage(res.data.message || 'Operation failed');
        setStatus('error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage(err.response?.data?.message || 'Server error');
      setStatus('error');
    }
  };

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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      localStorage.clear();
      sessionStorage.clear();

      await Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logout successful',
        showConfirmButton: false,
        timer: 1000
      });

      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white relative">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-gray-900 flex justify-between items-center border-b border-gray-800">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hamburger-button btn btn-sm btn-ghost text-white"
        >
          {sidebarOpen ? <X size={20} /> : <FiMenu size={20} />}
        </button>
        <h1 className="text-xl font-bold text-white">Service Management</h1>
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
          <p className="text-xs text-gray-400 mt-1">Service Management</p>
        </div>
        <nav className="mt-4 space-y-1">
          <SidebarLink to="/admin/dashboard" icon={<FiHome />} text="Dashboard" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/orders" icon={<FiShoppingBag />} text="Order List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/vendors" icon={<FiTruck />} text="Vendor List" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/users" icon={<FiUsers />} text="User Management" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/services" icon={<FiPackage />} text="Service Management" onClick={() => setSidebarOpen(false)} active />
          <SidebarLink to="/admin/analytics" icon={<FiPieChart />} text="Analytics" onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/admin/settings" icon={<FiSettings />} text="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
            <p className="text-sm text-gray-300">Total Services</p>
            <p className="text-2xl font-bold text-white">{services.length}</p>
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
      <div className="flex-1 p-4 lg:p-8 bg-gray-900 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Service Manager</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your service catalog</p>
          </div>
          <button 
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg shadow-blue-600/20"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Add Service
          </button>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Services</p>
            <p className="text-2xl font-bold text-white mt-1">{services.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-2xl font-bold text-white mt-1">
              {new Set(services.map(s => s.category)).size}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Active Services</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{services.filter(s => s.active !== false).length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Inactive Services</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{services.filter(s => s.active === false).length}</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            status === 'success' 
              ? 'bg-green-900/50 border border-green-700 text-green-300' 
              : 'bg-red-900/50 border border-red-700 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Table Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        Loading services...
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No services found. Click "Add Service" to create one.
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{s._id.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                          {s.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-green-400 font-semibold">${parseFloat(s.price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <img 
                          src={s.image} 
                          alt={s.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-gray-600" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                            onClick={() => startEdit(s)}
                          >
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                            onClick={() => handleDelete(s._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingServiceId ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service ID</label>
                  <input 
                    type="text" 
                    name="_id" 
                    value={form._id} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Enter service ID"
                    disabled={!!editingServiceId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input 
                    type="text" 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Enter category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={form.price} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="Enter price"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service Image</label>
                  <input 
                    type="file" 
                    name="image" 
                    onChange={handleChange} 
                    accept="image/*" 
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-contain rounded-lg bg-gray-900 border border-gray-700" 
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingServiceId ? 'Update Service' : 'Add Service'}
                </button>
                <button 
                  type="button" 
                  onClick={cancelEdit} 
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default AdminServiceManager;