// Import necessary dependencies
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contextProvider/AuthContext";

const { Title } = Typography;

// Define the Login component
const Login: React.FC = () => {
  const { loggedIn, login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    await login(values.username, values.password);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/dashboard');
    }
  }, [loggedIn, navigate]);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(../../public/background.jpg)`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <Form
        name="loginForm"
        onFinish={onFinish}
        initialValues={{ remember: true }}
        style={{ width: 350 }}
        className="shadow-md rounded-lg p-6 bg-white"
      >
        <Title level={4} style={{ textAlign: "center" }}>
          Login
        </Title>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-400"
          >
            Log in
          </Button>
        </Form.Item>
        <div className="text-center">Book Rental System</div>
        <div className="text-center"><Link to="/forgot-password">Forgot Password?</Link></div>
      </Form>
    </div>
  );
};

export default Login;
