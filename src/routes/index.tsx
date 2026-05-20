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
      ...publicRoutes,
      ...protectedRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);