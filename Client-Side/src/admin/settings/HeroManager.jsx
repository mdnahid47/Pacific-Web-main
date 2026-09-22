import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";
import { CATEGORIES } from "./categories";

const HeroManager = () => {
  const [category, setCategory] = useState("ac-cooling");
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    badge: "", title: "", highlight: "", subtitle: "",
    image: "", ctaPrimary: "", ctaSecondary: "",
    ctaPrimaryLink: "", ctaSecondaryLink: "",
    displayOrder: 0, isActive: 1,
  });

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/hero-list?category=${category}`);
      if (res.data.success) setHeroes(res.data.banners);
    } catch (err) {
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeroes(); }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/hero/${editingId}`, { ...formData, category });
        Swal.fire("Success", "Hero updated", "success");
      } else {
        await api.post("/admin/hero", { ...formData, category });
        Swal.fire("Success", "Hero added", "success");
      }
      resetForm();
      fetchHeroes();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleEdit = (hero) => {
    setFormData({
      badge: hero.badge || "", title: hero.title || "",
      highlight: hero.highlight || "", subtitle: hero.subtitle || "",
      image: hero.image || "", ctaPrimary: hero.ctaPrimary || "",
      ctaSecondary: hero.ctaSecondary || "",
      ctaPrimaryLink: hero.ctaPrimaryLink || "",
      ctaSecondaryLink: hero.ctaSecondaryLink || "",
      displayOrder: hero.displayOrder || 0,
      isActive: hero.isActive ?? 1,
    });
    setEditingId(hero.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this hero?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/hero/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchHeroes();
      } catch (err) {
        Swal.fire("Error", "Failed to delete", "error");
      }
    }
  };

  const toggleActive = async (hero) => {
    try {
      await api.put(`/admin/hero/${hero.id}`, {
        ...hero, isActive: hero.isActive ? 0 : 1, category,
      });
      fetchHeroes();
    } catch (err) {
      Swal.fire("Error", "Failed to toggle", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      badge: "", title: "", highlight: "", subtitle: "",
      image: "", ctaPrimary: "", ctaSecondary: "",
      ctaPrimaryLink: "", ctaSecondaryLink: "",
      displayOrder: 0, isActive: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">
            Hero <span className="text-olympic">Banners</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage hero carousel slides for each page
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn bg-olympic text-white hover:bg-blue-700 gap-2">
          <FaPlus /> Add Hero
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
      ) : heroes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">No hero banners for "{category}"</p>
          <button onClick={() => setShowForm(true)} className="btn btn-outline mt-4 gap-2">
            <FaPlus /> Create First Hero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.map((hero) => (
            <div key={hero.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="relative">
                <img src={hero.image} alt={hero.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=No+Image"; }} />
                <div className="absolute top-2 right-2">
                  <button onClick={() => toggleActive(hero)}
                    className={`btn btn-xs ${hero.isActive ? "btn-success" : "btn-error"}`}>
                    {hero.isActive ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {hero.displayOrder > 0 && (
                  <div className="absolute top-2 left-2 badge bg-olympic text-white">#{hero.displayOrder}</div>
                )}
              </div>
              <div className="p-4">
                {hero.badge && <p className="text-xs text-olympic font-semibold mb-1">{hero.badge}</p>}
                <h3 className="font-bold text-lg text-black">
                  {hero.title} {hero.highlight && <span className="text-olympic">{hero.highlight}</span>}
                </h3>
                <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">{hero.subtitle}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(hero)} className="btn btn-sm btn-outline flex-1 gap-1">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(hero.id)} className="btn btn-sm btn-error gap-1">
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
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingId ? "Edit Hero" : "Add New Hero"}</h2>
              <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text font-semibold">Badge</label>
                  <input type="text" placeholder="e.g., Professional AC Service"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label-text font-semibold">Title *</label>
                  <input type="text" placeholder="e.g., Expert AC Cooling"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input input-bordered w-full" required />
                </div>
                <div>
                  <label className="label-text font-semibold">Highlight</label>
                  <input type="text" placeholder="e.g., Repair & Service"
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label-text font-semibold">Display Order</label>
                  <input type="number" value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="label-text font-semibold">Subtitle</label>
                  <textarea placeholder="Description..."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="textarea textarea-bordered w-full" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-text font-semibold">Image URL *</label>
                  <input type="url" placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input input-bordered w-full" required />
                  {formData.image && (
                    <img src={formData.image} alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-xl"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  )}
                </div>
                <div>
                  <label className="label-text font-semibold">Primary CTA Text</label>
                  <input type="text" placeholder="Call Now"
                    value={formData.ctaPrimary}
                    onChange={(e) => setFormData({ ...formData, ctaPrimary: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label-text font-semibold">Primary CTA Link</label>
                  <input type="text" placeholder="tel:09638787878 or /book"
                    value={formData.ctaPrimaryLink}
                    onChange={(e) => setFormData({ ...formData, ctaPrimaryLink: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label-text font-semibold">Secondary CTA Text</label>
                  <input type="text" placeholder="WhatsApp"
                    value={formData.ctaSecondary}
                    onChange={(e) => setFormData({ ...formData, ctaSecondary: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label-text font-semibold">Secondary CTA Link</label>
                  <input type="text" placeholder="https://wa.me/8809638787878"
                    value={formData.ctaSecondaryLink}
                    onChange={(e) => setFormData({ ...formData, ctaSecondaryLink: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
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

export default HeroManager;