import { useState } from "react";
import { Space, Table, Button, Drawer, message, Form, Input, Modal } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { BookData } from "../assets/static-data";
import BookForm from "./BookForm";
import {
  useDeleteBook,
  useAddBook,
  useEditBook,
  useFetchBook,
  useFetchBookById,
} from "../api/book/queries";
import dayjs from "dayjs";

interface BookDataType {
  id: string;
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  file: any;
  isbn: any;
  pages: any;
  categoryId: any;
  authorId: any;
  photo:any;
}

const BookSetup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBookData, setSelectedBookData] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [fetchedBookDataById, setFetchedBookDataById] = useState<BookDataType|any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);

  const {data: books, isLoading: bookLoading, refetch: bookRefetch, } = useFetchBook();
  const { mutate: deleteBook, isLoading: isDeletingBook } = useDeleteBook();
  const { mutate: bookById, isLoading: bookByIdLoading } = useFetchBookById();

  const [form] = Form.useForm();

  const showModal = (id: number) => {
    setModalTitle(`Book ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    // setConfirmLoading(isDeletingAuthor);
    console.log(isDeletingBook)
    console.log(deleteId);
    deleteBook(deleteId,{
      onSuccess:()=>{
        form.resetFields();
        setSearchId(null);
        message.success(`Deleted Author  Successfully`);
        setOpenModal(false);
        bookRefetch();
      }
    })
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenModal(false);
  };

  const showDrawer = (editMode: boolean, bookData) => {
    setEditMode(editMode);
    setSelectedBookData(bookData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedBookData(null);
    bookRefetch();
  };

  const onFinish = (values: any) => {
    console.log(values.id)
    bookById(values.id, {
      onSuccess: (data) => {
        setSearchId(values.id);
        console.log(data)
        setFetchedBookDataById(data);
      },
      onError:(error)=>{
        message.error(error.message);
      }
    });
  };

  const onChange = (events:any) => {
    if(!events.target.value){
      setFetchedBookDataById(null);
      setSearchId(null);
      bookRefetch();
    }
  }
  
  const handleUpdateBook = (updateBook:any) => {
    setFetchedBookDataById(updateBook);
  }

  const columns: TableProps<BookDataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Isbn",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
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
          <h2 className="text-lg font-semibold">Book Setup</h2>
        </div>

        <Button
          type="primary"
          className="bg-blue-600 text-white"
          onClick={() => showDrawer(false, null)}
        >
          Create
        </Button>
      </div>

      <div>
        <Form className="flex justify-start space-x-4" onFinish={onFinish} form={form}>
          <Form.Item
            name="id"
            
            rules={[
              { required: true, message: "Please enter Book Id!" },
              // { type: "number", message: "Please Enter valid Id" },
            ]}
          >
            <Input placeholder="Enter Book Id" type="number" onChange={onChange} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={bookByIdLoading}
            >
              Search
            </Button>
          </Form.Item>
          
        </Form>
      </div>

      <Drawer
        title={editMode ? "Edit Book" : "Setup Book"}
        width={700}
        onClose={onClose}
        open={open}
      >
        <BookForm
          editMode={editMode}
          initialData={selectedBookData}
          onSuccess={onClose}
          onUpdateBook={handleUpdateBook}
        />
      </Drawer>

      <Table
        columns={columns}
        dataSource={searchId?[fetchedBookDataById]:books}
        loading={bookLoading}
        bordered
        rowKey={(record) => record.id}
        pagination={{ pageSize: 7 }}
      />

      <Modal
        title={modalTitle}
        open={openModal}
        onOk={handleOk}
        confirmLoading={isDeletingBook}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
      
    </div>
  );
};

export default BookSetup;
