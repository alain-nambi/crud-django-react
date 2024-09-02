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
  NumberInput,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";

import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file
import { useDisclosure } from "@mantine/hooks";
import AuthContext from "../../context/AuthContext";
import {
  IconCalendar,
  IconCalendarStats,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

import "@mantine/dates/styles.css";
import { toast } from "react-toastify";

// TaskCreation Component
export const TaskCreation = ({ refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(1);
  const [dueDate, setDueDate] = useState(null);

  const [opened, { open, close }] = useDisclosure(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleCreateTask = () => {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      !dueDate ||
      !estimatedTime
    ) {
      toast.error("Veuillez remplir toutes les champs requis");
      return
    }
    axios
      .post(`${serverUrl}/tasks/create/`, {
        title,
        description,
        user: user.id,
        estimated_time: estimatedTime * 3600,
        due_date: dueDate,
      })
      .then((response) => {
        console.log(response);

        const { title } = response.data;

        toast.success(`La tâche ${title} a été créé avec succès`, {
          position: "top-center",
          autoClose: 2000,
        });

        refreshTasks(); // Refresh task list after creating a new task
        setTitle("");
        setDescription("");
        setEstimatedTime("");
        setDueDate(null);
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
      <Modal opened={opened} onClose={close} title="Création d'une tâche" centered>
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

          <NumberInput
            decimalSeparator=","
            label="Temps estimé (en heure)"
            description="Saisissez le temps estimé"
            placeholder="ex: 2,5"
            defaultValue={1}
            value={estimatedTime}
            onChange={(value) => setEstimatedTime(value)}
            precision={2}
            step={0.5}
            required
          />

          <DateInput
            label="Date d'échéance estimé"
            description="Saisissez le date d'écheance estimé"
            placeholder="ex: 23 September 2024"
            valueFormat="DD MMMM YYYY"
            value={dueDate}
            onChange={(value) => setDueDate(value)}
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
  const [estimatedTime, setEstimatedTime] = useState(1);
  const [dueDate, setDueDate] = useState(null);
  const { auth } = useContext(AuthContext);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  // console.log(auth);

  // Fetch tasks with URL parameters
  const fetchTasks = () => {
    const params = new URLSearchParams({
      user_id: auth.user.id,
      status: selectedStatus,
      sort_order: sortOrder,
      search_query: searchQuery,
    });

    axios
      .get(`${serverUrl}/tasks/list/?${params.toString()}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Update URL parameters
  const updateURLParams = () => {
    const params = new URLSearchParams({
      status: selectedStatus,
      sort_order: sortOrder,
      search_query: searchQuery,
    });

    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  // Read URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedStatus(params.get("status") || "");
    setSortOrder(params.get("sort_order") || "");
    setSearchQuery(params.get("search_query") || "");

    fetchTasks();
  }, []);

  // Fetch tasks when filters or search query change
  useEffect(() => {
    updateURLParams();
    fetchTasks();
  }, [selectedStatus, sortOrder, searchQuery]);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setEstimatedTime(convertTimeToDecimalHours(task.estimated_time));
    setDueDate(task.due_date);
    setDescription(task.description);
    setStatusName(task.status.name); // Set initial statusId to the current status
    openEdit();
  };

  const handleUpdateTask = () => {
    if (title.trim() === "" || description.trim() === "") {
      toast.error("Veuillez remplir toutes les champs requis");
      return
    };
    axios
      .put(`${serverUrl}/tasks/update/`, {
        title: title,
        description: description,
        user_id: auth.user.id,
        task_id: selectedTask.id,
        status_name: statusName, // Send the new status name
        estimated_time: estimatedTime * 3600,
        due_date: dueDate,
      })
      .then((response) => {
        console.log(response);

        const { message } = response.data;
        toast.success(message, { position: "top-center", autoClose: 2000 });

        fetchTasks(); // Refresh task list after updating a task
        closeEdit(); // Close the edit modal
      })
      .catch((error) => {
        toast.error(error.data.message);

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

        const { message } = response.data;
        toast.success(message, { position: "top-center", autoClose: 2000 });

        fetchTasks(); // Refresh task list after deleting a task
        closeEdit(); // Close the edit modal
      })
      .catch((error) => {
        toast.error(error.message);
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

  const formatDateToFrench = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return formatter.format(date);
  };

  const convertTimeToDecimalHours = (timeString) => {
    if (timeString != 1 && timeString !== null) {
      // Split the timeString by ':' to extract hours, minutes, and seconds
      const [hours, minutes, seconds] = timeString.split(":").map(Number);

      // Convert minutes and seconds to a fraction of an hour
      const decimalHours = hours + minutes / 60 + seconds / 3600;

      // Return the decimal hours, formatted to 2 decimal places
      return decimalHours.toFixed(2);
    }
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
    <>
      <div className="task-list-container">
        <TaskCreation refreshTasks={fetchTasks} />

        <Text fw={600} mb={"md"} size="1.25rem">
          Liste des fonctionnalités
        </Text>

        <div className="flex">
          <Text mb={"sm"} className="py-2 px-4 text-red-500 border border-red-500 rounded-md">
            Bordure rouge : La date d'écheance a été dépassé
          </Text>
        </div>


        <div className="flex gap-4 items-center mb-6">
          <TextInput
            label="Recherche"
            description="Faite une recherche par rapport au nom ou description de la tâche"
            placeholder="Saisissez le nom de tâche"
            leftSection={<IconSearch size={18} />}
            onChange={handleSearchTask}
            value={searchQuery} // Bind value to searchQuery state
          />

          <Select
            label="Filtre par status"
            description="Faites une filtre par rapport aux status"
            placeholder="Sélectionner le status"
            data={statusOptions}
            clearable
            value={selectedStatus}
            onChange={handleStatusChange}
            searchable
          />

          <Select
            label="Trier de A à Z"
            description="Faites une tri par rapport à l'ordre"
            placeholder="Sélectionner un ordre"
            data={[
              { value: "A-Z", label: "De A à Z" },
              { value: "Z-A", label: "De Z à A" },
            ]}
            clearable
            value={sortOrder}
            onChange={handleSortOrderChange}
            searchable
          />
        </div>

        <Text fw={600} mb={"md"} size="1.25rem">
          {tasks.length > 0
            ? "Liste des tâches"
            : "Veuillez créer une tâche pour voir la liste des tâches"}
        </Text>

        <div className="task-list-grid">
          {tasks.map((task, index) => (
            <HoverCard withArrow key={index} openDelay={50} closeDelay={0}>
              <HoverCard.Target>
                <Card
                  className={`task-card border ${task.created_at > task.due_date ? 'border-red-500' : ''}`}
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

                    <Badge color={"red"} variant="dot">
                      {formatDateToFrench(task.due_date)}
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

                    <Textarea
                      label="Description de la tâche"
                      value={task.description}
                      disabled
                    />

                    <div className="flex gap-6 justify-between">
                      <Text size="sm" fw={500}>
                        Status de la tâche
                      </Text>

                      <Badge color={setColor(task.status.name)}>
                        {setStatus(task.status.name)}
                      </Badge>
                    </div>

                    <div className="flex gap-6 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <IconCalendar size={23} />
                        <Text size="sm" fw={500}>
                          Durée estimée (en heures)
                        </Text>
                      </div>

                      <Badge color="green" variant="dot">
                        <Text size="xs">{task.estimated_time}</Text>
                      </Badge>
                    </div>

                    <div className="flex gap-6 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <IconCalendarStats size={23} />
                        <Text size="sm" fw={500}>
                          {"Date d'échéance estimée"}
                        </Text>
                      </div>

                      <Badge color="red" variant="outline">
                        <Text size="xs">
                          {formatDateToFrench(task.due_date)}
                        </Text>
                      </Badge>
                    </div>
                  </div>
                </Group>
              </HoverCard.Dropdown>
            </HoverCard>
          ))}
        </div>

        {/* Edit Task Modal */}
        <Modal
          opened={openedEdit}
          onClose={closeEdit}
          title="Modifier la tâche"
          centered
        >
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

            <NumberInput
              decimalSeparator=","
              label="Temps estimé (en heure)"
              description="Saisissez le temps estimé"
              placeholder="ex: 2,5"
              defaultValue={1}
              value={estimatedTime}
              onChange={(value) => setEstimatedTime(value)}
              precision={2}
              step={0.5}
              required
            />

            <DateInput
              label="Date d'échéance estimé"
              description="Saisissez la date d'échéance estimée"
              placeholder="ex: 23 September 2024"
              value={dueDate !== null && new Date(dueDate)} // This should be a Date object or null
              onChange={(value) => setDueDate(value)} // Make sure this value is being handled correctly
              required
            />

            <div className="flex gap-2">
              <Button
                color="red"
                onClick={() => handleDeleteTask(selectedTask.id)} // Pass the task ID to handleDeleteTask
                title={`Supprimer la tâche ${title}`}
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
    </>
  );
};
