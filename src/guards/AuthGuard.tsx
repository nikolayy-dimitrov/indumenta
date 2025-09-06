import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoadingIndicator } from "../components/UI/LoadingIndicator.tsx";

const AuthGuard: React.FC = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingIndicator/>;
    }

    if (user) {
        return <Navigate to="/profile" replace/>;
    }

    return <Outlet/>;
};

export default AuthGuard;
