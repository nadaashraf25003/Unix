import { lazy } from "react";

const Login = lazy(() => import("@/Views/Auth/Login"));
const Register = lazy(() => import("@/Views/Auth/Register"));
const ForgetPassword = lazy(() => import("@/Views/Auth/ForgetPassword"));
const ResetPassword = lazy(() => import("@/Views/Auth/ResetPassword"));
const ResendVerification = lazy(() => import("@/Views/Auth/ResendVerification"));
const VerifyEmail = lazy(() => import("@/Views/Auth/VerifyEmail"));


export const authRoutes = [
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "forgot-password", element: <ForgetPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "resend-verification", element: <ResendVerification /> },
  { path: "verify-email", element: <VerifyEmail /> },

];
