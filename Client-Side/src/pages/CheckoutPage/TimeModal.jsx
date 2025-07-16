import React from 'react'
import { addDays, format, isSameDay, isToday } from 'date-fns';

const TimeModal = () => {

    // Date Slot
      const today = new Date();
      const nextDay = addDays(today, 1);
      const days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
      const [selectedDate, setSelectedDate] = useState(nextDay);


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

  return (
    <div>

    </div>
  )
}

export default TimeModal
