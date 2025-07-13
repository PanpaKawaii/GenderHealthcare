import React from "react";
import { Modal } from "antd";
import ReminderList from "./ReminderList";

export default function ReminderModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      bodyStyle={{ padding: 0 }}
      centered
      destroyOnClose
    >
      <div className="reminder-list-container">
        <h3>Reminder list</h3>
        <ReminderList />
      </div>
    </Modal>
  );
}
