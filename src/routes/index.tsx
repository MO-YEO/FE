import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public-routes";
import MobileLayout from "../layouts/mobileLayout";
import NotFoundPage from "../pages/notFound";
import { protectedRoutes } from "./protected-routes";
import ProtectedLayout from "../layouts/protectedLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MobileLayout />,
    children: [
      ...publicRoutes,
      {
        element: <ProtectedLayout />,
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
