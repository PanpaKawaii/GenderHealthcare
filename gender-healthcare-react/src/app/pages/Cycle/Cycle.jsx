import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { cycleAPI } from "../../services/api";
import Legend from "../../components/legend/Legend";
import ReminderList from "../../components/reminder/ReminderList";

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
  const [startDay, setStartDay] = useState(null);
  const [periodLength, setPeriodLength] = useState(DEFAULT_PERIOD_LENGTH);
  const [endDay, setEndDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  // Thêm state lưu giá trị gốc
  const [originalStartDay, setOriginalStartDay] = useState(null);
  const [originalEndDay, setOriginalEndDay] = useState(null);

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
    setStartDay(dayjs(date).format("YYYY-MM-DD"));
    setEndDay(
      dayjs(date)
        .add(DEFAULT_PERIOD_LENGTH - 1, "day")
        .format("YYYY-MM-DD")
    );
    setPeriodLength(DEFAULT_PERIOD_LENGTH);
  };

  const handleEndDay = (date) => {
    setEndDay(dayjs(date).format("YYYY-MM-DD"));
    setPeriodLength(dayjs(date).diff(dayjs(startDay), "day") + 1);
  };

  // Ngày thực tế tháng hiện tại
  const periodDays = startDay && endDay ? getRange(startDay, periodLength) : [];
  const fertileDays = periodDays.length
    ? getRange(
        dayjs(periodDays[periodDays.length - 1]).add(1, "day"),
        FERTILE_WINDOW_LENGTH
      )
    : [];

  // Ngày dự đoán các tháng tiếp theo
  const { predictedPeriodDays, predictedFertileDays } = startDay
    ? predictNextMonths(startDay, periodLength)
    : { predictedPeriodDays: [], predictedFertileDays: [] };

  // Tô màu lịch
  const tileClassName = ({ date }) => {
    const d = dayjs(date).format("YYYY-MM-DD");
    if (periodDays.includes(d)) return "period-day";
    if (fertileDays.includes(d)) return "fertile-day";
    if (predictedPeriodDays.includes(d)) return "predicted-period-day";
    if (predictedFertileDays.includes(d)) return "predicted-fertile-day";
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
      // Sau khi lưu, cập nhật lại giá trị gốc
      setOriginalStartDay(startDay);
      setOriginalEndDay(endDay);
      alert("Đã lưu kỳ kinh nguyệt!");
    } catch (err) {
      alert("Lỗi khi lưu: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div>
      <Legend />
      {loading && <div>Đang tải...</div>}
      {!startDay ? (
        <div>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded"
            onClick={() => {}}
          >
            Bắt đầu theo dõi ngày kinh nguyệt
          </button>
          <Calendar onClickDay={handleStartDay} tileClassName={tileClassName} />
        </div>
      ) : (
        <div>
          <div>
            <b>Ngày bắt đầu:</b>{" "}
            <input
              type="date"
              value={startDay}
              onChange={(e) => {
                handleStartDay(e.target.value);
              }}
              min="2000-01-01"
              max="2100-12-31"
            />
            <br />
            <b>Ngày kết thúc:</b>{" "}
            <input
              type="date"
              value={endDay}
              min={startDay}
              onChange={(e) => handleEndDay(e.target.value)}
            />
            <br />
            <b>Ghi chú:</b>{" "}
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
            />
            <br />
            {(startDay !== originalStartDay || endDay !== originalEndDay) && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleSave}
                disabled={loading}
              >
                Lưu kỳ kinh nguyệt
              </button>
            )}
          </div>
          <Calendar tileClassName={tileClassName} />
        </div>
      )}
      <ReminderList />
      <style>
        {`
          .period-day {
            background: #f472b6 !important;
            color: white !important;
            border-radius: 50%;
          }
          .fertile-day {
            background: #4ade80 !important;
            color: white !important;
            border-radius: 50%;
          }
          .predicted-period-day {
            border: 2px solid #f472b6 !important;
            border-radius: 50%;
            color: #f472b6 !important;
            background: none !important;
          }
          .predicted-fertile-day {
            border: 2px solid #4ade80 !important;
            border-radius: 50%;
            color: #4ade80 !important;
            background: none !important;
          }
        `}
      </style>
    </div>
  );
}
