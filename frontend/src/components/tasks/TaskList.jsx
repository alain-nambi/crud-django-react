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
  Select,
} from "@mantine/core";
import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file
import { useDisclosure } from "@mantine/hooks";
import AuthContext from "../../context/AuthContext";

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
      .post(`${serverUrl}/tasks/create/`, {
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
  const [statusName, setStatusName] = useState("");
  const { auth } = useContext(AuthContext);

  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const fetchTasks = () => {
    axios
      .get(`${serverUrl}/tasks/list/`)
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
    setStatusName(task.status.name); // Set initial statusId to the current status
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
        status_name: statusName, // Envoyer le nouvel ID du statut
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

  const statusOptions = [
    { value: "ongoing", label: "En cours" },
    { value: "blocked", label: "En blocage" },
    { value: "finished", label: "Terminé" },
  ];

  const setStatus = (status) => {
    if (status === "ongoing") return "En cours";
    if (status === "blocked") return "En blocage";
    if (status === "finished") return "Terminé";
  };

  return (
    <div className="task-list-container">
      <TaskCreation refreshTasks={fetchTasks} />
      <Text fw={600} mb={"md"} size="1.25rem">
        Liste des tâches
      </Text>
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
            <Group className="flex flex-col">
              <Text fw={500}>{task.title}</Text>
              <Text size="xs">{task.description}</Text>
              <Badge color={setColor(task.status.name)}>
                {setStatus(task.status.name)}
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

          <Select
            label="Modifier le statut"
            placeholder="Sélectionner le statut"
            data={statusOptions}
            value={statusName} // Use the statusId state here
            onChange={(value) => setStatusName(value)} // Update statusId when a status is selected
          />

          <Button color="blue" fullWidth onClick={handleUpdateTask}>
            Mettre à jour la tâche
          </Button>
        </div>
      </Modal>
    </div>
  );
};
