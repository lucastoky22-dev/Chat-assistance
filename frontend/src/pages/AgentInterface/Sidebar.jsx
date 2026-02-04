import {useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Stack,
    Box,
    Button,
    Typography,
    TextField
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import { EmailSharp } from '@mui/icons-material';
import Update from './Update';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import http from '../http';

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    px: 2,
    py: 1.3,
    borderRadius: 2,
    cursor: "pointer",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.2s ease",
    "&:hover": {
        background: "rgba(145,196,198,0.15)",
        color: "#91c4c6",
    },
};

export default function Sidebar({user, historyData}) {

    const [input, setInput]   = useState();
    const [name, setName]     = useState(user.nom); 
    const [email, setEmail]   = useState(user.email);
    const [number, setNumber] = useState(user.numero); 
    const [changeName, setChangeName]   = useState(false);
    const [changeEmail, setChangeEmail]   = useState(false);
    const [changeNumber, setChangeNumber]   = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [menu, setMenu] = useState();
    const fieldStyle = {
        "& .MuiOutlinedInput-root": {
                                    background: "#000",
                                    color: "#fff",
                                    borderRadius: 2,
                                    overflowY: "auto",
                                    "& fieldset": {
                                        borderColor: "rgba(145,196,198,0.3)",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#91c4c6",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#91c4c6",
                                    },
                                },
    }

    
    const goto = useNavigate();  
    const gotoConnexion = () => {
        goto("/connexion");
    }
    
    const disconnect = (matr) =>{
        console.log("matr: " + matr)
        http.put(`/disconnect?matr=${matr}`);
        gotoConnexion();
    }

    const setFree = (matr) =>{
        http.put(`/makeUserAsFree?matr=${matr}&state=${"FREE"}`)
    }

    const rename = (name) => {
        setName(name);
        setChangeName(true);
    }
    const handleEmail = (email) => {
        setEmail(email);
        setChangeEmail(true);
    }
    const handleNumber = (number) => {
        setNumber(number);
        setChangeNumber(true);
    }

    const handleClose = () => {
        setChangeName(false);
        setChangeEmail(false);
        setChangeNumber(false);
    }

    const update = (e, id, name, matricule, number, email, password) => {
        e.preventDefault()
        http.put("/updateInfo", {
            "id":        id,
            "nom":       name,
            "matricule": matricule,
            "email":     email,
            "numero":    number,
            "motDePasse": password,
        });
        
        console.log("hello user n°" + id);
    }

    const handleMenu = (index) =>{
        setMenu(index);
    }


    return (
        <Stack
            spacing={1}
            sx={{
                width: "100%",
                height: "100vh",
                p: 2,
                bgcolor: "#000",
                boxShadow: "0 6px 14px rgba(0, 0, 0, 0.7)",
                borderRadius:3,
                borderRight: "1px solid rgba(145,196,198,0.15)",
            }}
        >
            {/* Header */}
            <Typography
                sx={{
                    mb: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#91c4c6",
                }}
            >
                Mon espace
            </Typography>
            {["Information personnelle", "Historiques", "Rapport"].map(
                (label, idx) => {
                    const bgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                    const icon = [<PersonIcon fontSize='small' />, <HistoryIcon fontSize="small" />, <AssessmentIcon fontSize="small" />];
                    const activeColors = ["#989fa43d", "#989fa43d", "#989fa43d", "#989fa43d"];
                    return (
                         <Box  
                            key={idx}
                            onClick={() => handleMenu(idx)}
                            variant="outlined" sx={itemStyle}
                        >
                            {icon[idx]}
                            {label}
                        </Box>
                    );
                }
            )}    

            <Box sx={{ flexGrow: 1 }} />

            {menu === 0 && (
                    <Box
                        sx={{
                            width: "100%",
                            background:"#262626ff",
                            border: "1px solid #71717173",
                            borderRadius: 3,
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <PersonIcon
                                sx={{
                                    color: "white",
                                    width: 70,
                                    height: 70,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(231, 231, 231, 0.9)",
                                    boxShadow:"0px 0px 10px 5px rgba(5, 65, 77, 0.79)",
                                    padding: 2,
                                    mb:1

                                }}
                            />
                        </Box>
                        <form action="" onSubmit={(e) => update(e, user.id, name, user.matricule, number, email, user.motDePasse)}>
                            <Stack
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    gap: 2,
                                    borderRadius: 3,
                                    display:"flex",
                                    alignItems:"center"
                                }}
                            >

                                <Typography
                                    sx={{ color: "white", cursor: "pointer" }}
                                    onDoubleClick={() => rename(name)}
                                >
                                    {name}
                                </Typography>
                                
                                    <Typography
                                        sx={{
                                            color: "white",
                                            cursor: "pointer",
                                        }}
                                        onDoubleClick={() => handleEmail(email)}
                                    >
                                        {email}
                                    </Typography>
                               
                                <Typography
                                    sx={{ color: "white", cursor: "pointer" }}
                                    onDoubleClick={() => handleNumber(number)}
                                >
                                    {number}
                                </Typography>
                                <Button
                                    variant='contained'
                                    startIcon={<SaveIcon />}
                                    size="small"
                                    type='submit'
                                    sx={{
                                        color: "#000",
                                        fontSize:11,
                                        fontWeight:"bold",
                                        borderRadius: 3,
                                        p:1,
                                        //boxShadow:"0 10px 10px rgba(3, 47, 56, 0.79)",
                                        backgroundColor: "#76aaaa",
                                    }}
                                >
                                    sauvegarder
                                </Button>
                            </Stack>

                            {changeName && (
                                <Box
                                    sx={{
                                        position: "fixed",
                                        inset: 0,
                                        backgroundColor: "rgba(32, 32, 32, 0.67)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 1300,
                                    }}
                                >
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            width: "100%",
                                            maxWidth: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <TextField
                                            variant="outlined"
                                            value={name}
                                            type='text'
                                            onChange={(e) => setName(e.target.value)}
                                            sx={fieldStyle}
                                        />
                                        <CloseIcon
                                            onClick={handleClose}
                                            sx={{
                                                color: "white",
                                                borderRadius: "50%",
                                                bgcolor: "rgba(255, 0, 0, 0.9)",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    borderColor: "#91c4c6",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                            {changeEmail && (
                                <Box
                                    sx={{
                                        position: "fixed",
                                        inset: 0,
                                        backgroundColor: "rgba(32, 32, 32, 0.67)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 1300,
                                    }}
                                >
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            width: "100%",
                                            maxWidth: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <TextField
                                            variant="outlined"
                                            value={email}
                                            type='text'
                                            onChange={(e) => setEmail(e.target.value)}
                                            sx={fieldStyle}
                                        />
                                        <CloseIcon
                                            onClick={handleClose}
                                            sx={{
                                                color: "white",
                                                borderRadius: "50%",
                                                bgcolor: "rgba(255, 0, 0, 0.9)",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    borderColor: "#91c4c6",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                            {changeNumber && (
                                <Box
                                    sx={{
                                        position: "fixed",
                                        inset: 0,
                                        backgroundColor: "rgba(32, 32, 32, 0.67)",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 1300,
                                    }}
                                >
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            width: "100%",
                                            maxWidth: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <TextField
                                            variant="outlined"
                                            value={number}
                                            type='text'
                                            onChange={(e) => setNumber(e.target.value)}
                                            sx={fieldStyle}
                                        />
                                        <CloseIcon
                                            onClick={handleClose}
                                            sx={{
                                                color: "white",
                                                borderRadius: "50%",
                                                bgcolor: "rgba(255, 0, 0, 0.9)",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    borderColor: "#91c4c6",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}

                        </form>

                    </Box>
            )}
            {menu === 1 && (
                
                <>
                <Box sx={{
                            width: "100%",
                            background:"#262626ff",
                            border: "1px solid #71717173",
                            borderRadius: 3,
                            p: 1,
                        }}>
                    <Typography sx={{color:"white"}}>Historiques</Typography>
                    <Box
                        sx={{width:"100%", display:"flex", flexDirection:"column", gap:1}}
                    >
                        {historyData.map((value) => (
                                <Box
                                    key={value}
                                    sx={{width:"100%", borderRadius:3, p:1, bgcolor:"#448c8c71", display:"flex", flexDirection:"column", gap:1}}
                                >
                                    <Typography sx={{color:"#ffffffc2", fontSize:"11px"}}>{dayjs(value.dateDeCreation).format("MM/DD/HH/mm")}</Typography>
                                    <Typography sx={{width:"100%", color:"white", fontSize:"11px"}}>{value.email}</Typography>
                                </Box>
                            )
                        )}
                    </Box>
                </Box>
                </>
            )}

            

            {/* Déconnexion */}
            <Button
                startIcon={<LogoutIcon />}
                variant="outlined"
                onClick={() => disconnect(user.matricule)}
                sx={{
                    color: "#ff6b6b",
                    borderColor: "rgba(255,107,107,0.5)",
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 2,
                    "&:hover": {
                        background: "rgba(255,107,107,0.08)",
                        borderColor: "#ff6b6b",
                    },
                }}
            >
                Déconnexion
            </Button>
        </Stack>
    );
}
