import React, { type ComponentType, type FC } from "react";
import { Route, Navigate } from "react-router-dom";

interface PrivateRouteProps {
    component: ComponentType<any>;
    path?: string;
    exact?: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({
    component: Component,
    ...rest
}) => {
    const isAuthenticated = !!localStorage.getItem("accessToken");

    return (
        <Route
            {...rest}
            element={
                isAuthenticated ? (
                    <Component />
                ) : (
                    <Navigate to="/login" replace />
                )
            }
        />
    );
};

export default PrivateRoute;
