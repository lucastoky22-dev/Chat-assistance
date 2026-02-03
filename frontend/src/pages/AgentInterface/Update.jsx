import {useState} from 'react';
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
import CloseIcon from '@mui/icons-material/Close';

export default function Update({value}){

    const [data, setData] = useState(value);

    const handleClose = () => {
        alert("hello world");
    }

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

    return (
        <Box
            sx= {{
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
                onClick={ (e) => e.stopPropagation() }
                sx = {{
                    width: "100%",
                    maxWidth: 600,
                    display:"flex",
                    alignItems:"center",
                    gap:1
                }}
            >
                <TextField
                    variant="outlined"
                    value = {data}
                    type = 'text'
                    onChange = {(e) => setData(e.target.value)}
                    sx = { fieldStyle }
                />
                <CloseIcon
                    onClick={handleClose}
                    sx={{
                        color:"white",
                        borderRadius:"50%",
                        bgcolor:"rgba(255, 0, 0, 0.9)",
                        cursor:"pointer",
                        "&:hover": {
                            borderColor: "#91c4c6",
                        },
                    }}
                />
            </Box>
        </Box>
    )
}