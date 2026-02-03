import { BackHand, Padding } from "@mui/icons-material";

export const cardStyle = {
    background:"#f4f8ffff", 
        //"linear-gradient(135deg, #b3daffff, #ecf2ffff)",
        //"linear-gradient(135deg, rgba(169,217,222,0.85), rgba(145,196,198,0.75))", // gradient modifié pour plus de clarté
    borderRadius: 3,
    marginBottom: 2,
    border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "0 10px 10px rgba(12, 110, 181, 0.4)",
    minWidth: 250,
    backdropFilter: "blur(12px)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
    },
};
export const areaGraphStyle = {
    background: "#f4f8ffff",
    //boxShadow: "0 10px 25px rgba(0, 0, 0, 0.41)",
    borderRadius: 3,
    width: "500px",
    height: "400px",
    border: "1px solid #9d9d9d5c",
}

export const chartWrapper = {
    width: 200, 
    height: 220, 
    position: "relative"
}