import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoadingIndicator } from "../components/UI/LoadingIndicator.tsx";

const GuestGuard: React.FC = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    if (!user) {
        return <Navigate to="/authentication" replace/>;
    }

    return <Outlet/>;
};

export default GuestGuard;
