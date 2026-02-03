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

export function MiseAJour(data){

    const submit = (e) =>{
        e.preventDefault()
        toast.success("congraltulation")
    } 

    return <>
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
                        type="text"
                        size="small"
                        value={data.nom}
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Matricule"
                        type="text"
                        size="small"
                        value={data.matricule}
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Email"
                        type="text"
                        size="small"
                        value={data.email}
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Numéro"
                        type="text"
                        size="small"
                        value={data.numero}
                        sx={{ flex: "1 1 45%" }}
                    />

                    <TextField
                        label="Mot de passe"
                        size="small"
                        type="password"
                        value={data.motDePasse}
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
                        Enregistrer
                    </Button>
                </Box>
            </Stack>
        </form>
    </>
}
