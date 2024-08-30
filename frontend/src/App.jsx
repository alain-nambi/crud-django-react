import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import SignUp from "./components/user/SignUp.jsx";
import SignIn from "./components/user/SignIn.jsx";
import Home from "./components/home/Home.jsx";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <div className="flex items-center justify-center h-screen">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to={"/home"} />} />
              <Route path="*" element={<SignIn />} />{" "}
              {/* Redirect to SignIn by default */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}
