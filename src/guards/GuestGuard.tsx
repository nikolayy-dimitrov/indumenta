import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GuestGuard: React.FC = () => {
    const { user } = useContext(AuthContext);

    // If user is not logged in, redirect to login page
    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    // Otherwise, render the nested routes/components
    return <Outlet />;
};

export default GuestGuard;
