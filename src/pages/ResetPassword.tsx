import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  useGenerateOTP,
  useResetPassword,
} from "../api/password/queries";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  email?: string;
  password?: string;
  token: string;
};

const ResetPassword: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { mutate: generateOtp } = useGenerateOTP();

  const onFinish = (values: any) => {
    generateOtp(values, {
      onSuccess: (data) => {
        message.success(data);
        showModal();
      },
      onError: (errorMsg) => {
        message.error(`Failed: ${errorMsg}`);
      },
    });
  };

  const { mutate: resetUserPassword } = useResetPassword();

  const onSumbission = (value: any) => {
    resetUserPassword(value, {
      onSuccess: (data) => {
        handleCancel();
        message.success(`Reset Sucessfull ${data}`);

        navigate("/login", { replace: true });
      },
      onError: (errorMsg) => {
        message.error(`Failed: ${errorMsg}`);
      },
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 bg-white rounded-lg p-8 flex flex-col justify-between shadow-md">
        <h1 className="text-3xl text-center mb-6 text-gray-900 font-bold">
          Reset Password
        </h1>
        <Form
          name="generate-otp"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              placeholder="Enter Username"
              className="rounded-md mb-4 border focus:outline-none border-gray-900 focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold  px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
            >
              Send Token
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center">
          Have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </div>

      <Modal
        title="Create New Password" 
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          name="reset-password"
          initialValues={{ remember: true }}
          onFinish={onSumbission}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input
              placeholder="Enter Username"
              className="rounded-md mb-4 border focus:outline-none border-gray-900 focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="token"
            rules={[{ required: true, message: "Please input your token!" }]}
          >
            <Input
              placeholder="Enter Token"
              className="rounded-md mb-4 border focus:outline-none border-gray-900 focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              className="border-gray-900 rounded-md mb-4 border focus:outline-none focus:border-purple-500 px-3 py-2"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold  px-4 rounded-md focus:outline-none transition-all duration-300 w-full"
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResetPassword;
