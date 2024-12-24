import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthProvider";
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase/firebase.config";
import { toast, ToastContainer } from "react-toastify";
import { doc, setDoc } from 'firebase/firestore/lite';
import SignInWithGoogle from "../SignInWithGoogle";
import { useForm } from "react-hook-form";



const SigninModals = () => {
  const {
    register,
    formState: {
      errors
    } } = useForm();


  const { signUpWithGmail, signUpWithFacebook, login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  // redirecting to home page or specifig page
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      document.getElementById("nav_modal").close()
      navigate(from, {replace: true})
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);

      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  // google sign in 
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (result.user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        window.location.href = "/";
      }
    });


    }
 
  return (
    <div>
      <dialog id="nav_modal" className="modal modal-middle sm:modal-middle">
        <div className="modal-box">
          <div className="modal-action flex flex-col justify-center mt-0">
            <form className="card-body" method="dialog" onSubmit={handleSubmit}>
              <h3 className="font-bold text-lg">Please Login!</h3>

              {/* email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  className="input input-bordered"
                  {...register("email")}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  {...register("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className="label mt-1">
                  <a href="/forgot-password" className="label-text-alt link link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>

              {/* error */}
              {
                errorMessage ? <p className="text-red text-xs italic">{errorMessage}</p> : ""
              }

              {/* login btn */}
              <div className="form-control mt-4">
                <input
                  type="submit"
                  value="Login"
                  className="btn bg-olympic text-white"
                />
              </div>

              <p className="text-center my-2" onClick={() => document.getElementById('my_modal_3').show()}>
                Donot have an account?{" "}
                <Link to="/signup" className="underline text-red ml-1">
                  Signup Now
                </Link>{" "}
              </p>

              <button
                htmlFor="nav_modal"
                onClick={() => document.getElementById("nav_modal").close()}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >✕</button>
            </form>
               
            {/* social sign in */}
            <div className="text-center space-x-3 mb-5">
            <h3>Or Sign in With Google</h3> 
              <SignInWithGoogle/>
              <ToastContainer />

            </div>
          </div>
        </div>
      </dialog>
      {/* Sign up */}

    </div>
  )
}

export default SigninModals