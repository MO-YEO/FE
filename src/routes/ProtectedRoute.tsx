// 1. react에서 lazy와 함께 타입들을 불러옵니다.
import { lazy, type LazyExoticComponent, type ComponentType } from "react"; 
import { PATH } from "../components/path";

// 만약 위에서 계속 에러가 난다면 아래처럼 'import type'을 써보세요.
// import { lazy } from "react";
// import type { LazyExoticComponent, ComponentType } from "react";

// 2. 라우트 객체를 위한 타입 정의
interface RouteConfig {
  path: string;
  // React.ComponentType으로 써도 무방합니다.
  Component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
}

// --- 이하 동일 ---
const HomePage = lazy(() => import("../pages/home"));
const BoardPage = lazy(() => import("../pages/board"));
const ProjectPage = lazy(() => import("../pages/project/project"));
const MyPage = lazy(() => import("../pages/my/my"));
const MyPostPage = lazy(() => import("../pages/my/myPost"));
const NotFoundPage = lazy(() => import("../pages/notFound"));

export const protectedRoutes: RouteConfig[] = [
  { path: PATH.HOME, Component: HomePage },
  { path: PATH.BOARD, Component: BoardPage },
  { path: PATH.PROJECTS, Component: ProjectPage },
  { path: PATH.MY, Component: MyPage },
  { path: PATH.MY_POSTS, Component: MyPostPage },
  { path: PATH.NOT_FOUND, Component: NotFoundPage },
];

export default protectedRoutes;