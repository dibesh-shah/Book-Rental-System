import React, { useEffect, useState } from "react";
import { Content } from "antd/es/layout/layout";

import {  Navigate, Route, Routes } from "react-router-dom";
import { Breadcrumb,  Layout, Spin, theme } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AuthorSetup from "./AuthorSetup";
import CategorySetup from "./CategorySetup";
import MemberSetup from "./MemberSetup";
import BookSetup from "./BookSetup";
import RentBook from "./RentBook";
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
  const { loggedIn } = useAuth();
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
        const { username, role } = userInfo;
        setCurrentRole(role);
        // setCurrentUser(username);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", username);
      } else {
        // setCurrentUser(null);
        setCurrentRole(null);
      }
    } else {
      // setCurrentUser(null);
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


  const DashboardContent = () => {
    return (
      <div className="p-4">
        {loading ? (
          <div className="text-center">
            <Spin size="large" />
            <p>Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {/* Authors */}
            <div className="h-48 text-center bg-yellow-200">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-lg font-semibold text-black">Authors</h1>
                  <p className="text-5xl font-bold">{authorCount}</p>
                </div>
              </div>
            </div>
  
            {/* Books */}
            <div className="h-48 text-center bg-green-200">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-lg font-semibold text-black">Books</h1>
                  <p className="text-5xl font-bold">{bookCount}</p>
                </div>
              </div>
            </div>
  
            {/* Members */}
            <div className="h-48 text-center bg-orange-200">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-lg font-semibold text-black">Members</h1>
                  <p className="text-5xl font-bold">{memberCount}</p>
                </div>
              </div>
            </div>
  
            {/* Categories */}
            <div className="h-48 text-center bg-pink-200">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-lg font-semibold text-black">Categories</h1>
                  <p className="text-5xl font-bold">{categoryCount}</p>
                </div>
              </div>
            </div>
          </div>
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
