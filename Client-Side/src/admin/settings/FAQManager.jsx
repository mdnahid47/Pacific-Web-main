import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaQuestionCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";
import { CATEGORIES } from "./categories";

const FAQManager = () => {
  const [category, setCategory] = useState("ac-cooling");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "", displayOrder: 0 });

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/faqs?category=${category}`);
      if (res.data.success) setFaqs(res.data.faqs);
    } catch (err) { setFaqs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/faqs/${editingId}`, { ...formData, category, isActive: 1 });
        Swal.fire("Success", "Updated", "success");
      } else {
        await api.post("/admin/faqs", { ...formData, category });
        Swal.fire("Success", "Added", "success");
      }
      resetForm();
      fetchFaqs();
    } catch (err) { Swal.fire("Error", "Failed", "error"); }
  };

  const handleEdit = (f) => {
    setFormData({
      question: f.question || "",
      answer: f.answer || "",
      displayOrder: f.display_order || 0,
    });
    setEditingId(f.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/faqs/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchFaqs();
      } catch (err) { Swal.fire("Error", "Failed", "error"); }
    }
  };

  const resetForm = () => {
    setFormData({ question: "", answer: "", displayOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">
            <span className="text-olympic">FAQs</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">Questions per page</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn bg-olympic text-white hover:bg-blue-700 gap-2">
          <FaPlus /> Add FAQ
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
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">No FAQs for "{category}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl shadow border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-olympic/10 flex items-center justify-center text-olympic flex-shrink-0">
                  <FaQuestionCircle />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{f.question}</h3>
                  <p className="text-gray-600 text-sm">{f.answer}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(f)} className="btn btn-sm btn-outline">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="btn btn-sm btn-error">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Add"} FAQ</h2>
              <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="label-text font-semibold">Question *</label>
                <input type="text" placeholder="How long does repair take?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label-text font-semibold">Answer *</label>
                <textarea placeholder="Your answer..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="textarea textarea-bordered w-full" rows={4} required />
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

export default FAQManager;