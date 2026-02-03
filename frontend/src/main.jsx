//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Inscription from './pages/Inscription/Inscription.jsx'
import Connexion from './pages/Connexion/Connexion.jsx'
import AgentChatRoom from './pages/AgentInterface/agentChatRoom.jsx'
import ClientLogin from './pages/Visiteur/ClientLogin.jsx'
import ClientChat from './pages/Visiteur/ClientChat.jsx'
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

const router = createBrowserRouter([
  {
    path    : "/",
    element : <Connexion/>
  },
  {
    path    : "/connexion",
    element : <Connexion/>
  },
  {
    path    : "/inscription",
    element : <Inscription/>
  },
  {
    path    : "/dashboard",
    element : <Dashboard/>
  },
  {
    path    : "/agentChatRoom",
    element : <AgentChatRoom/> 
  },
  {
    path : "/DGi-chat",
    element:<ClientLogin/>
  },
  {
    path : "/Clichat",
    element:<ClientChat/>
  }
])


createRoot(document.getElementById('root')).render(
   <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
)
