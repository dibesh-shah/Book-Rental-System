import { Form, Input, Button, message, Select, InputNumber } from "antd";
import { useEffect } from "react";
// import dayjs from "dayjs";

import {
  useAddTransaction,
  useUpdateTransaction,
} from "../api/transaction/queries";
import { useFetchMember } from "../api/member/queries";
import { useFetchBook } from "../api/book/queries";

interface RentFormProps {
  editMode: boolean;
  initialData: any | null;
  onSuccess: () => void;
  onUpdateTransaction: (data: any) => void;
}

const { Option } = Select;

const RentForm: React.FC<RentFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateTransaction,
}) => {
  const [form] = Form.useForm();

  const { mutate: addTransaction, isLoading: isAddingTransaction } =
    useAddTransaction();
  const { mutate: editTransaction, isLoading: isEditingTransaction } =
    useUpdateTransaction();
  const { data: members } = useFetchMember();
  const { data: books } = useFetchBook();

  let bookArray = [];
  let memberArray = [];

  if (initialData) {
    const { bookName, memberName } = initialData;
    bookArray = bookName ? bookName.split(", ") : [];
    memberArray = memberName ? memberName.split(", ") : [];
  }

  const onFinish = (values: any) => {
    let payload: any = {
      bookId: values.bookId,
      fromDate: values.fromDate,
      toDate: values.toDate,
      rentType: "RENT",
      Fk_member_id: values.Fk_member_id,
    };

    if (initialData) {
      const { bookId, Fk_member_id, ...rest } = payload;
      payload = { ...rest, id: initialData.id };

      editTransaction(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Transaction Successfully`);
          onUpdateTransaction(payload);
          onReset();
        },
        onError: (errorMessage: any) => {
          message.error(`Failed : ${errorMessage}`);
        },
      });
    } else {
      addTransaction(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Transaction Successfully`);
          onReset();
        },
        onError: (errorMessage: any) => {
          message.error(`Failed : ${errorMessage}`);
        },
      });
    }

    console.log("Received values:", values);
  };

  const onFinishFailed = (errorInfo:any) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form for errors.");
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        id: initialData.id,
        bookName: initialData.bookName,
        code: initialData.code,
        fromDate: initialData.fromDate,
        toDate: initialData.toDate,
        rentType: initialData.rentType,
        memberName: initialData.memberName,
      });
    }

    return () => {
      form.resetFields();
    };
  }, [form, initialData]);

  const calculateToDate = (value: any) => {
    if (value === null) {
      form.setFieldsValue({ toDate: null });
    }
    const fromDate = new Date();
    form.setFieldsValue({ fromDate: fromDate.toISOString().split("T")[0] });
    if (fromDate && value) {
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + parseInt(value));
      form.setFieldsValue({ toDate: toDate.toISOString().split("T")[0] });
    }
  };

  return (
    <Form
      form={form}
      name="rentForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 4, offset: 0 }}
      wrapperCol={{ span: 20 }}
      initialValues={{
        bookId: bookArray,
        Fk_member_id: memberArray,
      }}
    >
      <Form.Item
        label="Book"
        name="bookId"
        // name={editMode?"":"bookId"}
        rules={[{ required: true, message: "Please select a book!" }]}
      >
        <Select placeholder="Select a book" disabled={editMode ? true : false}>
          {books?.map((book:any) => (
            <Option key={book.id} value={book.id}>
              {book.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Member"
        name="Fk_member_id"
        // name={editMode?"":"Fk_member_id"}
        rules={[{ required: true, message: "Please select a member!" }]}
      >
        <Select
          placeholder="Select a member"
          disabled={editMode ? true : false}
        >
          {members?.map((member:any) => (
            <Option key={member.memberid} value={member.memberid}>
              {member.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="No. of Days"
        name="numberOfDays"
        hidden={editMode ? true : false}
        // rules={[{ required: true, message: "Please enter no. of Days!" }]}
      >
        <InputNumber className="w-full" min={0} onChange={calculateToDate} />
      </Form.Item>

      <Form.Item
        label="From Date"
        name="fromDate"
        rules={[{ required: true, message: "Please select from date" }]}
      >
        <Input
          type="date"
          className="w-full py-2 px-4 border border-gray-900 rounded"
        />
      </Form.Item>

      <Form.Item
        label="Return Date"
        name="toDate"
        rules={[{ required: true, message: "Please select to date" }]}
      >
        <Input
          type="date"
          className="w-full py-2 px-4 border border-gray-900 rounded"
        />
      </Form.Item>

      <div className="flex justify-end">
        <Form.Item>
          <Button
            type="primary"
            className="bg-blue-600"
            htmlType="submit"
            loading={editMode ? isEditingTransaction : isAddingTransaction}
          >
            {editMode ? "Update" : "Save"}
          </Button>
        </Form.Item>

        <Form.Item>
          {!editMode && (
            <Button
              type="primary"
              className="bg-green-600 ml-4"
              htmlType="button"
              onClick={onReset}
            >
              Reset
            </Button>
          )}
        </Form.Item>
      </div>
    </Form>
  );
};

export default RentForm;
