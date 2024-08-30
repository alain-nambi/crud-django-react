import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext)
    return auth.token ? children : <Navigate to={"/signin"} />
}

export default ProtectedRoute
