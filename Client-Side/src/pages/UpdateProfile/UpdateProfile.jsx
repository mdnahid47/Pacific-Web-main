import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/firebase.config'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

const UpdateProfile = () => {
    // const {updateUserProfile} = useContext(AuthContext)
    // const [userDetails, setUserDetails] = useState(null);
    // const {
    //     register,
    //     handleSubmit,
    //     watch,
    //     formState: { errors },
    //   } = useForm();

    //   const location = useLocation();
    //   const navigate = useNavigate();
    //   const from = location.state?.from?.pathname || "/";

      
    //   const onSubmit = () => {
    //     const name = userDetails.firstName;
    //     const photoURL = userDetails.photoURL;
    //     updateUserProfile(name, photoURL).then(() => {
    //         // Profile updated!
    //         navigate(from, {replace: true})
    //         // ...
    //       }).catch((error) => {
    //         // An error occurred
    //         // ...
    //       });
    //   }
// onSubmit={handleSubmit(onSubmit)} {...register("name")} {...register("photoURL")}
const user = auth.currentUser;
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [firstName, sefirstName] = useState("");
const [number,setNumber] = useState("");
if (user) {
   setDoc(doc(db, "Users", user.uid), {
    firstName: firstName,
    number: number,
    
  });
}

  return (
    <div className='flex items-center justify-center h-screen'>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body" >
        <h3 className='font-bold'>Update Your Profile</h3>
        
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

        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Photo</span>
          </label>

          <input type="text"  placeholder="photoURL" className="input input-bordered"  />
          
          {/* TODO: Uplodaing image will be later */}
          {/* <input type="file" className="file-input w-full max-w-xs" /> */}
        </div>
        <div className="form-control mt-6">
          <button className="btn bg-olympic text-white">Update</button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default UpdateProfile

// export default UpdateProfile