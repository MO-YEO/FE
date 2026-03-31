// src/routes/protected-routes.ts
import { lazy } from "react";
import { PATH } from "../components/path";

// 컴포넌트 Lazy 로딩
const HomePage = lazy(() => import("../pages/home"));
const BoardPage = lazy(() => import("../pages/board/board"));
// ⚠️ 경로 확인: src/pages/board/boardDetail.tsx 파일이 맞는지 꼭 확인하세요!
const BoardDetailPage = lazy(() => import("../pages/board/boardDetail")); 
const ProjectPage = lazy(() => import("../pages/project/project"));
const NotFoundPage = lazy(() => import("../pages/notFound"));
const MyPage = lazy(() => import("../pages/my/my"));
const MyPostsPage = lazy(() => import("../pages/my/myPost"));
const MyLikePage = lazy(() => import("../pages/my/myLike"));
const MyScrapPage = lazy(() => import("../pages/my/myScrap"));
const MyAppliedProjectPage = lazy(() => import("../pages/my/myAppliedProject"));
const MemberPage = lazy(() => import("../pages/member"));
const SignupPage = lazy(() => import("../pages/signUp"));
const InquiryPage = lazy(() => import("../pages/Inquiry"));

export const protectedRoutes = [
  { path: PATH.HOME, Component: HomePage },
  { path: PATH.BOARD, Component: BoardPage },
  { path: PATH.BOARD_DETAIL, Component: BoardDetailPage }, // "/board/:id"
  { path: PATH.PROJECTS, Component: ProjectPage },
  { path: PATH.SIGNUP, Component: SignupPage },
  { path: PATH.MEMBER, Component: MemberPage },
  { path: PATH.MY, Component: MyPage },
  { path: PATH.MY_POSTS, Component: MyPostsPage },
  { path: PATH.MY_LIKE, Component: MyLikePage },
  { path: PATH.MY_SCRAP, Component: MyScrapPage },
  { path: PATH.MY_APPLIED_PROJECT, Component: MyAppliedProjectPage },
  { path: PATH.INQUIRY, Component: InquiryPage },
  { path: PATH.NOT_FOUND, Component: NotFoundPage },
];