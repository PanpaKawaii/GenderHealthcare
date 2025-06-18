import React, { useState, useEffect } from "react";
import moment from "moment";
import { reminderAPI } from "../../services/api";

function ReminderList({ userId }) {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    reminderAPI.getByCustomer(userId).then((res) => setReminders(res.data));
  }, [userId]);

  const handleAdd = () => {
    reminderAPI
      .create({
        userId,
        type: "pill",
        date: new Date(),
        message,
      })
      .then((res) => setReminders([...reminders, res.data]));
    setMessage("");
  };

  const handleDelete = (id) => {
    reminderAPI
      .remove(id)
      .then(() => setReminders(reminders.filter((r) => r._id !== id)));
  };

  return (
    <div>
      <h3>Nhắc nhở</h3>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập nội dung nhắc nhở"
      />
      <button onClick={handleAdd}>Thêm</button>
      <ul>
        {reminders.map((reminder) => (
          <li key={reminder._id}>
            {moment(reminder.date).format("DD/MM/YYYY")}: {reminder.message}
            <button onClick={() => handleDelete(reminder._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReminderList;
