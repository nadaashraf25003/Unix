// routes/shared.routes.ts
import { lazy } from "react";

const CampusMap = lazy(() => import("@/views/CampusMap/Campus"));
const StudentSchedule = lazy(() => import("@/views/Schedule/Schedule"));

export const sharedPublicRoutes = [
  { path: "campus-map", element: <CampusMap /> },
  { path: "schedule", element: <StudentSchedule /> },
];
