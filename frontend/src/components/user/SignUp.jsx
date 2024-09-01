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
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader } from "../effect/Loader";

const SignUp = () => {
  const [visible, { toggle }] = useDisclosure(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const resetInputFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    if (!emailRegex.test(email)) {
      toast.error(
        "L'adresse email saisie n'est pas valide. Veuillez réessayer."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.warning(
        "Les mots de passe ne correspondent pas. Veuillez confirmer votre mot de passe correctement."
      );
      setLoading(false);
      return;
    }

    axios
      .post(`${serverUrl}/accounts/signup/`, {
        username: username,
        email: email,
        password: confirmPassword,
      })
      .then((response) => {
        console.log(response);

        const {
          status,
          data: { message },
        } = response;

        if (status === 201) {
          toast.success(message);

          setTimeout(() => {
            navigate("/signin");
            setLoading(false);
          }, 2000);
        }

        // resetInputFields();
      })
      .catch((error) => {
        console.log(error);

        // console.log("DEBUGGING RESPONSE ERROR");
        // console.log(error.response.data);

        const { message, email } = error.response.data;

        // console.log(email);

        if (message) {
          toast.error(message);
        }

        if (email) {
          toast.error(email[0]);
        }

        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <Loader />
      ) : (
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
      )}
    </div>
  );
};

export default SignUp;
