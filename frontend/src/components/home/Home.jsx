import React, { useContext } from 'react'
import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import AuthContext from "../../context/AuthContext"

const Home = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleSignOff = (e) => {
    e.preventDefault()
    logout()
    navigate('/signin')
  }

  return (
    <div>
      <p>Bienvenu dans la page d'acceuil</p>
      <Button onClick={handleSignOff}>Déconnecter</Button>
    </div>
  )
}

export default Home
