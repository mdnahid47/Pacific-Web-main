
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Phone Number (11 digits after +88)
    if (!/^\d{11}$/.test(phoneNumber)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Phone number must be exactly 11 digits!",
      });
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
    }
  };

  return (
    <div className="max-w-md bg-white w-full shadow mx-auto flex items-center justify-center mt-2">
      <form onSubmit={handleSubmit} className="card-body">
        <h3 className="font-bold text-lg">Sign Up</h3>

        {/* Name Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Name</span>
          </label>
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Email Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Phone Number Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <div className="flex items-center">
            <span className="mr-2 font-bold">+88</span>
            <input
              type="text"
              placeholder="Enter 11 digits"
              className="input input-bordered flex-grow"
              value={phoneNumber}
              onChange={(e) => {
                if (/^\d{0,11}$/.test(e.target.value)) {
                  setPhoneNumber(e.target.value);
                }
              }}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="form-control mt-4">
          <button type="submit" className="btn bg-olympic text-white">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
