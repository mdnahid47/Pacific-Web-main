import { addDays, format, isSameDay, isToday } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const LeftSide = () => {
 const location = useLocation();
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
         const [useDifferentAddress, setUseDifferentAddress] = useState(false); 
         const [saveAddress, setSaveAddress] = useState(true); 

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
      try {
        // Fetch user ID from localStorage or authentication context
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("User is not logged in");
          setError("User not logged in");
          return;
        }

        // Make an API call to fetch user details from MySQL
        const response = await axios.get("http://localhost:5001/api/user-profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in headers
          },
        });

        if (response.status === 200) {
          setUserDetails(response.data); // Set user data
        } else {
          console.log("User data not found.");
          setError("User data not found.");
        }
      } catch (err) {
        console.error("Error fetching user data: ", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);
  return (
    <div>
      <div>
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
    </div>
  )
}

export default LeftSide
