import { useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  Modal,
  message,
  Form,
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

import AuthorForm from "./AuthorForm";
import {
  useDeleteAuthor,
  useDownloadAuthor,
  useFetchAuthor,
  useFetchAuthorById,
  useUploadAuthor,
} from "../api/author/queries";
import Dragger from "antd/es/upload/Dragger";

interface AuthorDataType {
  authorId: number;
  name: string;
  email: string;
  mobileNumber: string;
}

const AuthorSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAuthorData, setSelectedAuthorData] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [filteredData, setFilteredData] = useState<AuthorDataType | any>(null);
  const [fetchedAuthorDataById, setFetchedAuthorDataById] = useState<
    AuthorDataType | any
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);
  const [page, setPage] = useState(1);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    data: authors,
    isLoading: authorLoading,
    refetch: authorRefetch,
  } = useFetchAuthor();
  const { mutate: downloadAuthor, isLoading: downloadLoading } =
    useDownloadAuthor();
  const { mutate: deleteAuthor, isLoading: isDeletingAuthor } =
    useDeleteAuthor();
  const { mutate: authorById, isLoading: authorByIdLoading } =
    useFetchAuthorById();
  const { mutate: uploadAuthor } = useUploadAuthor();

  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const handleDownload = () => {
    downloadAuthor(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        console.log(data);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "author_data.xlsx";
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
    uploadAuthor(payload, {
      onSuccess: () => {
        message.success("Sucessfully uploaded");
        setOpenUploadModal(false);
        authorRefetch();
      },
      onError: (data) => {
        message.error(`Failed ${data}`);
      },
    });
  };

  const showModal = (id: number) => {
    setModalTitle(`Author ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    console.log(isDeletingAuthor);
    console.log(deleteId);
    deleteAuthor(deleteId, {
      onSuccess: () => {
        form.resetFields();
        setSearchId(null);
        setSearchText(null);
        message.success(`Deleted Author  Successfully`);
        setOpenModal(false);
        authorRefetch();
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

  const showDrawer = (editMode: boolean, authorData: any) => {
    setEditMode(editMode);
    setSelectedAuthorData(authorData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedAuthorData(null);
    authorRefetch();
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    if (isNaN(values.id)) {
      message.error("Please enter a valid Author Id");
      return false;
    }
    authorById(values.id, {
      onSuccess: (data) => {
        setFilteredData(null);
        setSearchText(null);
        setSearchId(values.id);
        console.log(data);
        setFetchedAuthorDataById(data);
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
      authorRefetch();
    } else {
      const filtered = authors.filter((record: AuthorDataType) => {
        return (
          record.authorId?.toString().toLowerCase().includes(inputValue) ||
          record.mobileNumber?.toLowerCase().includes(inputValue) ||
          record.email?.toLowerCase().includes(inputValue) ||
          record.name?.toLowerCase().includes(inputValue)
        );
      });
      setFilteredData(filtered);
      setSearchText(inputValue);
      setSearchId(null);
    }
  };

  const handleUpdateAuthor = (updateAuthor: any) => {
    console.log(updateAuthor);
    if (searchText) {
      const authorArray = [updateAuthor];
      setFilteredData(authorArray);
    } else {
      setFetchedAuthorDataById(updateAuthor);
    }
  };

  const columns: TableProps<AuthorDataType>["columns"] = [
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
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      render: (mobileNumber) => parseFloat(mobileNumber),
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
            onClick={() => showModal(_record.authorId)}
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
          <h2 className="text-lg font-semibold">Author Setup</h2>
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
              { required: true, message: "Please enter Author Details!" },
            ]}
          >
            <Input placeholder="Enter Author Details" onChange={onChange} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={authorByIdLoading}
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

          <Button icon={<UploadOutlined />} onClick={showUploadModal}>
            Upload Excel
          </Button>
        </div>
      </div>

      <Drawer
        title={editMode ? "Edit Author" : "Setup Author"}
        width={700}
        onClose={onClose}
        open={open}
      >
        <AuthorForm
          editMode={editMode}
          initialData={selectedAuthorData}
          onSuccess={onClose}
          onUpdateAuthor={handleUpdateAuthor}
        />
      </Drawer>

      <Table
        columns={columns}
        dataSource={
          searchId
            ? [fetchedAuthorDataById]
            : searchText
            ? filteredData
            : authors
        }
        loading={authorLoading}
        bordered
        rowKey={(record) => record.authorId}
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
        confirmLoading={isDeletingAuthor}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>

      <Modal
        footer
        title="Upload Author Excel"
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
              <p className="ant-upload-hint">
                Please Upload Excel File
              </p>
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

export default AuthorSetup;
