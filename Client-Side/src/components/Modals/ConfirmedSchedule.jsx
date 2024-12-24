
import { format } from 'date-fns/format';
import React from 'react';


const ConfirmedSchedule = ({ selectedDate }) => {
    return (
        <div className="selected-date">
          <h3>Selected Date:</h3>
          <p>{selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}</p>
        </div>
      );
};

export default ConfirmedSchedule;


