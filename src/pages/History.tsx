import { useEffect, useState } from "react";
import { Table, Button, message, DatePicker } from "antd";
import type { TablePaginationConfig, TableProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import {
  useDownloadTransaction,
  useFetchAllTransaction,
} from "../api/transaction/queries";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

interface RentDataType {
  id: number;
  bookName: string;
  code: any;
  fromDate: any;
  toDate: any;
  rentType: string;
  memberName: string;
}

const History: React.FC = () => {

  const { RangePicker } = DatePicker;
  
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [fromDate, setFromDate] = useState<any>(null);
  const [toDate, setToDate] = useState<any>(null);
  const [historyData, setHistoryData] = useState<RentDataType[] | any>(null);

  const { data: transactions, isLoading: isLoadingTransaction } =
    useFetchAllTransaction(
      pageNumber,
      pageSize,
      fromDate?.format("YYYY/MM/DD") || null,
      toDate?.format("YYYY/MM/DD") || null
    );
  const { mutate: downloadTransaction, isLoading: downloadLoading } =
    useDownloadTransaction();

  const handleDownload = () => {
    downloadTransaction(undefined, {
      onSuccess: (data) => {
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

  useEffect(() => {
    setHistoryData(transactions?.content);
  }, [transactions]);

  const onTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    setPageNumber(current || 1);
    setPageSize(pageSize || 10);
  };

  const handleDateChange = (value: RangePickerProps["value"]) => {
    if (!value) {
      setFromDate(undefined);
      setToDate(undefined);
      return;
    }

    setFromDate(dayjs(value?.[0]));
    setToDate(dayjs(value?.[1]));
  };


  const columns: TableProps<RentDataType>["columns"] = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Book",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Member",
      dataIndex: "member_name",
      key: "member_name",
    },
    {
      title: "From",
      dataIndex: "from_date",
      key: "from_date",
      render: (text) => {
        const date = new Date(text);
        return <span>{date.toISOString().split("T")[0]}</span>;
      },
    },
    {
      title: "To",
      dataIndex: "to_date",
      key: "to_date",
      render: (text) => {
        const date = new Date(text);
        return <span>{date.toISOString().split("T")[0]}</span>;
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Rent History</h2>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div>
          <RangePicker onChange={handleDateChange} />
        </div>
        <Button
          loading={downloadLoading}
          onClick={handleDownload}
          icon={<DownloadOutlined />}
        >
          Download Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={historyData}
        bordered
        loading={isLoadingTransaction}
        rowKey={(record) => record.id}
        pagination={{
          current: transactions?.currentPageIndex,
          total: transactions?.totalElements,
          pageSize: transactions?.numberOfElements,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 15, 20, 25, 30],
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default History;
