import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {LoadingIndicator} from "../components/LoadingIndicator.tsx";

const GuestGuard: React.FC = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    // Otherwise, render the nested routes/components
    return <Outlet />;
};

export default GuestGuard;
