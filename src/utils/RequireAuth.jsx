import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "@/API/token";

const ProtectedRoute = () => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/erp/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
