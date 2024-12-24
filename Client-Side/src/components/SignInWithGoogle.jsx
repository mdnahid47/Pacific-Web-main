import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import { auth, db } from "../firebase/firebase.config";

function SignInWithGoogle() {
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
      <button className="btn btn-circle hover:bg-olympic hover:text-white"  onClick={googleLogin}>
                <FaGoogle />
              </button>
    </div>
  );
}

export default SignInWithGoogle