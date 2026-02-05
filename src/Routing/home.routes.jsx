// home.routes.jsx
import { lazy, Suspense } from "react";
import Home from "@/views/Home/Home";
import Rooms from "@/views/Rooms/Rooms";
import CampusNavigation from "@/Views/CampusNavigation/pages/CampusNavigation";
import LostAndFoundUserPage from "@/Views/LostFound/LostFound";
import Drivers from "@/views/Drivers/Drivers";
import ExamSchedule from "@/views/ExamTable";
import Loader from "@/Components/Global/Loader";
const DepartmentsPage = lazy(
  () => import("@/Views/LandingPage/DepartmentsPage"),
);
export const homeRoutes = [
  {
    path: "departments",
    element: (
      <Suspense fallback={<Loader />}>
        <DepartmentsPage />
      </Suspense>
    ),
  },
  { index: true, element: <Home /> },
  { path: "campus-navigation", element: <CampusNavigation /> },
  { path: "rooms", element: <Rooms /> },
  { path: "lost-found", element: <LostAndFoundUserPage /> },
  { path: "drivers", element: <Drivers /> },
  { path: "graduation", element: <CampusNavigation /> },
  { path: "exam-schedule", element: <ExamSchedule /> },
];
