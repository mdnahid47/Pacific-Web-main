import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addDays, format, isSameDay, isToday } from "date-fns";
import Swal from "sweetalert2";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBangladeshiTakaSign,
  faUser,
  faPhone,
  faCalendarAlt,
  faMapMarkerAlt,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import ThanaDistrictlist from "../../components/divison&thanalist/ThanaDistrictlist";
import config from "../../config"; 

const capitalizeWords = (str) =>
  str ? str.replace(/\b\w/g, (ch) => ch.toUpperCase()) : "";

const validPromoCodes = {
  DISCOUNT10: 10,
  SAVE20: 20,
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCart = location.state?.cart || [];
  const [cart, setCart] = useState(initialCart);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1));
  const days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  // Config url
  const API_URL = config.API_URL;

  // Generate time slots from 8 AM to 8 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      const start = new Date();
      start.setHours(hour, 0, 0, 0);
      const end = new Date();
      end.setHours(hour + 1, 0, 0, 0);
      slots.push({ startTime: start, endTime: end });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const defaultSlot = timeSlots.find((s) => s.startTime.getHours() === 8);
  const [selectedSlot, setSelectedSlot] = useState(defaultSlot);

  // User info
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Address related
  const [selectedAddressType, setSelectedAddressType] = useState("home");
  const [homeAddress, setHomeAddress] = useState({
    houseNo: "",
    roadNo: "",
    areaName: "",
    division: "",
    district: "",
    thana: ""
  });
  const [officeAddress, setOfficeAddress] = useState({
    houseNo: "",
    roadNo: "",
    areaName: "",
    division: "",
    district: "",
    thana: ""
  });
  const [tempAddress, setTempAddress] = useState({
    name: "",
    phone: "",
    houseNo: "",
    roadNo: "",
    areaName: "",
    division: "",
    district: "",
    thana: ""
  });

  // Modal visibility
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
 
  // Form and promo
  const [isChecked, setIsChecked] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const scheduleModalRef = useRef(null);
  const addressModalRef = useRef(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/api/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          const userData = res.data.user;
          setUserDetails(userData);

          // Parse addresses correctly - ensure both addresses are preserved
          const homeAddr = typeof userData.home_address === 'string' 
            ? JSON.parse(userData.home_address) 
            : userData.home_address || {};
          
          const officeAddr = typeof userData.office_address === 'string' 
            ? JSON.parse(userData.office_address) 
            : userData.office_address || {};

          console.log("Loaded home address:", homeAddr);
          console.log("Loaded office address:", officeAddr);

          // Set both addresses independently
          setHomeAddress({
            houseNo: homeAddr.houseNo || "",
            roadNo: homeAddr.roadNo || "",
            areaName: homeAddr.areaName || "",
            division: homeAddr.division || "",
            district: homeAddr.district || "",
            thana: homeAddr.thana || homeAddr.policeStation || ""
          });

          setOfficeAddress({
            houseNo: officeAddr.houseNo || "",
            roadNo: officeAddr.roadNo || "",
            areaName: officeAddr.areaName || "",
            division: officeAddr.division || "",
            district: officeAddr.district || "",
            thana: officeAddr.thana || officeAddr.policeStation || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire("Error", "Failed to load user data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API_URL]);

  // Validate form on changes
  useEffect(() => {
    const address = selectedAddressType === "home" ? homeAddress : 
                   selectedAddressType === "office" ? officeAddress : tempAddress;

    const isAddressFilled = address.houseNo && address.roadNo && 
                          address.areaName && address.division && 
                          address.district && address.thana;

    const isAnotherValid = selectedAddressType !== "another" || 
                          (tempAddress.name && tempAddress.phone);

    setFormValid(isAddressFilled && isChecked && cart.length > 0 && isAnotherValid);
  }, [homeAddress, officeAddress, tempAddress, selectedAddressType, isChecked, cart]);

  // Format time for display
  const formatTime = (date) => 
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  // Change cart item quantity
  const handleQuantityChange = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.floor((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;
  const categories = [...new Set(cart.map(item => item.category))];

  // Apply promo code
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoError("Please enter a promo code.");
      setDiscountPercent(0);
      return;
    }

    if (validPromoCodes[code]) {
      setDiscountPercent(validPromoCodes[code]);
      setPromoError("");
      Swal.fire("Success", `Promo code applied! ${validPromoCodes[code]}% discount added.`, "success");
    } else {
      setPromoError("Invalid promo code.");
      setDiscountPercent(0);
    }
  };

  // Place order - Fixed version
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Error", "You need to login first", "error");
      return;
    }

    // Validate cart
    if (!cart || cart.length === 0) {
      Swal.fire("Error", "Your cart is empty", "error");
      return;
    }

    // Prepare order data according to backend expectations
    const orderData = {
      category: cart[0]?.category || "General",
      cart: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      selectedDate: format(selectedDate, "yyyy-MM-dd"),
      selectedSlot: `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`,
      notes: notes || "",
      addressType: selectedAddressType,
      recipientName: selectedAddressType === "another" ? tempAddress.name : userDetails?.name,
      recipientPhone: selectedAddressType === "another" ? tempAddress.phone : userDetails?.phone_number
    };

    // Add address based on type - use the correct field names expected by backend
    if (selectedAddressType === "home") {
      orderData.home_address = JSON.stringify(homeAddress);
    } else if (selectedAddressType === "office") {
      orderData.office_address = JSON.stringify(officeAddress);
    } else if (selectedAddressType === "another") {
      orderData.temp_address = JSON.stringify({
        houseNo: tempAddress.houseNo,
        roadNo: tempAddress.roadNo,
        areaName: tempAddress.areaName,
        division: tempAddress.division,
        district: tempAddress.district,
        thana: tempAddress.thana
      });
    }

    console.log("Order data being sent:", orderData);

    try {
      const res = await axios.post(`${API_URL}/api/place-order`, orderData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Order placed successfully! Order ID: ${res.data.orderId}`,
          icon: "success",
          confirmButtonText: "View Orders",
        }).then(() => {
          setCart([]);
          navigate("/orders");
        });
      }
    } catch (error) {
      console.error("Order error:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to place order. Please try again.";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  // Handle save address - Fixed version
  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "You need to login first", "error");
        return;
      }

      // Get the address to save based on selected type
      const addressToSave = selectedAddressType === "home" ? homeAddress : officeAddress;

      // Validate required fields
      const requiredFields = [
        { field: "division", name: "Division" },
        { field: "district", name: "District" },
        { field: "thana", name: "Thana" },
        { field: "houseNo", name: "House No" },
        { field: "areaName", name: "Area Name" },
      ];

      const missingFields = requiredFields.filter(({ field }) => {
        const value = addressToSave[field];
        return typeof value !== "string" || value.trim() === "";
      });

      if (missingFields.length > 0) {
        Swal.fire({
          title: "Incomplete Address",
          html: `Please complete these required fields:<br><br>
                ${missingFields.map(({ name }) => `• ${name}`).join("<br>")}`,
          icon: "error",
        });
        return;
      }

      // Prepare the update data - preserve both addresses
      const updateData = {
        name: userDetails?.name || "",
        phone_number: userDetails?.phone_number || "",
      };

      // Add both addresses to preserve them
      if (selectedAddressType === "home") {
        updateData.home_address = JSON.stringify(addressToSave);
        // Preserve existing office address
        updateData.office_address = JSON.stringify(officeAddress);
      } else if (selectedAddressType === "office") {
        updateData.office_address = JSON.stringify(addressToSave);
        // Preserve existing home address
        updateData.home_address = JSON.stringify(homeAddress);
      }

      console.log("Saving address data:", updateData);

      const response = await axios.put(
        `${API_URL}/api/user-profile`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: `${selectedAddressType === "home" ? "Home" : "Office"} address saved successfully`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Update user details in state with both addresses
        if (response.data.user) {
          setUserDetails(response.data.user);
          
          // Update both addresses from response to ensure consistency
          const updatedHomeAddress = typeof response.data.user.home_address === 'string' 
            ? JSON.parse(response.data.user.home_address) 
            : response.data.user.home_address || {};
          
          const updatedOfficeAddress = typeof response.data.user.office_address === 'string' 
            ? JSON.parse(response.data.user.office_address) 
            : response.data.user.office_address || {};

          setHomeAddress({
            houseNo: updatedHomeAddress.houseNo || "",
            roadNo: updatedHomeAddress.roadNo || "",
            areaName: updatedHomeAddress.areaName || "",
            division: updatedHomeAddress.division || "",
            district: updatedHomeAddress.district || "",
            thana: updatedHomeAddress.thana || updatedHomeAddress.policeStation || ""
          });

          setOfficeAddress({
            houseNo: updatedOfficeAddress.houseNo || "",
            roadNo: updatedOfficeAddress.roadNo || "",
            areaName: updatedOfficeAddress.areaName || "",
            division: updatedOfficeAddress.division || "",
            district: updatedOfficeAddress.district || "",
            thana: updatedOfficeAddress.thana || updatedOfficeAddress.policeStation || ""
          });
        }
        
        setAddressModalOpen(false);
      }
    } catch (err) {
      console.error("Address save error:", err);
      
      let errorMessage = "Failed to save address. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        if (err.response.data.field === 'name') {
          errorMessage = "Name is required. Please update your profile name first.";
        } else {
          errorMessage = "Invalid data provided. Please check all fields.";
        }
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please log in again.";
      }
      
      Swal.fire({
        title: "Save Failed",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  // আলাদা handler for home address fields
  const handleHomeAddressFieldChange = (field, value) => {
    setHomeAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // আলাদা handler for office address fields
  const handleOfficeAddressFieldChange = (field, value) => {
    setOfficeAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // আলাদা handler for temp address fields
  const handleTempAddressFieldChange = (field, value) => {
    setTempAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Render delivery address summary
  const renderAddressSummary = () => {
    const address = selectedAddressType === "home" ? homeAddress : 
                   selectedAddressType === "office" ? officeAddress : tempAddress;

    const hasAddress = address.houseNo || address.roadNo || address.areaName || 
                      address.division || address.district || address.thana;

    if (!hasAddress) {
      return <p className="italic text-gray-500">No delivery address set</p>;
    }
    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm space-y-1">
        {selectedAddressType === "another" && (
          <>
            <p>
              <strong>Recipient Name:</strong> {address.name || "-"}
            </p>
            <p>
              <strong>Recipient Phone:</strong> {address.phone || "-"}
            </p>
          </>
        )}
        {address.division && <p><strong>Division:</strong> {capitalizeWords(address.division)}</p>}
        {address.district && <p><strong>District:</strong> {capitalizeWords(address.district)}</p>}
        {address.thana && <p><strong>Thana:</strong> {capitalizeWords(address.thana)}</p>}
        {address.houseNo && <p><strong>House No:</strong> {address.houseNo}</p>}
        {address.roadNo && <p><strong>Road No:</strong> {address.roadNo}</p>}
        {address.areaName && <p><strong>Area:</strong> {capitalizeWords(address.areaName)}</p>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-24 container mx-auto px-4 py-8 max-w-7xl flex justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="pt-24 container mx-auto px-4 py-8 max-w-7xl">
      {/* Schedule Modal */}
      <dialog
        id="schedule_modal"
        className="modal modal-bottom sm:modal-middle"
        open={isScheduleModalOpen}
        ref={scheduleModalRef}
        onClick={(e) => {
          if (e.target === scheduleModalRef.current) {
            setScheduleModalOpen(false);
          }
        }}
      >
        <form method="dialog" className="modal-box relative p-6 max-w-2xl">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setScheduleModalOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4 text-center">
            Select Delivery Schedule
          </h3>

          {/* Date Picker */}
          <div className="overflow-x-auto mb-6">
            <table className="table-fixed w-full text-center border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {days.map((day) => (
                    <th
                      key={day.toISOString()}
                      className="p-2 border border-gray-300 text-sm sm:text-base"
                    >
                      {format(day, "EEE")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);
                    return (
                      <td
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`cursor-pointer p-3 border border-gray-300 select-none text-sm sm:text-base ${
                          isSelected
                            ? "bg-primary text-white font-bold"
                            : "hover:bg-gray-50"
                        } ${isCurrentDay ? "underline" : ""}`}
                      >
                        {format(day, "d")}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-center">
            {timeSlots.map((slot, i) => {
              const isSelected =
                selectedSlot &&
                slot.startTime.getTime() === selectedSlot.startTime.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`btn btn-sm ${
                    isSelected ? "btn-primary" : "btn-outline"
                  } whitespace-nowrap text-xs sm:text-sm`}
                >
                  {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                </button>
              );
            })}
          </div>

          <div className="modal-action justify-center mt-6">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setScheduleModalOpen(false)}
            >
              Save Schedule
            </button>
          </div>
        </form>
      </dialog>

      {/* Address Modal */}
      <dialog
        id="address_modal"
        className="modal"
        open={isAddressModalOpen}
        ref={addressModalRef}
        onClick={(e) => {
          if (e.target === addressModalRef.current) {
            setAddressModalOpen(false);
          }
        }}
      >
        <form method="dialog" className="modal-box max-w-xl">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setAddressModalOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-3">
            {selectedAddressType === "home"
              ? "Home Address"
              : selectedAddressType === "office"
              ? "Office Address"
              : "Order for Another Address"}
          </h3>

          {selectedAddressType === "another" && (
            <>
              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text">Recipient Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient name"
                  className="input input-bordered w-full"
                  value={tempAddress.name}
                  onChange={(e) => handleTempAddressFieldChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-3">
                <label className="label">
                  <span className="label-text">Recipient Phone</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter recipient phone number"
                  className="input input-bordered w-full"
                  value={tempAddress.phone}
                  onChange={(e) => handleTempAddressFieldChange('phone', e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* আলাদা ThanaDistrictlist for each address type */}
          <ThanaDistrictlist
            key={`${selectedAddressType}-address-selector`}
            uniqueKey={selectedAddressType}
            initialValues={{
              division: selectedAddressType === "home" 
                ? homeAddress.division 
                : selectedAddressType === "office" 
                  ? officeAddress.division 
                  : tempAddress.division,
              district: selectedAddressType === "home" 
                ? homeAddress.district 
                : selectedAddressType === "office" 
                  ? officeAddress.district 
                  : tempAddress.district,
              policeStation: selectedAddressType === "home" 
                ? homeAddress.thana 
                : selectedAddressType === "office" 
                  ? officeAddress.thana 
                  : tempAddress.thana
            }}
            onChange={(location) => {
              console.log(`${selectedAddressType} address updated:`, location);
              
              const updatedAddress = {
                division: location.division,
                district: location.district,
                thana: location.policeStation
              };

              // শুধুমাত্র সংশ্লিষ্ট এড্রেস টাইপ update হবে
              if (selectedAddressType === "home") {
                setHomeAddress(prev => ({ 
                  ...prev, 
                  ...updatedAddress 
                }));
              } else if (selectedAddressType === "office") {
                setOfficeAddress(prev => ({ 
                  ...prev, 
                  ...updatedAddress 
                }));
              } else {
                setTempAddress(prev => ({ 
                  ...prev, 
                  ...updatedAddress 
                }));
              }
            }}
          />

          {["houseNo", "roadNo", "areaName"].map((field) => (
            <div className="form-control mt-3" key={field}>
              <label className="label">
                <span className="label-text">
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              </label>
              <input
                type="text"
                placeholder={`Enter ${field
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}`}
                className="input input-bordered w-full"
                value={
                  selectedAddressType === "home"
                    ? homeAddress[field] || ""
                    : selectedAddressType === "office"
                    ? officeAddress[field] || ""
                    : tempAddress[field] || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (selectedAddressType === "home")
                    handleHomeAddressFieldChange(field, val);
                  else if (selectedAddressType === "office")
                    handleOfficeAddressFieldChange(field, val);
                  else handleTempAddressFieldChange(field, val);
                }}
                required
              />
            </div>
          ))}

          <div className="modal-action justify-between mt-6">
            <button
              type="button"
              className="btn"
              onClick={() => setAddressModalOpen(false)}
            >
              Close
            </button>
            {(selectedAddressType === "home" || selectedAddressType === "office") && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveAddress}
              >
                Save Address
              </button>
            )}
            {selectedAddressType === "another" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!tempAddress.name || !tempAddress.phone) {
                    Swal.fire("Error", "Please enter recipient name and phone number", "error");
                    return;
                  }
                  setAddressModalOpen(false);
                }}
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </dialog>

      {/* Main Checkout Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="lg:w-2/3 p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>

          {/* User Details */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} />
              {selectedAddressType === "another" ? "Recipient Details" : "User Details"}
            </h3>
            {selectedAddressType === "another" ? (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
                <p>
                  <strong>Name:</strong> {tempAddress.name || "Not set"}
                </p>
                <p>
                  <strong>Phone:</strong> {tempAddress.phone || "Not set"}
                </p>
              </div>
            ) : userDetails ? (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
                <p>
                  <strong>Name:</strong> {userDetails.name || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {userDetails.phone_number || "N/A"}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="italic text-gray-500">No user details available</p>
              </div>
            )}
          </div>

          {/* Delivery Schedule */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Delivery Schedule
            </h3>
            <button
              className="btn btn-outline w-full justify-start gap-2"
              onClick={() => setScheduleModalOpen(true)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              {format(selectedDate, "dd MMM yyyy")} |{" "}
              {`${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`}
            </button>
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Delivery Address
              </span>
            </h3>

            <div className="flex flex-col gap-3 mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="homeAddress"
                  name="addressType"
                  checked={selectedAddressType === "home"}
                  onChange={() => setSelectedAddressType("home")}
                  className="radio radio-primary"
                />
                <label htmlFor="homeAddress" className="cursor-pointer">
                  Home Address
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="officeAddress"
                  name="addressType"
                  checked={selectedAddressType === "office"}
                  onChange={() => setSelectedAddressType("office")}
                  className="radio radio-primary"
                />
                <label htmlFor="officeAddress" className="cursor-pointer">
                  Office Address
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="anotherAddress"
                  name="addressType"
                  checked={selectedAddressType === "another"}
                  onChange={() => {
                    setSelectedAddressType("another");
                    setAddressModalOpen(true);
                  }}
                  className="radio radio-primary"
                />
                <label htmlFor="anotherAddress" className="cursor-pointer">
                  Order for Another
                </label>
              </div>
            </div>

            {(selectedAddressType === "home" || selectedAddressType === "office") && (
              <button
                className="btn btn-sm btn-outline mb-3"
                onClick={() => setAddressModalOpen(true)}
              >
                Edit Address
              </button>
            )}

            {renderAddressSummary()}
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Additional Notes</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Any special instructions for delivery..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-1/3 flex flex-col">
          <div className="p-6 border rounded-lg shadow-sm bg-white mb-4 flex-grow">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            {categories.length > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <FontAwesomeIcon icon={faTags} className="text-gray-500" />
                <span className="font-medium">Category:</span>
                <span>{categories.join(", ")}</span>
              </div>
            )}

            <div className="space-y-4 max-h-64 overflow-y-auto mb-4 pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={item.image || ''}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.className = "hidden";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.price} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="btn btn-xs btn-outline"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="btn btn-xs btn-outline"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold">
                      {item.price * item.quantity}{" "}
                      <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="form-control mb-4">
              <label className="label" htmlFor="promoCode">
                <span className="label-text">Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="promoCode"
                  type="text"
                  className="input input-bordered flex-grow"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError("");
                  }}
                  placeholder="Enter promo code"
                />
                <button
                  className="btn btn-primary"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-error mt-1 text-sm">{promoError}</p>}
              {discountPercent > 0 && (
                <p className="text-success mt-1 text-sm">
                  {discountPercent}% discount applied!
                </p>
              )}
            </div>

            <div className="space-y-2 border-t pt-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {subtotal} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between">
                  <span>Discount ({discountPercent}%):</span>
                  <span className="font-semibold text-success">
                    -{discountAmount} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>
                  {total} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="text-sm text-success text-right mt-1">
                  You saved {discountAmount} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Order Button */}
          <div className="sticky bottom-0 bg-white border-t pt-4 pb-2">
            <div className="form-control mb-3">
              <label className="cursor-pointer label justify-start gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">
                  I agree to the terms and conditions
                </span>
              </label>
            </div>

            <button
              className={`btn btn-primary w-full ${!formValid ? "btn-disabled" : ""}`}
              disabled={!formValid}
              onClick={handlePlaceOrder}
            >
              Agree and Place Order -{" "}
              <span className="font-bold">
                {total} <FontAwesomeIcon icon={faBangladeshiTakaSign} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;