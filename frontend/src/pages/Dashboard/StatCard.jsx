import {Card, CardContent, Typography, Box} from "@mui/material";

export function StatCard({title,value,icon,color}){
    const valueStyle = {color:"#ffffffc3"}
    return(
        <Card
            sx={{
                background:"linear-gradient(135deg, #323232ff, #1f2022ff)",
                //background:"#171f34ff",
                borderRadius:3,
                width:"200px",
                marginBottom:2,
                //boxShadow:"0 10px 30px rgba(0,0,0,0.6)",
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center"
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="gray">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontStyle="bold" sx={valueStyle}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor:color,
                            borderRadius:"50%",
                            p:1.5,
                            color:"#fff",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
/*utilisaton
<StatCard
title="Utlsateur"
icon={<Person4Icon/>}
value="12"
color="#fff"
/>

*/