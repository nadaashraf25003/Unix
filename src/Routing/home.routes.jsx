// routes/student.routes.ts
import LostAndFoundUserPage from "@/Views/LostFound/LostFound";
import { lazy } from "react";

const Home = lazy(() => import("@/views/Home/Home"));
const Rooms = lazy(() => import("@/views/Rooms/Rooms"));
  const Projects = lazy(() => import("@/views/Graduation/Graduation"));
const Drivers = lazy(() => import("@/views/Drivers/Drivers"));
const ExamSchedule = lazy(() => import("@/views/ExamTable"));
export const studentProtectedRoutes = [
  { index: true, element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "rooms", element: <Rooms /> },
  { path: "lost-found", element: <LostAndFoundUserPage /> },
  { path: "drivers", element: <Drivers /> },
  { path: "graduation", element: <Projects /> },
  { path: "exam-schedule", element: <ExamSchedule /> },
];
