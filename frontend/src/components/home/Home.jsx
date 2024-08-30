import React, { useContext } from 'react';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";
import './styles.css'; // Import the CSS file for smooth styling

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleSignOff = (e) => {
    e.preventDefault();
    logout();
    navigate('/signin');
  };

  return (
    <div className="home-container">
      <p className="welcome-text">Bienvenue dans la page d'accueil</p>
      <Button className="logout-button" onClick={handleSignOff}>Déconnecter</Button>
    </div>
  );
};

export default Home;
