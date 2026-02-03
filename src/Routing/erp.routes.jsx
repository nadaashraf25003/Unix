import { authRoutes } from "./auth.routes";


import { lazy, Suspense } from "react";
import Loader from "@/Components/Global/Loader";
import CampusNavigation from "@/Views/CampusNavigation/pages/CampusNavigation";

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
      {
        path: "auth",
        element: (
          <Suspense fallback={<Loader />}>
            <AuthLayout />
          </Suspense>
        ),
        children: authRoutes,
      },
      {
        path: "campus",
        element: (
          <Suspense fallback={<Loader />}>
            <CampusNavigation />
          </Suspense>
        ),
        children: authRoutes,
      },
    ],
  },
];
