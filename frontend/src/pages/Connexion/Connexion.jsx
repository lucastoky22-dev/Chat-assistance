import axios from "axios"
import { useState } from "react"
import http from '../http.js'
import userLogo from '../../assets/OIP.webp'
import { useNavigate } from "react-router-dom"
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
import ReCAPTCHA from "react-google-recaptcha";

const Connexion = () =>{
    
    const [captchaToken, setCaptchaToken] = useState(null);
    const [statebutton, setStateButton]   = useState(false);
    const [uxMessage, setUxMessage]       = useState("");  
    const [matricule, setMatricule]       = useState("");
    const [password, setPassword]       = useState(""); 
    const [mtrError, setMtrError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const goto = useNavigate();
    const aff = (str) => {
        goto("/"+str)
    }
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&!^*()_\-+=\[\]{}:'",.<>\/\\|`~])(?!.*(123456|abcdef|qwerty|password|azerty))[A-Za-z\d@#$%&!^*()_\-+=\[\]{};:'",.<>\/\\|`~]{12,}$/;
    const validateMatricule = (matricule) => {
        if(matricule.length < 6){
            return "Le matricule doit contenir 6 chriffres";
        }
        if(/\D/.test(matricule)){
            return "Le matricule ne doit pas contenir d'autres caractères que des chiffres allant de 0 à 9";
        }
    }
    const validatePassword = (password) => {
        if (password.length < 12) {
            return "Le mot de passe doit contenir au moins 12 caractères";
        }
        if (!/[a-z]/.test(password)) {
            return "Ajoutez au moins une lettre minuscule";
        }
        if (!/[A-Z]/.test(password)) {
            return "Ajoutez au moins une lettre majuscule";
        }
        if (!/\d/.test(password)) {
            return "Ajoutez au moins un chiffre";
        }
        if (!/[@#$%&!^*()_\-+=\[\]{}:'",.<>\/\\|~]/.test(password)) {
            return "Ajoutez au moins un caractère spécial (@, #, $, %, &...)";
        }
        if (/(123456|abcdef|qwerty|password|azerty)/i.test(password)) {
            return "Évitez les suites ou mots de passe trop prévisibles";
        }
        return null;
    };
    const submit = (e) =>{
        e.preventDefault()
        /*if(!captchaToken){
            alert("veuillez valider le reCAPTCHA");
            return;
        }*/

        //champ vide
        if (matr.value == "" || pass.value == "") {
            toast.error("Veuillez remplir tous les champs !")
            if (matr.value == "") {
                setMtrError(true)
            } else setMtrError(false)
            if (pass.value == "") {
                setPasswordError(true)
            } else setPasswordError(false)
            setUxMessage("completer les champs vide")
            return;
        }
        const matriculeError = validateMatricule(matr.value)
        // Validation mot de passe
        const passwordError = validatePassword(pass.value);
        
        if (matriculeError) {
            setMtrError(true);
            setUxMessage(matriculeError);
            toast.error(matriculeError);
            return;
        }
        if (passwordError || !strongPassword.test(pass.value)) {
            setPasswordError(true);
            setUxMessage(passwordError);
            toast.error(passwordError);
            return;
        }
            http.post("/auth", {
                "matricule": matricule,
                "motDePasse": password
            }, 
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RECAPTCHA-TOKEN": captchaToken
                }
            }).then((res) => {
                setUxMessage("")
                res.data.admin ? aff("dashboard") : aff("agentChatRoom");// if admin go to dashboard else go to agent Chat interface
                return "success"
            }).catch((err) => {
                setUxMessage(err.response.data)
                if (err.response.data === "matricule incorrect") {
                    toast.error("Matricule incorrect.")
                    setMtrError(true)
                }else setMtrError(false)
                if (err.response.data === "votre mot de passe est incorrect"){
                    toast.error("Mot de passe incorrect.")
                    setPasswordError(true)
                }else setPasswordError(false)
                
                console.log(uxMessage)
            })
        
    } 

    const gotoInscr  = () =>{
        aff("inscription")
    }

    const message = (m) =>{
        console.log(m)
    }

    const changeValue = (e) => {
        (pass.value).length < 6 ? setStateButton(false) : setStateButton(true)

    }

    console.log("render")

 return (
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
                         onSubmit={submit}
                         noValidate
                         autoComplete="off"
                         style={{ width: "100%" }}
                     >
                         <Stack spacing={3}>
                             <img
                                 src={userLogo}
                                 alt="user"
                                 style={{
                                     width: 90,
                                     height: 90,
                                     objectFit: "cover",
                                     borderRadius: 12,
                                     margin: "0 auto",
                                 }}
                             />

                             {/* Champ matricule */}
                             <TextField
                                 label="Matricule"
                                 variant="outlined"
                                 type="text"
                                 name="matr"
                                 id="matr"
                                 size="small"
                                 error={mtrError}
                                 onChange={(e) => setMatricule(e.target.value)}
                                 InputProps={{
                                     endAdornment: (
                                         <PersonIcon sx={{ mr: 1, color: "#bbbbbb" }} />
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

                             {/* Champ mot de passe */}
                             <TextField
                                 label="Mot de passe"
                                 variant="outlined"
                                 type="password"
                                 name="pass"
                                 id="pass"
                                 size="small"
                                 error={passwordError}
                                 onChange={(e) => setPassword(e.target.value)}
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
                             {/* reCAPTCHA */}
                            <ReCAPTCHA
                                sitekey="6LeLk1AsAAAAAKPlCOkE76xLFc1zDp0Ivv_wGmWb"
                                onChange={(token) => setCaptchaToken(token)}
                            />
                             
                                {uxMessage==""?console.log():(
                                    <Typography
                                        variant="caption"
                                        align="center"
                                        sx={{ color: "red" }}
                                    >
                                        {uxMessage}
                                    </Typography>
                                )}

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
                                 Connexion
                             </Button>

                             <Typography
                                 variant="caption"
                                 align="center"
                                 sx={{ color: "white", margin:"1px"}}
                             >
                                 pas encore de compte? <span 
                                    onClick={gotoInscr}
                                    style={{
                                        color:"#1070eef0", 
                                        cursor:"pointer"
                                    }} >créer</span>.
                             </Typography>
                         </Stack>
                     </form>
            </Paper>
        </Box>
        </div>
    </>
);


}

export default Connexion