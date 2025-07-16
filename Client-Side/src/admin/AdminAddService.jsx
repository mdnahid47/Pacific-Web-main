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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

const AdminServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      const res = await axios.get(`${API_BASE}/services`);
      setServices(res.data);
    } catch (err) {
      setMessage('Failed to load services');
      setStatus('error');
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
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(`${API_BASE}/services/${_id}`);
      setMessage('Service deleted successfully');
      setStatus('success');
      fetchServices();
    } catch (err) {
      setMessage('Delete failed');
      setStatus('error');
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
        res = await axios.put(`${API_BASE}/services/${editingServiceId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post(`${API_BASE}/services`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        setMessage(editingServiceId ? 'Service updated successfully' : 'Service added successfully');
        setStatus('success');
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
      console.error(err);
      setMessage('Server error');
      setStatus('error');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-bold">Service Manager</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="mr-2" /> Add Service
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl p-4">
        <h3 className="text-black text-lg font-semibold mb-2">Total Services: {services.length}</h3>
      </div>

      {message && (
        <div className={`p-3 rounded text-white ${status === 'success' ? 'bg-green-700' : 'bg-red-600'}`}>{message}</div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full  ">
          <thead className='bg-gray-800 text-white' >
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='text-white'>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s._id}</td>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>{s.price}</td>
                <td>
                  <img src={s.image} alt={s.name} className="w-20 h-14 object-contain rounded" />
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-info" onClick={() => startEdit(s)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-200">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">
                  {editingServiceId ? 'Edit Service' : 'Add Service'}
                </h3>
                <button type="button" onClick={cancelEdit} className="btn btn-sm btn-circle">
                  <X />
                </button>
              </div>

              <input type="text" name="_id" value={form._id} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Service ID" disabled={!!editingServiceId} />
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Service Name" />
              <input type="text" name="category" value={form.category} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Category" />
              <input type="number" name="price" value={form.price} onChange={handleChange} className="input input-bordered w-full mb-3" placeholder="Price" />
              <input type="file" name="image" onChange={handleChange} accept="image/*" className="file-input file-input-bordered w-full mb-3" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain rounded mb-4" />}

              <button type="submit" className="btn btn-primary w-full">
                {editingServiceId ? 'Update' : 'Add'} Service
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminServiceManager;
