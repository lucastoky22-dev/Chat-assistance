import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"

const VisitorForm = () =>{
    const [email, setEmail] = useState();
    const goto = useNavigate();
        const aff = (str) => {
            goto("/"+str)
        }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const submit = (e) =>{
        e.preventDefault();
        toast.info("hello " + email);
        emailRegex.test(email)? aff("CliChat"):console.log("invalid email"); 
    }
    return(
     <>
    <div
        style={{
                fontFamily: "Inter, sans-serif",
                background: "#1f1e1f",
                minHeight: "100vh",
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
                     <form
                         onSubmit={(e) => submit(e)}
                         noValidate
                         autoComplete="off"
                         style={{ width: "100%" }}
                     >
                         <Stack spacing={3}>


                             {/* Champ mot de passe */}
                             <TextField
                                 label="Email"
                                 variant="outlined"
                                 type="email"
                                 name="pass"
                                 id="pass"
                                 size="small"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 InputProps={{
                                     endAdornment: (
                                         <LockIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                                     ),
                                 }}
                                 sx={{
                                     bgcolor: "#3a3a3a",
                                     borderRadius: 2,
                                     input: { color: "#f0f0f0" },
                                     "& .MuiOutlinedInput-root": {
                                         "& fieldset": { borderColor: "#555555" },
                                         "&:hover fieldset": { borderColor: "#888888" },
                                         "&.Mui-focused fieldset": { borderColor: "#1e90ff" },
                                     },
                                 }}
                             />
                           

                             <Button
                                 type="submit"
                                 variant="contained"
                                 size="medium"
                                 endIcon={<LoginIcon />}
                                 sx={{
                                     bgcolor: "#3fc2d680",
                                     borderRadius: 3,
                                     py: 1.2,
                                     fontWeight: 600,
                                     color: "#fff"
                                 }}
                             >
                                 Ok
                             </Button>

                         </Stack>
                     </form>
            </Paper>
        </Box>
    </div>
    </>
);

}
export default VisitorForm;