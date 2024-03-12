import { useState } from "react";
import {
  Form,
  Space,
  Table,
  Button,
  Drawer,
  message,
  Modal,
  Input,
} from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { MemberData } from "../assets/static-data";
import MemberForm from "./MemberForm";
import {
  useDeleteMember,
  useDownloadMember,
  useFetchMember,
  useFetchMemberById,
} from "../api/member/queries";

interface MemberDataType {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  address: string;
}

const MemberSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMemberData, setSelectedMemberData] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [fetchedMemberDataById, setFetchedMemberDataById] = useState<
    MemberDataType | any
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);

  const {
    data: members,
    isLoading: memberLoading,
    error,
    refetch: memberRefetch,
  } = useFetchMember();
  const { mutate: downloadMember, isLoading: downloadLoading } =
    useDownloadMember();
  const { mutate: deleteMember, isLoading: isDeletingMember } =
    useDeleteMember();
  const { mutate: memberById, isLoading: memberByIdLoading } =
    useFetchMemberById();

  const [form] = Form.useForm();

  const handleDownload = () => {
    downloadMember("", {
      onSuccess: (data) => {
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        console.log(data);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "member_data.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
  };

  const showModal = (id: number) => {
    setModalTitle(`Member ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    // setConfirmLoading(isDeletingAuthor);
    console.log(isDeletingMember);
    console.log(deleteId);
    deleteMember(deleteId, {
      onSuccess: () => {
        setOpenModal(false);
        form.resetFields();
        memberRefetch();
        message.success(`Deleted Member  Successfully`);
        setSearchId(null);
      },
    });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenModal(false);
  };

  const showDrawer = (editMode: boolean, memberData) => {
    setEditMode(editMode);
    setSelectedMemberData(memberData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedMemberData(null);
    memberRefetch();
    // console.log('closed')
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    memberById(values.id, {
      onSuccess: (data) => {
        console.log(data);
        setSearchId(values.id);
        setFetchedMemberDataById(data);
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  const onChange = (events: any) => {
    if (!events.target.value) {
      setFetchedMemberDataById(null);
      setSearchId(null);
      memberRefetch();
    }
  };

  const handleUpdateMember = (updateMember: any) => {
    setFetchedMemberDataById(updateMember);
  };

  const columns: TableProps<MemberDataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "memberid",
      key: "memberid",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, _record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              showDrawer(true, _record);
              console.log(_record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showModal(_record.memberid)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Member Setup</h2>
        </div>

        <Button
          type="primary"
          className="bg-blue-600 text-white"
          onClick={() => showDrawer(false, null)}
        >
          Create
        </Button>
      </div>

      <div className="flex justify-between">
        <Form
          className="flex justify-start space-x-4"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="id"
            rules={[
              { required: true, message: "Please enter Member Id!" },
              // { type: "number", message: "Please Enter valid Id" },
            ]}
          >
            <Input
              placeholder="Enter Member Id"
              type="number"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={memberByIdLoading}
            >
              Search
            </Button>
          </Form.Item>
        </Form>

        <Button loading={downloadLoading} onClick={handleDownload}>
          Download Excel
        </Button>
      </div>

      <Drawer
        title={editMode ? "Edit Member" : "Setup Member"}
        width={700}
        onClose={onClose}
        open={open}
      >
        <MemberForm
          editMode={editMode}
          initialData={selectedMemberData}
          onSuccess={onClose}
          onUpdateMember={handleUpdateMember}
        />
      </Drawer>

      <Table
        columns={columns}
        dataSource={searchId ? [fetchedMemberDataById] : members}
        bordered
        loading={memberLoading}
        rowKey={(record) => record.memberid}
        pagination={{ pageSize: 7 }}
      />

      <Modal
        title={modalTitle}
        open={openModal}
        onOk={handleOk}
        confirmLoading={isDeletingMember}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
    </div>
  );
};

export default MemberSetup;