import React, { useContext, useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Card,
  Text,
  Textarea,
  Badge,
  Group,
  Modal,
} from "@mantine/core";
import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file
import { useDisclosure } from "@mantine/hooks";
import AuthContext from "../../context/AuthContext"

// TaskCreation Component
export const TaskCreation = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Used in modals
  const [opened, { open, close }] = useDisclosure(false);

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
        close(); // Close the modal
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTask();
    }
  };

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Création d'une tâche">
        <div className="flex flex-col gap-4 p-4 w-96">
          <TextInput
            label="Nom de la tâche"
            description="Saisissez le nom de la tâche..."
            placeholder="ex: Créer un bouton de sauvegarde"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
          <Textarea
            label="Description de la tâche"
            description="Saisissez la description de la tâche..."
            placeholder="ex: Couleur du bouton en vert"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />
          <Button color="blue" fullWidth onClick={handleCreateTask}>
            Création de la tâche
          </Button>
        </div>
      </Modal>

      <Button onClick={open} className="mb-6">
        Créer une tâche
      </Button>
    </div>
  );
};

// TaskList Component
export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { auth } = useContext(AuthContext)

  // console.log('auth', auth);

  // const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const fetchTasks = () => {
    axios
      .get(`${serverUrl}/tasks/list`)
      .then((response) => {
        console.log(response);
        const sortedTasks = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setTasks(sortedTasks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    openEdit();
  };

  const handleUpdateTask = () => {
    if (title.trim() === "" || description.trim() === "") return;
    axios
      .put(`${serverUrl}/tasks/update/`, {
        title: title,
        description: description,
        user_id: auth.user.id,
        task_id: selectedTask.id,
        status: selectedTask.status.id
      })
      .then((response) => {
        console.log(response);
        fetchTasks(); // Refresh task list after updating a task
        closeEdit(); // Close the edit modal
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
            onClick={() => handleEditClick(task)}
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

      {/* Edit Task Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Modifier la tâche">
        <div className="flex flex-col gap-4 p-4 w-96">
          <TextInput
            label="Nom de la tâche"
            description="Saisissez le nom de la tâche..."
            placeholder="ex: Créer un bouton de sauvegarde"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description de la tâche"
            description="Saisissez la description de la tâche..."
            placeholder="ex: Couleur du bouton en vert"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button color="blue" fullWidth onClick={handleUpdateTask}>
            Mettre à jour la tâche
          </Button>
        </div>
      </Modal>
    </div>
  );
};
