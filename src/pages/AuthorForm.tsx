import { Form, Input, Button, message, Upload } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

import {
  useAddAuthor,
  useEditAuthor,
  useUploadAuthor,
} from "../api/author/queries";

interface AuthorFormProps {
  editMode: boolean;
  initialData: Object | null;
  onSuccess: () => void;
  onUpdateAuthor: (data:any) => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateAuthor,
}) => {
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<any[]>([]);

  const { mutate: addAuthor, isLoading: isAddingAuthor } = useAddAuthor();
  const { mutate: editAuthor, isLoading: isEditingAuthor } = useEditAuthor();
  const { mutate: uploadAuthor, isLoading: isUploadingAuthor } = useUploadAuthor();

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
      });
    } else {
      addAuthor(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Author ${values.name} Successfully`);
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
      form.setFieldsValue(initialData);
    }

    return () => {
      form.resetFields();
    };
  }, [form, initialData]);

  const validatePhoneNumber = (_, value) => {
    // Custom validation function for phone number
    const phoneNumberRegex = /^[0-9]{10}$/;
    if (value && !phoneNumberRegex.test(value)) {
      return Promise.reject("Invalid phone number");
    }
    return Promise.resolve();
  };

  const uploadProps = {
    name: "file",
    action: "",
    fileList: fileList,
    beforeUpload: (file: File) => {
      setFileList([file]);
      handleUpload(file);
      console.log(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUpload = (file: File) => {
    uploadAuthor({file}, {
      onSuccess: () => {
        setFileList([]); 
        onSuccess();
        message.success(`File Uploaded Successfully`);
        onReset();
      },
      onError: () => {
        message.error(`Error Uploading `);
      },
    });
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

      <Form>
        <Form.Item className="mr-auto ml-4">
          <Upload {...uploadProps} >
            <Button icon={<UploadOutlined  />}>Upload Excel</Button>
          </Upload>
        </Form.Item>
      </Form>
    </>
  );
};

export default AuthorForm;
