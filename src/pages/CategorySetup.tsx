import { useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";

import CategoryForm from "./CategoryForm";
import {
  useDeleteCategory,
  useDownloadCategory,
  useFetchCategory,
  useFetchCategoryById,
} from "../api/category/queries";

interface CategoryDataType {
  id: number;
  name: string;
  description: string;
}

const CategorySetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [fetchedCategoryDataById, setFetchedCategoryDataById] = useState<CategoryDataType | any>(null);
  const [searchText, setSearchText] = useState(null);
  const [filteredData, setFilteredData] = useState<CategoryDataType | any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);
  const [page, setPage] = useState(1);


  const {
    data: category,
    isLoading: categoryLoading,
    refetch: categoryRefetch,
  } = useFetchCategory();
  const { mutate: downloadCategory, isLoading: downloadLoading } =
    useDownloadCategory();
  const { mutate: deleteCategory, isLoading: isDeletingCategory } =
    useDeleteCategory();
  const { mutate: categoryById, isLoading: categoryByIdLoading } =
    useFetchCategoryById();

  const [form] = Form.useForm();

  const handleDownload = () => {
    downloadCategory(undefined, {
      onSuccess: (data) => {
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        console.log(data);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "category_data.xlsx";
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

  const showModal = (id: number) => {
    setModalTitle(`Category ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    console.log(isDeletingCategory);
    console.log(deleteId);
    deleteCategory(deleteId, {
      onSuccess: () => {
        form.resetFields();
        message.success(`Deleted Category  Successfully`);
        setOpenModal(false);
        categoryRefetch();
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

  const showDrawer = (editMode: boolean, categoryData) => {
    setEditMode(editMode);
    setSelectedCategoryData(categoryData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedCategoryData(null);
    categoryRefetch();
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    if (isNaN(values.id) ){
      message.error("Please enter a valid Category Id");
      return false;
    }
    categoryById(values.id, {
      onSuccess: (data) => {
        setFilteredData(null);
        setSearchText(null);
        setSearchId(values.id);
        console.log(data);
        setFetchedCategoryDataById(data);
      },
      onError: (errorMessage: any) => {
        message.error(`${errorMessage}`);
      },
    });
  };

  const onChange = (event: any) => {
    
    const inputValue = event.target.value.toLowerCase();;

    if (!inputValue) {
      setSearchId(null);
      setSearchText(null);
      setFilteredData(null);
      categoryRefetch();
    } else {
      const filtered = category.filter((record:any) => {
        return (
          record.id?.toString().toLowerCase().includes(inputValue) ||
          record.discription?.toLowerCase().includes(inputValue) ||
          record.name?.toLowerCase().includes(inputValue)
        );
      });
      setFilteredData(filtered);
      setSearchText(inputValue);
      setSearchId(null);
    }
  };

  const handleUpdateCategory = (updateCategory: any) => {
    setFetchedCategoryDataById(updateCategory);
    if(searchText){
      const categoryArray = [updateCategory];
      setFilteredData(categoryArray);
    }else{
      setFetchedCategoryDataById(updateCategory);    }
  };

  const columns: TableProps<CategoryDataType>["columns"] = [
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
      title: "Description",
      dataIndex: "discription",
      key: "discription",
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
            onClick={() => showModal(_record.id)}
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
          <h2 className="text-lg font-semibold">Category Setup</h2>
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
              { required: true, message: "Please enter Category Details!" },
            ]}
          >
            <Input
              placeholder="Enter Category Details"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={categoryByIdLoading}
            >
              Search
            </Button>
          </Form.Item>
        </Form>

        <div>
          <Button loading={downloadLoading} onClick={handleDownload} icon={<DownloadOutlined />} className="mr-4">
            Download Excel
          </Button>

          <Button  icon={<UploadOutlined />}>
            Upload Excel
          </Button>
        </div>
      </div>

      <Drawer
        title={editMode ? "Edit Category" : "Setup Category"}
        width={700}
        onClose={onClose}
        open={open}
      >
        <CategoryForm
          editMode={editMode}
          initialData={selectedCategoryData}
          onSuccess={onClose}
          onUpdateCategory={handleUpdateCategory}
        />
      </Drawer>

      <Table
        columns={columns}
        dataSource={searchId? [fetchedCategoryDataById] : searchText ? filteredData : category }
        bordered
        loading={categoryLoading}
        rowKey={(record) => record.id}
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
        confirmLoading={isDeletingCategory}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
    </div>
  );
};

export default CategorySetup;
