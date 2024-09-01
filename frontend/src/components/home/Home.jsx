import React, { useContext, useEffect } from "react";
import { Button, TextInput, Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./styles.css"; // Import the CSS file for smooth styling
import { TaskList } from "../tasks/TaskList";
import {
  IconLock,
  IconAt,
  IconSortAscending,
  IconSortDescending,
  IconLogout,
} from "@tabler/icons-react";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { logout, auth } = useContext(AuthContext);

  useEffect(() => {
    toast.success(
      `Utilisateur ${auth.user.username} est connecté sur l'application`,
      {
        position: "top-center",
        autoClose: 2000,
      }
    );
  });

  const handleSignOff = (e) => {
    e.preventDefault();
    logout();
    navigate("/signin");
  };

  return (
    <>
      <div className="home-container flex flex-col gap-6">
        <TaskList />

        <div className="flex items-center absolute top-0 right-0">
          <Avatar
            color="blue"
            key={auth.user.username}
            name={auth.user.username}
            title={auth.user.username}
            style={{ cursor: "pointer" }}
          ></Avatar>

          <Button
            className="logout-button"
            onClick={handleSignOff}
            leftSection={<IconLogout size={24} />}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
