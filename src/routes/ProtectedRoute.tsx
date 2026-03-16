import { Navigate, Outlet } from 'react-router-dom';
//import { PATH } from '../constants/path';
// 실제 구현하실 유저 상태 확인 커스텀 훅 (예시)
//import { useMe } from '../hooks/auth/useMe'; 

// export default function ProtectedRoute() {
//   const { data: user, isLoading, isError } = useMe();

//   if (isLoading) return <div>로딩 중...</div>; // 로딩 애니메이션 위치

//   // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
//   if (isError || !user) {
//     return <Navigate to={PATH.LOGIN} replace />;
//   }

//   return <Outlet />;
// }