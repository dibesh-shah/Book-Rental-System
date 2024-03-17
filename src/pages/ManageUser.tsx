import { useState } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  Select,
} from "antd";
import type { TableProps } from "antd";

import {
  useAddUser,
  useDeactivateUser,
  useFetchUser,
  useReactivateUser,
} from "../api/user/queries";

interface UserDataType {
  id: number;
  username?: string;
  password?: string;
  userType?: string;
  deleted?: boolean;
}

const ManageUser: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [status, setStatus] = useState(String);
  const [modalTitle, setModalTitle] = useState(String);

  const {
    data: users,
    isLoading: userLoading,
    refetch: userRefetch,
  } = useFetchUser();
  const { mutate: reactivate, isLoading: reactivateLoading } =
    useReactivateUser();
  const { mutate: deactivate, isLoading: deactivateLoading } =
    useDeactivateUser();
  const { mutate: addUser, isLoading: addUserLoading } = useAddUser();

  const [form] = Form.useForm();

  const showModal = (id: number, status: string) => {
    setModalTitle(`User ID - ${id}`);
    setDeleteId(id);
    setStatus(status);
    setOpenModal(true);
  };

  const handleOk = () => {
    console.log(deleteId);
    if (status == "activate") {
      reactivate(deleteId, {
        onSuccess: () => {
          setDeleteId(0);
          message.success(`Activated User  Successfully`);
          setOpenModal(false);
          userRefetch();
        },
      });
    } else {
      deactivate(deleteId, {
        onSuccess: () => {
          setDeleteId(0);
          message.success(`Deactivated User  Successfully`);
          setOpenModal(false);
          userRefetch();
        },
      });
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenModal(false);
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    addUser(values, {
      onSuccess: (data) => {
        console.log(data);
        message.success(`Added User Successfully`);
        form.resetFields();
        setIsModalOpen(false);
        userRefetch();
      },
      onError: (error:any) => {
        message.error(error.message);
      },
    });
  };

  const columns: TableProps<UserDataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <span style={{ color: record.deleted ? "red" : "green" }}>
          {record.deleted ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, _record) => (
        <>
          <Space size="middle">
            {_record.deleted ? (
              <Button
                type="default"
                // icon={<EditOutlined />}
                onClick={() => showModal(_record.id, "activate")}
              >
                Activate
              </Button>
            ) : (
              <Button
                type="default"
                // icon={<DeleteOutlined />}
                onClick={() => showModal(_record.id, "deactivate")}
                // onClick={()=>console.log(_record)}
              >
                Deactivate
              </Button>
            )}
          </Space>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">User Setup</h2>
        </div>

        <Button
          type="primary"
          className="bg-blue-600 text-white"
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </Button>
      </div>

      <Modal
        title="User Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          name="signup"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<UserDataType>
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item<UserDataType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="userType"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select
              placeholder="Select a role"
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "LIBRARIAN", label: "Librarian" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addUserLoading}
              className="bg-blue-400 hover:from-gray-900 hover:to-black text-white font-bold  px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={users}
        loading={userLoading}
        bordered
        rowKey={(record) => record.id}
        pagination={{ pageSize: 7 }}
      />

      <Modal
        title={modalTitle}
        open={openModal}
        onOk={handleOk}
        confirmLoading={
          status == "activate" ? reactivateLoading : deactivateLoading
        }
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to perfom the action?</p>
      </Modal>

    </div>
  );
};

export default ManageUser;
