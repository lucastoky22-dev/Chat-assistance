import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import PersonIcon from '@mui/icons-material/Person';


dayjs.extend(utc);
dayjs.extend(timezone);

const OwnMessage = (user, msg, index) => {
    //if (!user.nom) return <></>;
    let isMe = "";
    
    isMe = msg.sender.nom === user.nom;

    const timeStamp     = msg.timeStamp; 
    const formattedTime = dayjs(timeStamp)
      .format("HH:mm");

    return (
         <>
         <Box sx={{
            alignSelf: isMe ? "flex-end" : "flex-start",
            display:"flex",
            alignItems:"center",
            flexDirection:"row",
            gap:1,
            m:0
         }}>
            <Box >
                <PersonIcon sx={{ color:"white", borderRadius:"50%", bgcolor:"#1ea27fff", width:"30px", height:"30px"}}/>
            </Box>
            <Box
                key={index}
                sx={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    bgcolor: isMe ? "#1976d2" : "#f3f3f3ff",
                    color: isMe ? "white" : "#333",
                    p: 1.2,
                    px: 1.6,
                    borderRadius: 3,
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.28)",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <Typography variant="caption" sx={{color: isMe ? "#5aff83ff" : "#1a7a89ff", fontWeight: 600 }}>
                      {msg.sender.nom}
                </Typography>
                <Box 
                    sx={{
                        display:"flex",
                        flexDirection:"column",
                    }}
                >
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {msg.content}
                    </Typography>
                    
                    <Typography variant="caption" sx={{ color: isMe ? "#ffffff9a" : "#00000087", fontSize:"11px",alignSelf: "flex-end"}}>
                      {formattedTime}
                    </Typography>
                </Box>
            </Box>
        </Box>
             </>
    );
};

export default OwnMessage;
