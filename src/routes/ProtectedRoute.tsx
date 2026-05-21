import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../components/path";

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to={PATH.ONBOARDING} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;