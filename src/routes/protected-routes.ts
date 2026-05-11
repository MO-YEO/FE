import { lazy } from "react";
import { PATH } from "../components/path";

// 컴포넌트 Lazy 로딩
const HomePage = lazy(() => import("../pages/home"));
const BoardPage = lazy(() => import("../pages/board/board"));
// ✅ 상세 페이지 컴포넌트 임포트 확인 (파일명 주의!)
const BoardDetailPage = lazy(() => import("../pages/board/boardDetail")); 
const ProjectPage = lazy(() => import("../pages/project/project"));
const MyPage = lazy(() => import("../pages/my/my"));
const MyPostsPage = lazy(() => import("../pages/my/myPost"));
const MyLikePage = lazy(() => import("../pages/my/myLike"));
const MyScrapPage = lazy(() => import("../pages/my/myScrap"));
const MyAppliedProjectPage = lazy(() => import("../pages/my/myAppliedProject"));
const MyRecruitedProjectsPage = lazy(() => import("../pages/my/myRecruitedProject"));
const MyApplicantsPage = lazy(() => import("../pages/my/myApplicants"));
const MyParticipatedProjectsPage = lazy(() => import("../pages/my/myParticipatedProject"));
const MemberPage = lazy(() => import("../pages/member"));
const SignupPage = lazy(() => import("../pages/signUp"));
const InquiryPage = lazy(() => import("../pages/Inquiry"));
const NotFoundPage = lazy(() => import("../pages/notFound"));

export const protectedRoutes = [
  {
    path: PATH.HOME,
    Component: HomePage,
  },
  {
    path: PATH.BOARD,
    Component: BoardPage,
  },
  // ✅ 여기에 상세 페이지 라우트를 명시적으로 추가해야 합니다!
  {
    path: PATH.BOARD_DETAIL, // "/board/:id"
    Component: BoardDetailPage,
  },
  {
    path: PATH.PROJECTS,
    Component: ProjectPage,
  },
  {
    path: PATH.SIGNUP,
    Component: SignupPage,
  },
  {
    path: PATH.MEMBER,
    Component: MemberPage,
  },
  {
    path: PATH.MY,
    Component: MyPage,
  },
  {
    path: PATH.MY_POSTS,
    Component: MyPostsPage,
  },
  {
    path: PATH.MY_LIKE,
    Component: MyLikePage,
  },
  {
    path: PATH.MY_SCRAP,
    Component: MyScrapPage,
  },
  {
    path: PATH.MY_APPLIED_PROJECT,
    Component: MyAppliedProjectPage,
  },
  {
    path: PATH.MY_RECRUITED_PROJECTS,
    Component: MyRecruitedProjectsPage,
  },
  {
    path: PATH.MY_APPLICANTS,
    Component: MyApplicantsPage,
  },
  {
    path: PATH.MY_PARTICIPATED_PROJECTS,
    Component: MyParticipatedProjectsPage,
  },
  {
    path: PATH.INQUIRY,
    Component: InquiryPage,
  },
  // ⚠️ 중요: 모든 구체적인 경로 다음에 와야 합니다.
  {
    path: PATH.NOT_FOUND, // "*"
    Component: NotFoundPage,
  },
];