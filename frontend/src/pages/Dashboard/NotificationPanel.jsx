import React from "react";
import {useState} from "react";
import { Box, Stack, TextField, Typography, Button, Checkbox} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import http from '../http.js'
import { ToastContainer, toast } from "react-toastify";

const iconMap = {
  SUCCESS: {
    icon: <CheckCircleIcon color="success" />,
    bg: "#e8f5e9"
  },
  ERROR: {
    icon: <ErrorIcon color="error" />,
    bg: "#fdecea"
  },
  WARNING: {
    icon: <WarningIcon color="warning" />,
    bg: "#fff4e5"
  },
  INFO: {
    icon: <InfoIcon color="info" />,
    bg: "#e3f2fd"
  }
};

const NotificationPanel = ({ data }) => {
  if (!data) return null;

  const {
    type = "INFO",
    title,
    content = {},
    message = "Pas de notification pour le moment.",
    session=""
  } = data;

  const sendCodeValidation = async (session, code) => {
    //TODO securiser le code a envoyer
            console.log(session + " " + code)
            await http.post("/sendLogin", {
                "session" : session, 
                "login"   : code,
            }).then(()=>{
                toast.success("code de validation envoyé")
            })
            .catch((err) => {
                toast.error("err.response.data");
            })
  }

  const { icon, bg } = iconMap[type];
  const [input, setInput] = useState("");
  const write = (e) => {
    setInput(e.target.value)
  } 

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: bg,
        border: "1px solid #ddd"
      }}
    >
      {/* POPUP TOAST */}
      <ToastContainer
          position="top-center"   // ici tu choisis la position
          autoClose={3000}        // auto fermeture après 3s
          hideProgressBar={true} // si tu veux la barre de progression
          newestOnTop={false}      // le toast le plus récent en haut
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
      />
      {icon}
      {
        title=="Demande de validation"?
      (<Box>
        {title && (
          <Typography fontWeight="bold" mb={0.5}>
            {title}
          </Typography>
        )}
        <Typography variant="body2">
          {message}
        </Typography>
        <Stack
          sx={{
            gap:2
          }}
        >
          <Typography>nom : {content.nom}</Typography>
          <Typography>email : {content.email}</Typography>
          <Typography>matrccule : {content.matricule}</Typography>
          <Typography>numero : {content.numero}</Typography>

          <TextField
            placeholder="le code de validation"
            onChange={write}
            value={input}
          />
          
          <Button
            variant="contained"
            onClick={() => sendCodeValidation(session, input)}
            sx={{
              color:"white",
              bgcolor:"blue"
            }}
          >
            valider
          </Button>
          <Box
            sx={{
              display:"flex",
              alignItems:"center",
              gap:2
            }}
          >
          <Typography>Marquer comme lu</Typography>
          <Checkbox sx={{
            borderRadius:"50%",
            width:20,
            height:20
          }}/>
          </Box>
        </Stack>
        
      </Box>)
      :message
      }

    </Box>
  );
};

export default NotificationPanel;
