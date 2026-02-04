import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "@/API/token";
import { ROUTES } from "@/Routing/routePaths";

const ProtectedRoute = () => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
