import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import SigninModals from './Modals/SigninModals';
import { AuthContext } from '../contexts/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import SignInWithGoogle from './SignInWithGoogle';

const SignUp = () => {
  //   const { signUpWithGmail, createUser,signUpWithFacebook, updateUserProfile } =
  //   useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const onSubmit = (data) => {
  //   const email = data.email;
  //   const password = data.password;
  //   const number = data.number
  //   console.log(email, password,number)
  //   createUser(email, password,number)
  //     .then((result) => {
  //       // Signed up
  //       const user = result.user;
  //       toast.success("User Registration Successfully", {
  //         position: "top-center",
  //       });
  //       navigate(from,{replace:true})
  //       updateUserProfile(data.email, data.photoURL).then(() => {
  //         const userInfor = {
  //           name: data.name,
  //           email: data.email,
  //           number: data.number
  //         };
          
  //       });
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });

      
  // };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, sefirstName] = useState("");
  const [number,setNumber] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: firstName,
          number: number,
          photo:""
        });
      }
      navigate(from,{replace:true})
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  // login with google
 



    
  return (
    <div className='max-w-md bg-white w-full shadow mx-auto flex items-center justify-center mt-2'>
        <div className="modal-action flex flex-col justify-center mt-0">
          <form  className="card-body" method="dialog" onSubmit={handleRegister}>
            <h3 className="font-bold text-lg">Create A Account!</h3>


            <div className="form-control">
              <label className="label">
                <span className="label-text" >Your Name </span>
              </label>
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered"
                onChange={(e) => sefirstName(e.target.value)}
                required
              />
            </div>


            <div className="form-control">
              <label className="label">
                <span className="label-text" > Your Phone Number </span>
              </label>
              <input
                type="text"
                placeholder="Phone Number"
                className="input input-bordered"
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text"> Your Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                onChange={(e) => setEmail(e.target.value)}
                required
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* error */}
            

            {/* login btn */}
            <div className="form-control mt-2">
              <input
                type="submit"
                value="Signup"
                className="btn bg-olympic text-white"
              />
            </div>

            <p className="text-center ">
              have an account?{" "}
              <button  className="underline text-red ml-1" onClick={()=>document.getElementById('nav_modal').showModal()}>
                Log in Now
              </button>{" "}
            </p>

            <Link to='/'
            
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</Link>
          </form>

          {/* social sign in */}
          <div className="text-center space-x-3 mb-0">
            <button  className="btn btn-circle hover:bg-olympic hover:text-white"  >
            <SignInWithGoogle/>
            </button>
          </div>
        </div>

        <SigninModals/>
        <ToastContainer />
    </div>
  )
}

export default SignUp