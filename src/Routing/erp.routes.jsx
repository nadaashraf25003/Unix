import { lazy, Suspense } from "react";
import Loader from "@/Components/Global/Loader";
import ProtectedRoute from "@/utils/RequireAuth.jsx";

import { authRoutes } from "./auth.routes";
import { sharedPublicRoutes } from "./PublicRoutes";
import { studentProtectedRoutes } from "./home.routes";
import { adminProtectedRoutes } from "./admin.routes";

const ERPLayout = lazy(() => import("@/Views/ERPLayout"));
const AuthLayout = lazy(() => import("@/Views/Auth/AuthLayout"));

export const erpRoutes = [
  {
    path: "erp",
    element: (
      <Suspense fallback={<Loader />}>
        <ERPLayout />
      </Suspense>
    ),
    children: [
      // 🔓 PUBLIC ROUTES (no login)
      ...sharedPublicRoutes,

      // 🔓 AUTH (public)
      {
        path: "auth",
        element: (
          <Suspense fallback={<Loader />}>
            <AuthLayout />
          </Suspense>
        ),
        children: authRoutes,
      },

      // 🔐 PROTECTED ROUTES
      {
        element: <ProtectedRoute />,
        children: [
          ...studentProtectedRoutes,
          ...adminProtectedRoutes,
        ],
      },
    ],
  },
];
