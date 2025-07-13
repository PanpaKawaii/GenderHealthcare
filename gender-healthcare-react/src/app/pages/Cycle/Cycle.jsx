import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { cycleAPI } from "../../services/api";
import ReminderModal from "../../components/reminder/ReminderModal";
import { FiBell } from "react-icons/fi";
import "./Cycle.css"; // Sử dụng file CSS đã cung cấp

const DEFAULT_PERIOD_LENGTH = 7;
const FERTILE_WINDOW_LENGTH = 12;

function getRange(start, length) {
  return Array.from({ length }, (_, i) =>
    dayjs(start).add(i, "day").format("YYYY-MM-DD")
  );
}

function predictNextMonths(startDay, periodLength, months = 12) {
  const allPeriodDays = [];
  const allFertileDays = [];
  for (let m = 1; m < months; m++) {
    const monthStart = dayjs(startDay).add(m, "month");
    const periodStart = monthStart.date(dayjs(startDay).date());
    const periodDays = getRange(periodStart, periodLength);
    const fertileStart = dayjs(periodDays[periodDays.length - 1]).add(1, "day");
    const fertileDays = getRange(fertileStart, FERTILE_WINDOW_LENGTH);
    allPeriodDays.push(...periodDays);
    allFertileDays.push(...fertileDays);
  }
  return {
    predictedPeriodDays: allPeriodDays,
    predictedFertileDays: allFertileDays,
  };
}

export default function CyclePage() {
  const [customerId, setCustomerId] = useState(null);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [periodLength, setPeriodLength] = useState(DEFAULT_PERIOD_LENGTH);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [originalStartDay, setOriginalStartDay] = useState("");
  const [originalEndDay, setOriginalEndDay] = useState("");
  const [reminderOpen, setReminderOpen] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("UserId");
    setCustomerId(id);
    if (!id) return;
    setLoading(true);
    cycleAPI
      .getByCustomer(id)
      .then((res) => {
        if (res.data.length > 0) {
          const latest = res.data[0];
          const start = dayjs(latest.periodDays[0]).format("YYYY-MM-DD");
          const end = dayjs(
            latest.periodDays[latest.periodDays.length - 1]
          ).format("YYYY-MM-DD");
          setStartDay(start);
          setEndDay(end);
          setOriginalStartDay(start);
          setOriginalEndDay(end);
          setPeriodLength(latest.periodDays.length);
          setNotes(latest.notes || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartDay = (date) => {
    const formatted = dayjs(date).format("YYYY-MM-DD");
    setStartDay(formatted);
    setEndDay(
      dayjs(formatted)
        .add(DEFAULT_PERIOD_LENGTH - 1, "day")
        .format("YYYY-MM-DD")
    );
    setPeriodLength(DEFAULT_PERIOD_LENGTH);
  };

  const handleEndDay = (date) => {
    const formatted = dayjs(date).format("YYYY-MM-DD");
    setEndDay(formatted);
    setPeriodLength(dayjs(formatted).diff(dayjs(startDay), "day") + 1);
  };

  const periodDays = startDay && endDay ? getRange(startDay, periodLength) : [];
  const fertileDays = periodDays.length
    ? getRange(
        dayjs(periodDays[periodDays.length - 1]).add(1, "day"),
        FERTILE_WINDOW_LENGTH
      )
    : [];

  const { predictedPeriodDays, predictedFertileDays } = startDay
    ? predictNextMonths(startDay, periodLength)
    : { predictedPeriodDays: [], predictedFertileDays: [] };

  const tileClassName = ({ date }) => {
    const d = dayjs(date).format("YYYY-MM-DD");
    if (periodDays.includes(d)) return "period-day";
    if (fertileDays.includes(d)) return "fertile-day";
    if (predictedPeriodDays.includes(d)) return "predicted-period-day";
    if (predictedFertileDays.includes(d)) return "predicted-fertile-day";
    if (d === dayjs().format("YYYY-MM-DD")) return "today";
    return "";
  };

  const handleSave = async () => {
    if (!startDay || !endDay) return;
    setLoading(true);
    try {
      const periodArr = getRange(startDay, periodLength);
      await cycleAPI.create({
        periodDays: periodArr,
        notes,
        customerId,
      });
      // Gọi lại API lấy dữ liệu mới nhất
      const res = await cycleAPI.getByCustomer(customerId);
      if (res.data.length > 0) {
        const latest = res.data[0];
        const start = dayjs(latest.periodDays[0]).format("YYYY-MM-DD");
        const end = dayjs(
          latest.periodDays[latest.periodDays.length - 1]
        ).format("YYYY-MM-DD");
        setStartDay(start);
        setEndDay(end);
        setOriginalStartDay(start);
        setOriginalEndDay(end);
        setPeriodLength(latest.periodDays.length);
        setNotes(latest.notes || "");
      }
      alert("Đã lưu kỳ kinh nguyệt!");
    } catch (err) {
      alert("Lỗi khi lưu: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="cycle-wrapper fade-in">
        <div className="cycle-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div className="title">Track your menstrual cycle</div>
              <div className="instruction">
                Manage your cycle, predict ovulation, and receive health care
                reminders.
              </div>
            </div>
            <button
              className="btn btn-primary btn-bell"
              style={{
                borderRadius: "50%",
                width: 48,
                height: 48,
                fontSize: 22,
                marginLeft: 16,
                background: "#fc9292",
              }}
              onClick={() => setReminderOpen(true)}
              aria-label="Xem nhắc nhở"
            >
              <FiBell />
            </button>
          </div>
        </div>
        <div className="cycle-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : !startDay ? (
            // Nếu chưa chọn ngày bắt đầu, chỉ hiện 1 lịch để chọn
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <span className="form-label">
                    Select the start date of your first menstrual period:
                  </span>
                  <Calendar
                    onClickDay={handleStartDay}
                    tileClassName={tileClassName}
                    className="calendar-container"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Nếu đã chọn ngày bắt đầu, hiện form và 1 lịch ở dưới
            <div>
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      className="form-input"
                      type="date"
                      value={startDay}
                      onChange={(e) => handleStartDay(e.target.value)}
                      min="2000-01-01"
                      max="2100-12-31"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      className="form-input"
                      type="date"
                      value={endDay}
                      min={startDay}
                      onChange={(e) => handleEndDay(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <input
                      className="form-input"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </div>
                </div>
                {(startDay !== originalStartDay ||
                  endDay !== originalEndDay) && (
                  <button
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Menstrual Cycle
                  </button>
                )}
              </div>
              <div className="calendar-container" style={{ marginTop: 24 }}>
                <Calendar tileClassName={tileClassName} />
              </div>
            </div>
          )}
        </div>
        <ReminderModal
          open={reminderOpen}
          onClose={() => setReminderOpen(false)}
        />
      </div>
    </div>
  );
}
