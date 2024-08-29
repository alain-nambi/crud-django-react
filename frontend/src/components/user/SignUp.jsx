import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { 
  TextInput, 
  PasswordInput, 
  Text, 
  Button, 
  Image,
  Stack
} from "@mantine/core";
import { IconLock, IconAt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo-Blueline.jpg";

const SignUp = () => {  
  const [visible, { toggle }] = useDisclosure(false)


  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-6 w-96 p-8 bg-white shadow-lg rounded-md">
        <Image radius="md" src={Logo} w={100} h={100} />

        <Text size="lg" fw={600} align="center">
          Inscrivez-vous pour commencer à gérer vos tâches
        </Text>

        <Text size="md" color="dimmed" align="center">
          Créez un compte pour accéder à votre liste de tâches.
        </Text>

        <TextInput
          label="Adresse email"
          description="Saisissez l'adresse email que vous souhaitez utiliser"
          placeholder="ex: alainnambi.work@gmail.com"
          leftSection={
            <IconAt style={{ width: 18, height: 18 }} stroke={1.5} />
          }
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
            required
          />
        </Stack>

        

        <Button variant="filled" color="#D20B34" fullWidth>
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
    </div>
  );
};

export default SignUp;
