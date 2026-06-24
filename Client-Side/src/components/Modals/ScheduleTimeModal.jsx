import React from 'react';
import { addDays, format, isSameDay, isToday } from 'date-fns';
import '../Css file/ScheduleTimeModal.css';

const ScheduleTimeModal = () => {
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="date-picker">
      <h3>Select a Date</h3>
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
  );
};

export default ScheduleTimeModal;
