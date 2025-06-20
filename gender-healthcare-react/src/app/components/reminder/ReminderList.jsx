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
      message.success("Đã xóa nhắc nhở.");
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
        message.success("Đã tạo nhắc nhở mới.");
      } else {
        await reminderAPI.update(editingReminder._id, {
          ...values,
          date: values.date.format("YYYY-MM-DD"),
          customerId,
        });
        message.success("Đã cập nhật nhắc nhở.");
      }
      setModalVisible(false);
      setEditingReminder(null);
      setIsCreate(false);
      fetchReminders(customerId);
    } catch (err) {
      message.error(
        "Lỗi khi lưu: " + (err.response?.data?.error || err.message)
      );
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa nhắc nhở này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
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
        Thêm nhắc nhở
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
        title={isCreate ? "Tạo nhắc nhở mới" : "Cập nhật nhắc nhở"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText={isCreate ? "Tạo mới" : "Lưu"}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Loại nhắc nhở"
            rules={[{ required: true, message: "Nhập loại nhắc nhở" }]}
          >
            <Input placeholder="Ví dụ: Uống thuốc, Sự kiện..." />
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày nhắc nhở"
            rules={[{ required: true, message: "Chọn ngày nhắc nhở" }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="message" label="Nội dung">
            <Input placeholder="Nội dung nhắc nhở (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ReminderList;
