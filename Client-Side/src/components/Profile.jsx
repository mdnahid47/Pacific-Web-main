import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import Avatar from "../assets/user-avatar.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { logOut, user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch user data using JWT
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      // Set Authorization header with token
      const response = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserDetails(response.data); // Assuming your API returns user data
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (error.response && error.response.status === 401) {
        // If token is invalid or expired
        logOut();
      } else {
        // General error handling
        alert("An error occurred while fetching user data. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      logOut(); // Use the `logOut` method from AuthContext
      navigate("/"); // Client-side navigation
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {userDetails?.photoURL ? (
                <img alt="User" src={userDetails.photoURL} />
              ) : (
                <img alt="User Avatar" src={Avatar} />
              )}
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
            <li>
              <a href="/user-profile">Profile</a>
            </li>
            <li>
              <a href="/orders">Orders</a>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-link">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;


