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
  Select,
} from "antd";
import { doctorAPI, medicalfacilitiesAPI } from "../../services/api";

function DashboardDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [form] = Form.useForm();

  console.log("lỗiiiiiiiiiiiiiiiiii:", doctors);
  console.log("lỗiiiiiiiiiiiiiiiiii:", medicalFacilities);

  useEffect(() => {
    fetchDoctors();
    fetchMedicalFacilities();
  }, []);

  const fetchDoctors = async () => {
    const respone = await doctorAPI.getAll();
    setDoctors(respone.data);
  };

  const fetchMedicalFacilities = async () => {
    const response = await medicalfacilitiesAPI.getAll();
    setMedicalFacilities(response.data);
  };

  // Mở modal edit
  const handleEdit = (record) => {
    setEditingDoctor(record);
    setIsCreate(false);
    setModalVisible(true);
    form.setFieldsValue(record);
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
    await doctorAPI.delete(doctor._id); // _id là id bth tại vì trong database đặt biển id là _id, tại vì ban đầu tạo mẫu nó để như z, có thể zô sửa lại
    message.success("Deleted doctor.");
    fetchDoctors();
  };

  // Lưu chỉnh sửa hoặc tạo mới
  const handleSave = async () => {
    console.log("handleSave called");
    try {
      const values = await form.validateFields();
      if (isCreate) {
        console.log("11111111111111111111111111111");
        await doctorAPI.create(values);
        console.log("Created new doctor123333333333333333333:", values);
        message.success("Created new doctor.");
      } else {
        await doctorAPI.update(editingDoctor._id, values);
        message.success("Updated succesfully.");
      }
      setModalVisible(false);
      setEditingDoctor(null);
      setIsCreate(false);
      fetchDoctors();
    } catch (err) {
      console.error("Error saving doctor:", err);
      message.error("Failed to save doctor.");
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img
          src={avatar || "https://via.placeholder.com/50"}
          alt="Avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
      width: "5%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Degree",
      dataIndex: "degree",
      key: "degree",
      width: "10%",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      width: "15%",
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      width: "25%",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: "10%",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Do you want to delete?"
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
    <>
      <Sidebar active="users" />
      <div style={{ marginLeft: 240, padding: 32 }}>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: 16,
            color: "#a8dadc",
          }}
        >
          Manage Doctors
        </div>
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
              name="name"
              label="Name"
              rules={[{ required: true, message: "Input name , please" }]}
            >
              <Input />
            </Form.Item>
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
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Input phone , please" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="avatar"
              label="Avatar URL"
              rules={[{ required: true, message: "Add avatar , please" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="medicalfacilityId" // medicalfacilityId là id của medical facility là foreign key trong bảng doctor nếu không truyền vào thì sẽ không lưu được
              label="Medical Facility"
              rules={[
                { required: true, message: "Please select medical facility" },
              ]}
            >
              <Select placeholder="Select facility">
                {medicalFacilities.map((med) => (
                  <Select.Option key={med._id} value={med._id}>
                    {med.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default DashboardDoctor;
