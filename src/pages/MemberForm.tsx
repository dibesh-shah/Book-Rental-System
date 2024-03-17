import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

import {
  useAddMember,
  useEditMember,
} from "../api/member/queries";

interface MemberFormProps {
  editMode: boolean;
  initialData: any | null;
  onSuccess: () => void;
  onUpdateMember: (data:any) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  editMode,
  initialData,
  onSuccess,
  onUpdateMember,
}) => {
  const [form] = Form.useForm();

  const { mutate: addMember, isLoading: isAddingMember } = useAddMember();
  const { mutate: editMember, isLoading: isEditingMember } = useEditMember();

  const onFinish = (values: any) => {
    let payload: any = {
      name: values.name,
      email: values.email,
      mobileNo: values.mobileNo,
      address: values.address,
    };

    if (initialData) {
      payload = { ...payload, memberid: initialData.memberid };

      editMember(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Edited Member ${values.name} Successfully`);
          onUpdateMember(payload);
          onReset();
        },
        onError: (errorMessage: any) => {
          message.error(`${errorMessage}`);
        },
      });
    } else {
      addMember(payload, {
        onSuccess: () => {
          onSuccess();
          message.success(`Added Member ${values.name} Successfully`);
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
    const phoneNumberRegex =  /^98\d{8}$/;
    if (value && !phoneNumberRegex.test(value)) {
      return Promise.reject("Invalid phone number");
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      name="memberForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 3, offset: 0 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the member's name!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Member's Name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter the member's email!" },
          { type: "email", message: "Invalid email format!" },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Member's Email" />
      </Form.Item>

      <Form.Item
        label="Mobile"
        name="mobileNo"
        rules={[
          {
            required: true,
            message: "Please enter the member's phone number!",
          },
          { validator: validatePhoneNumber },
        ]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Member's Phone Number"
          maxLength={10}
        />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          { required: true, message: "Please enter the member's address!" },
        ]}
      >
        <Input
          prefix={<EnvironmentOutlined />}
          placeholder="Member's Address"
        />
      </Form.Item>

      <div className="flex justify-end">
          <Form.Item>
            <Button
              type="primary"
              className="bg-blue-600"
              htmlType="submit"
              loading={editMode ? isEditingMember : isAddingMember}
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

export default MemberForm;
