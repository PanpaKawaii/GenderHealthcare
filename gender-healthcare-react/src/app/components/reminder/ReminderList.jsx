import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import { reminderAPI } from "../../services/api";
import "./ReminderList.css"; // Nếu bạn tách CSS riêng

function ReminderList() {
  const [customerId, setCustomerId] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const id = localStorage.getItem("UserId");
    setCustomerId(id);
    if (id) fetchReminders(id);
  }, []);

  const fetchReminders = async (customerId) => {
    setLoading(true);
    try {
      const res = await reminderAPI.getByCustomer(customerId);
      setReminders(res.data);
    } catch (err) {
      message.error(
        "Lỗi khi lấy nhắc nhở: " + (err.response?.data?.error || err.message)
      );
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setEditingReminder(null);
    setIsCreate(true);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsCreate(false);
    setModalVisible(true);
    form.setFieldsValue({
      ...reminder,
      date: dayjs(reminder.date),
    });
  };

  const handleDelete = async (reminder) => {
    setLoading(true);
    try {
      await reminderAPI.delete(reminder._id);
      message.success("Deleted reminder.");
      fetchReminders(customerId);
    } catch (err) {
      message.error(
        "Lỗi khi xóa: " + (err.response?.data?.error || err.message)
      );
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (isCreate) {
        await reminderAPI.create({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
          customerId,
        });
        message.success("Created new reminder.");
      } else {
        await reminderAPI.update(editingReminder._id, {
          ...values,
          date: values.date.format("YYYY-MM-DD"),
          customerId,
        });
        message.success("Updated reminder.");
      }
      setModalVisible(false);
      setEditingReminder(null);
      setIsCreate(false);
      fetchReminders(customerId);
    } catch (err) {
      message.error(
        "Error saving: " + (err.response?.data?.error || err.message)
      );
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Reminder Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Reminder Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Content",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Change
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this reminder?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: 16 }}
        block
      >
        Add Reminder
      </Button>
      <Table
        columns={columns}
        dataSource={reminders}
        rowKey="_id"
        loading={loading}
        pagination={false}
        size="small"
      />
      <Modal
        title={isCreate ? "Create New Reminder" : "Update Reminder"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText={isCreate ? "Create" : "Save"}
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Reminder Type"
            rules={[{ required: true, message: "Please enter reminder type" }]}
          >
            <Input placeholder="E.g., Take medicine, Event..." />
          </Form.Item>
          <Form.Item
            name="date"
            label="Reminder Date"
            rules={[{ required: true, message: "Please select reminder date" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="message" label="Content">
            <Input placeholder="Reminder content (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ReminderList;
