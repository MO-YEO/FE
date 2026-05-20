import { lazy } from 'react';
import { PATH } from '../components/path';

const OnboardingPage = lazy(() => import('../pages/onBoarding'));
const LoginPage = lazy(() => import('../pages/login'));
const OAuthCallback = lazy(() => import('../pages/OAuthCallback'));

export const publicRoutes = [
  { path: PATH.ONBOARDING, Component: OnboardingPage },
  { path: PATH.LOGIN, Component: LoginPage },
  // ⭕ 정석 주소와 백엔드 오타 주소를 둘 다 등록해서 404 에러를 원천 차단합니다!
  { path: "/oauth/callback", Component: OAuthCallback },
  { path: "/outh/callback", Component: OAuthCallback }, 
];