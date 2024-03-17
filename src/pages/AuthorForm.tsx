import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import { useAddAuthor, useEditAuthor } from "../api/author/queries";

interface AuthorFormProps {
  editMode: boolean;
  initialData: AuthorDataType | null;
  onSuccess: () => void;
  onUpdateAuthor: (data: any) => void;
}

interface AuthorDataType {
  authorId: any;
  name: string;
  email: string;
  mobileNumber: string;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateAuthor,
}) => {
  const [form] = Form.useForm();

  const { mutate: addAuthor, isLoading: isAddingAuthor } = useAddAuthor();
  const { mutate: editAuthor, isLoading: isEditingAuthor } = useEditAuthor();

  const onFinish = (values: any) => {
    let payload: any = {
      name: values.name,
      email: values.email,
      mobileNumber: values.mobileNumber,
    };

    if (initialData) {
      payload = { ...payload, authorId: initialData.authorId };

      editAuthor(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Author ${values.name} Successfully`);
          onUpdateAuthor(payload);
          onReset();
        },
        onError: (errorMessage: any) => {
          message.error(`${errorMessage}`);
        },
      });
    } else {
      addAuthor(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Author ${values.name} Successfully`);
          onReset();
        },
        onError: (errorMessage: any) => {
          message.error(`${errorMessage}`);
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
      form.setFieldsValue(initialData);
    }

    return () => {
      form.resetFields();
    };
  }, [form, initialData]);

  const validatePhoneNumber = (_:any, value:any) => {
    const phoneNumberRegex = /^98\d{8}$/;
    if (value && !phoneNumberRegex.test(value)) {
      return Promise.reject("Invalid phone number");
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form
        form={form}
        name="authorForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 3, offset: 0 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the author's name!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Author's Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the author's email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Author's Email" />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobileNumber"
          rules={[
            {
              required: true,
              message: "Please enter the author's phone number!",
            },
            { validator: validatePhoneNumber },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Author's Phone Number"
            maxLength={10}
          />
        </Form.Item>

        <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={editMode ? isEditingAuthor : isAddingAuthor}
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
    </>
  );
};

export default AuthorForm;
