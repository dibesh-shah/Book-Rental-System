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
import type { TableProps, UploadProps } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import MemberForm from "./MemberForm";
import {
  useDeleteMember,
  useDownloadMember,
  useFetchMember,
  useFetchMemberById,
  useUploadMember,
} from "../api/member/queries";
import Dragger from "antd/es/upload/Dragger";

interface MemberDataType {
  memberid: number;
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
  const [searchText, setSearchText] = useState(null);
  const [filteredData, setFilteredData] = useState<MemberDataType | any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);
  const [page, setPage] = useState(1);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    data: members,
    isLoading: memberLoading,
    refetch: memberRefetch,
  } = useFetchMember();
  const { mutate: downloadMember, isLoading: downloadLoading } =
    useDownloadMember();
  const { mutate: deleteMember, isLoading: isDeletingMember } =
    useDeleteMember();
  const { mutate: memberById, isLoading: memberByIdLoading } =
    useFetchMemberById();
  const { mutate: uploadMember } = useUploadMember();

  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const handleDownload = () => {
    downloadMember(undefined, {
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
      onError: (errorMessage: any) => {
        message.error(`${errorMessage}`);
      },
    });
  };

  const showUploadModal = () => {
    setOpenUploadModal(true);
  };

  const handleUploadOk = () => {
    setOpenUploadModal(false);
  };

  const handleUploadCancel = () => {
    setOpenUploadModal(false);
  };

  const props: UploadProps = {
    name: "file",
    fileList: fileList,
    action: "",
    beforeUpload: (file: File) => {
      const isExcel =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return false;
      }
      setFileList([file]);
      onUploadFinish(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const onUploadFinish = (e: any) => {
    let payload = {
      file: e.file.file,
    };
    uploadMember(payload, {
      onSuccess: () => {
        message.success("Sucessfully uploaded");
        setOpenUploadModal(false);
        memberRefetch();
        setFileList([]);
      },
      onError: (data) => {
        message.error(`Failed ${data}`);
      },
    });
  };

  const showModal = (id: number) => {
    setModalTitle(`Member ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
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
      onError: (errorMessage: any) => {
        message.error(`${errorMessage}`);
      },
    });
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenModal(false);
  };

  const showDrawer = (editMode: boolean, memberData:any) => {
    setEditMode(editMode);
    setSelectedMemberData(memberData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedMemberData(null);
    memberRefetch();
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    if (isNaN(values.id)) {
      message.error("Please enter a valid Member Id");
      return false;
    }
    memberById(values.id, {
      onSuccess: (data) => {
        setFilteredData(null);
        setSearchText(null);
        setSearchId(values.id);
        console.log(data);
        setFetchedMemberDataById(data);
      },
      onError: (errorMessage: any) => {
        message.error(`${errorMessage}`);
      },
    });
  };

  const onChange = (event: any) => {
    const inputValue = event.target.value.toLowerCase();

    if (!inputValue) {
      setSearchId(null);
      setSearchText(null);
      setFilteredData(null);
      memberRefetch();
    } else {
      const filtered = members.filter((record: any) => {
        return (
          record.memberid?.toString().toLowerCase().includes(inputValue) ||
          record.mobileNo?.toLowerCase().includes(inputValue) ||
          record.email?.toLowerCase().includes(inputValue) ||
          record.address?.toLowerCase().includes(inputValue) ||
          record.name?.toLowerCase().includes(inputValue)
        );
      });
      setFilteredData(filtered);
      setSearchText(inputValue);
      setSearchId(null);
    }
  };

  const handleUpdateMember = (updateMember: any) => {
    setFetchedMemberDataById(updateMember);
    if (searchText) {
      const memberArray = [updateMember];
      setFilteredData(memberArray);
    } else {
      setFetchedMemberDataById(updateMember);
    }
  };

  const columns: TableProps<MemberDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (_, __, index) => (page - 1) * 7 + index + 1,
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
              { required: true, message: "Please enter Member Details!" },
            ]}
          >
            <Input placeholder="Enter Member Details" onChange={onChange} />
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

        <div>
          <Button
            loading={downloadLoading}
            onClick={handleDownload}
            icon={<DownloadOutlined />}
            className="mr-4"
          >
            Download Excel
          </Button>

          <Button icon={<UploadOutlined />} onClick={showUploadModal}>Upload Excel</Button>
        </div>
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
        dataSource={
          searchId
            ? [fetchedMemberDataById]
            : searchText
            ? filteredData
            : members
        }
        bordered
        loading={memberLoading}
        rowKey={(record) => record.memberid}
        pagination={{
          pageSize: 7,
          responsive: true,
          onChange(current) {
            setPage(current);
          },
        }}
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

      <Modal
        footer
        title="Upload Member Excel"
        open={openUploadModal}
        onOk={handleUploadOk}
        onCancel={handleUploadCancel}
      >
        <Form
          form={uploadForm}
          onFinish={onUploadFinish}
          className="flex flex-col justify-between h-full"
        >
          <Form.Item name="file" className="mb-4">
            <Dragger name="file" {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Please Upload Excel File</p>
            </Dragger>
          </Form.Item>
          <Form.Item className="flex justify-center">
            <Button
              className="bg-blue-600 text-white "
              type="default"
              htmlType="submit"
            >
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberSetup;
