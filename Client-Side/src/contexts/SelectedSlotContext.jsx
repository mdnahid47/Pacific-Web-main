import React, { useState } from 'react'
import TimeSlot from '../components/Modals/TimeSlot'
import ShowTimeSlot from '../components/Schedule/ShowTimeSlot'

const SelectedSlotContext = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSlotSelect = (slot) => {
      setSelectedSlot(slot);
  };

  return (
      <div>
          <TimeSlot onSelect={handleSlotSelect} />
          <ShowTimeSlot selectedSlot={selectedSlot} />
      </div>
  );
}

export default SelectedSlotContext
