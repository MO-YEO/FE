// src/routes/protected-routes.ts (이미지 5 기반 픽스)
import { lazy } from 'react';
import { PATH } from '../components/path';

// 1. pages/ 루트 폴더 파일들
const HomePage = lazy(() => import('../pages/home'));
const BoardPage = lazy(() => import('../pages/board'));
const ProjectPage = lazy(() => import('../pages/project/project')); // projects.tsx
const NotFoundPage = lazy(() => import('../pages/notFound')); // notFound.tsx
const MyPage = lazy(() => import('../pages/my/my')); // pages/my/my.tsx
const MyPostsPage = lazy(() => import('../pages/my/myPost')); // pages/my/myPost.tsx
// 2. 추후 구현 예정 (주석 유지)
// const MemberPage = lazy(() => import("../pages/member/member"));
// const MemberApplyPage = lazy(() => import("../pages/member/memberApply"));
// const ProjectUploadPage = lazy(() => import("../pages/project/projectUpload"));
// const ProjectApplyPage = lazy(() => import("../pages/project/projectApply"));

export const protectedRoutes = [
  {
    path: PATH.HOME,
    Component: HomePage,
  },
  {
    path: PATH.BOARD,
    Component: BoardPage,
  },
  {
    path: PATH.PROJECTS,
    Component: ProjectPage,
  },
  // MyPage 서브 라우팅
  {
    path: PATH.MY,
    Component: MyPage,
  },
  {
    path: PATH.MY_POSTS,
    Component: MyPostsPage,
  },
  // 404 페이지도 로그인 한 사람에게 보여주도록 Protected에 추가
  {
    path: PATH.NOT_FOUND,
    Component: NotFoundPage,
  },
];