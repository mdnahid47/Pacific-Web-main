import React, { useState } from "react";
import {
  FaImages, FaShieldAlt, FaQuestionCircle,
  FaCog, FaChartLine, FaListUl, FaCreditCard,
} from "react-icons/fa";
import AdminOverview from "./settings/AdminOverview";
import HeroManager from "./settings/HeroManager";
import WarrantyManager from "./settings/WarrantyManager";
import FAQManager from "./settings/FAQManager";
import ProblemsManager from "./settings/ProblemsManager";
import PaymentMethodsManager from "./settings/PaymentMethodsManager";
import SiteSettings from "./settings/SiteSettings";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "hero", label: "Hero Banners", icon: <FaImages /> },
    { id: "warranty", label: "Warranty", icon: <FaShieldAlt /> },
    { id: "faq", label: "FAQs", icon: <FaQuestionCircle /> },
    { id: "problems", label: "Problems", icon: <FaListUl /> },
    { id: "payment", label: "Payment Methods", icon: <FaCreditCard /> },
    { id: "site", label: "Site Settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-black text-black">
            Admin <span className="text-olympic">Settings</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage all website content dynamically
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-olympic text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "hero" && <HeroManager />}
        {activeTab === "warranty" && <WarrantyManager />}
        {activeTab === "faq" && <FAQManager />}
        {activeTab === "problems" && <ProblemsManager />}
        {activeTab === "payment" && <PaymentMethodsManager />}
        {activeTab === "site" && <SiteSettings />}
      </div>
    </div>
  );
};

export default AdminSettings;