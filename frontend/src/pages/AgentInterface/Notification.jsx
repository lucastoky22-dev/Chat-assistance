import {useState} from "react";
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import IconButton from '@mui/material/IconButton';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
const Notification = (value) =>{

    return (<>
        <IconButton
            sx={{
                display:"flex",
                color:"#3d3d3dff"
            }}
        >
            <NotificationsSharpIcon/>
            <Typography
                sx={{
                    color:"red",
                    fontSize:"11px",
                }}
            >
                +{value}
            </Typography>
        </IconButton>
    </>)
}

export default Notification;