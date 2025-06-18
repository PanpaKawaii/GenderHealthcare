import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "./PeriodCalendar.css";
import { cycleAPI } from "../../services/api";

function PeriodCalendar({ userId, onCycleChange }) {
  const [cycles, setCycles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    cycleAPI.getByCustomer(userId).then((res) => setCycles(res.data));
  }, [userId]);

  const handleDayClick = (date) => setSelectedDate(date);

  const handleSave = () => {
    cycleAPI
      .create({
        userId,
        periodStart: selectedDate,
        periodLength: 7,
      })
      .then((res) => {
        setCycles([res.data, ...cycles]);
        if (onCycleChange) onCycleChange();
      });
  };

  // Highlight logic: hồng, xanh, khoanh tròn, v.v.
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
    // Logic dự báo, thụ thai, v.v. có thể bổ sung thêm ở đây
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
