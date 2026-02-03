import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import http from '../http.js'
import userLogo from '../../assets/OIP.webp'
import {Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  Stack,
  Box,
  Typography,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";

export function PopChat({data, state}) {

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [close, setClose] = useState(false);

    return (
        <>
            {state && (
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
                    onClick={handleClose}
                >
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            width: "100%",
                            maxWidth: 600,
                        }}
                    >
                        {data.nom}
                    </Box>
                </Box>
            )}
        </>
    )
}