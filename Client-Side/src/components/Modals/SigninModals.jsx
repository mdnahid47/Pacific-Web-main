import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";
import api from "../../api";
import SignUp from "../../components/SignUp";

const SigninModals = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { handleLogin } = useContext(AuthContext);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const modal = document.getElementById("nav_modal");
      if (modal && e.target === modal) closeModal();
    };
    const modal = document.getElementById("nav_modal");
    if (modal) modal.addEventListener("click", handleOutsideClick);
    return () => {
      if (modal) modal.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const modal = document.getElementById("nav_modal");
    const handleModalOpen = () => {
      setError("");
      setShowSignUp(false);
    };
    if (modal) modal.addEventListener("show", handleModalOpen);
    return () => {
      if (modal) modal.removeEventListener("show", handleModalOpen);
    };
  }, []);

  const closeModal = () => {
    const modal = document.getElementById("nav_modal");
    if (modal) {
      modal.close();
      setError("");
      setShowPassword(false);
      setTimeout(() => setShowSignUp(false), 300);
    }
  };

  const handleNavigationClick = (path) => {
    closeModal();
    setTimeout(() => navigate(path), 100);
  };

  const reopenModalWithError = (errorMessage) => {
    setError(errorMessage);
    const modal = document.getElementById("nav_modal");
    if (modal) {
      setTimeout(() => modal.showModal(), 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    closeModal();

    try {
      const response = await api.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        const userData = response.data.user;
        const role = response.data.role;
        localStorage.setItem("token", response.data.token);
        handleLogin({ ...userData, token: response.data.token });

        Swal.fire({
          icon: "success",
          title: "Login successful!",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          if (role === "admin" || role === "superadmin") {
            navigate("/admin/dashboard");
          } else {
            navigate(from, { replace: true });
          }
        }, 1600);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";

      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: errorMessage,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => reopenModalWithError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id="nav_modal" className="modal">
      {/* Modal box — no fixed height, auto adjusts to content */}
      <div className="modal-box relative 
                w-[92%] sm:w-[85%] md:w-full 
                max-w-md sm:max-w-lg md:max-w-xl 
                p-5 sm:p-7 md:p-8 
                rounded-2xl 
                max-h-[95vh] 
                overflow-y-auto 
                overflow-x-hidden 
                hide-scrollbar
                transition-all duration-300">

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-500 z-30"
          disabled={isLoading}
        >
          ✕
        </button>

        {/* ✅ Dynamic render — only active view is mounted */}
        <div className="relative overflow-hidden">
          {showSignUp ? (
            <div className="animate-slide-in-right">
              <SignUp
                onSwitchToLogin={() => setShowSignUp(false)}
                onClose={closeModal}
              />
            </div>
          ) : (
            <div className="animate-slide-in-left">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="text-center mb-5 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-black">
                    Welcome <span className="text-olympic">Back</span>
                  </h3>
                  <p className="text-gray-500 text-sm mt-1.5">
                    Sign in to continue ordering
                  </p>
                </div>

                {error && (
                  <div className="alert alert-error text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-700 text-sm">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full 
                               h-12 
                               px-4 rounded-xl 
                               border-gray-300 
                               focus:border-olympic focus:ring-2 focus:ring-blue-100 
                               transition-all duration-200 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold text-gray-700 text-sm">
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input input-bordered w-full 
                                 h-12 
                                 px-4 pr-12 rounded-xl 
                                 border-gray-300 
                                 focus:border-olympic focus:ring-2 focus:ring-blue-100 
                                 transition-all duration-200 text-base"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigationClick("/forgot-password")}
                    className="label-text-alt link link-hover mt-2 block text-left text-olympic text-sm"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={`btn w-full mt-2 
                             h-12 
                             rounded-xl font-bold text-base shadow-lg 
                             transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-olympic hover:bg-blue-700 text-white hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Switch to SignUp */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setShowSignUp(true)}
                      className="text-olympic font-semibold hover:underline"
                      disabled={isLoading}
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModal}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default SigninModals;