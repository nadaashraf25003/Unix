// routes/admin.routes.ts
 
import { lazy } from "react";

const AdminDashboard = lazy(() => import("@/views/Admin/AdminDashboard"));
 const ScheduleManagment = lazy(() => import("@/views/Admin/ScheduleManager"));
const DriversManagment = lazy(() => import("@/views/Admin/DriversManagment"));
const UserManager = lazy(() => import("@/views/Admin/UserManagement"));
const Departments = lazy(() => import("@/views/Admin/Department"));
const Sections = lazy(() => import("@/views/Admin/Sections"));
const Courses = lazy(() => import("@/views/Admin/Coursemanage"));
const Instructors = lazy(() => import("@/views/Admin/InstructorManager"));
export const adminProtectedRoutes = [
  { index: true, element: <AdminDashboard /> },
  { path: "dashboard", element: <AdminDashboard /> },
   { path: "schedulemang", element: <ScheduleManagment /> },
  { path: "drivers", element: <DriversManagment /> },
  { path: "users", element: <UserManager /> },
  { path: "departments", element: <Departments /> },
  { path: "sections", element: <Sections /> },
  { path: "courses", element: <Courses /> },
  { path: "instructors", element: <Instructors /> },

];
