import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {StatCard} from "./StatCard.jsx";
import {TableBoard} from "./TableBoard.jsx";
import http from '../http.js'
import userLogo from '../../assets/OIP.webp'
import AgentChatRoom from "../AgentInterface/agentChatRoom.jsx";
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
import HomeIcon from "@mui/icons-material/Home";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import AddIcon from "@mui/icons-material/Add";
import DiscountIcon from "@mui/icons-material/Discount";
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Person4Icon  from "@mui/icons-material/Person4";
import CloseIcon from '@mui/icons-material/Close';
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Grid4x4Icon from "@mui/icons-material/Grid4x4";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Skeleton from '@mui/material/Skeleton';
import Groups3Icon from "@mui/icons-material/Groups3";
import PersonIcon from '@mui/icons-material/Person';
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import OfflineBolt from "@mui/icons-material/OfflineBolt";
import AnalyticsSharpIcon from "@mui/icons-material/AnalyticsSharp";
import EditIcon from "@mui/icons-material/Edit";
import {UpdateForm} from './UpdateForm.jsx';
import {RadarCard} from './RadarCard.jsx';
import AreaStatCard from './AreaStatCard.jsx'
import StateValueCard from './StateValueCard.jsx'
import MessagePerDay from './MessagePerDay.jsx'
import QueueEvolutionCard from "./QueueEvolutionCard.jsx";
import {RadarForQueue} from './RadarForQueue.jsx'
import Notification from '../AgentInterface/Notification.jsx';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationPanel from "./NotificationPanel.jsx";
import ArrowUpwardSharpIcon from "@mui/icons-material/ArrowUpwardSharp"
import OwnMessage from '../AgentInterface/OwnMessage.jsx'
import DurationList from './DurationList.jsx'
import { ChatVolume } from './ChatVolume.jsx';
import { StatsCard } from '../../component/StatsCard.jsx';
/*****Stomp Clienti*****/
import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getOnlineAgent, getFreeAgent, getBusyAgent } from "../../api/dashboardData.js"; 
import { onlineManager } from "@tanstack/react-query";
import {simulatedMessages, queue} from './Simulation.js'
const Dashboard = () => {
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState([]);
    const [visitorSession, setVisitorSession] = useState("");
    const [sidebarIndex , setSidebarIndex] = useState(0);
    const [tabIndex, setTabIndex]          = useState(0);
    const [backendData, setBackendData]    = useState([]);
    const [agentWithNoGroup, setAgentWithNoGroup] = useState([]);
    const [agentWithGroup, setAgentWithGroup] = useState([]);
    const [groupData, setGroupData]        = useState([]);
    const [onLineAgent, setOnLineAgent]    = useState([]);
    const [freeAgent, setFreeAgent]        = useState([]);
    const [busyAgent, setBusyAgent]        = useState([]);
    const [waitValidation, setWaitValidation] = useState({});
    const [messageData, setMessageData]    = useState([]);
    const [member, setMember]              = useState([]);
    const [user, setUser]                  = useState(null);
    const stompClient                      = useRef(null);
    const connectedRef                     = useRef(false); // empêche la double connexion
    const [isConnected, setIsConnected]    = useState("disconnected");
    const [notification, setNotification]  = useState(); 
    const [dashNotif, setDashNotif]        = useState({}); 
    const [notificationTable, setNotificationTable] = useState([]);
    const [chatVolume, setChatVolume]      = useState(0);
    const [openChat, setOpenChat]          = useState([]);
    const [averageChat, setAverageChat]    = useState([]);
    const [listDuration, setListDuration]  = useState([]);
    const [notificationData, setNotificationData] = useState({});
    const [queueData, setQueueData]        = useState([])

    const statsData = {
        title: 'Total Utilisateurs',
        value: '2,543',
        icon: Person4Icon,
        trend: '+12.5%',
        trendUp: true,
        color: 'primary',
    }

    let cardStyle = {
        display:"flex",
        alignItems:"center",
        gap:1,
        textAlign:"start",
        color:"#000000ff",
        width:"300px",
        fontWeight:"bold",
        padding:"10px 30px",
        marginBottom:2,
        borderRadius:1,
        bgcolor:"#e6fff5f2",
        fontSize:"14px",
    };

    const palette = {
        light: "#a9d9de",
        main: "#91c4c6",
        dark: "#76aaaa",
    };

    const field = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#ffffffcc",
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
        "& label": {
            color: "#3a3a3a",
            fontFamily: "Montserrat",
        },
    };

    const getUser = async () => { // recuperer l'utilisateur de la session actuel 
        try {
            const res = await http.get("/session");
            const currentUser = {
                nom         : res.data.nom,
                matricule   : res.data.matricule,
                email       : res.data.email,
                numero      : res.data.numero,
                motDePasse  : res.data.motDePasse,
                isAdmin     : res.data.admin,
                isConnected : res.data.connected,
                etat        : res.data.etat,
                myGroup     : res.data.myGroup,
            };
            setUser(currentUser);
        } catch (err) {
            console.error(err.response?.data);
        }
    };

    /***********************Charger le user proprietaire de la session**************************/
    useEffect(() => {
        getUser();
    }, []);
    /***********************Connection WebSocket UNE SEULE FOIS quand le user proprietaire du session est chargé**************************/
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

        // Nettoyage si composant détruit
        return () => {
            console.log("Cleanup WebSocket");
            client.deactivate();
            connectedRef.current = false;
        };

    }, [user]);

    const onConnect = () => {
        if (!user) {
            console.log("WebSocket connecté, mais user pas encore chargé");
            return;
        }
        console.log(user.nom + " est connecté");

        stompClient.current.subscribe("/user/"+user.matricule+"/private", (message) => {
                const msg = JSON.parse(message.body);
        
                setMessages(prev => [...prev, msg]); //mise a jour du state message
                console.log("messages : " + messages)
                setVisitorSession(msg.visitor.session)
                toast.success("vous avez recu un message", {
                  transition: Slide
                });
              });
        //Abonement a l'api /dashboard 
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard", (data) => {
            const msg = JSON.parse(data.body);
            setGroupData(msg); //mise a jour du table des groupes
            toast.success("mise a jour éffectuée", {
                transition: Slide
            });
        });
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard/notif", (data) => {
            const createData = JSON.parse(data.body);
            console.log(createData)
            setDashNotif(createData)
            setNotification(1)
            toast.success("nouvelle notification", {
                transition: Slide
            });
        });
        //Abonement a l'api /dashboard/updateGroup
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard/updateGroup", (message) => {
            const msg = JSON.parse(message.body);
            setAgentWithGroup(msg); //mise a jour du table des groupes
            toast.success("mise a jour éffectuée", {
                transition: Slide
            });
        });
        //Abonement a l'api /dashboard/agent
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard/groupList", (message) => {
            const msg = JSON.parse(message.body);
            setGroupData(msg); //mise a jour du table des groupes
            /*
            toast.success("mise a jour éffectuée", {
                transition: Slide
            });*/
        });
        
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard/agent", (message) => {
            const msg = JSON.parse(message.body);
            setAgentWithNoGroup(msg); //mise a jour du table des agents
            toast.info("un agent a été lberer de son groupe")
        });
        //Abonement a l'api /dashboard/userData
        stompClient.current.subscribe("/user/" + user.matricule + "/dashboard/userData", (message) => {
            const msg = JSON.parse(message.body);
            setBackendData(msg); //mise a jour de la table des agents
            toast.info("vous avez recu un message")
        });
    };

    const onError = () => {
        console.log("Erreur de connexion au WebSocket");
    };

    /***********************fetch des data**************************/
    function displayData() {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/listOfUser");
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setBackendData(data);
                console.log("backendData: " + data[0].etat)
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    } 

    function userWithNoGroup() {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/userWithNoGroup");
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setAgentWithNoGroup(data);
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    } 

    function groupMemeber(groupId) {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/group/listOfMembers/${groupId}`);
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setAgentWithGroup(data);
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    }

    function displayGroupData() {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/group/listOfGroup");
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setGroupData(data);
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    } 

    function getAllMessage(){
        const fetchData = async () => {
            try {
                const response = await fetch("/api/listOfAllMessages");
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setMessageData(data);
                console.log("messageDta : " + messageData)
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    }

    async function getAllOpenChat(){
        await http.get("/allOpenChat")
            .then((res) =>{
                const data = res.data;
                setOpenChat(data);
                console.log("data = " + data)
            })
            .catch((err) =>{console.log(err)})
    }

    function queueEvolution(){
        const fetchData = async () => {
            try {
                const response = await fetch("/api/queueEvolution");
                if (!response.ok) throw new Error("Erreur serveur");
                const data = await response.json();
                setQueueData(data);
                console.log("messageDta : " + queueData)
            } catch (error) {
                console.error("Failed to load JSON:", error);
                toast.error("Impossible de charger les données !");
            }
        };
        fetchData();
    }

    function getChatVolume(){
        http.get("/chatSize").then((res) =>{
            setChatVolume(res.data);
            console.log(res.data);
        }).catch((err) => {console.log(err)} )
    }

    function getAverageChatDuration(){
        http.get("/averageChatDuration").then((res) =>{
            setAverageChat(res.data)
            console.log("timeStamp : " + res.data[0].timeStamp, "seconds : " + res.data[0].seconds)
        }).catch((err) =>{console.log(err)})
    }

    function getDurationList(){
        http.get("/ListDuration").then((res) =>{
            setListDuration(res.data)
        }).catch((err) =>{console.log(err)})
    }

    function notifPush(data) {
        const tab = [];
        tab.push(data);
        return tab;
    }

    /***********************Affichage initial des tables***********************/
    useEffect(() => {
        getOnlineAgent().then((res)=>{
            console.log("res = " + res);
            setOnLineAgent(res);
        });

        getFreeAgent().then((res)=>{
            console.log("res = " + res);
            setFreeAgent(res);
        })
        console.log("freeAgent: " + freeAgent)
        getBusyAgent().then((res)=>{
            console.log("res = " + res);
            setBusyAgent(res);
        })

        displayData()
        displayGroupData()
        userWithNoGroup()
        getAllMessage()
        queueEvolution()
        getQueueSize()
        getChatVolume()
        getAllOpenChat()
        getAverageChatDuration()
        getDurationList()

    }, []);
    useEffect(() =>{
        console.log("onLineAgent: " + onLineAgent.length)
    }, [onLineAgent])
    useEffect(() => {
        console.log("dashNotif mis à jour :", dashNotif);
        setNotificationTable(notifPush(dashNotif))
    }, [dashNotif]);

    const handleTab = (index) => {
        setTabIndex(index);
        //toast.info(`Vous avez sélectionné l'onglet ${index + 1}`);
    };

    const handleSidebar = (i) =>{
        setSidebarIndex(i);
    } 

    const addRow = () => {
        const newId = tableData.length + 1;
        setTableData([...tableData, { id: newId, name: `User ${newId}`, age: 20 + newId, email: `user${newId}@example.com` }]);
        toast.success("Nouvelle ligne ajoutée !");
    };
   

    /***********************A ne pas changer de place***********************/
    const [open, setOpen] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [data, setData] = useState({
        "id" : "f",
        "nom"  : "sdf",
        "matricule" : "sf",
        "email" : "sd",
        "numero" : "numero",
        "motDePasse" : "s"
    })
    const [groupInfo, setGroupInfo] = useState({});
    const handleOpen = (row) => {
        setData(
            {
                "id": row.id,
                "nom": row.nom,
                "matricule": row.matricule,
                "email": row.email,
                "numero":row.numero,
                "motDePasse": row.motDePasse
            }
        )
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    /**********************************mettre a jour un agent*********************************/
    const handleUpdate = (e) => {
        
    } 

    /***********************suppprimer un agent***********************/
    const handleDelete = (id) => {
        http.delete(`/deleteUser?id=${id}`)
            .then(() => {
                toast.success("Supprimé avec succès !");
                setBackendData(prev => prev.filter(user => user.id !== id));
            })
            .catch(err => {
                console.error(err);
                toast.error("Une erreur est survenue !");
            });
    };

    const addNewAgent = () => {
        setOpenCreateModal(true);
    }

    const quitCreation = () => setOpenCreateModal(false)
    
    function tableEvent () {
        toast.info("hello");
    }
    /***************************creer un nouveau agent********************************/
    const handleCreate = async (e) =>{
        e.preventDefault()
        await http.post("/adminCreateUser", {
            "nom"        : nom.value,
            "matricule"  : matricule.value,
            "numero"     : numero.value,
            "email"      : email.value,
            "motDePasse" : motDePasse.value
        }).then(()=>{
            toast.success("l'agent est bien créé")
            displayData()
        })
        .catch((err) => {
            toast.error(err.response.data);
        })
    }

     /***************************Gestion de l'etat********************************/
    const etat = (e) => {
        console.log(e)
        if(e) {
            setIsConnected("connected");
        }
        else{
            setIsConnected("connected");
        } 
    }
    
    /******************************************************************************GESTON DES GROUPES***************************************************************************************/    

    /***************************** manage add checkbox ***************************/

    function remove(element, tableau){
        if(element == 0){
            tableau.shift()
            return tableau;
        }
        if (element == tableau.length) {
            tableau.pop()
            return tableau;
        }
        if (element > 0 && element < tableau.length) {

            let tab1 = [];
            tab1 = tableau.slice(0, element)

            let tab2 = [];
            tab2 = tableau.slice(element + 1, tableau.length)

            return tab1.concat(tab2);
        }
    }

    const addCheck = (user) => {
        member.indexOf(user) == -1? setMember([...member, user]) : setMember(remove(member.indexOf(user), member))
        console.log(member);
        /*for(let c = 0; c < member.length ; c++){
            console.log(member[c]);
        }*/
        
    }

    /***************************creer un nouveau groupe********************************/
    const createGroup = async (e) => {
        e.preventDefault();
        await http.post("/group/createGroup", {
            "nom"   : nom.value,
            "membres": member 
        }).then(()=>{
            toast.success(nom.value + " a  bien été créé")
            setMember([])
        })
        .catch((err) => {
            toast.error("erreur lors de la créton: " + err.response.data);
        })

        for(let c = 0; c < member.length ; c++){
            console.log(member[c]);
        }
    }

    /************************mettre a jour un groupe ************************/
    const updateGroup = (row) => {
        setGroupInfo(row)
        groupMemeber(row.groupId)
        setOpen(true);
    }
    const saveUpdate = async (e) =>{
        e.preventDefault();
        await http.put("/group/updateGroup", {
            "id"     : id.value,
            "nom"    : nom.value,
            "membres": member 
        }).then(()=>{
            toast.success(nom.value + "modification efféctué")
            setMember([])
        })
        .catch((err) => {
            toast.error(err.response.data);
        })
    }
    /************************supprimer un groupe ************************/
    const deleteGroup = (id) => {
         http.delete(`group/deleteGroup/${id}`)
            .then(() => {
                toast.success("Supprimé avec succès !");
                setGroupData(prev => prev.filter(groupId => groupId.id !== id));
            })
            .catch(err => {
                console.error(err);
                toast.error("Une erreur est survenue !");
            });
    }

    /************************supprimer un membre du groupe ************************/
    const deleteFromGroup = (groupId, userId) => {
        http.delete(`/group/deleteMember?groupId=${groupId}&userId=${userId}`)
            .then(() => {
                toast.success("Supprimé avec succès !");
                setBackendData(prev => prev.filter(user => user.id !== userId));
            })
            .catch(err => {
                console.error(err);
                toast.error("Une erreur est survenue !");
            });
    }

    

    const dialogField = {
        /* Texte */
        "& .MuiInputBase-input": {
            color: "#fff",
        },

        /* Label */
        "& .MuiInputLabel-root": {
            color: "#ffffffb3",
        },
        "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled": {
            color: "#c1c1c1ff",
            backgroundColor: "transparent", // pas de fond 
            padding: "0 6px",
        },

        /* Champ et bordures */
        "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent", // champ principal
            "&.Mui-focused": {
                backgroundColor: "transparent", // focus
            },
            "&.Mui-disabled": {
                backgroundColor: "transparent", // disabled
            },
            "& fieldset": {
                borderColor: "#ffffff80",
            },
            "&:hover fieldset": {
                borderColor: "#fff",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#b8b8b8ff",
            },
        },
    };

    const [queueSize, setQueueSize] = useState()

    const getQueueSize = () => {
        http.get("/queueSize").then((res) => {
            const size = res.data
            setQueueSize(size)
            console.log("queue size : " + size)
        }).catch((err) => {
            console.log(err);
        })
    }
    
    const endTheChat = () =>{
        
        http.put(`/makeUserAsFree?matr=${user.matricule}&state=${"FREE"}`)
        
        toast.info("chat ending");
    
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
    

    return (
        <div
            style={{
                    background:"linear-gradient(135deg, #f3f3f3ff, #ecf2ffff)",
                    minHeight: "100vh",
                    fontFamily: "Inter, sans-serif",
                    //padding: 20,
                /*
                padding: 20,
                background: "#ececf1",
                boxSizing: "border-box"
            */}}
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

            {/************************************************NAVBAR*************************************************/} 
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", sm: "space-between" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 },
                    px: 3,
                    py: 1,
                    //background: "rgba(255, 255, 255, 0.75)",
                    background:"#e4f8faff",
                    backdropFilter: "blur(14px)",
                    borderBottom: "1px solid rgba(178, 178, 178, 0.48)",
                    //boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                {/************************************************Logo*************************************************/}
                <Box>
                    <img src="images/LOGO_DGI_OK.png" width="50px" />
                </Box>

                {/************************************************Titre*************************************************/}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <AdminPanelSettingsIcon
                        sx={{
                            color: "#2b3a3a",
                            width: 40,
                            height: 40,
                            background: "rgba(145,196,198,0.25)",
                            borderRadius: "12px",
                            p: 0.8,
                        }}
                    />

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#1f2d2d",
                            letterSpacing: "-0.4px",
                        }}
                    >
                        Administrateur
                    </Typography>
                </Box>

                {/************************************************Actions*************************************************/}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    {Notification(notification)}

                    <IconButton
                        sx={{
                            color: "#1f2d2d",
                            background: "rgba(145,196,198,0.2)",
                            borderRadius: "12px",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                background: "rgba(145,196,198,0.35)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        <SettingsIcon />
                    </IconButton>

                    <Avatar
                        sx={{
                            background: "linear-gradient(135deg, #91c4c6, #cfeff1)",
                            width: 40,
                            height: 40,
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#1f2d2d",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                        }}
                    >
                        U
                    </Avatar>
                </Box>
            </Box>



            <div style={{ 
                display: "flex", 
                flexWrap:"wrap",
                gap: 2,
                flexDirection: window.innerWidth < 900 ? "column" : "row",
                width: "100%",
            }}>

                {/************************************************SIDEBAR*************************************************/} 
                <Stack
                    sx={{
                        background:"#262626ff",
                        //"#073766ff",
                        //"linear-gradient(180deg, #edededff, #d7e4e5ff)",
                        //boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                        minWidth: { xs: "100%", sm: 200, md: 80 },
                        width: { xs: "100%", lg: "auto" },
                        padding:1,
                        borderRight: "1px solid rgba(255,255,255,0.35)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <List
                        sx={{
                            color: "#fff",
                            pt: 2,
                        }}
                    >
                        {[
                            { label: "Tables", icon: <Grid4x4Icon sx={{color:"#a9d9de"}}/> },
                            { label: "Analytiques", icon: <AnalyticsSharpIcon sx={{color:"#a9d9de"}}/> },
                            { label: "Chat", icon: <ChatIcon sx={{color:"#a9d9de"}}/> },
                            { label: "Messages", icon: <AreaChartIcon sx={{color:"#a9d9de"}}/> },
                            { label: "Notification", icon: <NotificationsNoneIcon sx={{color:"#a9d9de"}}/> },
                            { label: "Paramètres", icon: <SettingsIcon sx={{color:"#a9d9de"}}/> },
                            { label: "Déconnexion", icon: <PowerSettingsNewIcon sx={{color:"#a9d9de"}}/> },
                        ].map((item, i) => (
                            <ListItemButton
                                key={i}
                                onClick={() => handleSidebar(i)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 1,
                                    paddingY: 1.6,
                                    paddingX: 2,
                                    borderRadius: 2,
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        background: "rgba(255,255,255,0.25)",
                                        transform: "translateX(4px)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: "#a9d9de",
                                            opacity: 0.9,
                                            mb: 0.5,
                                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "11px",
                                            color: "#a9d9de",
                                            opacity: 0.85,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            </ListItemButton>
                        ))}
                    </List>
                </Stack>


                {/************************************************MAIN CONTENT*************************************************/} 
                <div
                    style={{
                        flex: 4,
                        background:"linear-gradient(135deg, #a9d9de, #ecf2ffff)",
                        padding:"10px",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.10)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    {/************************************************sidebar TABLES*************************************************/} 
                    {sidebarIndex === 0 && (
                        <>
                            <div
                                sx={{
                                    padding:"2px",
                                }}
                            >
                                {/* TABS */}
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        borderBottom: "2px solid #4545458f",
                                        marginBottom: 20,
                                        gap: 8
                                    }}
                                >
                                    {["Gérer les utilisateurs", "Gérer les groupes", "Video", "Messages"].map(
                                        (label, idx) => {
                                            const bgColors = ["#a9d9de", "#a9d9de", "#a9d9de", "#a9d9de"];
                                            //const activeColors = ["#5719d2ff", "#8219d2ff", "#c319d2ff", "#d2198eff"];
                                            const activeColors = ["#76aaaa", "#76aaaa", "#76aaaa", "#76aaaa"];
                                            return (
                                                <Button
                                                    key={idx}
                                                    onClick={() => handleTab(idx)}
                                                    sx={{
                                                        padding:"10px 10px",
                                                        color:"#363636b0",
                                                        fontWeight:600,
                                                        fontSize: 11,
                                                        textAlign:"start",
                                                        bgcolor:  tabIndex === idx
                                                                            ? "#989fa417"
                                                                            : bgColors[idx],
                                                        //boxShadow: tabIndex === idx
                                                                           //</div> ? "0 4px 10px" + activeColors[idx]
                                                                           // : "0 4px 10px rgba(109, 70, 139, 0.43)",
                                                        borderBottom:
                                                            tabIndex === idx
                                                                ? `3px solid ${activeColors[idx]}`
                                                                : "3px solid transparent",
                                                        
                                                    }}
                                                >
                                                    {label}
                                                </Button>
                                            );
                                        }
                                    )}
                                </div>

                                {/* TAB CONTENT */}
                                    {/************************************************TAB CONTENT 1*************************************************/}  
                                {tabIndex === 0 && (
                                    <>
                                        
                                                {/***************************************Header du tableau*******************************/}
                                                <Box sx={{
                                                    display: "flex",
                                                    flexWrap:"wrap",
                                                    flexDirection: { xs: "column", sm: "row" },
                                                    alignItems: { xs: "stretch", sm: "center" },
                                                    //justifyContent: "space-between",
                                                    gap: 1,
                                                }}>
                                                    {["Agents", "Libres", "Actifs", "En ligne"].map((title, idx) =>{
                                                            const iconList = [<PersonIcon fontSize="small" />, <Groups3Icon fontSize="small" />, 
                                                                            <ChatBubbleIcon fontSize="small" /> , <Groups3Icon fontSize="small" />]
                                                            const iconbgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                                                            const bgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                                                            const valueItem = [backendData.length, 0 , 0, onLineAgent.length];
                                                            return (
                                                                <StateValueCard
                                                                    key={idx}
                                                                    title={title}
                                                                    value={valueItem[idx]}
                                                                    subtitle="Effectif"
                                                                    color={bgColors[idx]}
                                                                    icon={iconList[idx]}
                                                                    iconBg={iconbgColors[idx]}
                                                                    
                                                                />   
                                                            );

                                                        })
                                                    }
                                                    {/*<StatsCard
                                                        key={0}
                                                        title={statsData.title}
                                                        value={statsData.value}
                                                        icon={statsData.icon}
                                                        trend={statsData.trend}
                                                        trendUp={statsData.trendUp}
                                                        color={statsData.color}
                                                    />*/}
                                                   
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: { xs: "column", sm: "row" },
                                                        alignItems: { xs: "stretch", sm: "center" },
                                                        justifyContent: "space-between",
                                                        gap: 2,
                                                        mb: 3,
                                                    }}
                                                >
                                                    

                                                    {/*************************************************Ajouter******************************************/}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            justifyContent: { xs: "center", sm: "flex-start" },
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<AddIcon />}
                                                            onClick={addNewAgent}
                                                            sx={{
                                                                padding: "10px 14px",
                                                                //borderRadius: 5,
                                                                border: "1px solid #6d6d6d71",
                                                                fontWeight: 600,
                                                                fontSize: 11,
                                                                color: "#ffffffff",
                                                                background:"#0738fbe4",
                                                                    //"linear-gradient(135deg, #315050ff, #a9d9de)",
                                                                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                                                                textTransform: "none",
                                                                "&:hover": {
                                                                    background:"#0738fbcd",
                                                                        //"linear-gradient(135deg, #3f8588ff, #a9d9de)",
                                                                    //boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                                                                },
                                                            }}
                                                        >
                                                            Nouveau agent
                                                        </Button>
                                                    </Box>


                                                    {/*************************************************Recherche***************************************/}
                                                    <TextField
                                                        placeholder="Rechercher un agent..."
                                                        size="small"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        fullWidth
                                                        sx={{
                                                            maxWidth: { xs: "100%", sm: 300 },
                                                            borderRadius: 2,
                                                            background:"#fff",
                                                                //"linear-gradient(135deg, rgba(118,170,170,0.35), rgba(169,217,222,0.25))",
                                                            backdropFilter: "blur(10px)",
                                                            border: "1px solid rgba(255,255,255,0.35)",

                                                            "& .MuiOutlinedInput-root": {
                                                                color: "#1f2d2d",
                                                                fontSize: "11px",
                                                                padding: "4px 6px",
                                                            },

                                                            "& fieldset": {
                                                                border: "none",
                                                            },

                                                            "&:hover": {
                                                                background:"#dededeff"
                                                                    //"linear-gradient(135deg, rgba(118,170,170,0.45), rgba(169,217,222,0.35))",
                                                            },
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <SearchIcon
                                                                    sx={{
                                                                        color: "#1f2d2d",
                                                                        opacity: 0.6,
                                                                        mr: 1,
                                                                    }}
                                                                />
                                                            ),
                                                        }}
                                                />

                                                </Box>

                                                {/************************************************TABLE*******************************************/}
                                                
                                                <TableBoard
                                                    tabHeader={[
                                                        { label: "ID", key: "id" },
                                                        { label: "Nom", key: "nom" },
                                                        { label: "Email", key: "email" },
                                                        { label: "Matricule", key: "matricule" },
                                                        { label: "Mot de passe", key: "motDePasse" },
                                                        { label: "Etat", key: "etat" },
                                                        { label: "Groupe", key: "groupName" },
                                                        { label: "Actions", key: "actions" },
                                                    ]}
                                                    data={backendData}
                                                    renderActions={(row) => (
                                                        <>
                                                            <IconButton
                                                                onClick={() => handleOpen(row)}
                                                                sx={{ padding: { xs: 0.5, sm: 1 }, color: "#01b613ef" }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>

                                                            <IconButton
                                                                onClick={() => handleDelete(row.id)}
                                                                sx={{ padding: { xs: 0.5, sm: 1 }, color: "#fa1212d9" }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                />
                                                {open && (
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

                                                                <UpdateForm
                                                                    data={data}
                                                                    avatar={userLogo}
                                                                    onSubmit={handleUpdate}
                                                                    close={handleClose}
                                                                />
                                                                </Box>
                                                            </Box>
                                                            )}

                                                <Dialog
                                                    open={openCreateModal}
                                                    onClose={quitCreation}
                                                    fullWidth
                                                    maxWidth="sm"
                                                    PaperProps={{
                                                        sx: {
                                                        background: `linear-gradient(135deg, ${palette.light}, #ffffff)`,
                                                        borderRadius: 3,
                                                        boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
                                                        },
                                                    }}
                                                >
                                                    {/* HEADER AVEC ICÔNE FERMER*/}
                                                    <DialogTitle
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            height: 56,
                                                            fontFamily: "Montserrat",
                                                            fontWeight: 600,
                                                            letterSpacing: 0.5,
                                                            
                                                        }}
                                                    >
                                                        <Typography sx={{ 
                                                            color: "#141414ff",
                                                            fontWeight:"bold"
                                                        }}>Créer un nouveau agent</Typography>
                                                        
                                                    
                                                        <IconButton onClick={quitCreation} sx={{ color: "#fbfbfbff", p: 1, bgcolor:"#f93030ff", width:20, height:20}}>
                                                            <CloseIcon sx={{
                                                                width:20, 
                                                                height:20
                                                            }}/>
                                                        </IconButton>

                                                    </DialogTitle>
                                                    <DialogContent sx={{
                                                        background: `linear-gradient(135deg, ${palette.light}, #ffffff)`,
                                                        py: 4,
                                                    }}>
                                                        <form onSubmit={handleCreate}>
                                                            <Stack spacing={3}>
                                                                {/* Avatar */}
                                                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                                    
                                                                </Box>

                                                                {/* Inputs en flex-wrap */}
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        flexWrap: "wrap",
                                                                        gap: 2,
                                                                       
                                                                        justifyContent: "space-between",
                                                                        "& > *": {
                                                                            flex: { xs: "1 1 100%", sm: "1 1 45%" }
                                                                        }
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        label="Nom"
                                                                        name="nom"
                                                                        id="nom"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={field}
                                                                    />

                                                                    <TextField
                                                                        label="Matricule"
                                                                        id="matricule"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={field}
                                                                    />

                                                                    <TextField
                                                                        label="Email"
                                                                        id="email"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={field}
                                                                    />

                                                                    <TextField
                                                                        label="Numéro"
                                                                        id="numero"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={field}
                                                                    />

                                                                    <TextField
                                                                        label="Mot de passe"
                                                                        id="motDePasse"
                                                                        size="small"
                                                                        type="password"
                                                                        sx={field}
                                                                    />
                                                                </Box>

                                                                {/* BOUTON ENREGISTRER */}
                                                                <Box sx={{ 
                                                                        display: "flex", 
                                                                        justifyContent: "space-around",

                                                                    }}>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
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
                                                                        Creer
                                                                    </Button>
                                                                </Box>
                                                            </Stack>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                                    {/************************************************TAB CONTENT 2*************************************************/}     
                                {tabIndex === 1 && (
                                    <>
                                                {/* Header du tableau */}
                                                <Box sx={{
                                                    display: "flex",
                                                    flexWrap:"wrap",
                                                    flexDirection: { xs: "column", sm: "row" },
                                                    alignItems: { xs: "stretch", sm: "center" },
                                                    //justifyContent: "space-between",
                                                    gap: 1,
                                                }}>
                                                    
                                                    {["Groupes", "Mensions", "Actifs", "En ligne"].map((title, idx) =>{
                                                            const iconList = [<PersonIcon fontSize="small" />, <Groups3Icon fontSize="small" />, 
                                                                            <ChatBubbleIcon fontSize="small" /> , <Groups3Icon fontSize="small" />]
                                                            const iconbgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                                                            const bgColors = ["#5719d2ff", "#2196f3", "#43a047", "#ff7043"];
                                                            return (
                                                                <StateValueCard
                                                                    key={idx}
                                                                    title={title}
                                                                    value={backendData.length}
                                                                    subtitle="Effectif"
                                                                    color={bgColors[idx]}
                                                                    icon={iconList[idx]}
                                                                    iconBg={iconbgColors[idx]}
                                                                    
                                                                />   
                                                            );

                                                        })
                                                    }
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: { xs: "column", sm: "row" },
                                                        alignItems: { xs: "stretch", sm: "center" },
                                                        justifyContent: "space-between",
                                                        gap: 2,
                                                        mb: 3,
                                                    }}
                                                >
                                                      {/************************************************NOUVEAU GROUPE*************************************************/}  
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            justifyContent: { xs: "center", sm: "flex-start" },
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<AddIcon/>}
                                                            onClick={addNewAgent}
                                                            sx={{
                                                                 padding: "10px 14px",
                                                                //borderRadius: 5,
                                                                border: "1px solid #6d6d6d71",
                                                                fontWeight: 600,
                                                                fontSize: 11,
                                                                color: "#ffffffff",
                                                                background:"#0738fbe4",
                                                                    //"linear-gradient(135deg, #315050ff, #a9d9de)",
                                                                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                                                                textTransform: "none",
                                                                "&:hover": {
                                                                    background:"#0738fbcd",
                                                                        //"linear-gradient(135deg, #3f8588ff, #a9d9de)",
                                                                    //boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                                                                },
                                                            }}
                                                        >Nouveau groupe</Button>
                                                    </Box>

                                                      {/************************************************BARRE DE RECHERCHE*************************************************/}        
                                                    {/* Recherche */}
                                                    <TextField
                                                        placeholder="Rechercher un agent..."
                                                        size="small"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        fullWidth
                                                        sx={{
                                                            maxWidth: { xs: "100%", sm: 300 },
                                                            border:"none",
                                                            borderRadius:2,
                                                            bgcolor:"#373434ff",
                                                            "& .MuiOutlinedInput-root": {
                                                                color: "white",
                                                                fontSize:"11px",
                                                                padding:"3px 3px",
                                                            },
                                                            "& fieldset": {
                                                                //borderColor: "#2d2d2dff",
                                                            },
                                                            "&:hover fieldset": {
                                                                //borderColor: "#d9d9d9ff",
                                                            },
                                                        }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <SearchIcon sx={{ color: "#f3f3f39c", mr: 1 }} />
                                                            ),
                                                        }}
                                                    />
                                                </Box>

                                                    {/************************************************TABLE DES GROUPES*************************************************/}  
                                                
                                                 <TableBoard
                                                    tabHeader={[
                                                        { label: "ID", key: "groupId" },
                                                        { label: "Nom", key: "nom" },
                                                        { label: "Abonnes", key: "abonnes" },
                                                        { label: "Date de création", key: "dateDeCreation" },
                                                        { label: "Actions", key: "actions" },
                                                    ]}
                                                    data={groupData}
                                                    renderActions={(row) => (
                                                        <>
                                                            <IconButton
                                                                onClick={() => updateGroup(row)}
                                                                sx={{ padding: { xs: 0.5, sm: 1 }, color: "#ffffffd9" }}
                                                            >
                                                                <UpdateIcon fontSize="small" />
                                                            </IconButton>

                                                            <IconButton
                                                                onClick={() => deleteGroup(row.groupId)}
                                                                sx={{ padding: { xs: 0.5, sm: 1 }, color: "#ffffffd9" }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                />
                                                    {/************************************************METTRE A JOUR UN GROUPE*************************************************/}  
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    fullWidth
                                                    maxWidth="sm"
                                                    sx= {{
                                                            width: "100%", 
                                                            margin: 0 , 
                                                            borderRadius:3, 
                                                        }}
                                                    
                                                >
                                                    {/* HEADER AVEC ICÔNE FERMER */}
                                                    <DialogTitle
                                                        sx={{
                                                            color: "#f2f2f2ff",
                                                            bgcolor:"#261a36ff",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            textAlign: "center",
                                                            fontWeight : 600
                                                        }}
                                                    >
                                                        Mettre a jour le groupe
                                                        {/* Icône Annuler */}
                                                        <IconButton onClick={handleClose}>
                                                            <CloseIcon sx={{ color: "#ecececff" }} />
                                                        </IconButton>
                                                    </DialogTitle>
                                                    <DialogContent sx={{ backgroundColor: "#1b1b1bff" }}>
                                                        <form onSubmit={saveUpdate}>
                                                            <Stack spacing={3}>
                                                                {/* Avatar */}
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    justifyContent: "center"
                                                                }}></Box>
                                                                {/* Inputs en flex-wrap */}
                                                                <Stack
                                                                    sx={{
                                                                        gap: 2
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        value={groupInfo.groupId}
                                                                        disabled={true}
                                                                        name="id"
                                                                        id="id"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={{
                                                                            flex: "1 1 45%",
                                                                            bgcolor: "#3939399a",
                                                                            "& .MuiOutlinedInput-root": {
                                                                                color: "white",
                                                                                fontSize: "13px",
                                                                                padding: "3px 3px",
                                                                            },
                                                                        }}
                                                                    />
                                                                    <TextField
                                                                        placeholder={groupInfo.nom}
                                                                        name="nom"
                                                                        id="nom"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={{
                                                                            flex: "1 1 45%",
                                                                            bgcolor: "#3939399a",
                                                                            "& .MuiOutlinedInput-root": {
                                                                                color: "white",
                                                                                fontSize: "13px",
                                                                                padding: "3px 3px",
                                                                            },
                                                                        }}
                                                                    />
                                                                    <Typography sx={{ fontWeight: "bold", color: "#ffffffd7" }}>Ajouter des membres</Typography>
                                                                    <Stack
                                                                        sx={{
                                                                            background: "#0d0d0d92",
                                                                            padding: 2,
                                                                            overflowX: "auto",  // scroll horizontal sur mobile
                                                                            overflowY: "auto",
                                                                            maxHeight: 200,
                                                                        }}
                                                                    >

                                                                        <Box stickyHeader
                                                                            sx={{
                                                                                display: "flex",
                                                                                justifyContent: "space-between",
                                                                                bgColor: "#353535ff"
                                                                            }}
                                                                        >
                                                                            <Typography sx={{ fontSize: "13px", color: "#ffffffd7" }}>Numero</Typography>
                                                                            <Typography sx={{ fontSize: "13px", color: "#ffffffd7" }}>Nom</Typography>
                                                                            <Typography sx={{ fontSize: "13px", color: "#ffffffd7" }}>Matricule</Typography>
                                                                            <Typography sx={{ fontSize: "13px", color: "#ffffffd7" }}>Selectioner</Typography>
                                                                        </Box>

                                                                        {agentWithGroup.map((row) => (
                                                                            <Box
                                                                                key={row.userId}
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    flex: "wrap",
                                                                                    padding: 2,
                                                                                    justifyContent: "space-between",
                                                                                    borderBottom: "1px solid #58585830",
                                                                                    alignItems: "center",
                                                                                    "&:hover": {
                                                                                        backgroundColor: "#58585830",
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.userId}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.nom}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.matricule}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>
                                                                                    <IconButton onClick={() => deleteFromGroup(groupInfo.groupId, row.userId)}>
                                                                                        <CloseIcon sx={{ color: "#ecececff" }} />
                                                                                    </IconButton>
                                                                                </Box>
                                                                            </Box>
                                                                        ))}

                                                                        {agentWithNoGroup.map((row) => (
                                                                            <Box
                                                                                key={row.userId}
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    flex: "wrap",
                                                                                    padding: 2,
                                                                                    justifyContent: "space-between",
                                                                                    borderBottom: "1px solid #58585830",
                                                                                    alignItems: "center",
                                                                                    "&:hover": {
                                                                                        backgroundColor: "#58585830",
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.id}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.nom}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>{row.matricule}</Box>
                                                                                <Box sx={{ fontSize: "14px", color: "#ffffffd7" }}>
                                                                                    <input type="checkbox" name="ajouter" id="ajouter" onChange={() => addCheck(row)} />
                                                                                </Box>
                                                                            </Box>
                                                                        ))}

                                                                    </Stack>
                                                                </Stack>

                                                                {/* BOUTON ENREGISTRER */}
                                                                <Box sx={{ display: "flex", justifyContent: "center"}}>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        sx={{
                                                                            bgcolor: "#e6f7ffb5",
                                                                            fontWeight:600,
                                                                            fontSize:"15px",
                                                                            color:"#101010ec",
                                                                            px: 4,
                                                                            "&:hover": { bgcolor: "#e6f7ff7e" }
                                                                        }}
                                                                    >
                                                                        Enregistrer
                                                                    </Button>
                                                                </Box>
                                                            </Stack>
                                                        </form>
                                                    </DialogContent>

                                                    {/* Plus de DialogActions */}
                                                </Dialog>
                                                        
                                                    {/************************************************CREER UN GROUPE*************************************************/}                
                                                <Dialog
                                                    open={openCreateModal}
                                                    onClose={quitCreation}
                                                    fullWidth
                                                    maxWidth="sm"
                                                    PaperProps={{
                                                        sx: { width: "100%", margin: 0 }
                                                    }}
                                                >
                                                    {/* HEADER AVEC ICÔNE FERMER */}
                                                    <DialogTitle
                                                        sx={{
                                                            backgroundColor: "#282828ff",
                                                            color: "#ecececff",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        Nouveau groupe

                                                        {/* Icône Annuler */}
                                                        <IconButton onClick={quitCreation}>
                                                            <CloseIcon sx={{ color: "#f3f3f3ff" }} />
                                                        </IconButton>
                                                    </DialogTitle>

                                                    <DialogContent sx={{ backgroundColor: "#1b1b1bff" }}>
                                                        <form onSubmit={createGroup}>
                                                            <Stack spacing={3}>
                                                                {/* Avatar */}
                                                                <Box sx={{ 
                                                                    display: "flex", 
                                                                    justifyContent: "center" }}></Box>
                                                                {/* Inputs en flex-wrap */}
                                                                <Stack
                                                                    sx={{
                                                                       gap:2
                                                                    }}
                                                                >
                                                                    <TextField
                                                                        placeholder="Nom"
                                                                        name="nom"
                                                                        id="nom"
                                                                        type="text"
                                                                        size="small"
                                                                        sx={{ flex: "1 1 45%", 
                                                                            bgcolor:"#3939399a",
                                                                             "& .MuiOutlinedInput-root": {
                                                                                color: "white",
                                                                                fontSize:"13px",
                                                                                padding:"3px 3px",
                                                                            },
                                                                        }}
                                                                    />
                                                                    <Typography sx={{fontWeight:"bold", color:"#ffffffd7"}}>Ajouter des membres</Typography>
                                                            <Stack
                                                                sx={{
                                                                        background: "#0d0d0d92",
                                                                        padding:2,
                                                                        overflowX: "auto",  // scroll horizontal sur mobile
                                                                        overflowY: "auto",
                                                                        maxHeight: 200,
                                                                    }}
                                                            >
                                                                
                                                                <Box stickyHeader
                                                                    sx={{
                                                                        display:"flex",
                                                                        justifyContent:"space-between",
                                                                        bgColor:"#353535ff"
                                                                    }}
                                                                >
                                                                 <Typography sx={{fontSize:"13px", color:"#ffffffd7"}}>Numero</Typography>
                                                                 <Typography sx={{fontSize:"13px", color:"#ffffffd7"}}>Nom</Typography>
                                                                 <Typography sx={{fontSize:"13px", color:"#ffffffd7"}}>Matricule</Typography>
                                                                 <Typography sx={{fontSize:"13px", color:"#ffffffd7"}}>Selectioner</Typography>   
                                                                </Box>
                                                                {agentWithNoGroup.map((row) => (
                                                                    <Box
                                                                        key={row.userId}
                                                                        sx={{
                                                                            display:"flex",
                                                                            flex:"wrap",
                                                                            padding:2,
                                                                            justifyContent:"space-between",
                                                                            borderBottom:"1px solid #58585830",
                                                                            alignItems:"center",
                                                                            "&:hover": {
                                                                                backgroundColor: "#58585830",
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Box sx={{fontSize:"14px", color:"#ffffffd7"}}>{row.id}</Box>
                                                                        <Box sx={{fontSize:"14px", color:"#ffffffd7"}}>{row.nom}</Box>
                                                                        <Box sx={{fontSize:"14px", color:"#ffffffd7"}}>{row.matricule}</Box>
                                                                        <Box sx={{fontSize:"14px", color:"#ffffffd7"}}>
                                                                            <input type="checkbox" name="ajouter" id="ajouter" onChange={() => addCheck(row)} />
                                                                        </Box>
                                                                    </Box>
                                                                ))}</Stack>
                                                                </Stack>

                                                                {/* BOUTON ENREGISTRER */}
                                                                <Box sx={{ display: "flex", justifyContent: "center"}}>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        sx={{
                                                                            bgcolor: "#e6f7ffb5",
                                                                            fontWeight:600,
                                                                            fontSize:"15px",
                                                                            color:"#101010ec",
                                                                            px: 4,
                                                                            "&:hover": { bgcolor: "#e6f7ff7e" }
                                                                        }}
                                                                    >
                                                                        Creer
                                                                    </Button>
                                                                </Box>
                                                            </Stack>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                            </div>
                        </>
                    )}


                    {/************************************************sidebar GRAPH*************************************************/} 
                    {sidebarIndex === 1 && (
                        <>
                            <div>
                                <Typography 
                                    sx={{
                                            color:"rgba(235, 235, 235, 1)",
                                            margin:2,
                                            fontSize:"20px",
                                            fontWeight:"bold",
                                            borderBottom:"1px solid #a5a5a5be"
                                        }}>
                                            Analytiques
                                </Typography>
                                        {/********STAT CARD*******/}
                                <Stack 
                                    sx={{
                                        flexDirection:"row",
                                        flexWrap:"wrap",
                                        gap:2,
                                        px:4,
                                    }}
                                >
                                    <StateValueCard
                                        title="Chat"
                                        value={chatVolume}
                                        subtitle="Aujourd'hui"
                                        color="rgba(23, 59, 237, 0.93)"
                                        icon={<MessageIcon/>}
                                        iconBg="rgba(28, 155, 17, 0.93)"
                                    />
                                    <StateValueCard
                                        title="File d'attente" 
                                        value={queueSize}
                                        subtitle="Aujourd'hui"
                                        color="rgba(45, 91, 255, 0.93)"
                                        icon={<CloudQueueIcon/>}
                                        iconBg="rgba(255, 94, 45, 0.93)"
                                    />
                                    <StateValueCard
                                        title="Durée moyen d'un chat" 
                                        value={averageChat.length!=0?averageChat[0].seconds:0}
                                        subtitle="Aujourd'hui"
                                        color="rgba(45, 91, 255, 0.93)"
                                        icon={<ChatBubbleIcon/>}
                                        iconBg="rgba(45, 132, 255, 0.93)"
                                    />
                                    {/*["Durée moyen d'un chat", "Temps de reponse moyen"].map((title, idx) => {
                                            const  iconList = [<PersonIcon/>, <Groups3Icon/>,
                                                                <ChatBubbleIcon />, <PersonIcon />
                                            ]
                                            return(
                                                <RadarCard
                                                    title={title}
                                                    value={backendData.length}
                                                    icon={iconList[idx]}
                                                    color="rgba(45, 91, 255, 0.93)"
                                                />
                                            )
                                        })
                                    */}
                                   
                                </Stack>
                                
                                        {/********COURBES*******/}
                                 <Stack
                                    sx={{
                                        flexDirection:"row",
                                        justifyContent:"space-between",
                                        flexWrap:"wrap",
                                        gap:2,
                                        p:4,
                                    }}
                                >

                                    <QueueEvolutionCard
                                        data={queue}
                                    />

                                    <DurationList
                                        data={listDuration}
                                        height={320}
                                        dateFormat="HH:mm"
                                    />

                                    <ChatVolume
                                        title="Volume de discussion par jours"
                                        messages={simulatedMessages}
                                    />
                                    
                                </Stack>
                                
                            </div>
                        </>
                    )}

                    {/************************************************sidebar CHATROOM*************************************************/} 
                    {sidebarIndex === 2 && (
                        <>
                        
                        <Stack
                            sx={{
                                display:"flex",
                                flexDirection:"column",
                                justifyContent:"center",
                                alignContent:"center",
                                my:"7%",
                                height:"500px",
                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.56)",
                                borderRadius:3
                            }}
                        >
                        

                        <Button 
                            variant="outlined" 
                            onClick={() => endTheChat()}
                            sx={{
                                color:"#fff",
                                fontSize:"11px",
                                border:"1px solid #d4131364", 
                                bgcolor:"#d90202ff",
                                //boxShadow: "0 10px 10px rgba(94, 30, 30, 0.42)", 
                                width:"200px",
                                alignSelf:"flex-end"
                            }}
                        >
                            Terminer la discussion  
                        </Button>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.2,
                                }}
                            >
                                {messages.map((msg, index) => (OwnMessage(user, msg, index)))}
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    backdropFilter: "blur(8px)",
                                    borderTop: "1px solid rgba(145,196,198,0.2)",
                                    display:"flex",
                                    flexDirection:"column",
                                    gap:2,
                                    alignItems: "center",
                                    justifyContent:"center",
                                }}
                            >
                                <Stack direction="row" spacing={1} sx={{
                                    alignItems: "center",
                                    justifyContent:"center",
                                    borderRadius: 3,
                                }}>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Écris ton message…"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                background: "#262626ff",
                                                color: "#fff",
                                                borderRadius: 2,
                                                width: "100vh",
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
                                        onClick={() => {sendMessage();}}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "14px",
                                            background: "#76aaaa",
                                            boxShadow: "0 8px 20px rgba(22, 22, 22, 0.35)",
                                            "&:hover": {
                                                background: "#7fb3b5",
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 10px 24px rgba(145,196,198,0.45)",
                                            },
                                        }}
                                    >
                                        <ArrowUpwardSharpIcon sx={{
                                            color: "white",
                                        }} />
                                    </IconButton>
                                </Stack>
                            </Box>
                        </Stack>
                        </>
                    )}

                    {/************************************************sidebar GRAPH2*************************************************/} 
                    {sidebarIndex === 3 && (
                        <>
                            <div>
                                Artfcel
                            </div>
                        </>
                    )}
                    {/************************************************sidebar GRAPH2*************************************************/} 
                    {sidebarIndex === 4 && (
                        <>
                            {
                            notificationTable.length != 0?(<NotificationPanel 
                                    data={{
                                        type: dashNotif.type,
                                        title: dashNotif.title,
                                        content: dashNotif.content,
                                        message: dashNotif.message,
                                        session : dashNotif.session
                                    }}
                                    />):"Pas de notification pour le moment"
                            }
                        </>
                    )}
                    
                </div>
                
            </div>
        </div>
    );
}

export default Dashboard
