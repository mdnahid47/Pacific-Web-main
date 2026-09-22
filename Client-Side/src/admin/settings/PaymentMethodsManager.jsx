import React, { useState, useEffect } from "react";
import {
  FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash,
  FaMobileAlt, FaUniversity, FaCreditCard,
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";

const ICON_OPTIONS = [
  { value: "FaMobileAlt", label: "Mobile (bKash/Nagad)", icon: <FaMobileAlt /> },
  { value: "FaUniversity", label: "Bank", icon: <FaUniversity /> },
  { value: "FaCreditCard", label: "Card", icon: <FaCreditCard /> },
];

const PaymentMethodsManager = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    method_name: "", display_name: "", account_number: "", account_name: "",
    bank_name: "", branch: "", instructions: "", icon: "FaMobileAlt",
    display_order: 0, is_active: 1,
  });

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payment-methods");
      if (res.data.success) setMethods(res.data.methods);
    } catch (err) { setMethods([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMethods(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/payment-methods/${editingId}`, formData);
        Swal.fire("Success", "Updated", "success");
      } else {
        await api.post("/admin/payment-methods", formData);
        Swal.fire("Success", "Added", "success");
      }
      resetForm();
      fetchMethods();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  const handleEdit = (m) => {
    setFormData({
      method_name: m.method_name || "", display_name: m.display_name || "",
      account_number: m.account_number || "", account_name: m.account_name || "",
      bank_name: m.bank_name || "", branch: m.branch || "",
      instructions: m.instructions || "", icon: m.icon || "FaMobileAlt",
      display_order: m.display_order || 0, is_active: m.is_active ?? 1,
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/payment-methods/${id}`);
        Swal.fire("Deleted!", "", "success");
        fetchMethods();
      } catch (err) { Swal.fire("Error", "Failed", "error"); }
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/admin/payment-methods/${id}/toggle`);
      fetchMethods();
    } catch (err) { Swal.fire("Error", "Failed", "error"); }
  };

  const resetForm = () => {
    setFormData({
      method_name: "", display_name: "", account_number: "", account_name: "",
      bank_name: "", branch: "", instructions: "", icon: "FaMobileAlt",
      display_order: 0, is_active: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">
            Payment <span className="text-olympic">Methods</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">bKash, Nagad, Bank accounts for vendor payments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn bg-olympic text-white hover:bg-blue-700 gap-2">
          <FaPlus /> Add Method
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 Vendors will see these methods when paying platform dues. Only <b>active</b> methods appear.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : methods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500 mb-4">No payment methods</p>
          <button onClick={() => setShowForm(true)} className="btn btn-outline gap-2">
            <FaPlus /> Add First Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((m) => (
            <div key={m.id} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${m.is_active ? "border-gray-200" : "border-red-200 opacity-70"}`}>
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-olympic/10 flex items-center justify-center text-olympic text-xl">
                    {ICON_OPTIONS.find((i) => i.value === m.icon)?.icon || <FaMobileAlt />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{m.display_name}</h3>
                    <p className="text-xs text-gray-500 uppercase">{m.method_name}</p>
                  </div>
                </div>
                <button onClick={() => toggleActive(m.id)}
                  className={`btn btn-sm btn-circle ${m.is_active ? "btn-success" : "btn-error"}`}>
                  {m.is_active ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className="p-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono font-semibold">{m.account_number || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Name:</span>
                  <span className="font-semibold">{m.account_name || "—"}</span>
                </div>
                {m.bank_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-semibold">{m.bank_name}</span>
                  </div>
                )}
                {m.branch && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Branch:</span>
                    <span className="font-semibold">{m.branch}</span>
                  </div>
                )}
                {m.instructions && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                    <p className="text-gray-700">{m.instructions}</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button onClick={() => handleEdit(m)} className="btn btn-sm btn-outline flex-1 gap-1">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(m.id)} className="btn btn-sm btn-error">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Add"} Payment Method</h2>
              <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text font-semibold">Method Name *</label>
                  <input type="text" placeholder="bkash, nagad, bank"
                    value={formData.method_name}
                    onChange={(e) => setFormData({ ...formData, method_name: e.target.value.toLowerCase().replace(/\s/g, "") })}
                    className="input input-bordered w-full" required disabled={!!editingId} />
                </div>
                <div>
                  <label className="label-text font-semibold">Display Name *</label>
                  <input type="text" placeholder="bKash, Nagad"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="input input-bordered w-full" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text font-semibold">Account Number</label>
                  <input type="text" placeholder="01712345678"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="input input-bordered w-full font-mono" />
                </div>
                <div>
                  <label className="label-text font-semibold">Account Name</label>
                  <input type="text" placeholder="Pacific Services"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="input input-bordered w-full" />
                </div>
              </div>

              {formData.method_name === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div>
                    <label className="label-text font-semibold">Bank Name</label>
                    <input type="text" placeholder="Dutch Bangla Bank"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="input input-bordered w-full" />
                  </div>
                  <div>
                    <label className="label-text font-semibold">Branch</label>
                    <input type="text" placeholder="Gulshan Branch"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="input input-bordered w-full" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text font-semibold">Icon</label>
                  <select value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="select select-bordered w-full">
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text font-semibold">Display Order</label>
                  <input type="number" value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="input input-bordered w-full" />
                </div>
              </div>

              <div>
                <label className="label-text font-semibold">Instructions</label>
                <textarea placeholder="Send money to this number..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="textarea textarea-bordered w-full" rows={3} />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" checked={formData.is_active === 1}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                  className="checkbox checkbox-primary" />
                <div>
                  <p className="font-semibold text-sm">Active</p>
                  <p className="text-xs text-gray-500">Vendor can see this method</p>
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

export default PaymentMethodsManager;