import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from '../http.js'
import userLogo from '../../assets/OIP.webp'
import {
  Button,
  TextField,
  Stack,
  Box,
} from "@mui/material";
import {useState} from 'react'

export function Creation (){
    const submit = async (e) =>{
            e.preventDefault()
            await http.post("/createUser", {
                "nom" : nom.value,
                "matricule" : matricule.value,
                "email" : email.value,
                "numero" : numero.value,
                "motDePasse" : motDePasse.value

            }).then(()=>{
                toast.success("l'agent est bien créé")
            })
            .catch((err) => {
                console.error(err);
            })
    } 
    return <>
          {/* POPUP TOAST */}
                 <ToastContainer
                    position="top-center"   // position
                    autoClose={3000}        // auto fermeture après 3s
                    hideProgressBar={true} //  barre de progression
                    newestOnTop={false}      // la notification le plus récent en haut
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
        <form onSubmit={submit}>
            <Stack spacing={3}>
                {/* Avatar */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                        src={userLogo}
                        alt="user"
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                        }}
                    />
                </Box>

                {/* Inputs en flex-wrap */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "space-between",
                        "& > *": {
                            flex: { xs: "1 1 100%", sm: "1 1 45%" }
                        }
                    }}
                >
                    <TextField
                        label="Nom"
                        name="nom"
                        id="nom"
                        type="text"
                        size="small"
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Matricule"
                        id="matricule"
                        type="text"
                        size="small"
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Email"
                        id="email"
                        type="text"
                        size="small"
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Numéro"
                        id="numero"
                        type="text"
                        size="small"
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Mot de passe"
                        id="motDePasse"
                        size="small"
                        type="password"
                        sx={{ flex: "1 1 100%" }}
                    />
                </Box>

                {/* BOUTON ENREGISTRER */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: "#7b1fa2",
                            px: 4,
                            "&:hover": { bgcolor: "#6a1b9a" }
                        }}
                    >
                        Creer
                    </Button>
                </Box>
            </Stack>
        </form>
    </>
}