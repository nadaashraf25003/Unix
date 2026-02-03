import CampusNavigation from "@/pages/CampusNavigation/CampusNavigation";
import ProtectedRoute from "@/Auth/ProtectedRoute";
import CampusNavigation from '@/Views/CampusNavigation/pages/CampusNavigation';

const CampusRoutes = [
  {
    path: "/campus-navigation",
    element: (
    //   <ProtectedRoute allowedRoles={["Student"]}>
        <CampusNavigation />
    //   </ProtectedRoute>
    ),
  },
];

export default CampusRoutes;
