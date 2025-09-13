import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import CampaignList from "../pages/Campaign/List";
import CampaignDetails from "../pages/Campaign/Details";
import CampaignCreate from "../pages/Campaign/Create";

const RegistrationPage = lazy(() => import("../pages/Auth/Registration"));
const LoginPage = lazy(() => import("../pages/Auth/Login"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const RoutePagesComponent: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) window.scrollTo(0, 0);
    }, [location]);

    return (
        <Suspense fallback={"Loading..."}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected block */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<CampaignList />} />
                        <Route path="/campaigns/new" element={<CampaignCreate />} />
                        <Route path="/campaign/:id" element={<CampaignDetails />} />
                        {/* add more protected routes here */}
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AnimatePresence>
        </Suspense>
    );
};

export default RoutePagesComponent;
