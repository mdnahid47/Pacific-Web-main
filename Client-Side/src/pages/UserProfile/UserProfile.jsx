import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import axios from "axios";
import Avatar from "../../assets/user-avatar.png";
import Swal from "sweetalert2";
import ThanaDistrictlist from "../../components/divison&thanalist/ThanaDistrictlist";
import { Navigate, useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const { user, handleLogin, handleLogout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressType, setAddressType] = useState("home"); // 'home' or 'office'
  const [addresses, setAddresses] = useState({
    home: {},
    office: {}
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user profile data
useEffect(() => {
  const source = axios.CancelToken.source();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/user-profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cancelToken: source.token,
        }
      );

      const profile = response.data.user;

      // Home Address Parse
      const addrHome = typeof profile.home_address === "string"
        ? JSON.parse(profile.home_address)
        : profile.home_address || {};

      // Office Address Parse
      const addrOffice = typeof profile.office_address === "string"
        ? JSON.parse(profile.office_address)
        : profile.office_address || {};

      //  Set profile and photo
      setUserDetails({
        ...profile,
        photo: profile.photo 
          ? `http://localhost:5001${profile.photo}?${Date.now()}`
          : null,
      });

      //  Set address state separately
      setAddresses({
        home: addrHome,
        office: addrOffice,
      });
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) fetchUserProfile();

  return () => source.cancel();
}, [user, handleLogout]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Error", "Only image files are allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "File size must be less than 2MB", "error");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

const handleUpdateUser = async (e) => {
  e.preventDefault();
  setIsUpdating(true);

  try {
    const formData = new FormData();
    
    // Add basic form fields
    formData.append("name", e.target.firstName.value);
    formData.append("phone_number", e.target.phone.value);

    // Prepare and validate addresses
    const homeAddress = {
      houseNo: addresses.home.houseNo || '',
      roadNo: addresses.home.roadNo || '',
      areaName: addresses.home.areaName || '',
      division: addresses.home.division || '',
      district: addresses.home.district || '',
      policeStation: addresses.home.policeStation || ''
    };

    const officeAddress = {
      houseNo: addresses.office.houseNo || '',
      roadNo: addresses.office.roadNo || '',
      areaName: addresses.office.areaName || '',
      division: addresses.office.division || '',
      district: addresses.office.district || '',
      policeStation: addresses.office.policeStation || ''
    };

    // Add addresses to form data
    formData.append("home_address", JSON.stringify(homeAddress));
    formData.append("office_address", JSON.stringify(officeAddress));

    // Debug log
    console.log("Submitting addresses:", {
      home: homeAddress,
      office: officeAddress
    });

    // Add photo if exists
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const response = await axios.put(
      "http://localhost:5001/api/user-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success && response.data.user) {
      const updatedProfile = response.data.user;

      // Update all states
      setUserDetails(prev => ({
        ...prev,
        ...updatedProfile,
        photo: updatedProfile.photo 
          ? `http://localhost:5001${updatedProfile.photo}?${Date.now()}`
          : photoPreview || prev.photo,
      }));

      setAddresses({
        home: updatedProfile.home_address || {},
        office: updatedProfile.office_address || {}
      });

      handleLogin({
        ...user,
        name: updatedProfile.name || user.name,
        photo: updatedProfile.photo 
          ? `http://localhost:5001${updatedProfile.photo}?${Date.now()}`
          : user.photo,
      });

      Swal.fire("Success", "Profile updated successfully", "success");
      setModalOpen(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  } catch (error) {
    console.error("Update error:", error);
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to update profile",
      "error"
    );
  } finally {
    setIsUpdating(false);
  }
};

  const handleAddressChange = (field, value) => {
    setAddresses(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleLocationChange = (location) => {
  console.log("Received location data:", location);
  
  setAddresses(prev => ({
    ...prev,
    [addressType]: {
      ...prev[addressType],
      division: location.division,
      district: location.district,
      policeStation: location.policeStation
    }
  }));
};

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  if (!user) return <Navigate to="/" replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>;

  if (!userDetails) return <div className="min-h-screen flex items-center justify-center">
    <div className="alert alert-error shadow-lg max-w-md">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No user data available</span>
      </div>
    </div>
  </div>;

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-box shadow-lg p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="avatar mb-4">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img 
                src={photoPreview || (userDetails.photo || Avatar)} 
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Avatar;
                }}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center">
            {userDetails.name || "User"}
            {userDetails.role === "admin" && (
              <span className="badge badge-primary ml-2">Admin</span>
            )}
          </h1>
        </div>

        {/* Address Tabs */}
        <div className="tabs tabs-boxed bg-base-100 mb-6">
          <button 
            className={`tab ${addressType === 'home' ? 'tab-active' : ''}`}
            onClick={() => setAddressType('home')}
          >
            Home Address
          </button>
          <button 
            className={`tab ${addressType === 'office' ? 'tab-active' : ''}`}
            onClick={() => setAddressType('office')}
          >
            Office Address
          </button>
        </div>

        {/* Address Display */}
       {/* Address Display */}
<div className="card bg-base-100 shadow-sm p-4 mb-8">
  <h3 className="font-semibold text-lg mb-2">
    {addressType === 'home' ? 'Home' : 'Office'} Address
  </h3>

  {addresses[addressType]?.houseNo || addresses[addressType]?.division ? (
    <div className="space-y-2">
      {addresses[addressType].houseNo && (
        <p><span className="font-medium">House:</span> {addresses[addressType].houseNo}</p>
      )}
      {addresses[addressType].roadNo && (
        <p><span className="font-medium">Road:</span> {addresses[addressType].roadNo}</p>
      )}
      {addresses[addressType].areaName && (
        <p><span className="font-medium">Area:</span> {addresses[addressType].areaName}</p>
      )}
      
      {(addresses[addressType].division || addresses[addressType].district || addresses[addressType].policeStation) && (
        <p>
          <span className="font-medium">Location:</span>{" "}
          {[addresses[addressType].division, addresses[addressType].district, addresses[addressType].policeStation]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
    </div>
  ) : (
    <p className="text-sm opacity-70">No {addressType} address provided</p>
  )}
</div>


        {/* Contact Info */}
        <div className="card bg-base-100 shadow-sm p-4 mb-8">
          <h3 className="font-semibold text-lg mb-2">Contact Info</h3>
          <div className="space-y-2">
            <div>
              <label className="label-text text-sm opacity-70">Email</label>
              <p className="font-medium">{userDetails.email || "Not provided"}</p>
            </div>
            <div>
              <label className="label-text text-sm opacity-70">Phone</label>
              <p className="font-medium">{userDetails.phone_number || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
          <button
            onClick={handleLogoutAndRedirect}
            className="btn btn-error gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l3-3a1 1 0 10-1.414-1.414L14 7.586l-2.293-2.293a1 1 0 10-1.414 1.414L12.586 9H7a1 1 0 100 2h5.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        {/* Edit Profile Modal */}
        <dialog 
          id="editProfileModal" 
          className={`modal ${isModalOpen ? 'modal-open' : ''}`}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="modal-box relative max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={userDetails.name}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={userDetails.phone_number}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Profile Photo</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                  />
                  {photoPreview && (
                    <div className="mt-4 flex flex-col items-center">
                      <p className="text-sm mb-2">New Photo Preview:</p>
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-full border-2 border-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Address Type Selector */}
                <div className="tabs tabs-boxed bg-base-100">
                  <button 
                    type="button"
                    className={`tab ${addressType === 'home' ? 'tab-active' : ''}`}
                    onClick={() => setAddressType('home')}
                  >
                    Home Address
                  </button>
                  <button 
                    type="button"
                    className={`tab ${addressType === 'office' ? 'tab-active' : ''}`}
                    onClick={() => setAddressType('office')}
                  >
                    Office Address
                  </button>
                </div>

                {/* Address Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">House No</span>
                    </label>
                    <input
                      type="text"
                      value={addresses[addressType]?.houseNo || ''}
                      onChange={(e) => handleAddressChange('houseNo', e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Road No</span>
                    </label>
                    <input
                      type="text"
                      value={addresses[addressType]?.roadNo || ''}
                      onChange={(e) => handleAddressChange('roadNo', e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Area Name</span>
                  </label>
                  <input
                    type="text"
                    value={addresses[addressType]?.areaName || ''}
                    onChange={(e) => handleAddressChange('areaName', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

<ThanaDistrictlist
  key={`${addressType}-selector`} // optional: re-render on switch
  initialValues={{
    division: addresses[addressType]?.division || '',
    district: addresses[addressType]?.district || '',
    policeStation: addresses[addressType]?.policeStation || ''
  }}
  onChange={handleLocationChange}
/>
          </div>

              <div className="modal-action mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Updating...
                    </>
                  ) : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default UserProfile;
