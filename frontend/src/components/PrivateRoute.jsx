import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { serverUrl } from "../constants/env";

const PrivateRoute = ({ children }) => {
  const [isAuthentificated, setIsAuthentificated] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (token) {
      axios
        .post(`${serverUrl}/accounts/validate-token`, { token, user })
        .then((response) => {
          if (response.status === 200) {
            setIsAuthentificated(true);
          } else {
            setIsAuthentificated(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsAuthentificated(false);
          localStorage.removeItem("token");
        });
    } else {
      setIsAuthentificated(false);
    }
  }, [token]);

  if (isAuthentificated === null) {
    return <div>En cours de chargement...</div>;
  }

  return isAuthentificated ? children : <Navigate to={"/signin"} />;
};

export default PrivateRoute;
