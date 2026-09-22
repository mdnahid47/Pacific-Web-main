import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import api from "../../api";

const SignUp = ({ onSwitchToLogin, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate Phone Number (11 digits)
    if (!/^\d{11}$/.test(phoneNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 11 digits!",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      firstName,
      email,
      phoneNumber: `+88${phoneNumber}`,
      password,
    };

    try {
      const response = await api.post("/register", data);
      const result = response.data;

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Sign-up Successful!",
          text: "Your account has been created. Please sign in to continue.",
          showConfirmButton: false,
          timer: 2000,
        });

        // Reset form + switch back to login view inside modal
        setTimeout(() => {
          setFirstName("");
          setEmail("");
          setPhoneNumber("");
          setPassword("");
          if (onSwitchToLogin) onSwitchToLogin();
        }, 2100);
      } else {
        Swal.fire({
          icon: "error",
          title: "Sign-up Failed",
          text: result.message || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong! Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-black mb-1">
          Create Your <span className="text-olympic">Account</span>
        </h2>
        <p className="text-gray-500 text-sm">
          Join thousands of satisfied customers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Name */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-700 text-sm">
              Full Name
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your full name"
              className="input input-bordered w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-700 text-sm">
              Email Address
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-700 text-sm">
              Phone Number
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <FaPhone className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center relative">
              <span className="absolute left-9 font-semibold text-gray-600 text-sm z-10">
                +88
              </span>
              <input
                type="text"
                placeholder="Enter 11 digits"
                className="input input-bordered w-full pl-16 pr-4 py-2.5 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
                value={phoneNumber}
                onChange={(e) => {
                  if (/^\d{0,11}$/.test(e.target.value)) {
                    setPhoneNumber(e.target.value);
                  }
                }}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-700 text-sm">
              Password
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Create a strong password"
              className="input input-bordered w-full pl-10 pr-4 py-2.5 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-control mt-5">
          <button
            type="submit"
            className={`btn w-full rounded-xl font-bold text-base shadow-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-olympic hover:bg-blue-700 text-white hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Switch to Login */}
        <div className="text-center pt-3 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-olympic font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>

      {/* Terms */}
      <div className="text-center mt-3">
        <p className="text-gray-400 text-xs">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-olympic hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-olympic hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;