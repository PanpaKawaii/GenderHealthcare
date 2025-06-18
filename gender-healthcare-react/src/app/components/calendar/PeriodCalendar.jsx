import { useEffect } from "react";
import { useState } from "react";
import { cycleAPI } from "../../services/api";
import moment from "moment";
import Calendar from "react-calendar";
import "./PeriodCalendar.css";

function PeriodCalendar({ customerId, onCycleChange }) {
  const [cycles, setCycles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (customerId) {
      cycleAPI.getByCustomer(customerId).then((res) => setCycles(res.data));
    }
  }, [customerId]);

  const handleDayClick = (date) => setSelectedDate(date);

  const handleSave = () => {
    cycleAPI
      .create({
        customerId,
        periodStart: selectedDate,
        periodLength: 7,
      })
      .then((res) => {
        setCycles([res.data, ...cycles]);
        if (onCycleChange) onCycleChange();
      });
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";
    for (let cycle of cycles) {
      const start = moment(cycle.periodStart);
      const end = moment(cycle.periodStart).add(cycle.periodLength - 1, "days");
      if (moment(date).isBetween(start, end, null, "[]")) {
        if (moment(date).isSame(start)) return "period-start";
        return "period-day";
      }
    }
    return "";
  };

  return (
    <div className="calendar-container">
      <h2>Theo dõi chu kỳ kinh nguyệt</h2>
      <Calendar
        onClickDay={handleDayClick}
        value={selectedDate}
        tileClassName={tileClassName}
        maxDate={new Date()}
      />
      <button className="save-btn" onClick={handleSave}>
        Ghi nhận ngày bắt đầu kinh
      </button>
    </div>
  );
}

export default PeriodCalendar;
