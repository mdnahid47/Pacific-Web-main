import React, { useState } from 'react'
import '../Css file/TimeSlot.css'
import ShowTimeSlot from '../Schedule/ShowTimeSlot';
export const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
  };

const TimeSlot = () => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Generate time slots from 8:00 AM to 9:00 PM
    const generateTimeSlots = () => {
        const slots = [];
        const startHour = 8; // 8 AM
        const endHour = 21; // 9 PM (exclusive)
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

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
    };

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot);
    };
    const handleConfirmClick = () => {
        // Handle confirm logic here
        console.log("Slot confirmed:", selectedSlot); // For testing
      };

    return (
        <div className="time-slot-picker">
          <h3>Select a Time Slot</h3>
          <div className="time-slots">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`time-slot-button ${
                  selectedSlot && slot.startTime.getTime() === selectedSlot.startTime.getTime() ? 'selected' : ''
                }`}
                onClick={() => handleSlotClick(slot)}
              >
                {`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
              </button>
            ))}
          </div>

          {/* <div>
          <h1>Order Summary</h1>
          {cart ? (
            <ul>
              {cart.map(item => (
                <div key={item.id}>
                  <div className='flex gap-28 items-center'>
                    <div>
                      <h1 className='text-xl'>{item.category}</h1>
                      <h3 className='text-lg text-gray-600 '>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div>
                      {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No items in cart.</p>
          )}
        </div> */}
        </div>


        
      );
   
}

export default TimeSlot
