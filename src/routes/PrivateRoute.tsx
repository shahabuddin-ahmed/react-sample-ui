import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("accessToken");
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
