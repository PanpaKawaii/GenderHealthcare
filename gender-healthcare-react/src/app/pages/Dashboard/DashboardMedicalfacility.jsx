import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebarStyle";
import { medicalfacilitiesAPI } from "../../services/api";
import { Form, message, Modal, Table, Button, Popconfirm, Input } from "antd";

function DashboardMedicalfacility() {
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [editingMedicalFacility, setEditingMedicalFacility] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [form] = Form.useForm();

  const fetchMedicalFacilities = async () => {
    const respone = await medicalfacilitiesAPI.getAll();
    setMedicalFacilities(respone.data);
  };

  useEffect(() => {
    fetchMedicalFacilities();
  }, []);

  const handleEdit = (record) => {
    setEditingMedicalFacility(record);
    setIsCreate(false);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleCreate = () => {
    setEditingMedicalFacility(null);
    setIsCreate(true);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue();
  };

  const handleDelete = async (medicalFacility) => {
    await medicalfacilitiesAPI.delete(medicalFacility._id);
    message.success("Deleted medical facility.");
    fetchMedicalFacilities();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isCreate) {
        await medicalfacilitiesAPI.create(values);
        message.success("Created medical facility.");
      } else {
        await medicalfacilitiesAPI.update(editingMedicalFacility._id, values);
        message.success("Updated medical facility.");
      }
      setModalVisible(false);
      setEditingMedicalFacility(null);
      setIsCreate(false);
      fetchMedicalFacilities();
    } catch (error) {
      message.error("Failed to save medical facility.");
      console.error("Save error:", error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || "https://via.placeholder.com/50"}
          alt="Image"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Opening Hours",
      dataIndex: "openingHours",
      key: "openingHours",
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      key: "establishedYear",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      <Sidebar active="medicalfacility" />
      <div style={{ marginLeft: 240, padding: 32 }}>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: 16,
            color: "#a8dadc",
          }}
        >
          Manage Medical Facilities
        </div>
        <Button
          type="primary"
          onClick={handleCreate}
          style={{ marginBottom: 16 }}
        >
          Add new medical facility
        </Button>
        <Table
          columns={columns}
          dataSource={medicalFacilities}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={isCreate ? "Create Medical Facility" : "Edit Medical Facility"}
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
              rules={[{ required: true, message: "Please input the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please input the address!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please input the phone!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="openingHours"
              label="Opening Hours"
              rules={[
                { required: true, message: "Please input the opening hours!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="establishedYear"
              label="Established Year"
              rules={[
                {
                  required: true,
                  message: "Please input the established year!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image URL"
              rules={[{ message: "Please input the image URL!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default DashboardMedicalfacility;
