// home.routes.jsx
import { lazy, Suspense } from "react";
import Home from "@/Views/Home/Home.jsx";
import Rooms from "@/Views/Rooms/Rooms";
import LostAndFoundUserPage from "@/Views/LostFound/LostFound";
import Drivers from "@/Views/Drivers/Drivers";
import ExamSchedule from "@/Views/ExamTable";
import Loader from "@/Components/Global/Loader";
import GraduationProject from "@/Views/Graduation/GraduationProject";
import StudentProfile from "@/Views/Student/StudentProfile";
import NotificationsPage from "@/Views/Student/NotificationsPage";
const StudentSchedule = lazy(() => import("@/Views/Schedule/Schedule"));

// all routes for student after login protected
export const homeRoutes = [
  { index: true, element: <Home /> },
  { path: "profile", element: <StudentProfile /> },
  { path: "graduation", element: <GraduationProject /> },
  { path: "drivers", element: <Drivers /> },
  { path: "lost-found", element: <LostAndFoundUserPage /> },
  { path: "rooms", element: <Rooms /> },
  { path: "exam-schedule", element: <ExamSchedule /> },
  { path: "schedule", element: <StudentSchedule /> },
  { path: "notifications", element: <NotificationsPage /> },
];
