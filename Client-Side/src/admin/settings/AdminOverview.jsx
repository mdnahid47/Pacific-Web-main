import React, { useEffect, useState } from "react";
import {
  FaImages, FaTools, FaShieldAlt,
  FaQuestionCircle, FaListUl, FaCog, FaCreditCard,
} from "react-icons/fa";
import api from "../../api";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    heroes: 0, services: 0, warranties: 0,
    faqs: 0, problems: 0, settings: 0, payments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/settings-stats");
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error("Stats fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Hero Banners", value: stats.heroes, icon: <FaImages />, color: "bg-blue-500" },
    { label: "Services", value: stats.services, icon: <FaTools />, color: "bg-green-500" },
    { label: "Warranty", value: stats.warranties, icon: <FaShieldAlt />, color: "bg-yellow-500" },
    { label: "FAQs", value: stats.faqs, icon: <FaQuestionCircle />, color: "bg-pink-500" },
    { label: "Problems", value: stats.problems, icon: <FaListUl />, color: "bg-red-500" },
    { label: "Payment Methods", value: stats.payments, icon: <FaCreditCard />, color: "bg-indigo-500" },
    { label: "Site Settings", value: stats.settings, icon: <FaCog />, color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-black mb-6">
        Dashboard <span className="text-olympic">Overview</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">{card.label}</p>
                <p className="text-4xl font-black text-black mt-2">{card.value}</p>
              </div>
              <div className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;