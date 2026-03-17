import { lazy } from "react";
import { PATH } from "../components/path";

const HomePage = lazy(() => import("../pages/home"));
//const BoardPage = lazy(() => import('../pages/Board'));
//const MemberFindPage = lazy(() => import('../pages/MemberFind'));
const ProjectPage = lazy(() => import("../pages/projects"));
//const SignupPage = lazy(() => import('../pages/Signup')); // 가입 후 최초 프로필 설정 등

export const protectedRoutes = [
  {
    path: PATH.HOME,
    Component: HomePage,
  },
  //   {
  //     path: PATH.BOARD,
  //     Component: BoardPage,
  //   },
  //   {
  //     path: PATH.MEMBER_FIND,
  //     Component: MemberFindPage,
  //   },
  {
    path: PATH.PROJECTS,
    Component: ProjectPage,
  },
  //   {
  //     path: PATH.SIGNUP,
  //     Component: SignupPage,
  //   },
];
