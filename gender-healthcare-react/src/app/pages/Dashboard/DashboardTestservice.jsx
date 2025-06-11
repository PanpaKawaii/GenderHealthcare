import React, { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../../components/sidebar/sidebarStyle";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Table,
  Form,
  Switch,
  Input,
  Select,
} from "antd";
import { medicalfacilitiesAPI, testserviceAPI } from "../../services/api";

function DashboardTestservice() {
  const [testservices, setTestservices] = useState([]);
  const [editingTestservice, setEditingTestservice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [form] = Form.useForm();
  const [medicalFacilities, setMedicalFacilities] = useState([]);

  const fetchTestservices = async () => {
    const respone = await testserviceAPI.getAll();
    setTestservices(respone.data);
  };

  const fetchMedicalFacilities = async () => {
    const response = await medicalfacilitiesAPI.getAll();
    setMedicalFacilities(response.data);
  };

  useEffect(() => {
    fetchTestservices();
    fetchMedicalFacilities();
  }, []);

  const handleEdit = (record) => {
    setEditingTestservice(record);
    setIsCreate(false);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleCreate = () => {
    setEditingTestservice(null);
    setIsCreate(true);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
  };

  const handleDelete = async (testservice) => {
    await testserviceAPI.delete(testservice._id); // _id is the default id field in MongoDB
    message.success("Deleted test service.");
    fetchTestservices();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (isCreate) {
        await testserviceAPI.create(values);
        message.success("Created new test service.");
      } else {
        await testserviceAPI.update(editingTestservice._id, values);
        message.success("Updated test service.");
      }
      setModalVisible(false);
      setEditingTestservice(null);
      setIsCreate(false);
      fetchTestservices();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Test Service Name",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "5%",
    },
    {
      title: "Processing Time (mins)",
      dataIndex: "processingTime",
      key: "processingTime",
      width: "10%",
    },
    {
      title: "Sample Type",
      dataIndex: "sampleType",
      key: "sampleType",
      width: "10%",
    },
    {
      title: "Instructions",
      dataIndex: "instructions",
      key: "instructions",
      width: "20%",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: "5%",
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
      <Sidebar active="testservice" />
      <div style={{ marginLeft: 240, padding: 32 }}>
        <div style={{ fontSize: "30px", fontWeight: "bold", marginBottom: 16 }}>
          Manage Test Services
        </div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleCreate}>
            Add new test service
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={testservices}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={
            isCreate
              ? "Add new test service"
              : "Update test service's information"
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSave}
          okText={isCreate ? "Create" : "Save"}
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Test Service Name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter the description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter the price!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="processingTime"
              label="Processing Time (minutes)"
              rules={[
                {
                  required: true,
                  message: "Please enter the processing time!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="sampleType"
              label="Sample Type"
              rules={[
                { required: true, message: "Please enter the sample type!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="instructions"
              label="Instructions"
              rules={[
                { required: true, message: "Please enter the instructions!" },
              ]}
            >
              <Input.TextArea rows={4} />
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

export default DashboardTestservice;
