import React, { useState } from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions} from "@mui/material";
import http from '../http.js'
import userLogo from '../../assets/OIP.webp'
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


export function MyComponent(){
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({})
    const handleOpen = (row) => {
        setData = {
            "id" : row.data,
            "nom"  : row.name,
            "matricule" : row.matricule,
            "email" : row.email,
            "motDdepasse" : row.motDdepasse
        }
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const submit = () =>{

    } 

    return (
        <div>
            {/* Bouton pour ouvrir le composant */}
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Ouvrir le formulaire
            </Button>

            {/* Composant qui s'affiche */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Formulaire</DialogTitle>
                <DialogContent>
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
                                name="nom"
                                type="text"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <PersonIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Matricule */}
                            <TextField
                                label="Matricule"
                                name="matr"
                                type="text"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <NumbersIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Email */}
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <EmailIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Numéro */}
                            <TextField
                                label="Numéro"
                                name="num"
                                type="tel"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <PhoneIphoneIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Mot de passe */}
                            <TextField
                                label="Mot de passe"
                                name="pass"
                                type="password"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <LockIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Confirmation */}
                            <TextField
                                label="Confirmez le mot de passe"
                                name="confPass"
                                type="password"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <CheckCircleIcon sx={{ mr: 1, color: "#1976d2" }} />
                                    ),
                                }}
                                sx={{
                                    bgcolor: "#fafafa",
                                    borderRadius: 2,
                                }}
                            />


                            {/* BOUTON */}
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: "#1976d2",
                                    borderRadius: 3,
                                    py: 1,
                                    textTransform: "none",
                                    "&:hover": { bgcolor: "#1565c0" },
                                    boxShadow: "0 3px 10px rgba(25,118,210,0.3)",
                                }}
                            >
                                Inscription
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={() => { alert("Envoyé !"); handleClose(); }} color="primary">
                        Envoyer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
