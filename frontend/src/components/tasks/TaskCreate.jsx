import React, { useState } from "react";
import {
  TextInput,
  Button,
  Textarea,
  Modal,
  NumberInput,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";

import axios from "axios";
import { serverUrl } from "../../constants/env";
import "./styles.css"; // Import the CSS file
import { useDisclosure } from "@mantine/hooks";

import "@mantine/dates/styles.css";
import { toast } from "react-toastify";

// TaskCreation Component
export const TaskCreate = ({ refreshTasks }) => {
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
      return;
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
      <Modal
        opened={opened}
        onClose={close}
        title="Création d'une tâche"
        centered
      >
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
