import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "context";

const RequiresAuth = () => {
  const location = useLocation();
  const { user } = useAuth();
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export { RequiresAuth };
