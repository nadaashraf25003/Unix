// home.routes.jsx
import { lazy, Suspense } from "react";
import Home from "@/views/Home/Home";
import Rooms from "@/views/Rooms/Rooms";
import LostAndFoundUserPage from "@/Views/LostFound/LostFound";
import Drivers from "@/views/Drivers/Drivers";
import ExamSchedule from "@/views/ExamTable";
import Loader from "@/Components/Global/Loader";
import GraduationProject from "@/Views/Graduation/GraduationProject";
import StudentProfile from "@/Views/Student/StudentProfile";
const StudentSchedule = lazy(() => import("@/views/Schedule/Schedule"));

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
];
