import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from "react-icons/fa";

const SignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate Phone Number (11 digits after +88)
    if (!/^\d{11}$/.test(phoneNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 11 digits!",
      });
      setIsLoading(false);
      return;
    }

    // Prepare data for submission
    const data = {
      firstName,
      email,
      phoneNumber: `+88${phoneNumber}`, // Add +88 prefix before sending
      password,
    };

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Sign-up Successful!",
          text: "Your account has been created. Please sign in to continue.",
          showConfirmButton: false,
          timer: 2000,
        });

        // Redirect to "/" and open the sign-in modal
        setTimeout(() => {
          navigate("/");
          document.getElementById("nav_modal").showModal(); // Opens the sign-in modal
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-olympic hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black mb-2">
              Create Your <span className="text-olympic">Account</span>
            </h2>
            <p className="text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Phone Number</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center">
                  <span className="absolute left-8 font-semibold text-gray-600">+88</span>
                  <input
                    type="text"
                    placeholder=" Enter 11 digits"
                    className="input input-bordered w-full pl-16 pr-4 py-3 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200"
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
              <label className="label">
                <span className="label-text-alt text-gray-500">Must be exactly 11 digits</span>
              </label>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl border-gray-300 focus:border-olympic focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8">
              <button 
                type="submit" 
                className={`btn w-full  rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-olympic hover:bg-blue-700 text-white hover:shadow-blue-500/30 transform hover:-translate-y-1'
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

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => document.getElementById("nav_modal").showModal()}
                  className="text-olympic font-semibold hover:underline transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-olympic hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-olympic hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;