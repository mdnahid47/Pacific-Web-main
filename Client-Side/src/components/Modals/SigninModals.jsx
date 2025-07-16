import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";

const SigninModals = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { handleLogin } = useContext(AuthContext);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:5001/api/login", {
      email,
      password,
    }, { withCredentials: true }); // for cookie

    if (response.data.success) {
      const userData = response.data.user;
      const role = response.data.role;
 localStorage.setItem("token", response.data.token);
      // AuthContext or LocalStorage use
      handleLogin({ ...userData, token: response.data.token });

      //  Modal close fast
      const modal = document.getElementById("nav_modal");
      if (modal) modal.close();

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          timer: 1500,
          showConfirmButton: false
        });
      }, 200); // slight delay so modal can close first


      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "superadmin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1800); // wait for Swal to finish
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login failed",
      text: error.response?.data?.message || "Invalid credentials",
    });
  }
};



  return (
    <dialog id="nav_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-bold">Sign In</h3>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <Link
              to="/forgot-password"
              className="label-text-alt link link-hover mt-2 block"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            Sign In
          </button>

          {/* Sign Up */}
          <div className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium">
              Sign Up
            </Link>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={() => document.getElementById("nav_modal").close()}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
};

export default SigninModals;
