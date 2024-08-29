import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from "./components/user/SignUp.jsx";
import SignIn from "./components/user/SignIn.jsx";
import Home from "./components/home/Home.jsx";

export default function App() {
  return (
    <MantineProvider>
    <Router>
        <div className="flex items-center justify-center h-screen">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<SignIn />} />  {/* Redirect to SignIn by default */}
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </MantineProvider>
  );
}
