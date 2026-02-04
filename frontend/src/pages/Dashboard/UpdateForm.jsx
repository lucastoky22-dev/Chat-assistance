import {Button, Box, Typography, Stack ,  Card, CardContent, TextField} from "@mui/material";
import { useState } from "react";
import http from '../http';
import CloseIcon from '@mui/icons-material/Close';

export function UpdateForm({ data, onSubmit, avatar , close}) {
  const palette = {
    light: "#a9d9de",
    main: "#91c4c6",
    dark: "#76aaaa",
  };

  const [name, setName] = useState(data.nom);
  const [email, setEmail] = useState(data.email);
  const [number, setNumber] = useState(data.numero);
  const [matricule, setMatricule] = useState(data.matricule);
  const [password, setPassword] = useState(data.motDePasse);

   /**********************************mettre a jour un agent*********************************/
      const handleUpdate = (e, id, name, matr, number, password, mail) => {
          e.preventDefault()
          http.put("/updateInfo",{
              "id":        id,
              "nom":       name,
              "matricule": matr,
              "email":     mail,
              "numero":    number,
              "motDePasse": password,
          }).then(()=>{
              toast.success("modification éffectué")
              displayData()
          }).catch((err) =>{
              toast.error(err.response.data)
          })
      } 

  console.log("data.id: " + data.id)

  const field = {
    "& .MuiInputBase-input": {
      color: "#2f2f2f",
      fontFamily: "Montserrat",
    },

    "& .MuiInputLabel-root": {
      color: "#4a6f72",
      fontFamily: "Montserrat",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: palette.dark,
    },

    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffffcc",
      borderRadius: 2,
      "& fieldset": {
        borderColor: palette.main,
      },
      "&:hover fieldset": {
        borderColor: palette.dark,
      },
      "&.Mui-focused fieldset": {
        borderColor: palette.dark,
        borderWidth: 2,
      },
    },
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${palette.light}, #ffffff)`,
        borderRadius: 3,
        boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
      }}
    >
      <CardContent>
        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* Avatar */}
            <Box sx={{ display: "flex", flexDirection:"row-reverse", justifyContent: "center" }}>
              
                <CloseIcon
                  sx={{
                    width:20,
                    height:20,
                    bgcolor:"rgba(234, 25, 25, 1)",
                    color:"#fff",
                    borderRadius:"50%"
                  }}
                  onClick={close}
                />
              <Box
                sx={{
                  width: "100%",
                  height: 100,
                  padding: 1,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center"
                }}
              >
                <Typography
                  sx={{
                    fontWeight:"bold",
                    fontSize:"20px",
                    color:"#1a1a1ac8"
                  }}
                >Mettre a jour les nformaton de l'agent</Typography>

              </Box>
            </Box>

            {/* Inputs */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "space-between",
                "& > *": {
                  flex: { xs: "1 1 100%", sm: "1 1 45%" },
                },
              }}
            >
              <TextField label="Id" size="small" disabled value={data.id} sx={field} />

              <TextField label="Nom" size="small" value={name} onChange={(e) => setName(e.target.value)} sx={field} />

              <TextField label="Matricule" size="small" value={matricule} onChange={(e) => setMatricule(e.target.value)} sx={field} />

              <TextField label="Email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} sx={field} />

              <TextField label="Numéro" size="small" value={number} onChange={(e) => setNumber(e.target.value)} sx={field} />

              <TextField
                label="Mot de passe"
                type="password"
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                sx={field}
              />
            </Box>

            {/* Bouton */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={(e) => handleUpdate(e, data.id, name, matricule, number, password, email)}
                sx={{
                  bgcolor: palette.dark,
                  color: "#fff",
                  px: 5,
                  py: 1.2,
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  "&:hover": {
                    bgcolor: palette.main,
                  },
                }}
              >
                Enregistrer
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
