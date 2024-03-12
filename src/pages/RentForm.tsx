import { Form, Input, Button, message, Select, InputNumber } from "antd";
import { useEffect } from "react";
import { BookData, MemberData } from "../assets/static-data";
import {
  useAddTransaction,
  useUpdateTransaction,
  useUploadTransaction,
} from "../api/transaction/queries";
import { useFetchMember } from "../api/member/queries";
import { useFetchBook } from "../api/book/queries";

interface RentFormProps {
  editMode: boolean;
  initialData: Object | null;
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
  const { mutate: uploadTransaction, isLoading: isUploadingTransaction } =
    useUploadTransaction();
  const { data: members } = useFetchMember();
  const { data: books } = useFetchBook();

  let bookArray =[];
  let memberArray =[];

  if(initialData){
    const { bookName, memberName } = initialData;
    bookArray = bookName ? bookName.split(', ') : [];
    memberArray = memberName ? memberName.split(', ') : [];
  }

  const onFinish = (values: any) => {
    let payload: any = {
      bookId: values.bookId,
      code: values.code,
      fromDate: values.fromDate,
      toDate: values.toDate,
      rentType: values.rentType,
      Fk_member_id: values.Fk_member_id,
    };

    if (initialData) {
      payload = { ...payload, id: initialData.id };

      editTransaction(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Transaction Successfully`);
          onUpdateTransaction(payload);
          onReset();
        },
      });
    } else {
      addTransaction(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Transaction Successfully`);
          onReset();
        },
      });
    }

    console.log("Received values:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form for errors.");
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    // Use setFieldsValue to set initial values after the form is mounted
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

  return (
    <Form
      form={form}
      name="rentForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 3, offset: 0 }}
      wrapperCol={{ span: 20 }}
      // initialValues={{
      //   bookId: bookArray,
      //   Fk_member_id: memberArray,
      // }}
    >
      <Form.Item
        label="Book"
        name="bookId"
        rules={[{ required: true, message: "Please select a book!" }]}
      >
        <Select placeholder="Select a book" >
          {books?.map((book) => (
            <Option key={book.id} value={book.id}>
              {book.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Member"
        name="Fk_member_id"
        rules={[{ required: true, message: "Please select a member!" }]}
      >
        <Select placeholder="Select a member" >
          {members?.map((member) => (
            <Option key={member.memberid} value={member.memberid}>
              {member.name}
            </Option>
          ))}
        </Select>
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
        label="To Date"
        name="toDate"
        rules={[{ required: true, message: "Please select to date" }]}
      >
        <Input
          type="date"
          className="w-full py-2 px-4 border border-gray-900 rounded"
        />
      </Form.Item>

      <Form.Item
        label="Code"
        name="code"
        rules={[{ required: true, message: "Please enter the code!" }]}
      >
        <Input placeholder="Transcation Code" />
      </Form.Item>

      <Form.Item
        label="Status"
        name="rentType"
        rules={[{ required: true, message: "Plese Select Status" }]}
      >
        <Select
          options={[
            { value: "RENT", label: <span>Rent</span> },
            { value: "RETURN", label: <span>Return</span> },
          ]}
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
