import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import { PATH } from "../components/path";

interface RouteConfig {
  path: string;
  Component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
}

const OnboardingPage = lazy(() => import("../pages/onBoarding"));
const LoginPage = lazy(() => import("../pages/login"));
const OAuthCallback = lazy(() => import("../pages/OAuthCallback"));
const SignupPage = lazy(() => import("../pages/signUp")); // 🔓 퍼블릭으로 안전하게 이동 완료

export const publicRoutes: RouteConfig[] = [
  { path: PATH.ONBOARDING, Component: OnboardingPage },
  { path: PATH.LOGIN, Component: LoginPage },
  { path: "/oauth/callback", Component: OAuthCallback }, // 정석 콜백 주소
  { path: PATH.SIGNUP, Component: SignupPage },          // 가입 주소
];