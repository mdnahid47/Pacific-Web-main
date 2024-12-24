/* eslint-disable react/prop-types */

import React, { useEffect } from 'react'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import { auth, db } from '../firebase/firebase.config';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore/lite';
import Avatar from '../assets/user-avatar.png'



const Profile = ({user}) => {
  const {logOut} = useContext(AuthContext)
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user);

      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
            {
                user.photoURL ? <img
                alt="User"
                src={user.photoURL}
              /> : <img alt="user" src={Avatar} />
              }
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a href="/user-profile">Profile</a>
            </li>
            <li>
              <a>Order</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile