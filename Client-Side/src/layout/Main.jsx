import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SigninModals from "../components/Modals/SigninModals";
import ScrollToTop from "../components/ScrollToTop";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Route change এ scroll top এ যাবে */}
      <ScrollToTop />

      <Navbar />

      {/* ✅ Page content — lazy load এ spinner */}
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />

      {/* ✅ Sign In Modal — সব page এ available */}
      <SigninModals />
    </div>
  );
};

export default Main;