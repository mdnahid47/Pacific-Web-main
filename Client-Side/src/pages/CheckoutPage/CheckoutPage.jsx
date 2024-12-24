import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addDays, format, isSameDay, isToday } from 'date-fns';
import "./CheckoutPage.css";
import cIcon from '../../../public/images/cIcon.png';
import { auth, db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import userPhoto from '../../../public/images/userPhoto.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import home from '../../../public/images/home-address.png'
import Swal from 'sweetalert2'
const CheckoutPage = () => {
  const location = useLocation();
  const initialCart = location.state?.cart || []; // Extract cart from state or default to an empty array
  const [cart, setCart] = useState(initialCart); // Initialize cart state
  const [address, setAddress] = useState("");
  // Date Slot
  const today = new Date();
  const nextDay = addDays(today, 1);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  const [selectedDate, setSelectedDate] = useState(nextDay);


   // Address State Variables
   const [houseNo, setHouseNo] = useState('');
   const [roadNo, setRoadNo] = useState('');
   const [blockNo, setBlockNo] = useState('');
   const [sectorNo, setSectorNo] = useState('');
   const [areaName, setAreaName] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [formValid, setFormValid] = useState(false); // Validation state
 
  // Generate time slots from 8:00 AM to 9:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 9 PM (exclusive)
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = new Date();
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date();
      endTime.setHours(hour + 1, 0, 0, 0);
      slots.push({ startTime, endTime });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Set default slot to the 8:00 AM - 9:00 AM slot
  const defaultSlot = timeSlots.find(slot => slot.startTime.getHours() === 8);
  const [selectedSlot, setSelectedSlot] = useState(defaultSlot || timeSlots[0]);
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  // User Details
  const [userDetails, setUserDetails] = useState(null);
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
        }
      });
    };

    fetchUserData();
  }, []);

  // Handle quantity changes
  const handleQuantityChange = (id, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(item.quantity + delta, 1); // Ensure quantity doesn't go below 0
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryCharge = subtotal > 0 ? 0 : 0; // Example delivery charge
  const total = subtotal + deliveryCharge;
   // State to manage the checkbox for terms and conditions
  const [isChecked, setIsChecked] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

   // Form validation function
   const validateForm = () => {
    // Validate if all required fields are filled
    if (houseNo && roadNo && areaName && phoneNumber) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  // Call validateForm whenever these fields change
  useEffect(() => {
    validateForm();
  }, [houseNo, roadNo, areaName, phoneNumber]);

  
  const handleSubmitOrder = async () => {
     // Ensure the form is valid and terms are checked
     if (!isChecked || !formValid) {
      return; // Form is not valid, prevent submission
    }
    const orderData = {
      userDetails,
      cart,
      address: {
        houseNo,
        roadNo,
        blockNo,
        sectorNo,
        areaName,
        phoneNumber,
      },
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      selectedSlot: `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`,
      bio: document.querySelector("textarea").value,
    };
  
    try {
      const response = await fetch('http://localhost:5000/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        // 
        Swal.fire({
          title: "Order Palces Scucessfull!",
          text: "our Team Contact you Soon!",
          icon: "success"
        });
        // Handle success (e.g., clear the form, redirect, etc.)
      } else {
       
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // alert('Error placing the order.');
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  
  
  
  
  return (
    <div>
      <div >
        <dialog id="time_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg"></h3>
            <p className="py-4"></p>
            <div className="modal-action justify-center">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <div className='flex flex-col'>
                <div>
                  <div className="date-picker">
                    <h3>Select Your Preferred Date</h3>
                    <div className="calendar">
                      <table>
                        <thead>
                          <tr>
                            {days.map(day => (
                              <th key={day}>{format(day, 'EEE')}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {days.map(day => (
                              <td
                                key={day}
                                className={`date-cell ${isToday(day) ? 'today' : ''} ${selectedDate && isSameDay(day, selectedDate) ? 'selected' : ''}`}
                                onClick={() => handleDateClick(day)}
                              >
                                {format(day, 'd')}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Time Slot */}
                <div className="time-slot-picker">
                  <h3>Select Your Preferred Time</h3>
                  <div className="time-slots">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot-button ${selectedSlot && slot.startTime.getTime() === selectedSlot.startTime.getTime() ? 'selected' : ''
                          }`}
                        onClick={() => handleSlotClick(slot)}
                      >
                        {`${formatTime(slot.startTime, false)} - ${formatTime(slot.endTime, true)}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>

        {/* Modal end */}

        {/* Left Side */}
        {cart.length > 0 ?(
        <div className='md:flex gap-40 p-5'>
          <div>
            <div className='flex gap-2'>
              <img src={cIcon} className='w-8 rounded-sm ' alt="" />
              <h1 className='md:text-2xl items-center'>Schedule</h1>
            </div>
            <div className='flex gap-3 items-center'>
              <div className='border-r-2 border-gray-400 pr-2'>
                {selectedSlot && (
                  <div>
                    <p className='md:text-2xl'>{`${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}`}</p>
                  </div>
                )}
              </div>
              <div>
                {selectedDate && (
                  <div className='flex gap-2 items-baseline'>
                    <span className='md:text-2xl'>{format(selectedDate, 'dd')}</span>
                    <span>{format(selectedDate, 'MMMM, yyyy')}</span>
                  </div>
                )}
              </div>
              <button className="btn" onClick={() => document.getElementById('time_modal').showModal()}>Change </button>
            </div>

            {/* Contact Person  */}
            <div>
              {userDetails ? (
                <><div className='flex gap-2 mt-5 items-center'>
                  <img src={userPhoto} className='w-8 rounded-sm' alt="" />
                  <h1 className='md:text-2xl'>Contact Person</h1>
                </div><div className='flex gap-3 mt-3'>
                    <p className='border-r-2 border-gray-400 pr-2 '>Name</p>
                    <p className='md:text-xl'>{userDetails.firstName}</p>
                  </div></>
              ) : (
                <p>Loading</p>
              )}
            </div>

            <div className='flex flex-col gap-2 border-2 border-olympic w-fit p-10 rounded-lg mt-5'>
              <div className='flex gap-2 '>
                <img src={home} alt=""  className='w-8 rounded-sm'/>
                <h3 className='md:text-2xl'>Address</h3>
              </div>
              <div  id="address" className='flex gap-3'>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="House No."
                  className="input input-bordered input-info w-full max-w-xs" required />
                <input
                  type="text"
                  value={roadNo}
                  onChange={(e) => setRoadNo(e.target.value)}
                  placeholder="Road No./Name"
                  className="input input-bordered input-info w-full max-w-xs" required />
              </div>
              <div className='flex gap-3'>
                <input
                  type="text"
                  value={blockNo}
                  onChange={(e) => setBlockNo(e.target.value)}
                  placeholder="Block No."
                  className="input input-bordered input-info w-full max-w-xs" />
                <input
                  type="text"
                  value={sectorNo}
                  onChange={(e) => setSectorNo(e.target.value)}
                  placeholder="Sector No."
                  className="input input-bordered input-info w-full max-w-xs" />
              </div>
              <div className='flex gap-3'>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Area Name"
                  className="input input-bordered input-info w-full max-w-xs" required />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="input input-bordered input-info w-full max-w-xs" required />
              </div>
              <label className="label cursor-pointer justify-normal gap-2">
                <input type="checkbox" defaultChecked className="checkbox checkbox-info" />
                <span>Save This Address?</span>
              </label>
            </div>
          </div>

          {/* Right Side  */}
          <div>
            <h1 className='text-2xl'>Order Summary</h1>
            <div className='mt-10'>
              {cart.length > 0 ? (
                <ul>
                  {cart.map(item => (
                    <div key={item.id}>
                      <div className='flex justify-between  items-center'>
                        <div>
                          <h1 className='text-xl'>{item.category}</h1>
                          <h3 className='text-lg text-gray-600 '>{item.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faBangladeshiTakaSign} />&nbsp;<span className='text-xl'>{item.price}</span>
                        </div>
                      </div>

                      <div className='mt-5 flex justify-between items-center'>
                        <div className=' flex flex-col gap-2'>
                          <h3>Subtotal: </h3>
                          <h3>Delivery Charge: </h3>
                          <h3>Amount to be Paid: </h3>
                        </div>
                        <div className='flex flex-col gap-2 items-end'>
                          <h3><FontAwesomeIcon icon={faBangladeshiTakaSign} />&nbsp;{Math.round(subtotal)}</h3>
                          <h3><FontAwesomeIcon icon={faBangladeshiTakaSign} />&nbsp;{Math.round(deliveryCharge)}</h3>
                          <h3><FontAwesomeIcon icon={faBangladeshiTakaSign} />&nbsp;{Math.round(total)}</h3>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 justify-end  items-center ">
                        <button
                          className="btn btn-sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                  ))}
                  <div className='flex flex-col gap-2'>
                    <h3>Do you want to additional notes with your order?</h3>
                    <textarea className="textarea textarea-info" placeholder="Bio"></textarea>
                  </div>

                  <div className='flex flex-col gap-2 items-center mt-2'>
                  <div className="form-control ">
                    <label className="cursor-pointer label justify-normal gap-2 ">
                    <input type="checkbox"  id="agreeTerms"
                       checked={isChecked}
                        onChange={handleCheckboxChange}className="checkbox checkbox-info" />
                      <span  className="label-text"> I Agree With <a href="#" className='text-blue'>terms & condition,privacy & refund</a> policy</span>
                     
                    </label>
                  </div>

                  <div>
                  <button type="submit" className="btn btn-xs bg-olympic text-white sm:btn-sm md:btn-md lg:btn-lg" 
                   onClick={handleSubmitOrder}
                   disabled={!isChecked || !formValid} // Disable if form is not valid or checkbox is not checked
                  >Palce Order</button>
                  </div>
                  </div>
                </ul>
              ) : (
                <p>No items in cart.</p>
              )}
            </div>
          </div>
        </div>):(
          // Show a message when the cart is empty
          <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-lg'>No items in cart.😥</p>
          <a href='/' className="btn bg-olympic text-white mt-4">Continue Shopping</a>
        </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
