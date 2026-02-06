// routes/shared.routes.ts
import Loader from "@/Components/Global/Loader";
import { lazy, Suspense } from "react";
import CampusNavigation from "@/Views/CampusNavigation/pages/CampusNavigation";

const CampusMap = lazy(() => import("@/views/CampusMap/Campus"));
const DepartmentsPage = lazy(
  () => import("@/Views/LandingPage/DepartmentsPage"),
);
export const sharedPublicRoutes = [
  {
    path: "departments",
    element: (
      <Suspense fallback={<Loader />}>
        <DepartmentsPage />
      </Suspense>
    ),
  },
  { path: "campus-navigation", element: <CampusNavigation /> },
  { path: "campus-map", element: <CampusMap /> },

];
