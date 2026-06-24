
import ScheduleTimeModal from './ScheduleTimeModal';
import ConfirmedSchedule from './ConfirmedSchedule';
import { useState } from 'react';


const ParentComponent = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
      <div>
        <ScheduleTimeModal selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <ConfirmedSchedule selectedDate={selectedDate} />
      </div>
    );
};

export default ParentComponent;
