import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "@/App";

// Import your module route arrays
import { erpRoutes } from "./Routing/unix.routes";
 
// UI Components
import Loader from "./Components/Global/Loader.jsx";
import Landing from "./Views/LandingPage/Landingpage";
const Error404 = lazy(() => import("./Components/Global/Error404"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App.jsx wraps all children below
    children: [
      
         // 🟢 Landing Page
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Landing />
          </Suspense>
        ),
      },
      // 2. ERP Module Routes
      ...erpRoutes,
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <Error404 />
      </Suspense>
    ),
  },
]);