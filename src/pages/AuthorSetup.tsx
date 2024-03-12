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
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { AuthorData } from "../assets/static-data";
import AuthorForm from "./AuthorForm";
import {
  useDeleteAuthor,
  useDownloadAuthor,
  useFetchAuthor,
  useFetchAuthorById,
} from "../api/author/queries";

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
  // const [filteredData, setFilteredData] = useState([]);
  const [filteredData, setFilteredData] = useState<AuthorDataType | any>(null);
  const [fetchedAuthorDataById, setFetchedAuthorDataById] = useState<
    AuthorDataType | any
  >(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);

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

  const [form] = Form.useForm();

  const handleDownload = () => {
    downloadAuthor(undefined, {
      onSuccess: (data) => {
        // message.success(`Deleted Author  Successfully`);
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
    });
  };

  const showModal = (id: number) => {
    setModalTitle(`Author ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    // setConfirmLoading(isDeletingAuthor);
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
    authorById(values.id, {
      onSuccess: (data) => {
        setFilteredData(null);
        setSearchText(null);
        setSearchId(values.id);
        console.log(data);
        setFetchedAuthorDataById(data);
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  const onChange = (event: any) => {
    const inputValue = event.target.value;

    if (!inputValue) {
      // setFetchedAuthorDataById(null);
      setSearchId(null);
      setSearchText(null);
      setFilteredData(null);
      authorRefetch();
    } else {
      const filtered = authors.filter((record: AuthorDataType) => {
        return (
          record.authorId.toString().includes(inputValue) ||
          record.mobileNumber.includes(inputValue) ||
          record.email.includes(inputValue) ||
          record.name.includes(inputValue)
        );
      });
      setFilteredData(filtered);
      setSearchText(inputValue);
      setSearchId(null);
    }
  };

  const handleUpdateAuthor = (updateAuthor: any) => {
    console.log(updateAuthor);
    if(searchText){
      const jsonArray = [updateAuthor];
      setFilteredData(jsonArray);
    }else{
      setFetchedAuthorDataById(updateAuthor);
    }
  
  };

  const columns: TableProps<AuthorDataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "authorId",
      key: "authorId",
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
            // onClick={()=>console.log(_record)}
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
              { required: true, message: "Please enter Author Id!" },
              // { type: "number", message: "Please Enter valid Id" },
            ]}
          >
            <Input placeholder="Enter Author Id" onChange={onChange} />
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

        <Button loading={downloadLoading} onClick={handleDownload}>
          Download Excel
        </Button>
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
        dataSource={searchId? [fetchedAuthorDataById] : searchText ? filteredData : authors }
        loading={authorLoading}
        bordered
        rowKey={(record) => record.authorId}
        pagination={{ pageSize: 7 }}
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
    </div>
  );
};

export default AuthorSetup;
