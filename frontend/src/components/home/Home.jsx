import React, { useContext } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./styles.css"; // Import the CSS file for smooth styling
import { TaskCreation, TaskList } from "../tasks/TaskList";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSignOff = (e) => {
    e.preventDefault();
    logout();
    navigate("/signin");
  };

  return (
    <div>
      <TaskList />
      <div className="home-container">
        <Button className="logout-button" onClick={handleSignOff}>
          Déconnecter
        </Button>
      </div>
    </div>
  );
};

export default Home;
