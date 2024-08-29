import React, { useState } from "react";
import { TextInput, PasswordInput, Text, Button, Image } from "@mantine/core";
import { IconLock, IconAt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import "./styles.css";
import Logo from "../../assets/Logo-Blueline.jpg";
import { serverUrl } from "../../constants/env";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event);

    fetch(`${serverUrl}/accounts/signin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { user, token } = data;
        console.log(data);
        if (user && token) {
          // console.log(user);
          // console.log(location.href);
          location.href = "/home";
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-auto p-8 bg-white shadow-lg rounded-md">
          <Image radius="md" src={Logo} w={100} h={100} />

          <Text size="lg" fw={600} align="center">
            Bienvenue sur votre application de gestion des tâches
          </Text>

          <Text size="md" color="dimmed" align="center">
            Veuillez vous connecter pour accéder à votre liste de tâches.
          </Text>

          {/* <TextInput
          label="Nom d'utilisateur"
          description="Saisissez le nom d'utilisateur associée à votre compte"
          placeholder="ex: Alain Nambii"
          leftSection={
            <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
          }
          required
        /> */}

          <TextInput
            label="Adresse email"
            description="Saisissez l'adresse email associée à votre compte"
            placeholder="ex: alainnambi.work@gmail.com"
            leftSection={
              <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
            }
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <PasswordInput
            label="Mot de passe"
            description="Entrez votre mot de passe sécurisé"
            placeholder="••••••••••••"
            leftSection={
              <IconLock style={{ width: 18, height: 18 }} stroke={1.5} />
            }
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          <Button variant="filled" color="#D20B34" type="submit" fullWidth>
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
      </form>
    </div>
  );
};

export default SignIn;
