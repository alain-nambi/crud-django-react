import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth.token && auth.user ? children : <Navigate to={"/signin"} />;
};

export default ProtectedRoute;
