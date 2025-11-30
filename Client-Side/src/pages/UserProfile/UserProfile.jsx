import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import axios from "axios";
import Avatar from "../../assets/user-avatar.png";
import Swal from "sweetalert2";
import ThanaDistrictlist from "../../components/divison&thanalist/ThanaDistrictlist";
import { Navigate, useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHome, FaBuilding, FaCamera, FaSignOutAlt, FaEdit } from "react-icons/fa";

function UserProfile() {
  const navigate = useNavigate();
  const { user, handleLogin, handleLogout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressType, setAddressType] = useState("home");
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

        // Set profile and photo
        setUserDetails({
          ...profile,
          photo: profile.photo 
            ? `http://localhost:5001${profile.photo}?${Date.now()}`
            : null,
        });

        // Set address state separately
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

      // Prepare and validate addresses - support both policeStation and thana fields
      const homeAddress = {
        houseNo: addresses.home.houseNo || '',
        roadNo: addresses.home.roadNo || '',
        areaName: addresses.home.areaName || '',
        division: addresses.home.division || '',
        district: addresses.home.district || '',
        thana: addresses.home.policeStation || addresses.home.thana || '' // Use thana field for backend
      };

      const officeAddress = {
        houseNo: addresses.office.houseNo || '',
        roadNo: addresses.office.roadNo || '',
        areaName: addresses.office.areaName || '',
        division: addresses.office.division || '',
        district: addresses.office.district || '',
        thana: addresses.office.policeStation || addresses.office.thana || '' // Use thana field for backend
      };

      console.log("Saving addresses:", { homeAddress, officeAddress });

      // Add addresses to form data
      formData.append("home_address", JSON.stringify(homeAddress));
      formData.append("office_address", JSON.stringify(officeAddress));

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

        // Parse updated addresses from response
        const updatedHomeAddr = typeof updatedProfile.home_address === 'string' 
          ? JSON.parse(updatedProfile.home_address) 
          : updatedProfile.home_address || {};

        const updatedOfficeAddr = typeof updatedProfile.office_address === 'string' 
          ? JSON.parse(updatedProfile.office_address) 
          : updatedProfile.office_address || {};

        // Update all states
        setUserDetails(prev => ({
          ...prev,
          ...updatedProfile,
          photo: updatedProfile.photo 
            ? `http://localhost:5001${updatedProfile.photo}?${Date.now()}`
            : photoPreview || prev.photo,
        }));

        setAddresses({
          home: updatedHomeAddr,
          office: updatedOfficeAddr
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

  // আলাদা handler for each address type
  const handleHomeAddressChange = (field, value) => {
    setAddresses(prev => ({
      ...prev,
      home: {
        ...prev.home,
        [field]: value
      }
    }));
  };

  const handleOfficeAddressChange = (field, value) => {
    setAddresses(prev => ({
      ...prev,
      office: {
        ...prev.office,
        [field]: value
      }
    }));
  };

  // আলাদা location change handlers for each address type
  const handleHomeLocationChange = (location) => {
    setAddresses(prev => ({
      ...prev,
      home: {
        ...prev.home,
        division: location.division,
        district: location.district,
        policeStation: location.policeStation,
        thana: location.policeStation // backup field for backend
      }
    }));
  };

  const handleOfficeLocationChange = (location) => {
    setAddresses(prev => ({
      ...prev,
      office: {
        ...prev.office,
        division: location.division,
        district: location.district,
        policeStation: location.policeStation,
        thana: location.policeStation // backup field for backend
      }
    }));
  };

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  if (!user) return <Navigate to="/" replace />;
  
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olympic"></div>
    </div>
  );

  if (!userDetails) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No User Data</h3>
        <p className="text-gray-600">Unable to load user profile data.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-olympic overflow-hidden">
                <img 
                  src={photoPreview || (userDetails.photo || Avatar)} 
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Avatar;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              {userDetails.role === "admin" && (
                <div className="absolute -top-2 -right-2 bg-olympic text-white px-3 py-1 rounded-full text-xs font-bold">
                  Admin
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                {userDetails.name || "User"}
              </h1>
              <div className="flex-column items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-olympic" />
                  <span>{userDetails.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-olympic" />
                  <span>{userDetails.phone_number || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-olympic text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/30"
              >
                <FaEdit />
                Edit Profile
              </button>
              <button
                onClick={handleLogoutAndRedirect}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-red-500/30"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                addressType === 'home' 
                  ? 'bg-olympic text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setAddressType('home')}
            >
              <FaHome />
              Home Address
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                addressType === 'office' 
                  ? 'bg-olympic text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setAddressType('office')}
            >
              <FaBuilding />
              Office Address
            </button>
          </div>

          {/* Address Display */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-olympic" />
              {addressType === 'home' ? 'Home' : 'Office'} Address
            </h3>

            {addresses[addressType]?.houseNo || addresses[addressType]?.division ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses[addressType].houseNo && (
                  <div>
                    <label className="text-sm text-gray-600">House No</label>
                    <p className="font-medium">{addresses[addressType].houseNo}</p>
                  </div>
                )}
                {addresses[addressType].roadNo && (
                  <div>
                    <label className="text-sm text-gray-600">Road No</label>
                    <p className="font-medium">{addresses[addressType].roadNo}</p>
                  </div>
                )}
                {addresses[addressType].areaName && (
                  <div>
                    <label className="text-sm text-gray-600">Area Name</label>
                    <p className="font-medium">{addresses[addressType].areaName}</p>
                  </div>
                )}
                {(addresses[addressType].division || addresses[addressType].district || addresses[addressType].policeStation || addresses[addressType].thana) && (
                  <div>
                    <label className="text-sm text-gray-600">Location</label>
                    <p className="font-medium">
                      {[addresses[addressType].division, addresses[addressType].district, addresses[addressType].policeStation || addresses[addressType].thana]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No {addressType} address provided</p>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        <dialog 
          id="editProfileModal" 
          className={`modal ${isModalOpen ? 'modal-open' : ''}`}
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="modal-box relative max-w-2xl bg-white p-0 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-olympic text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button 
                  className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleUpdateUser}>
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full border-4 border-olympic overflow-hidden">
                        <img 
                          src={photoPreview || (userDetails.photo || Avatar)} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute bottom-0 right-0 bg-olympic text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200">
                        <FaCamera />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {photoPreview && (
                      <p className="text-sm text-olympic font-medium">New photo selected</p>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        defaultValue={userDetails.name}
                        className="input input-bordered w-full rounded-xl focus:border-olympic focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Phone Number</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={userDetails.phone_number}
                        className="input input-bordered w-full rounded-xl focus:border-olympic focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Address Type Selector */}
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 ${
                        addressType === 'home' 
                          ? 'bg-olympic text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAddressType('home')}
                    >
                      <FaHome />
                      Home Address
                    </button>
                    <button 
                      type="button"
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex-1 ${
                        addressType === 'office' 
                          ? 'bg-olympic text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAddressType('office')}
                    >
                      <FaBuilding />
                      Office Address
                    </button>
                  </div>

                  {/* Address Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">House No</span>
                        </label>
                        <input
                          type="text"
                          value={addresses[addressType]?.houseNo || ''}
                          onChange={(e) => addressType === 'home' 
                            ? handleHomeAddressChange('houseNo', e.target.value)
                            : handleOfficeAddressChange('houseNo', e.target.value)
                          }
                          className="input input-bordered w-full rounded-xl focus:border-olympic focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Road No</span>
                        </label>
                        <input
                          type="text"
                          value={addresses[addressType]?.roadNo || ''}
                          onChange={(e) => addressType === 'home' 
                            ? handleHomeAddressChange('roadNo', e.target.value)
                            : handleOfficeAddressChange('roadNo', e.target.value)
                          }
                          className="input input-bordered w-full rounded-xl focus:border-olympic focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Area Name</span>
                      </label>
                      <input
                        type="text"
                        value={addresses[addressType]?.areaName || ''}
                        onChange={(e) => addressType === 'home' 
                          ? handleHomeAddressChange('areaName', e.target.value)
                          : handleOfficeAddressChange('areaName', e.target.value)
                        }
                        className="input input-bordered w-full rounded-xl focus:border-olympic focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* আলাদা ThanaDistrictlist for each address type */}
                    {addressType === 'home' ? (
                      <ThanaDistrictlist
                        key="home-address"
                        uniqueKey="home"
                        initialValues={{
                          division: addresses.home.division || '',
                          district: addresses.home.district || '',
                          policeStation: addresses.home.policeStation || addresses.home.thana || ''
                        }}
                        onChange={handleHomeLocationChange}
                      />
                    ) : (
                      <ThanaDistrictlist
                        key="office-address"
                        uniqueKey="office"
                        initialValues={{
                          division: addresses.office.division || '',
                          district: addresses.office.district || '',
                          policeStation: addresses.office.policeStation || addresses.office.thana || ''
                        }}
                        onChange={handleOfficeLocationChange}
                      />
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="modal-action mt-8">
                  <button 
                    type="submit" 
                    className="bg-olympic text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                    onClick={() => setModalOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default UserProfile;