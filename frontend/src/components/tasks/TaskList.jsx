import React, { useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Card,
  Text,
  Textarea,
  Badge,
  Group,
} from "@mantine/core";
import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file

export const TaskCreation = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateTask = () => {
    if (title.trim() === "" || description.trim() === "") return;
    axios
      .post(`${serverUrl}/tasks/create`, {
        title,
        description,
        user: user.id,
      })
      .then((response) => {
        console.log(response);
        refreshTasks(); // Refresh task list after creating a new task
        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCreateTask()
    }
  } 

  return (
    <div className="flex flex-col gap-4 p-4 w-96">
      <TextInput
        label="Nom de la tâche"
        placeholder="ex: Créer un bouton de sauvegarde"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Textarea
        label="Description de la tâche"
        placeholder="ex: Couleur du bouton en vert"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button fullWidth onClick={handleCreateTask}>
        Créer une tâche
      </Button>
    </div>
  );
};

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    axios
      .get(`${serverUrl}/tasks/list`)
      .then((response) => {
        console.log(response);
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const setColor = (status) => {
    if (status === "ongoing") return "blue";
    if (status === "blocked") return "red";
    if (status === "finished") return "green";
  };

  return (
    <div className="task-list-container">
      <TaskCreation refreshTasks={fetchTasks} />
      <div className="task-list-grid">
        {tasks.map((task, index) => (
          <Card
            className="task-card"
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            key={index}
            style={{ cursor: "pointer" }}
          >
            <Group className="flex justify-between">
              <Text fw={500}>{task.title}</Text>
              <Badge color={setColor(task.status.name)}>
                {task.status.name}
              </Badge>
            </Group>
          </Card>
        ))}
      </div>
    </div>
  );
};
