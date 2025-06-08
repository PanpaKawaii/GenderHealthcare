import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebarStyle";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Popconfirm,
} from "antd";
import { doctorAPI } from "../../services/api";

function DashboardDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const respone = await doctorAPI.getAll();
    setDoctors(respone.data);
  };

  // Mở modal edit
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setIsCreate(false);
    setModalVisible(true);
    form.setFieldsValue(doctor);
  };

  // Mở modal create
  const handleCreate = () => {
    setEditingDoctor(null);
    setIsCreate(true);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
  };

  // Xóa bác sĩ
  const handleDelete = async (doctor) => {
    await doctorAPI.delete(doctor._id);
    message.success("Đã xóa bác sĩ.");
    fetchDoctors();
  };

  // Lưu chỉnh sửa hoặc tạo mới
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isCreate) {
        await doctorAPI.create(values);
        message.success("Đã tạo mới bác sĩ.");
      } else {
        await doctorAPI.update(editingDoctor._id, values);
        message.success("Cập nhật thành công.");
      }
      setModalVisible(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      // Xử lý lỗi validate hoặc API
    }
  };

  const columns = [
    {
      title: "Degree",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
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
    <>
      <Sidebar />
      <div style={{ marginLeft: 240, padding: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleCreate}>
            Add new doctor
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={isCreate ? "Add new doctor" : "Update doctor's information"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSave}
          okText={isCreate ? "Create" : "Save"}
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: "Input degree , please" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="experience"
              label="Experience"
              rules={[{ required: true, message: "Input experience, please" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="bio"
              label="Bio"
              rules={[{ required: true, message: "Input bio, please" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="no Active" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default DashboardDoctor;
