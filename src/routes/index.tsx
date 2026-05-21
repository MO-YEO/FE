import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public-routes";
import { protectedRoutes } from "./protected-routes";
import MobileLayout from "../layouts/mobileLayout";
import ProtectedRoute from "./ProtectedRoute"; // ⭕ 보안 자물쇠 컴포넌트 임포트
import NotFoundPage from "../pages/notFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      // 1. 🔓 로그인 없이 누구나 접근 가능한 공개 라우트 그룹
      // (온보딩, 로그인, 소셜 로그인 콜백 /oauth/callback, 회원가입 /signUp 등)
      ...publicRoutes,
      
      // 2. 🔒 로그인(토큰)이 필수인 보호된 라우트 그룹
      // 로컬스토리지에 토큰이 없으면 진입을 차단하고 온보딩으로 강제 이송시킵니다.
      {
        element: <ProtectedRoute />,
        children: protectedRoutes.map((route) => ({
          path: route.path,
          element: <route.Component />,
        })),
      },
      
      // 3. ❌ 상기 지정된 모든 규칙(공개/보호)에 걸리지 않는 완전히 엉뚱한 주소만 404 처리
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);