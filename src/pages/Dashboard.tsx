import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";

import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AuthorSetup from "./AuthorSetup";
import CategorySetup from "./CategorySetup";
import MemberSetup from "./MemberSetup";
import BookSetup from "./BookSetup";
import RentBook from "./RentBook";
import ReturnBook from "./ReturnBook";
import { useAuth } from "../contextProvider/AuthContext";
import About from "./About";
import ManageUser from "./ManageUser";
import History from "./History";
import ChangePassword from "./ChangePassword";


const Dashboard: React.FC = () => {
  const { loggedIn, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("bookRental");
    const getUserInfoFromToken = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedData = JSON.parse(atob(base64));
        return {
          username: decodedData.sub,
          exp: decodedData.exp,
          role: decodedData.role,
        };
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
      }
    };

    if (userToken) {
      const userInfo = getUserInfoFromToken(userToken);
      if (userInfo) {
        const { username, exp, role } = userInfo;
        setCurrentRole(role);
        setCurrentUser(username);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", username);
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
    } else {
      setCurrentUser(null);
      setCurrentRole(null);
    }
  }, []);


  //   const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "10px 0" }}>
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Navigate to={loggedIn ? "/dashboard" : "/login"} replace />
                }
              />

              <Route path="author-setup" element={<AuthorSetup />} />
              <Route path="category-setup" element={<CategorySetup />} />
              <Route path="member-setup" element={<MemberSetup />} />
              <Route path="book-setup" element={<BookSetup />} />
              <Route path="rent-book" element={<RentBook />} />
              <Route path="return-book" element={<ReturnBook />} />
              <Route path="about" element={<About />} />
              <Route path="transaction-history" element={<History />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route
                path="manage-user"
                element={
                  currentRole === "ADMIN" ? (
                    <ManageUser />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
