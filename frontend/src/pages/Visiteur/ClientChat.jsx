import { useEffect, useState, useRef } from 'react';
import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import http from '../http.js';
import { toast, ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import OwnMessage from '../AgentInterface/OwnMessage.jsx';
const ClientChat = () => {

    const[open, setOpen] = useState(true)
    const[input, setInput] = useState("")
    const [user, setUser] = useState({
        nom        : "johnDoe",
        matricule  : "matricule",
        isAdmin    : false,
        isConnected: true
    });
    const[visitor,  setVisitor] = useState({
        nom : "john Doe"
    })
    const [messages, setMessages] = useState([]);
    const stompClient  = useRef(null);
    const connectedRef = useRef(false); // empêche la double connexion
    const [session, setSession] = useState("default");
    const [agent, setAgent] = useState("default");
    const messagesEndRef = useRef(null);
    
    
    const getSession = () => { // recuperer la session actuel
        try {
            http.get("/visitorSession")
                .then((r)=> {
                    console.log("res.data : " + r.data);
                    setSession(r.data);
                    console.log("visitorSession : " + session)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (err) {
            console.error(err.response?.data);
        }
    };
    
      const [openCreateModal, setOpenCreateModal] = useState(false);
      const addNewAgent = () => {
        setOpenCreateModal(true);
      }

      const quitCreation = () => setOpenCreateModal(false)
      
      useEffect(() => {
        getSession();
        addNewAgent()
      }, [])

      const [email, setEmail] = useState();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      const submit = (e) => {
        e.preventDefault();
        toast.info("hello " + email);
        emailRegex.test(email) ? quitCreation() : console.log("invalid email");
      }

    // Connecton WebSocket
        useEffect(() => {

            if (!session || session === "default") return; // attend que la session soit dispo
            if (connectedRef.current) return; // empêche double connexion

            console.log("User chargé :", user);

            const socket = new SockJS(`/ws?visitor=${session}`);
            const client = new Client({
                webSocketFactory: () => socket,
                debug: (msg) => console.log(msg),
                onConnect: () => onConnect(),
                onStompError: onError
            });

            stompClient.current = client;
            client.activate();

            connectedRef.current = true;

            return () => {
                console.log("Cleanup WebSocket");
                client.deactivate();
                connectedRef.current = false;
            };

    
        }, [session]);

    const onConnect = () => {
        console.log(user.nom + " est connecté");
        
        //Abonement a l'api /topic/public et recuperation du message qui vient du serveur
        stompClient.current.subscribe('/queue/messages', (message) => {
            const msg = JSON.parse(message.body);
            setMessages(prev => [...prev, msg]); //mise a jour du state message
            toast.success("vous avez recu un message de " + msg.sender.nom + "", {
                transition: Slide
            });
        });


        //Abonement a l'endpoint /private pour recuperer le message qui vient du serveur
        stompClient.current.subscribe("/user/"+session+"/private", (message) => {
            const msg = JSON.parse(message.body);
            setMessages(prev => [...prev, msg]); //mise a jour du state message
            setAgent(msg.sender.nom);
            toast.success("DGi-assistance. agent " + msg.sender.nom, {
                transition: Slide
            });
        });
        
    };
    useEffect(() =>{
      // scroll vers le bas à chaque nouveau message
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },[messages]);
    const onError = () => {
        console.log("Erreur de connexion au WebSocket");
    };
    const sendMessage = () => {//envoie du message par l'utilisateur

        if (!input.trim()) return;//supprime les espaces null au debut et a la fin du chaine de caractere

        const sms = {
            content: input,
            visitor: {session : session, email: email},
            sender : user,
            receiver: "agent", 
            timeStamp: Date.now(),
            type: 'CHAT'
        };
        
      const startChat = () => {
        setOpen(true);
      }

      const quitChat = () => setOpen(false)

      
        
        setMessages(prev => [...prev, sms]); //mise a jour du state message
        console.log("Json envoyé : " + JSON.stringify(sms));
        console.log("sms : " + sms.visitor.session)

        setInput("");//reset le champ de texte

        if (!stompClient.current || !stompClient.current.connected) {
            console.log("STOMP pas connecté !");
            return;
        }

        stompClient.current.publish({// envoie du message au serveur
            destination: "/app/DGi-support",
            body: JSON.stringify(sms)
        });
    }

  return (
    <> 
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #91c4c6, #ffffff)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        
        {/* POPUP TOAST */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
        <Dialog
          open={openCreateModal}
          onClose={(event, reason) => {
            if(reason === 'backdropClick')return;
            quitCreation();
          } }
          fullWidth
          maxWidth="sm"
          PaperProps={{
              sx: {
              borderRadius: 3,
              background: "#f3f3f3ff",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              
              },
          }}
        >
          <DialogTitle sx={{marginBottom:"20px", display:"flex", alignItems:"center", gap:2}}>
            <Box
                component="img"
                src="images/LOGO_DGI_OK.png"
                alt="DGI"
                sx={{
                  height: 36,
                  width: "auto",
                  objectFit: "contain",
                }}
              >
            </Box>
              <Typography sx={{ 
                  color: "#141414ff",
                  fontWeight:"bold"
              }}>Entrer votre adresse email</Typography>

          </DialogTitle>
          <DialogContent>
              <form action="" onSubmit={(e) => submit(e)}>
                <Box
                  sx={{
                    display:"flex",
                    justifyContent:"center",
                    flexDirection:"column",
                    gap:1
                  }} 
                >
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
                      <EmailIcon sx={{ mr: 1, color: "#bbbbbb" }} />
                    ),
                  }}
                  sx={{
                    bgcolor: "#efefefff",
                    borderRadius: 2,
                    input: { color: "#202020ff" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555555" },
                      "&:hover fieldset": { borderColor: "#888888" },
                      "&.Mui-focused fieldset": { borderColor: "#1e90ff" },
                    },
                  }}
                />
                <Button type='submit' variant='contained' sx={{
                  background:"#76aaaa",
                  borderRadius:3, 
                  fontWeight:"bold"}}>
                  Ok
                </Button>
              </Box>
              </form>
          </DialogContent>
        </Dialog>
        <Paper
          elevation={0}
          sx={{
            width: "700px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(145,196,198,0.15))",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 3,
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            margin: "auto",
            backdropFilter: "blur(12px)",
            //minHeight: "100vh",
            height:"600px",
            backgroundImage: `url("/images/LOGO_DGI_OK.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              background: "linear-gradient(135deg, #76aaaa, #91c4c6)",
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            }}
          >
            {/* Logo DGI */}
            <Box
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                p: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <Box
                component="img"
                src="images/LOGO_DGI_OK.png"
                alt="DGI"
                sx={{
                  height: 36,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Texte */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#1f2d2d",
                lineHeight: 1.2,
              }}
            >
              Direction Générale des Impôts
            </Typography>
          </Box>


          {/* MESSAGES */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              background: "rgba(255,255,255,0.6)",
            }}
          >
            {messages.map((msg, index) =>
              OwnMessage(user, msg, index)
            )}
            <div ref={messagesEndRef} /> {/* <-- élément pour scroller à la fin */}
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              p: 2,
              background: "rgba(255,255,255,0.85)",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                variant="outlined"
                placeholder="En quoi peut-on vous aider ?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "#ffffff",
                    borderRadius: 2,
                    fontSize: "13px",
                  },
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.15)",
                  },
                }}
              />

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  background:
                    "linear-gradient(135deg, #76aaaa, #91c4c6)",
                  px: 3,
                  fontWeight: 600,
                  color: "#1f2d2d",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #91c4c6, #a9d9de)",
                  },
                }}
                onClick={() => {
                  sendMessage(input);
                  setInput("");
                }}
              >
                Envoyer
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default ClientChat