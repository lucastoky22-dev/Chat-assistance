import { useState , useRef, useEffect} from "react"
import http from '../http.js'
import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import userLogo from '../../assets/OIP.webp'
import { useNavigate } from "react-router-dom"
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inscription = () =>{
    
    const [uxMessage, setUxMessage] = useState(""); 
    const stompClient  = useRef(null);
    const connectedRef = useRef(false); // empêche la double connexion
    const [session, setSession] = useState("");

    const goto = useNavigate();   

    const aff = (str) => {
        goto("/"+str)
    }

    const fieldStyle = {
        bgcolor: "#3a3a3a",
        borderRadius: 2,
        input: { color: "#f0f0f0" },
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555555" },
            "&:hover fieldset": { borderColor: "#888888" },
            "&.Mui-focused fieldset": { borderColor: "#1e90ff" },
        },
    }
    
    
    useEffect(() => {

            if (connectedRef.current) return; // <-- empêche la double connexion
    
            const socket = new SockJS(`/ws`);
            const client = new Client({
                webSocketFactory: () => socket,
                debug: (msg) => console.log(msg), // active les logs
                onConnect: () => onConnect(),
                onStompError: onError
            });
    
            stompClient.current = client;
            client.activate();
    
            connectedRef.current = true;
    
            // Nettoyage si composant détruit
            return () => {
                console.log("Cleanup WebSocket");
                client.deactivate();
                connectedRef.current = false;
            };
    
    });

    const onConnect = () => {
        //Abonement a l'api /topic/public et recuperation du message qui vient du serveur
        stompClient.current.subscribe("/user/" + session + "/subscribeSession", (message) => {
            alert("votre login de conénnexion est : " + message.body)
            toast.success("votre login de conénnexion est : " + message.body, {
                transition: Slide
            });
        });
    };

    const onError = () => {
        console.log("Erreur de connexion au WebSocket");
    };

    const submit = (e) =>{
        confPass.value!=pass.value?toast.info("confirmer votre mot de passe"):
            http.post("/createUser", {
                        "nom"        : nom.value,
                        "matricule"  : matr.value,
                        "numero"     : num.value,
                        "email"      : email.value,
                        "motDePasse" : pass.value,
                        "motDePasseConf" : confPass.value
                    }).then((res)=>{
                        setSession(res.data);
                        setUxMessage("");
                        console.log("response : " + res.data);
                        return res;
                    }).catch((err) =>{
                        //setUxMessage(err.response.data)
                        //toast.error(err.response.data)
                        console.log(uxMessage + "an error as occured")
            });
        e.preventDefault()
    }

    const gotoConn  = () =>{
        aff("connexion")
    }

    return (
    <>
        {/* Toast notifications */}
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

        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: " #1f1e1f",
                fontFamily: "Inter, sans-serif",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 5,
                    borderRadius: 4,
                    bgcolor: "#2a2a2a",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <form onSubmit={submit} style={{ width: "100%" }}>
                    <Stack spacing={2}>
                        <img
                            src={userLogo}
                            alt="user"
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 8,
                                margin: "0 auto",
                            }}
                        />
                        {/* NOM */}
                        <TextField
                            label="Nom"
                            id="nom"
                            type="text"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <PersonIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                            sx={fieldStyle}
                        />

                        {/* Matricule */}
                        <TextField
                            label="Matricule"
                            id="matr"
                            type="text"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <NumbersIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                             sx={fieldStyle}
                        />

                        {/* Email */}
                        <TextField
                            label="Email"
                            id="email"
                            type="email"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <EmailIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                             sx={fieldStyle}
                        />

                        {/* Numéro */}
                        <TextField
                            label="Numéro"
                            id="num"
                            type="tel"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <PhoneIphoneIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                             sx={fieldStyle}
                        />

                        {/* Mot de passe */}
                        <TextField
                            label="Mot de passe"
                            id="pass"
                            type="password"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <LockIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                             sx={fieldStyle}
                        />

                        {/* Confirmation */}
                        <TextField
                            label="Confirmez le mot de passe"
                            id="confPass"
                            type="password"
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <CheckCircleIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                ),
                            }}
                             sx={fieldStyle}
                        />

                        {/* Message d'erreur */}
                            {uxMessage == "" ? console.log() : (
                                <Typography
                                    variant="caption"
                                    align="center"
                                    sx={{ color: "red" }}
                                >
                                    {uxMessage}
                                </Typography>
                            )}

                        {/* BOUTON */}
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                bgcolor: "#3fc2d680",
                                borderRadius: 3,
                                py: 1.2,
                                fontWeight: 600,
                                color: "#fff",
                                "&:hover": { bgcolor: "#3fc2d680" },
                                boxShadow: "0 3px 10px rgba(7, 24, 42, 0.36)",
                            }}
                        >
                            Inscription
                        </Button>
                         <Typography
                                 variant="caption"
                                 align="center"
                                 sx={{ color: "white", margin:"1px"}}
                             >
                                 j'ai déja un compte? <span 
                                 onClick={gotoConn}
                                    style={{
                                        color:"#1070eef0", 
                                        cursor:"pointer"
                                    }} >se connecter</span>.
                             </Typography>
                    </Stack>
                </form>
            </Paper>
        </Box>
    </>
);


}

   

export default Inscription