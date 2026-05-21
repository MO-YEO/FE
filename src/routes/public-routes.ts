import { lazy, type LazyExoticComponent, type ComponentType } from "react";
import { PATH } from "../components/path";

interface RouteConfig {
  path: string;
  Component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
}

const OnboardingPage = lazy(() => import("../pages/onBoarding"));
const LoginPage = lazy(() => import("../pages/login"));
const OAuthCallback = lazy(() => import("../pages/OAuthCallback"));
const SignupPage = lazy(() => import("../pages/signUp"));

export const publicRoutes: RouteConfig[] = [
  { path: PATH.ONBOARDING, Component: OnboardingPage },
  { path: PATH.LOGIN, Component: LoginPage },
  { path: "/oauth/callback", Component: OAuthCallback }, 
  { path: PATH.SIGNUP, Component: SignupPage },          
];