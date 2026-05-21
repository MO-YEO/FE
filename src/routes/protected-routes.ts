import { lazy, type LazyExoticComponent, type ComponentType } from "react"; 
import { PATH } from "../components/path";

// 1. 라우트 객체를 위한 타입 정의
interface RouteConfig {
  path: string;
  Component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
}

// 2. 페이지 컴포넌트 Lazy Loading (재범님 원본 변수명 100% 동일)
const HomePage = lazy(() => import("../pages/home"));
const BoardPage = lazy(() => import("../pages/board/board"));
const BoardDetailPage = lazy(() => import("../pages/board/boardDetail"));
const ProjectPage = lazy(() => import("../pages/project/project"));

const MyPage = lazy(() => import("../pages/my/my"));
const MyPostsPage = lazy(() => import("../pages/my/myPost")); // 원본 명칭 유지
const MyLikePage = lazy(() => import("../pages/my/myLike"));
const MyScrapPage = lazy(() => import("../pages/my/myScrap"));
const MyAppliedProjectPage = lazy(() => import("../pages/my/myAppliedProject"));
const MyRecruitedProjectsPage = lazy(() => import("../pages/my/myRecruitedProject"));
const MyApplicantsPage = lazy(() => import("../pages/my/myApplicants"));
const MyParticipatedProjectsPage = lazy(() => import("../pages/my/myParticipatedProject"));

const MemberPage = lazy(() => import("../pages/member"));
const InquiryPage = lazy(() => import("../pages/Inquiry"));

// 3. 보호된 라우트 목록 구성 (가입과 404만 제외하고 원본 매칭 유지)
export const protectedRoutes: RouteConfig[] = [
  { path: PATH.HOME, Component: HomePage },
  { path: PATH.BOARD, Component: BoardPage },
  { path: PATH.BOARD_DETAIL, Component: BoardDetailPage },
  { path: PATH.PROJECTS, Component: ProjectPage },
  { path: PATH.MEMBER, Component: MemberPage },
  { path: PATH.INQUIRY, Component: InquiryPage },
  
  // 마이페이지 관련 전체 복구
  { path: PATH.MY, Component: MyPage },
  { path: PATH.MY_POSTS, Component: MyPostsPage },
  { path: PATH.MY_LIKE, Component: MyLikePage },
  { path: PATH.MY_SCRAP, Component: MyScrapPage },
  { path: PATH.MY_APPLIED_PROJECT, Component: MyAppliedProjectPage },
  { path: PATH.MY_RECRUITED_PROJECTS, Component: MyRecruitedProjectsPage },
  { path: PATH.MY_APPLICANTS, Component: MyApplicantsPage },
  { path: PATH.MY_PARTICIPATED_PROJECTS, Component: MyParticipatedProjectsPage },
];

export default protectedRoutes;