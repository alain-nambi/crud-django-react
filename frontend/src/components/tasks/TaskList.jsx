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
  HoverCard,
  Avatar,
  Stack,
  Anchor,
} from "@mantine/core";
import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file
import { useDisclosure } from "@mantine/hooks";
import AuthContext from "../../context/AuthContext";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useContext(AuthContext);

  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  // console.log(auth);

  const fetchTasks = () => {
    axios
      .get(`${serverUrl}/tasks/list/`, { params: { user_id: auth.user.id } })
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
        status_name: statusName, // Send the new status name
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

  const handleDeleteTask = (task_id) => {
    axios
      .delete(`${serverUrl}/tasks/delete/`, {
        data: { task_id: task_id, user_id: auth.user.id },
      })
      .then((response) => {
        console.log(response);
        fetchTasks(); // Refresh task list after deleting a task
        closeEdit(); // Close the edit modal
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [timeoutId, setTimeoutId] = useState(null);

  const handleSearchTask = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const id = setTimeout(() => {
      axios
        .post(`${serverUrl}/tasks/search/`, {
          user_id: auth.user.id,
          q_search: query,
        })
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    setTimeoutId(id);
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

      <TextInput
        className="mb-6"
        placeholder="Rechercher par le nom de la tâche / par description"
        leftSection={<IconSearch size={18} />}
        onChange={handleSearchTask}
        value={searchQuery} // Bind value to searchQuery state
      />

      <Text fw={600} mb={"md"} size="1.25rem">
        Liste des tâches
      </Text>

      <div className="task-list-grid">
        {tasks.map((task, index) => (
          <HoverCard withArrow key={index}>
            <HoverCard.Target>
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
                  <Badge color={setColor(task.status.name)}>
                    {setStatus(task.status.name)}
                  </Badge>
                </Group>
              </Card>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group>
                <div className="flex flex-col gap-4 p-4 w-96">
                  <TextInput
                    label="Nom de la tâche"
                    value={task.title}
                    disabled
                  />

                  <TextInput
                    label="Description de la tâche"
                    value={task.description}
                    disabled
                  />

                  <Text size="sm">
                    Status de la tâche
                  </Text>

                  <Badge color={setColor(task.status.name)}>
                    {setStatus(task.status.name)}
                  </Badge>
                </div>
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
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
            value={statusName} // Use the statusName state here
            onChange={(value) => setStatusName(value)} // Update statusName when a status is selected
            searchable
          />

          <div className="flex gap-2">
            <Button
              color="red"
              onClick={() => handleDeleteTask(selectedTask.id)} // Pass the task ID to handleDeleteTask
              title="Supprimer la tâche"
            >
              <IconTrash />
            </Button>

            <Button color="blue" fullWidth onClick={handleUpdateTask}>
              Mettre à jour la tâche
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
