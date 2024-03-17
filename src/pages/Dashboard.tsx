import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";

import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Breadcrumb, Card, Col, Layout, Menu, Row, Spin, theme } from "antd";
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
import { useFetchAuthor } from "../api/author/queries";
import { useFetchCategory } from "../api/category/queries";
import { useFetchMember } from "../api/member/queries";
import { useFetchBook } from "../api/book/queries";

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: authors } = useFetchAuthor();
  const { data: category } = useFetchCategory();
  const { data: members } = useFetchMember();
  const { data: books, isLoading: loading } = useFetchBook();

  const authorCount = authors?.length || 0;
  const bookCount = books?.length || 0;
  const memberCount = members?.length || 0;
  const categoryCount = category?.length || 0;

  const CustomCard = ({ title, count, backgroundColor, textColor }) => {
    return (
      <Card
        style={{ height: "200px", textAlign: "center", backgroundColor }}
        bodyStyle={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ color: textColor, fontSize: "20px" }}>{title}</h1>
          <p style={{ fontSize: "60px", fontWeight: "bold", color: textColor }}>
            {count}
          </p>
        </div>
      </Card>
    );
  };

  const DashboardContent = () => {
    return (
      <div style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
            <p>Loading...</p>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <CustomCard
                title="Authors"
                count={authorCount}
                backgroundColor="#ffecb3"
                textColor="black"
              />
            </Col>
            <Col span={6}>
              <CustomCard
                title="Books"
                count={bookCount}
                backgroundColor="#b2dfdb"
                textColor="black"
              />
            </Col>
            <Col span={6}>
              <CustomCard
                title="Members"
                count={memberCount}
                backgroundColor="#ffcc80"
                textColor="black"
              />
            </Col>
            <Col span={6}>
              <CustomCard
                title="Categories"
                count={categoryCount}
                backgroundColor="#f8bbd0"
                textColor="black"
              />
            </Col>
          </Row>
        )}
      </div>
    );
  };

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
            {location.pathname === "/dashboard" && <DashboardContent />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
