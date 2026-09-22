import React, { useState, useEffect } from "react";
import { FaSave, FaCog } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../../api";

const SiteSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/site-settings");
      if (res.data.success) {
        const obj = {};
        res.data.settings.forEach((s) => {
          obj[s.setting_key] = s.setting_value || "";
        });
        setSettings(obj);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/site-settings", { settings });
      Swal.fire("Success", "Settings saved", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "site_name", label: "Site Name", type: "text" },
    { key: "site_tagline", label: "Tagline", type: "text" },
    { key: "phone_number", label: "Phone Number", type: "text" },
    { key: "whatsapp_number", label: "WhatsApp Number", type: "text", hint: "e.g., 8809638787878" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "facebook_url", label: "Facebook URL", type: "url" },
    { key: "youtube_url", label: "YouTube URL", type: "url" },
    { key: "instagram_url", label: "Instagram URL", type: "url" },
    { key: "service_cities", label: "Service Cities", type: "text", hint: "Comma separated" },
    { key: "working_hours", label: "Working Hours", type: "text" },
    { key: "footer_text", label: "Footer Text", type: "text" },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olympic mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-olympic/10 flex items-center justify-center text-olympic text-xl">
          <FaCog />
        </div>
        <div>
          <h2 className="text-2xl font-black text-black">
            Site <span className="text-olympic">Settings</span>
          </h2>
          <p className="text-gray-600 text-sm mt-0.5">
            Global configuration for the entire site
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div key={field.key} className={field.type === "url" || field.key === "footer_text" ? "md:col-span-2" : ""}>
              <label className="label-text font-semibold text-gray-700 text-sm mb-1 block">
                {field.label}
              </label>
              <input
                type={field.type}
                value={settings[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="input input-bordered w-full"
              />
              {field.hint && <p className="text-xs text-gray-400 mt-1">{field.hint}</p>}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
          <button type="submit" disabled={saving}
            className={`btn bg-olympic text-white hover:bg-blue-700 gap-2 ${saving ? "loading" : ""}`}>
            {!saving && <FaSave />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;