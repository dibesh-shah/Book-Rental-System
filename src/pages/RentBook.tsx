import { useState } from "react";
import {
  Space,
  Table,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Modal,
} from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";

import RentForm from "./RentForm";
import {
  useDeleteTransaction,
  useDownloadTransaction,
  useFetchTransaction,
  useFindTransactionById,
  useMailTransaction,
} from "../api/transaction/queries";

interface RentDataType {
  id: number;
  bookName: string;
  code: number;
  fromDate: any;
  toDate: any;
  rentType: string;
  memberName: string;
}

const RentBook: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRentData, setSelectedRentData] = useState(null);
  const [searchId, setSearchId] = useState(null);
  const [fetchedTransactionDataById, setFetchedTransactionDataById] = useState<RentDataType | any>(null);
  const [searchText, setSearchText] = useState(null);
  const [filteredData, setFilteredData] = useState<RentDataType | any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(Number);
  const [modalTitle, setModalTitle] = useState(String);
  const [page, setPage] = useState(1);

  const {
    data: transactions,
    isLoading: isLoadingTransaction,
    refetch: refetchTransaction,
  } = useFetchTransaction();
  const { mutate: transactionById, isLoading: isLoadingTransactionId } =
    useFindTransactionById();
  const { mutate: downloadTransaction, isLoading: downloadLoading } =
    useDownloadTransaction();
  const { mutate: deleteransaction, isLoading: isDeletingTransaction } =
    useDeleteTransaction();
  const { mutate: mail, isLoading: mailLoading } = useMailTransaction();

  const [form] = Form.useForm();

  const handleDownload = () => {
    downloadTransaction(undefined, {
      onSuccess: (data) => {
        // message.success(`Deleted Author  Successfully`);
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        console.log(data);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transaction.xlsx";
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
    setModalTitle(`Transaction ID - ${id}`);
    setDeleteId(id);
    setOpenModal(true);
  };

  const handleOk = () => {
    // setConfirmLoading(isDeletingAuthor);
    console.log(isDeletingTransaction);
    console.log(deleteId);
    deleteransaction(deleteId, {
      onSuccess: () => {
        form.resetFields();
        setSearchId(null);
        message.success(`Deleted Transaction  Successfully`);
        setOpenModal(false);
        refetchTransaction();
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

  const showDrawer = (editMode: boolean, rentData) => {
    setEditMode(editMode);
    setSelectedRentData(rentData);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedRentData(null);
    refetchTransaction();
  };

  const onFinish = (values: any) => {
    console.log(values.id);
    if (isNaN(values.id) ){
      message.error("Please enter a valid Rent Id");
      return false;
    }
    transactionById(values.id, {
      onSuccess: (data) => {
        setFilteredData(null);
        setSearchText(null);
        setSearchId(values.id);
        console.log(data);
        setFetchedTransactionDataById(data);
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
      refetchTransaction();
    } else {
      const filtered = transactions.filter((record: any) => {
        return (
          record.id?.toString().toLowerCase().includes(inputValue) ||
          record.code?.toString().toLowerCase().includes(inputValue) ||
          record.bookName?.toLowerCase().includes(inputValue) ||
          record.memberName?.toLowerCase().includes(inputValue) ||
          record.rentType?.toLowerCase().includes(inputValue)
        );
      });
      setFilteredData(filtered);
      setSearchText(inputValue);
      setSearchId(null);
    }
  };

  const handleUpdateTransaction = (updateTransaction: any) => {
    setFetchedTransactionDataById(updateTransaction);
    if(searchText){
      const transactionArray = [updateTransaction];
      setFilteredData(transactionArray);
    }else{
      setFetchedTransactionDataById(updateTransaction);
    }
  };

  const sendMail = () => {
    mail(undefined, {
      onSuccess: () => {
        message.success("Due emails send sucessfully");
      },
      onError: (data) => {
        message.error(`Failed: ${data}`);
      },
    });
  };

  const columns: TableProps<RentDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (_, __, index) => (page - 1) * 7 + index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Book",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Member",
      dataIndex: "memberName",
      key: "memberName",
    },
    {
      title: "From",
      dataIndex: "fromDate",
      key: "fromDate",
    },
    {
      title: "To",
      dataIndex: "toDate",
      key: "toDate",
    },
    {
      title: "Status",
      dataIndex: "rentType",
      key: "rentType",
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
            Return
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Rent Book</h2>
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
              { required: true, message: "Please enter Transaction Id!" },
            ]}
          >
            <Input
              placeholder="Enter Transaction Id"
              onChange={onChange}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={isLoadingTransactionId}
            >
              Search
            </Button>
          </Form.Item>

          <Button onClick={sendMail} loading={mailLoading}>
            Send Due Mail
          </Button>
        </Form>

        <Button loading={downloadLoading} onClick={handleDownload} icon={<DownloadOutlined />}>
          Download Excel
        </Button>
      </div>

      <Drawer
        title={editMode ? "Edit Rent" : "Rent Book"}
        width={700}
        onClose={onClose}
        open={open}
      >
        <RentForm
          editMode={editMode}
          initialData={selectedRentData}
          onSuccess={onClose}
          onUpdateTransaction={handleUpdateTransaction}
        />
      </Drawer>

      <Table
        columns={columns}
        dataSource={searchId? [fetchedTransactionDataById] : searchText ? filteredData : transactions }
        bordered
        loading={isLoadingTransaction}
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
        confirmLoading={isDeletingTransaction}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-blue-400" }}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
    </div>
  );
};

export default RentBook;
