import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaShieldAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";
import { CATEGORIES } from "./categories";

const WarrantyManager = () => {
  const [category, setCategory] = useState("ac-cooling");
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    icon: "FaShieldAlt", title: "", description: "", displayOrder: 0,
  });

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/warranty?category=${category}`);
      if (res.data.success) setPolicies(res.data.policies);
    } catch (err) { setPolicies([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPolicies(); }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/warranty/${editingId}`, { ...formData, category, isActive: 1 });
        Swal.fire("Success", "Updated", "success");
      } else {
        await api.post("/admin/warranty", { ...formData, category });
        Swal.fire("Success", "Added", "success");
      }
      resetForm();
      fetchPolicies();
    } catch (err) { Swal.fire("Error", "Failed", "error"); }
  };

  const handleEdit = (p) => {
    setFormData({
      icon: p.icon || "FaShieldAlt", title: p.title || "",
      description: p.description || "", displayOrder: p.display_order || 0,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/warranty/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchPolicies();
      } catch (err) { Swal.fire("Error", "Failed", "error"); }
    }
  };

  const resetForm = () => {
    setFormData({ icon: "FaShieldAlt", title: "", description: "", displayOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">
            Warranty <span className="text-olympic">Policies</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">Warranty cards per page</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn bg-olympic text-white hover:bg-blue-700 gap-2">
          <FaPlus /> Add Policy
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow">
        <label className="font-semibold text-gray-700 mr-3">Page:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="select select-bordered">
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : policies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">No warranty for "{category}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-olympic/10 flex items-center justify-center text-olympic text-xl">
                  <FaShieldAlt />
                </div>
                <h3 className="font-bold text-lg">{p.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{p.description}</p>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline flex-1 gap-1">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-error">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Add"} Policy</h2>
              <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="label-text font-semibold">Title *</label>
                <input type="text" placeholder="90 Days Service Warranty"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label-text font-semibold">Description</label>
                <textarea placeholder="Details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered w-full" rows={3} />
              </div>
              <div>
                <label className="label-text font-semibold">Display Order</label>
                <input type="number" value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="input input-bordered w-full" />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn bg-olympic text-white hover:bg-blue-700">
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyManager;