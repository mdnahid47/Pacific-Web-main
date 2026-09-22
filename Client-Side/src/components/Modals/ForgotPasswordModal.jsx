import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaArrowLeft,
  FaKey,
  FaLock,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api";

const ForgotPasswordModal = ({ onSwitchToLogin, onClose }) => {
  // Steps: 'email' → 'otp' → 'newPassword' → 'success'
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // ============================================================
  // 🔑 SESSION PERSISTENCE — component mount হলে check করি
  // ============================================================
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    const savedStep = localStorage.getItem("resetStep");

    if (savedEmail && savedStep === "otp") {
      checkOtpStatus(savedEmail);
    } else if (savedEmail && savedStep === "newPassword") {
      // User OTP verify করে newPassword step এ ছিল, refresh করেছে
      setEmail(savedEmail);
      setStep("newPassword");
    }
  }, []);

  const checkOtpStatus = async (emailToCheck) => {
    try {
      const res = await api.get(`/check-otp-status/${emailToCheck}`);
      if (res.data.success && res.data.hasActiveOtp) {
        setEmail(emailToCheck);
        setOtpExpiry(new Date(res.data.expiresAt));
        setStep("otp");

        Swal.fire({
          icon: "info",
          title: "OTP Already Sent",
          text: "We already sent an OTP to your email. Please check your inbox.",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        // Expired → clear
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetStep");
      }
    } catch (err) {
      console.error("OTP status check failed:", err);
    }
  };

  // ============================================================
  // ⏱️ Countdown Timer for OTP expiry
  // ============================================================
  useEffect(() => {
    if (step !== "otp" || !otpExpiry) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((otpExpiry - Date.now()) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetStep");
        Swal.fire({
          icon: "warning",
          title: "OTP Expired",
          text: "Please request a new OTP.",
          timer: 2500,
          showConfirmButton: false,
        });
        setStep("email");
        setOtp("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, otpExpiry]);

  // ============================================================
  // STEP 1: Email Submit → OTP Send
  // ============================================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/forgot-password-otp", { email });

      if (res.data.success) {
        localStorage.setItem("resetEmail", email);
        localStorage.setItem("resetStep", "otp");

        if (res.data.expiresAt) {
          setOtpExpiry(new Date(res.data.expiresAt));
        }

        Swal.fire({
          icon: "success",
          title: res.data.alreadySent ? "OTP Already Sent" : "OTP Sent!",
          text: res.data.alreadySent
            ? "We already sent an OTP to your email. Please check your inbox."
            : "Please check your email for the 6-digit OTP.",
          timer: 2500,
          showConfirmButton: false,
        });

        setStep("otp");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // STEP 2: Verify OTP
  // ============================================================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/verify-otp", { email, otp });

      if (res.data.success) {
        localStorage.setItem("resetStep", "newPassword");
        setStep("newPassword");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: error.response?.data?.message || "Please try again",
      });
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // STEP 3: Reset Password
  // ============================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/reset-password-with-otp", {
        email,
        newPassword: password,
      });

      if (res.data.success) {
        // ✅ Clear localStorage
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetStep");

        setStep("success");

        setTimeout(() => {
          onSwitchToLogin();
          // Reset form
          setEmail("");
          setOtp("");
          setPassword("");
          setConfirmPassword("");
          setStep("email");
        }, 2500);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Reset failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "newPassword") {
      setStep("otp");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // RENDER
  // ============================================================

  // ---------- SUCCESS VIEW ----------
  if (step === "success") {
    return (
      <div className="text-center py-8 animate-fadeIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Password Reset!
        </h2>
        <p className="text-gray-600 text-sm">
          You can now sign in with your new password.
        </p>
      </div>
    );
  }

  // ---------- STEP 1: EMAIL VIEW ----------
  if (step === "email") {
    return (
      <div className="w-full">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FaLock className="text-olympic text-xl" />
          </div>
          <h2 className="text-2xl font-black text-black mb-1">
            Forgot <span className="text-olympic">Password?</span>
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email to receive an OTP
          </p>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-700 text-sm">
                Email Address
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full h-12 pl-10 pr-4 rounded-xl
                           border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100
                           transition-all duration-200 text-base"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn w-full h-12 rounded-xl font-bold text-base shadow-lg
                       transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-olympic hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending OTP...
              </span>
            ) : (
              <>
                <FaKey /> Send OTP
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 mt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-olympic font-semibold hover:underline text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ---------- STEP 2: OTP VIEW ----------
  if (step === "otp") {
    return (
      <div className="w-full">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FaKey className="text-olympic text-xl" />
          </div>
          <h2 className="text-2xl font-black text-black mb-1">
            Enter <span className="text-olympic">OTP</span>
          </h2>
          <p className="text-gray-500 text-sm">
            We sent a 6-digit code to
            <br />
            <span className="font-semibold text-olympic break-all">{email}</span>
          </p>
          {timeLeft > 0 && (
            <p className="text-red-500 text-xs mt-2 font-semibold">
              ⏱ Expires in {formatTime(timeLeft)}
            </p>
          )}
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="form-control">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="● ● ● ● ● ●"
              value={otp}
              onChange={(e) => {
                if (/^\d{0,6}$/.test(e.target.value)) setOtp(e.target.value);
              }}
              className="input input-bordered w-full h-14 rounded-xl
                         border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100
                         text-center text-2xl font-bold tracking-[0.5em]"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`btn w-full h-12 rounded-xl font-bold text-base shadow-lg
                       transition-all duration-300 ${
              isLoading || otp.length !== 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-olympic hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
            }}
            className="btn btn-ghost w-full h-10 rounded-xl text-gray-600"
            disabled={isLoading}
          >
            <FaArrowLeft className="mr-1" /> Change Email
          </button>
        </form>
      </div>
    );
  }

  // ---------- STEP 3: NEW PASSWORD VIEW ----------
  if (step === "newPassword") {
    return (
      <div className="w-full">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FaLock className="text-green-500 text-xl" />
          </div>
          <h2 className="text-2xl font-black text-black mb-1">
            New <span className="text-olympic">Password</span>
          </h2>
          <p className="text-gray-500 text-sm">
            Set a strong new password for your account
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-3.5">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-700 text-sm">
                New Password
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaLock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full h-12 pl-10 pr-12 rounded-xl
                           border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100
                           transition-all duration-200"
                required
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <label className="label py-0.5">
              <span className="label-text-alt text-gray-400 text-xs">
                Minimum 6 characters
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-700 text-sm">
                Confirm Password
              </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input input-bordered w-full h-12 rounded-xl
                         transition-all duration-200 ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100"
              }`}
              required
              disabled={isLoading}
            />
            {confirmPassword && confirmPassword !== password && (
              <label className="label py-0.5">
                <span className="label-text-alt text-red-500 text-xs">
                  Passwords do not match
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword || password.length < 6}
            className={`btn w-full h-12 rounded-xl font-bold text-base shadow-lg
                       transition-all duration-300 ${
              isLoading || password !== confirmPassword || password.length < 6
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-olympic hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="btn btn-ghost w-full h-10 rounded-xl text-gray-600"
            disabled={isLoading}
          >
            <FaArrowLeft className="mr-1" /> Back
          </button>
        </form>
      </div>
    );
  }

  return null;
};

export default ForgotPasswordModal;