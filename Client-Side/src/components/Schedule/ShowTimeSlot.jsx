/* eslint-disable react/prop-types */


import React, { useState } from 'react'
import TimeSlot, { formatTime } from '../Modals/TimeSlot';



const ShowTimeSlot = ({ selectedSlot  }) => {

    const formattedStartTime = selectedSlot ? formatTime(selectedSlot.startTime) : '';
  const formattedEndTime = selectedSlot ? formatTime(selectedSlot.endTime) : '';

  return (
    <div className="selected-slot">
      <h3>Selected Time Slot Details</h3>
      <p>Start Time: {formattedStartTime}</p>
      <p>End Time: {formattedEndTime}</p>
    </div>
  );
};

export default ShowTimeSlot
