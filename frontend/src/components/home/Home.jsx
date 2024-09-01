import React, { useContext } from "react";
import { Button, TextInput } from "@mantine/core";
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
    <>
      <div className="home-container flex flex-col gap-6">
        <TaskList />

        <Button
          className="logout-button"
          onClick={handleSignOff}
          leftSection={<IconLogout size={24} />}
        >
          Se déconnecter
        </Button>
      </div>
    </>
  );
};

export default Home;
