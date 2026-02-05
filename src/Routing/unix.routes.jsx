import { lazy, Suspense } from "react";
import Loader from "@/Components/Global/Loader";
import ProtectedRoute from "@/utils/RequireAuth.jsx";
import { authRoutes } from "./auth.routes";
import { sharedPublicRoutes } from "./PublicRoutes";
import { homeRoutes } from "./home.routes";
import { adminProtectedRoutes } from "./admin.routes";
import CampusRoutes from "./campus.routes";

const RoleBasedLayout = lazy(() => import("@/Views/RoleBasedLayout"));
const AuthLayout = lazy(() => import("@/Views/Auth/AuthLayout"));

export const erpRoutes = [
  {
    path: "unix",
    element: (
      <Suspense fallback={<Loader />}>
        <RoleBasedLayout />
      </Suspense>
    ),
    children: [
      // 🔓 PUBLIC AUTH ROUTES (Login/Register)

      {
        path: "auth",
        element: (
          <Suspense fallback={<Loader />}>
            <AuthLayout />
          </Suspense>
        ),
        children: authRoutes, // ✅ هنا Login/Register وما يدخلش ProtectedRoute
      },

      //  PROTECTED ROUTES (Student/Admin)
      {
        element: <ProtectedRoute />,
        children: [...homeRoutes, ...adminProtectedRoutes],
      },

      ...CampusRoutes,
      ...sharedPublicRoutes,
    ],
  },
];
