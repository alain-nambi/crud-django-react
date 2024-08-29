import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Text,
  Button,
  Image,
  Stack,
} from "@mantine/core";
import { IconLock, IconAt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo-Blueline.jpg";
import { serverUrl } from "../../constants/env";

const SignUp = () => {
  const [visible, { toggle }] = useDisclosure(false);
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event);

    console.log(`${serverUrl}/accounts/signup/`);

    fetch(`${serverUrl}/accounts/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: confirmPassword
      })
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-auto h-auto p-8 bg-white shadow-lg rounded-md">
          <Image radius="md" src={Logo} w={100} h={100} />

          <Text size="lg" fw={600} align="center">
            Inscrivez-vous pour commencer à gérer vos tâches
          </Text>

          <Text size="md" color="dimmed" align="center">
            Créez un compte pour accéder à votre liste de tâches.
          </Text>

          <TextInput
            label="Nom d'utilisateur"
            description="Saisissez votre nom d'utilisateur que vous souhaitez utiliser"
            placeholder="ex: Alain Nambii"
            leftSection={
              <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
            }
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />

          <TextInput
            label="Adresse email"
            description="Saisissez l'adresse email que vous souhaitez utiliser"
            placeholder="ex: alainnambi.work@gmail.com"
            leftSection={
              <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
            }
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />

          <Stack>
            <PasswordInput
              label="Mot de passe"
              description="Créez un mot de passe sécurisé"
              placeholder="••••••••••••"
              leftSection={
                <IconLock style={{ width: 18, height: 18 }} stroke={1.5} />
              }
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <PasswordInput
              label="Confirmer votre mot de passe"
              description="Retaper votre mot de passe sécurisé"
              placeholder="••••••••••••"
              leftSection={
                <IconLock style={{ width: 18, height: 18 }} stroke={1.5} />
              }
              visible={visible}
              onVisibilityChange={toggle}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </Stack>

          <Button variant="filled" color="#D20B34" type="submit" fullWidth>
            S'inscrire
          </Button>

          <Text color="dimmed" align="center" className="text-sm">
            Vous avez déjà un compte?{" "}
            <Link to="/signin" style={{ color: "#D20B34" }}>
              Connectez-vous ici
            </Link>
            .
          </Text>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
