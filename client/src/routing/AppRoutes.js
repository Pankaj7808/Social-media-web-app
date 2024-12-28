import React from "react";
import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import PageNotFound from "../pages/PageNotFound";
import Auth from "../pages/Auth";
import Layout from "../pages/Layout";

const PrivateRoute = ({ children, isLoggedIn }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => state?.app?.auth?.isLoggedIn);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<h5>Loading....</h5>}>
        <Routes>
          {/* Redirect /login and / to /home if logged in */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Auth />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Auth />}
          />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Layout />
              </PrivateRoute>
            }
          />

          {/* Fallback for unmatched routes */}
          <Route path="*" name="Not Found" element={<PageNotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
