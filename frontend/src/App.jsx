import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/user/SignUp.jsx";
import SignIn from "./components/user/SignIn.jsx";
import Home from "./components/home/Home.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/signin"
              element={
                <AuthRedirect>
                  <SignIn />
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect>
                  <SignUp />
                </AuthRedirect>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to={"/home"} />} />
            <Route path="*" element={<Navigate to={"/home"} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

function AuthRedirect({ children }) {
  const { auth } = useContext(AuthContext);

  if (auth.token) {
    return <Navigate to="/home" />;
  }

  return children;
}
