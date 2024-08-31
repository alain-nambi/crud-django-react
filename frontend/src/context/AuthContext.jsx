import React, { createContext, useState, useEffect } from "react";
import { Loader } from "../components/effect/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setAuth({ token, user });
    }

    // Simulate a delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />;
      </div>
    ); // Display the loader while loading
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
