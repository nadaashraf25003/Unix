// routes/admin.routes.ts

import { lazy } from "react";
import CampusNavigation from "@/Views/CampusNavigation/pages/CampusNavigation";
import AdminProfile from "@/Views/Admin/AdminProfile";

const AdminDashboard = lazy(() => import("@/Views/Admin/AdminDashboard"));
const ScheduleManagment = lazy(() => import("@/Views/Admin/ScheduleManager"));
const DriversManagment = lazy(() => import("@/Views/Admin/DriversManagment"));
const UserManager = lazy(() => import("@/Views/Admin/AdminUsersPage"));
const Departments = lazy(() => import("@/Views/Admin/Department"));
const Sections = lazy(() => import("@/Views/Admin/Sections"));
const Courses = lazy(() => import("@/Views/Admin/Coursemanage"));
const Instructors = lazy(() => import("@/Views/Admin/InstructorManager"));
const Projects = lazy(() => import("@/Views/Admin/ProjectManager"));
const ExamSchedule = lazy(() => import("@/Views/Admin/ExamSchedule"));
const LostFound = lazy(() => import("@/Views/Admin/LostAndFoundAdminPage"));

export const adminProtectedRoutes = [
  { index: true, element: <AdminDashboard /> },
  { path: "adminprofile", element: <AdminProfile /> },
  { path: "dashboard", element: <AdminDashboard /> },
  { path: "schedulemang", element: <ScheduleManagment /> },
  { path: "driversmang", element: <DriversManagment /> },
  { path: "users", element: <UserManager /> },
  { path: "departments", element: <Departments /> },
  { path: "sections", element: <Sections /> },
  { path: "courses", element: <Courses /> },
  { path: "instructors", element: <Instructors /> },
  { path: "projects", element: <Projects /> },
  { path: "examsmange", element: <ExamSchedule /> },
  { path: "lost-found-Admin", element: <LostFound /> },
  { path: "campus-navigation", element: <CampusNavigation /> },
];
