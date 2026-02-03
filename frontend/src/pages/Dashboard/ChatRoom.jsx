import React from "react";
import {
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ArrowUpwardSharpIcon from "@mui/icons-material/ArrowUpwardSharp";

export default function ChatRoom({
  user,
  messages,
  input,
  setInput,
  sendMessage,
  setFree,
  OwnMessage, // fonction qui rend un message
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "#252425ff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(37,36,37,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            display: "flex",
            color: "wheat",
            alignItems: "center",
            gap: 1.2,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1d7edfff",
              width: 32,
              height: 32,
              fontSize: "0.9rem",
            }}
          >
            {user?.nom?.charAt(0)?.toUpperCase() || ""}
          </Avatar>

          {user?.nom || ""}

          {user?.isConnected ? (
            <CheckCircleIcon sx={{ color: "#17b21cff" }} />
          ) : (
            <CancelRoundedIcon sx={{ color: "#c73131ff" }} />
          )}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="inherit"
            size="small"
            onClick={() => setFree(user.matricule)}
            sx={{
              background: "#414141ff",
              fontSize: 11,
              fontWeight: 600,
              color: "white",
              px: 2,
              "&:hover": { background: "#414141b7" },
            }}
          >
            terminer la discussion
          </Button>
        </Box>
      </Box>

      {/* MESSAGES */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          background: "radial-gradient(circle at top, #262626, #1e1e1e)",
        }}
      >
        {messages.map((msg, index) => OwnMessage(user, msg, index))}
      </Box>

      {/* INPUT */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#1b1a1b7e",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder="Écris ton message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                background: "#141414",
                color: "white",
                borderRadius: 2,
                "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                "&:hover fieldset": { borderColor: "#1d7edfff" },
                "&.Mui-focused fieldset": { borderColor: "#1d7edfff" },
              },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiInputLabel-root": { color: "#ffffffb3" },
            }}
          />

          <IconButton
            variant="contained"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1d7edfff, #155fa0)",
              boxShadow: "0 8px 20px rgba(29,126,223,0.35)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 10px 24px rgba(29,126,223,0.45)",
              },
            }}
            onClick={() => sendMessage()}
          >
            <ArrowUpwardSharpIcon sx={{ color: "white" }} />
          </IconButton>
        </Stack>
      </Box>
    </Paper>
  );
}
