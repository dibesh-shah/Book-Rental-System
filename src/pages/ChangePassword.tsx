import { useState } from "react";
import { Button, message, Form, Input } from "antd";

import { useResetUser } from "../api/user/queries";

const ChangePassword: React.FC = () => {
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const { mutate: resetUser, isLoading: resetLoading } = useResetUser();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values.id);
    resetUser(values, {
      onSuccess: (data: any) => {
        console.log(data);
        message.success(`Password changed Successfully`);
        form.resetFields();
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    });
  };

  const validatePassword = (_: any, value: string) => {
    const newPassword = form.getFieldValue("newPassword");
    const passwordsMatch = newPassword === value;
    setPasswordsMatch(!passwordsMatch);
    return passwordsMatch
      ? Promise.resolve()
      : Promise.reject("Passwords do not match");
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 border-b mb-4 ">
        <div>
          <h2 className="text-lg font-semibold">Change Password</h2>
        </div>
      </div>

      <div>
        <Form
          form={form}
          name="change-password"
          onFinish={onFinish}
          style={{ width: "80%" }}
        >
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please input your old password!" },
            ]}
            className="w-1/2"
          >
            <Input.Password className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
            className="w-1/2"
          >
            <Input.Password className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your new password!" },
              { validator: validatePassword },
            ]}
            className="w-1/2"
          >
            <Input.Password className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </Form.Item>

          <Form.Item className="w-24">
            <Button
              type="primary"
              htmlType="submit"
              disabled={passwordsMatch}
              loading={resetLoading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
