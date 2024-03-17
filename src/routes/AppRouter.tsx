import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/LoginForm";
import ResetPassword from "../pages/ResetPassword";

const MyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ResetPassword />} />
      {/* <Route path="signup" element={<SignupForm />} /> */}
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route index element={<Dashboard />} />
    </Routes>
  );
};

export default MyRoutes;
