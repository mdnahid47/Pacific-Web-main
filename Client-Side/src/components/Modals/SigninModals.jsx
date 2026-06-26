// import React, { useState, useContext, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { AuthContext } from "../../contexts/AuthProvider";

// const SigninModals = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/";

//   const { handleLogin } = useContext(AuthContext);

//   // Handle click outside modal to close
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       const modal = document.getElementById("nav_modal");
//       if (modal && e.target === modal) {
//         closeModal();
//       }
//     };

//     const modal = document.getElementById("nav_modal");
//     if (modal) {
//       modal.addEventListener("click", handleOutsideClick);
//     }

//     return () => {
//       if (modal) {
//         modal.removeEventListener("click", handleOutsideClick);
//       }
//     };
//   }, []);

//   // Reset error when modal opens
//   useEffect(() => {
//     const modal = document.getElementById("nav_modal");
//     const handleModalOpen = () => {
//       setError("");
//     };

//     if (modal) {
//       modal.addEventListener('show', handleModalOpen);
//     }

//     return () => {
//       if (modal) {
//         modal.removeEventListener('show', handleModalOpen);
//       }
//     };
//   }, []);

//   // Handle navigation links (Sign Up, Forgot Password)
//   const handleNavigationClick = (path) => {
//     closeModal();
    
//     // Small delay to ensure modal closes before navigation
//     setTimeout(() => {
//       navigate(path);
//     }, 100);
//   };

//   // Close modal function
//   const closeModal = () => {
//     const modal = document.getElementById("nav_modal");
//     if (modal) {
//       modal.close();
//       setError(""); // Clear error when closing
//     }
//   };

//   // Reopen modal with error
//   const reopenModalWithError = (errorMessage) => {
//     setError(errorMessage);
//     const modal = document.getElementById("nav_modal");
//     if (modal) {
//       setTimeout(() => {
//         modal.showModal();
//       }, 100);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     // Close modal immediately when submit starts
//     closeModal();

//     try {
//       const response = await axios.post("http://localhost:5001/api/login", {
//         email,
//         password,
//       }, { withCredentials: true });

//       if (response.data.success) {
//         const userData = response.data.user;
//         const role = response.data.role;
//         localStorage.setItem("token", response.data.token);
        
//         // AuthContext or LocalStorage use
//         handleLogin({ ...userData, token: response.data.token });

//         // Show success message
//         Swal.fire({
//           icon: "success",
//           title: "Login successful!",
//           timer: 1500,
//           showConfirmButton: false
//         });

//         setTimeout(() => {
//           if (role === "admin") {
//             navigate("/admin/dashboard");
//           } else if (role === "superadmin") {
//             navigate("/admin/dashboard");
//           } else {
//             navigate(from, { replace: true });
//           }
//         }, 1600);

//       }

//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Invalid credentials";
      
//       // Show error message first
//       Swal.fire({
//         icon: "error",
//         title: "Login failed",
//         text: errorMessage,
//         timer: 2000,
//         showConfirmButton: false
//       }).then(() => {
//         // Reopen modal with error after Swal closes
//         reopenModalWithError(errorMessage);
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <dialog id="nav_modal" className="modal">
//       <div className="modal-box relative">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h3 className="text-2xl font-bold">Sign In</h3>

//           {/* Error Message */}
//           {error && (
//             <div className="alert alert-error">
//               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Email */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Email</span>
//             </label>
//             <input
//               type="email"
//               placeholder="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="input input-bordered w-full"
//               required
//               disabled={isLoading}
//             />
//           </div>

//           {/* Password */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text">Password</span>
//             </label>
//             <input
//               type="password"
//               placeholder="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="input input-bordered w-full"
//               required
//               disabled={isLoading}
//             />
//             {/* Forgot Password Link */}
//             <button
//               type="button"
//               onClick={() => handleNavigationClick("/forgot-password")}
//               className="label-text-alt link link-hover mt-2 block text-left"
//               disabled={isLoading}
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             className={`btn btn-primary w-full mt-4 ${isLoading ? 'loading' : ''}`}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Signing In...' : 'Sign In'}
//           </button>

//           {/* Sign Up Link */}
//           <div className="text-center mt-4">
//             Don't have an account?{" "}
//             <button
//               type="button"
//               onClick={() => handleNavigationClick("/signup")}
//               className="text-primary font-medium hover:underline"
//               disabled={isLoading}
//             >
//               Sign Up
//             </button>
//           </div>
//         </form>

//         {/* Close Button */}
//         <button
//           onClick={closeModal}
//           className="btn btn-sm btn-circle absolute right-2 top-2"
//           disabled={isLoading}
//         >
//           ✕
//         </button>
//       </div>
      
//       {/* Modal Backdrop - Click outside to close */}
//       <form method="dialog" className="modal-backdrop">
//         <button type="button" onClick={closeModal}>close</button>
//       </form>
//     </dialog>
//   );
// };

// export default SigninModals;

import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../contexts/AuthProvider";

const SigninModals = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { handleLogin } = useContext(AuthContext);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const modal = document.getElementById("nav_modal");
      if (modal && e.target === modal) {
        closeModal();
      }
    };

    const modal = document.getElementById("nav_modal");
    if (modal) {
      modal.addEventListener("click", handleOutsideClick);
    }

    return () => {
      if (modal) {
        modal.removeEventListener("click", handleOutsideClick);
      }
    };
  }, []);

  useEffect(() => {
    const modal = document.getElementById("nav_modal");
    const handleModalOpen = () => {
      setError("");
    };

    if (modal) {
      modal.addEventListener("show", handleModalOpen);
    }

    return () => {
      if (modal) {
        modal.removeEventListener("show", handleModalOpen);
      }
    };
  }, []);

  const handleNavigationClick = (path) => {
    closeModal();
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const closeModal = () => {
    const modal = document.getElementById("nav_modal");
    if (modal) {
      modal.close();
      setError("");
      setShowPassword(false); // Reset show password on close
    }
  };

  const reopenModalWithError = (errorMessage) => {
    setError(errorMessage);
    const modal = document.getElementById("nav_modal");
    if (modal) {
      setTimeout(() => {
        modal.showModal();
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    closeModal();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/login",
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
      }).then(() => {
        reopenModalWithError(errorMessage);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id="nav_modal" className="modal">
      <div className="modal-box relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-2xl font-bold">Sign In</h3>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
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
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-slash icon (password visible)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  // Eye icon (password hidden)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {/* Forgot Password Link */}
            <button
              type="button"
              onClick={() => handleNavigationClick("/forgot-password")}
              className="label-text-alt link link-hover mt-2 block text-left"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full mt-4 ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => handleNavigationClick("/signup")}
              className="text-primary font-medium hover:underline"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={closeModal}
          className="btn btn-sm btn-circle absolute right-2 top-2"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      {/* Modal Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={closeModal}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default SigninModals;