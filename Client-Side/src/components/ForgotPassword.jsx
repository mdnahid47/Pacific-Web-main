
import React from 'react'
import { auth, db } from '../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(auth,emalVal).then(data=>{
            toast.success("Check Your Email", {
                position: "top-center",
              });

            
        }).catch(err=>{
            alert(err.code)
        })
    }

    return (
        <div className='min-h-screen '>
            <div className='flex flex-col items-center justify-center mt-52 gap-4'> 
                <form action=""  className="card-body" method="dialog" onSubmit={(e)=>handleSubmit(e)}>
                <div className="form-control flex flex-col gap-2">
              <label className="label">
               <h1>Reset Your Password</h1>
              </label>
              <input
                placeholder="Enter Your Email"
                className="input input-bordered"
                name='email'
                required
              />
               
            </div>
            <button className='btn bg-olympic text-white'>Reset Password</button>
            <a href="/" className="label-text-alt link link-hover">Back to Home Page </a>
                </form>
               
               
            </div>
         <ToastContainer />
           
        </div>
    )
}

export default ForgotPassword