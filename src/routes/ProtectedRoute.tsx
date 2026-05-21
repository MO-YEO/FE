import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../components/path";

const ProtectedRoute: React.FC = () => {
  // 1. 로컬스토리지에서 토큰이 있는지 검사합니다.
  const token = localStorage.getItem("access_token");

  // 2. 토큰이 없다면 비로그인 상태이므로 온보딩/로그인 화면으로 튕겨냅니다.
  if (!token) {
    return <Navigate to={PATH.ONBOARDING} replace />;
  }

  // 3. 토큰이 있다면 정상 로그인이 된 상태이므로, 자식 페이지들(홈, 게시판 등)을 보여줍니다.
  return <Outlet />;
};

// ⭕ index.tsx에서 <ProtectedRoute />로 깔끔하게 쓸 수 있도록 내보냅니다.
export default ProtectedRoute;