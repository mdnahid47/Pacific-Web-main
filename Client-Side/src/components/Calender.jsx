import React, { useState } from 'react';

function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Sunday = 0, ...

    const calendarRows = [];
    let dayCounter = 1;
    let row = [];

    for (let i = 0; i < 6; i++) { // Assuming maximum 6 weeks in a month
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          row.push(<td key={`blank-${j}`}></td>);
        } else if (dayCounter <= daysInMonth) {
          row.push(<td key={`day-${dayCounter}`}>{dayCounter}</td>);
          dayCounter++;
        } else {
          row.push(<td key={`blank-${i}-${j}`}></td>);
        }
      }
      calendarRows.push(<tr key={`row-${i}`}>{row}</tr>);
      row = [];
    }

    return calendarRows;
  };

  return (
    <div className="calendar">
      <h1>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h1>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
    </div>
  );
}

export default Calender;