import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTools } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";
import { CATEGORIES } from "./categories";

const ProblemsManager = () => {
  const [category, setCategory] = useState("ac-cooling");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ problemText: "", displayOrder: 0 });

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/problems?category=${category}`);
      if (res.data.success) setProblems(res.data.problems);
    } catch (err) { setProblems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProblems(); }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/problems/${editingId}`, { ...formData, category, isActive: 1 });
        Swal.fire("Success", "Updated", "success");
      } else {
        await api.post("/admin/problems", { ...formData, category });
        Swal.fire("Success", "Added", "success");
      }
      resetForm();
      fetchProblems();
    } catch (err) { Swal.fire("Error", "Failed", "error"); }
  };

  const handleEdit = (p) => {
    setFormData({ problemText: p.problem_text || "", displayOrder: p.display_order || 0 });
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
        await api.delete(`/admin/problems/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchProblems();
      } catch (err) { Swal.fire("Error", "Failed", "error"); }
    }
  };

  const resetForm = () => {
    setFormData({ problemText: "", displayOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">
            Common <span className="text-olympic">Problems</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">Problems list per page</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn bg-olympic text-white hover:bg-blue-700 gap-2">
          <FaPlus /> Add Problem
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
      ) : problems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">No problems for "{category}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaTools className="text-olympic flex-shrink-0" />
                <span className="font-medium text-gray-800">{p.problem_text}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="btn btn-xs btn-outline">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-xs btn-error">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Add"} Problem</h2>
              <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="label-text font-semibold">Problem Text *</label>
                <input type="text" placeholder="AC not cooling properly"
                  value={formData.problemText}
                  onChange={(e) => setFormData({ ...formData, problemText: e.target.value })}
                  className="input input-bordered w-full" required />
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

export default ProblemsManager;