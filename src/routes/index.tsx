import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public-routes";
import { protectedRoutes } from "./protected-routes";
import MobileLayout from "../layouts/mobileLayout";
import NotFoundPage from "../pages/notFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      // 1. 🔓공개 라우트 목록 (온보딩, 로그인, 소셜 로그인 콜백, 회원가입 페이지 등)
      ...publicRoutes,
      
      // 2. 🔒보호된 라우트 목록 (홈, 게시판, 마이페이지 등)
      ...protectedRoutes,
      
      // 3. ❌지정되지 않은 모든 엉뚱한 주소는 404 페이지로 리다이렉트
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);