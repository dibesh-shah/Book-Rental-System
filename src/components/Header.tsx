import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useAuth } from "../contextProvider/AuthContext";

const Head: React.FC = () => {
  const { loggedIn, logout } = useAuth();
  const userName = localStorage.getItem("userName");
  const currentUser = userName?.split('@')[0];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="change-password"> Change Password</Link>,
    },
    {
      key: "2",
      label: <a onClick={logout}>Logout</a>,
    },
  ];

  return (
    <div className="flex justify-between items-center p-4 bg-white ">
      <span className="text-xl font-bold text-black">Book Rental System</span>
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <Button icon={<UserOutlined />} className="bg-yellow-400">{currentUser}</Button>
      </Dropdown>
    </div>
  );
};

export default Head;
