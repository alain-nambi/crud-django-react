import React, { useContext } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./styles.css"; // Import the CSS file for smooth styling
import { TaskCreation, TaskList } from "../tasks/TaskList";
import {
  IconLock,
  IconAt,
  IconSortAscending,
  IconSortDescending,
  IconLogout,
} from "@tabler/icons-react";

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
      <div className="home-container">
        <div
          style={{
            width: "300px",
            height: "100vh",
            border: "1px solid gray",
            position: "relative",
          }}
        >
          <Button
            className="logout-button"
            onClick={handleSignOff}
            leftSection={<IconLogout size={24} />}
            style={{ width: "232px" }}
          >
            Se déconnecter
          </Button>
        </div>
        <div>
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Home;
