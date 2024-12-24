import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase.config";
import { collection, doc, getDoc } from "firebase/firestore";
import Avatar from '../../assets/user-avatar.png'

function UserProfile() {
  // const [userDetails, setUserDetails] = useState(null);
  // const fetchUserData = async () => {
  //   auth.onAuthStateChanged(async (user) => {
  //     console.log(user);
  //     const userCollectionRef = collection(db, "Users");
  //     const docRef = doc(userCollectionRef, user.uid);
  //     // const docRef = doc(db, "Users", user.uid);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setUserDetails(docSnap.data());
  //       console.log(docSnap.data());
  //     } else {
  //       console.log("User is not logged in");
  //     }
  //   })
  // };
  // useEffect(() => {
  //   fetchUserData();
  // }, []);
  const [userDetails, setUserDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "Users", user.uid); // 'db' is your Firestore instance
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUserDetails(docSnap.data());
            } else {
              console.log("No such document!");
              setError("User data not found.");
            }
          } catch (err) {
            console.error("Error fetching user data: ", err);
            setError("Failed to fetch user data.");
          }
        } else {
          console.log("User is not logged in");
          setLoading(false);
        }
      });
    };

    fetchUserData();
  }, []);

  const AddOrUpdateUserData = () => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleAddOrUpdateUser = async () => {
      try {
        // Specifying the document ID explicitly
        await setDoc(doc(db, "Users", userId), {
          name: name,
          email: email,
        });
        console.log("Document successfully written!");
      } catch (e) {
        console.error("Error adding or updating document: ", e);
      }
    };

    // async function handleLogout() {
    //   try {
    //     await auth.signOut();
    //     window.location.href = "/login";
    //     console.log("User logged out successfully!");
    //   } catch (error) {
    //     console.error("Error logging out:", error.message);
    //   }
  };
  return (


    <div className="min-h-screen ">

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="update" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>


      {userDetails ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mt-60 " >
            <img
              src={userDetails.photo}
              width={100}
              style={{ borderRadius: "50%" }}
            />
          </div>

          <div className="mt-5">
            <p className="text-xs md:text-xl border-b-2">Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp; {userDetails.firstName} </p>
            <p className="text-xs md:text-xl border-b-2">Email &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; {userDetails.email}</p>
            <p className="text-xs md:text-xl border-b-2">Address&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; Khilgaon,Dhaka,Bangladesh</p>
          </div>
          <button className="btn bg-olympic text-white mt-2" onClick={() => document.getElementById('update').showModal()}>Update</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


export default UserProfile