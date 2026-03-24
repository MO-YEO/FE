// src/components/path.ts (이미지 5 기반 픽스)
export const PATH = {
  // 1. Public (로그인 전 접속 가능)
  ONBOARDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signUp",

  // 2. Protected (로그인이 필요한 메인 메뉴)
  HOME: "/home",
  BOARD: "/board",
  PROJECTS: "/project", // 파일 이름인 projects.tsx와 주소 일치

  // 3. MyPage (pages/my/ 서브 폴더 구조 반영)
  MY: "/my",
  MY_POSTS: "/my/posts", // pages/my/myPost.tsx 로 라우팅

  MEMBER: "/member", // 팀원 페이지도 PATH에 추가 (추후 구현 예정)

  // 4. Error
  NOT_FOUND: "*",
} as const;
