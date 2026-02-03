import ProtectedRoute from '@/utils/RequireAuth';
import CampusNavigation from '@/Views/CampusNavigation/pages/CampusNavigation';

const CampusRoutes = [
  {
    path: "campus-navigation",
    element: (
      // <ProtectedRoute allowedRoles={["Student"]}>
        <CampusNavigation />
      // </ProtectedRoute>
    ),
  },
];

export default CampusRoutes;
