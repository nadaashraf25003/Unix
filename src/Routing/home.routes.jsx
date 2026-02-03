// routes/student.routes.ts
import { lazy } from "react";

const Home = lazy(() => import("@/views/Home/Home"));
const Rooms = lazy(() => import("@/views/Rooms/Rooms"));
const LostFound = lazy(() => import("@/views/LostFound/LostFound"));
const Drivers = lazy(() => import("@/views/Drivers/Drivers"));
const Projects = lazy(() => import("@/views/Graduation/Graduation"));

export const studentProtectedRoutes = [
  { index: true, element: <Home /> },
  { path: "home", element: <Home /> },
  { path: "rooms", element: <Rooms /> },
  { path: "lost-found", element: <LostFound /> },
  { path: "drivers", element: <Drivers /> },
  { path: "graduation", element: <Projects /> },
];
