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
import VisitorForm from '../../component/VisitorForm.jsx';

const ClientLogin = () => {
    return(
        <Box>
            <VisitorForm/>
        </Box>
    )
}
export default ClientLogin;