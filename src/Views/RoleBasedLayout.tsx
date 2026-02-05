// utils/RoleBasedLayout.jsx
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "@/Components/Global/Loader";

const AdminLayout = lazy(() => import("@/Views/AdminLayout"));
const StudentLayout = lazy(() => import("@/Views/StudentLayout"));

const RoleBasedLayout = () => {
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  // user.role = "Admin" | "Student"

  if (user?.role === "Student") {
    return (
      <Suspense fallback={<Loader />}>
        <StudentLayout />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<Loader />}>
      <AdminLayout />
    </Suspense>
  );
};

export default RoleBasedLayout;
