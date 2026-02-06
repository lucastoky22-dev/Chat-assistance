import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import http from '../http.js';
import { toast, ToastContainer, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import Sidebar from './Sidebar.jsx';
import OwnMessage from './OwnMessage.jsx';
import GroupIcon from "@mui/icons-material/Group";
import Groups3Icon from "@mui/icons-material/Groups3";
import PersonIcon from '@mui/icons-material/Person';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import Notification from "./Notification.jsx"
import IconButton from '@mui/material/IconButton';
import { PopChat } from './PopChat.jsx';

import { getChatHistory } from "../../api/dashboardData.js"; 

const AgentChatRoom = () => {

    const [user, setUser] = useState(null);
    const [onLineAgent, setOnLineAgent] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messages1, setMessages1] = useState([]);
    const [messages2, setMessages2] = useState([]);
    const [input, setInput] = useState("");
    const [visitorSession, setVisitorSession] = useState("");
    const [visitorSession1, setVisitorSession1] = useState("");
    const [visitorSession2, setVisitorSession2] = useState("");
    const [tabIndex, setTabIndex] = useState(0);
    const stompClient  = useRef(null);
    const connectedRef = useRef(false); // empêche la double connexion
    const [notifValue, setNotifValue] = useState(0);
    const [state, setState] = useState();
    const [latencyPerMes, setLatencyPerMes] = useState([]);
    const [averageLatency, setAverageLatency] = useState([]);
    const messagesEndRef = useRef(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [open, setOpen] = useState()
    const [isDiscussionClose, setIsDiscussionClose] = useState(false);
       const maDtoList = [
        { matricule: "AG123", responseTime: 20 },
        { matricule: "AG124", responseTime: 45 },
        { matricule: "AG125", responseTime: 75 },
    ];
    const profilStyle = {
        borderBottom:"1px solid #5f5f5f67"
    }
    let notifCounter = 0;
    const goto = useNavigate();    

    const getUser = async () => { // recuperer l'utilisateur de la session actuel
        try {
            const res = await http.get("/session");
            
            const currentUser = {
                id         : res.data.userId,
                nom        : res.data.nom,
                email      : res.data.email,
                matricule  : res.data.matricule,
                numero     : res.data.numero,
                motDePasse : res.data.motDePasse,
                isAdmin    : res.data.admin,
                isConnected: res.data.connected
            };

            if(currentUser.nom == undefined
                && currentUser.matricule == undefined
                && currentUser.isAdmin == undefined
                && currentUser.isConnected == undefined
            ) {
                setUser(null)
            }else setUser(currentUser);
        } catch (err) {
            console.error(err.response?.data);
        }
    };
    
    function onLineUser() {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/onOffAgent?etat=${true}`);
                if (!response.ok) throw new Error("Erreur serveur");
                
                const data = await response.json();
                console.log(data);
                setOnLineAgent(data);
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Immpossible de charger les données !");
            }
        };
        fetchData();
    } 

    function latenceParMessage(session){
        const fetchData = async () => {
            try {
                const response = await fetch(`api/agentLatency?session=${session}`);
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setLatencyPerMes(data);
            } catch (error) {
                console.error("Failed to load JSON:", error);
            }
        };
        fetchData();
    }

    function average(session){
        const fetchData = async () => {
            try {
                const response = await fetch(`api/averageLatency?session=${session}`);
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setAverageLatency(data);
                console.log("data[0].responseTimeSec : " + data[0].responseTimeSec)
            } catch (error) {
                console.error("Failed to load JSON:", error);
            }
        };
        fetchData();
    }

    const getChatHistory = async (user) =>{
        await http.get(`/chatHistory?userMatricule=${user.matricule}`).then((res) => {
            console.log(res + "  " + res.data);
            setChatHistory(res.data);
        })
    }

    // Charger user une seule fois
    useEffect(() => {
        getUser();
        onLineUser();
        getChatHistory(user);
    }, []);

    // Connecter WebSocket UNE SEULE FOIS quand user est chargé
    useEffect(() => {
        if (!user) return;

        if (connectedRef.current) return; // <-- empêche la double connexion

        console.log("User chargé :", user);

        const socket = new SockJS(`/ws?matricule=${user.matricule}`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (msg) => console.log(msg), // active les logs
            onConnect: () => onConnect(),
            onStompError: onError
        });

        stompClient.current = client;
        client.activate();

        connectedRef.current = true;

        /* Nettoyage si composant détruit
        return () => {
            console.log("Cleanup WebSocket");
            client.deactivate();
            connectedRef.current = false;
        };*/

    }, [user]);

    const onConnect = () => {
      if (!user) {
        console.log("WebSocket connecté, mais user pas encore chargé");
        return;
      }

      console.log(user.nom + " est connecté");
      //Abonement a l'api /topic/public et recuperation du message qui vient du serveur
      stompClient.current.subscribe("/user/"+user.matricule+"/private", (message) => {
        const msg = JSON.parse(message.body);

        setMessages(prev => [...prev, msg]); //mise a jour du state message
        console.log("messages : " + messages)
        setVisitorSession(msg.visitor.session)
        getChatHistory(user);
        setNotifValue(notifCounter+=1)
        toast.success("vous avez recu un message", {
          transition: Slide
        });
      });
      stompClient.current.subscribe("/topic/public", (response) => {
        const res = JSON.parse(response.body);
        setOnLineAgent([...res]);
        console.log(res);
        toast.success("notification", {
          transition: Slide
        });
      });
    };

    useEffect(() => {
        console.log("mise a jour de online agent");
    }, [onLineAgent])
        
    useEffect(() => {
        
        if (!user) return;
        // scroll vers le bas à chaque nouveau message
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

    }, [messages]);

    

    const onError = () => {
        console.log("Erreur de connexion au WebSocket");
    };

    const handleTab = (index) => {
        setTabIndex(index);
        //toast.info(`Vous avez sélectionné l'onglet ${index + 1}`);
    };

    const redirect = (str) => {
        goto("/"+str)
    }

    const disconnect = (matr) =>{
        http.put(`/disconnect?matr=${matr}`);
        setUser({})
        redirect("connexion");
    }

    const setFree = (matr) =>{
        setIsDiscussionClose(true);
        http.put(`/makeUserAsFree?matr=${matr}&state=${"FREE"}`)
    }

    const incrementNotif = () =>{
        setNotifValue(notifValue + 1)
    }

    const sendMessage = () => {//envoie du message par l'agent

            toast.info("message envoyer");

            if (!input.trim()) return;//supprime les espaces vide au debut et a la fin de la chaine de caractere

            const sms = {
                content: input,
                sender: user,
                visitor: { session: visitorSession },
                timeStamp: Date.now(),
                type: 'CHAT'
            };
            setMessages(prev => [...prev, sms])
            setInput("");//reset le champ de texte

            if (!stompClient.current || !stompClient.current.connected) {
                console.log("STOMP pas connecté !");
                return;
            }

            stompClient.current.publish({// envoie du message au serveur
                destination: "/app/agent-assistance",
                body: JSON.stringify(sms)
            });
    };

    const handleOpen = (row) => {
        console.log("open")
        setOpen(true);
        <PopChat
            data  = {row}
            state = {true} 
        />
    }
    const handleClose = () => setOpen(false);

 

  return (
  <>
    {user != null? 
    <Box
        sx={{
            width: "100vw",
            height: "100vh",
            bgcolor: "#2d2b2dff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
        {/************************************************SIDEBAR*************************************************/} 
        <Stack
            sx={{
                background:"linear-gradient(135deg, #a9d9de, #ecf2ffff)",
                padding: 2,
                minWidth: { xs: "100%", sm: 220 },
                width: { xs: "100%", lg: "420px" },
                height: "100vh",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                gap: 2,
            }}
        >
            {/* TABS */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        borderBottom: "2px solid #4545458f",
                        justifyContent:"space-between",
                        padding:2,
                        alignItems:"center",
                        //gap: 9
                    }}
                >
                    {["profil", "En ligne", "Groupes", "Messages"].map(
                        (label, idx) => {
                            const bgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                            const icon = [<PersonIcon/>, <GroupIcon/>, <Groups3Icon/>, Notification(notifValue)] ;
                            //const activeColors = ["#5719d2ff", "#8219d2ff", "#c319d2ff", "#d2198eff"];
                            const activeColors = ["#989fa43d", "#989fa43d", "#989fa43d", "#989fa43d"];
                            return (
                                <IconButton
                                    key={idx}
                                    onClick={() => handleTab(idx)}
                                    variant="outlined"
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        color: "#76aaaa",
                                        background: tabIndex === idx ? "#161616f2" : "transparent",
                                        transition: "all .2s ease",
                                        "&:hover": {
                                            background: "#252525e4",
                                        },
                                    }}
                                >
                                    {/*label*/}
                                    {icon[idx]}
                                </IconButton>
                            );
                        }
                    )}    
                    
                </div>

                {tabIndex === 0 && (
                    <>
                        <Sidebar
                            user={user}
                            historyData={chatHistory}
                        />
                    </>
                        
                    )
                }
                {tabIndex === 1 && (
                        <>
                            <Stack spacing={1}
                                sx={{
                                        width: "100%",
                                        height: "100vh",
                                        p: 2,
                                        bgcolor: "#000",
                                        borderRadius:3,
                                        borderRight: "1px solid rgba(145,196,198,0.15)",
                                    }}
                            >
                                {onLineAgent.map((row) => (
                                    <Box
                                        key={row.email}
                                        onClick={() => handleOpen(row)}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            cursor: "pointer",
                                            background: "rgba(192, 192, 192, 0.16)",
                                            border: "1px solid rgba(145,196,198,0.15)",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                background: "rgba(145,196,198,0.15)",
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
                                            },
                                        }}
                                    >
                                        {/* Avatar + statut */}
                                        <Box sx={{ position: "relative" }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#a9d9ce",
                                                    width: 36,
                                                    height: 36,
                                                    fontSize: 14,
                                                    color: "#000",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {row?.nom?.charAt(0)?.toUpperCase() || ""}
                                            </Avatar>

                                            {/* Indicateur online */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    bgcolor: "#0be112ff",
                                                    border: "1px solid #1f1f1fff",
                                                }}
                                            />
                                        </Box>

                                        {/* Infos */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: "#ffffffeb",
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {row.nom}
                                            </Typography>

                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: "#ffffffbe",
                                                    fontSize: 11,
                                                }}
                                            >
                                                {row.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </>
                    )
                }
                {tabIndex === 2 && (
                        <>
                            <div>tab 3 </div>
                        </>
                    )
                }
                {tabIndex === 3 && (
                        <>
                            <div>tab 4 </div>
                        </>
                    )
                }

        </Stack>

        <Paper //chatRoom
            elevation={4}
            sx={{
                width: "100%",
                height: "100vh",
                bgcolor: "#000",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                //boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
                fontFamily: "Inter, sans-serif",
                
            }}
        >

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(145,196,198,0.25)",
                }}
            >
                {/* Titre */}
                <Box sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                    Discussion en cours
                </Box>
                    <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setFree(user.matricule)}
                              sx={{
                                  color: "#ff6b6b",
                                  borderColor: "rgba(255,107,107,0.5)",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  textTransform: "none",
                                  "&:hover": {
                                      background: "rgba(255,107,107,0.08)",
                                      borderColor: "#ff6b6b",
                                  }
                              }}
                    >
                        terminer la discussion
                    </Button>

            </Box>

            <Box //champ de discussion
                sx={{
                    flex: 1,
                    p: 2,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.2,
                    background:"rgba(29, 28, 28, 0.85)",
                }}
            >
                {messages.map((msg, index) => (OwnMessage(user, msg, index)))}
                {isDiscussionClose ? (<Box sx={{borderBottom:"1px solid #ffffff72", marginTop:2, display:"flex", justifyContent:"center"}}><Typography sx={{color:"#ffffff72"}}>discussion terminer</Typography></Box>): console.log("discussion  en cours")}
                
                <div ref={messagesEndRef} /> {/* <-- élément pour scroller à la fin */}
            </Box>

            <Box
                sx={{
                    p: 2,
                    bgcolor: "rgba(29, 28, 28, 0.85)",
                    backdropFilter: "blur(8px)",
                    borderTop: "1px solid rgba(145,196,198,0.2)",
                }}
            >
                <Stack direction="row" spacing={1} sx={{
                    alignItems:"center",
                    justifyContent:"center",
                }}> 
                    <TextField
                        variant="outlined"
                        placeholder="Écris ton message…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "#000",
                                color: "#fff",
                                borderRadius: 2,
                                width: "400px",
                                overflowY:"auto",
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
                        }}
                    />

                    <IconButton
                            variant="contained"
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "14px",
                                background: "#91c4c6",
                                boxShadow: "0 8px 20px rgba(145,196,198,0.35)",
                                "&:hover": {
                                    background: "#7fb3b5",
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 10px 24px rgba(145,196,198,0.45)",
                                },
                        }}
                        onClick={() => {sendMessage();}}
                    >
                        <ArrowUpwardSharpIcon sx={{
                            color:"white",
                        }}/>
                    </IconButton>
                </Stack>
            </Box>
        </Paper>
    </Box> :  <Box sx={{
        display:"flex",
        justifyContent:"center",
        width:"100vw",
        height:"100vh",
        alignItems:"center",
        bgcolor:"rgba(21, 21, 21, 1)"
    }}> <Typography
        sx={{
            color:"#fff"
        }}
    > Accée non authorisé. Allez à la page de <span onClick={() => redirect("connexion")} style={{
        fontWeight:"bold",
        cursor:"pointer",
        color:"#3b8affe6",
        "&:hover": { color: "#072b55ff" },
        }}>connexion</span> pour vous authentifiez.</Typography></Box>}
    </>
);

}

export default AgentChatRoom