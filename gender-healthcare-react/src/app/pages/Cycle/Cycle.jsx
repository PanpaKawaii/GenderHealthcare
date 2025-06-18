import React from "react";
import Legend from "../../components/legend/Legend";
import PeriodCalendar from "../../components/calendar/PeriodCalendar";
import ReminderList from "../../components/reminder/ReminderList";

function Cycle() {
  return (
    <div>
      <Legend />
      <PeriodCalendar />
      <ReminderList />
    </div>
  );
}

export default Cycle;
