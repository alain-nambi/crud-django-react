import React from "react";
import {
  TextInput,
  PasswordInput,
  Text,
  Button,
  Image,
} from "@mantine/core";
import { IconLock, IconAt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import "./styles.css";
import Logo from "../../assets/Logo-Blueline.jpg";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-6 w-96 p-8 bg-white shadow-lg rounded-md">
        <Image
          radius="md"
          src={Logo}
          w={100}
          h={100}
        />

        <Text size="lg" fw={600} align="center">
          Bienvenue sur votre application de gestion des tâches
        </Text>

        <Text size="md" color="dimmed" align="center">
          Veuillez vous connecter pour accéder à votre liste de tâches.
        </Text>

        <TextInput
          label="Adresse email"
          description="Saisissez l'adresse email associée à votre compte"
          placeholder="ex: alainnambi.work@gmail.com"
          leftSection={
            <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
          }
          required
        />

        <PasswordInput
          label="Mot de passe"
          description="Entrez votre mot de passe sécurisé"
          placeholder="••••••••••••"
          leftSection={
            <IconLock style={{ width: 18, height: 18 }} stroke={1.5} />
          }
          required
        />

        <Button variant="filled" color="#D20B34" fullWidth>
          Se connecter
        </Button>

        <Text color="dimmed" align="center" className="text-sm">
          Vous n'avez pas encore de compte ?{" "}
          <Link to="/signup" style={{ color: "#D20B34" }}>
            Inscrivez-vous ici{" "}
          </Link>
          .
        </Text>
      </div>
    </div>
  );
};

export default SignIn;
