import { lazy } from "react";
import { PATH } from "../components/path";

const HomePage = lazy(() => import("../pages/home"));
const BoardPage = lazy(() => import("../pages/board"));
//const MemberFindPage = lazy(() => import('../pages/MemberFind'));
const ProjectPage = lazy(() => import("../pages/projects"));
const SignupPage = lazy(() => import("../pages/signUp"));
const MyPage = lazy(() => import("../pages/MyPage"));
const MyPostsPage = lazy(() => import("../pages/MyPostsPage"));

export const protectedRoutes = [
  {
    path: PATH.HOME,
    Component: HomePage,
  },
  {
    path: PATH.BOARD,
    Component: BoardPage,
  },
  //   {
  //     path: PATH.MEMBER_FIND,
  //     Component: MemberFindPage,
  //   },
  {
    path: PATH.PROJECTS,
    Component: ProjectPage,
  },
  {
    path: PATH.SIGNUP,
    Component: SignupPage,
  },
  {
    path: PATH.MY,
    Component: MyPage,
  },
  {
    path: PATH.MYPOSTS,
    Component: MyPostsPage,
  },
];
