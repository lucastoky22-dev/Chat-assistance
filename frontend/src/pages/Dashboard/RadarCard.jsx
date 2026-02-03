import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Box, Typography } from "@mui/material";
import { useState } from 'react';
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export function RadarCard({ title, value, icon, color }) {

    const [trendicon, setTrendicon] = useState();
    const con = [
                    <TrendingUpIcon/>, 
                    <TrendingDownIcon/>
                ]

    const valueStyle = { color: "#ffffffc3" }

    const data = [
        {
            name: "Value",
            value: value,
        },
    ];

    const getColor = (value) => {
        if (value < 40) {// rouge
            return "#f44336";
        }   
        if (value < 70) {
            return "#ff9800";
        }   // orange
        return "#4caf50";                  // vert
    };

    const chartColor = getColor(value);
    return (

        <Card
            sx={{
               //background: "linear-gradient(135deg, #323232ff, #1f2022ff)",
                background: "linear-gradient(135deg, #0d1338ff, #2d4a84ff)",
                borderRadius: 3,
                width: "200px",
                marginBottom: 2,
            }}
        >
            <CardContent>
                <Box
                    sx={{ 
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                >
                    <Typography variant="body2" color="gray" textAlign="center">
                        {title}
                    </Typography>

                    <Box
                        sx={{
                            background:
                                value < 40?"linear-gradient(135deg, #0c8af8ff, #a9d9de)":"linear-gradient(135deg, #ff1100ff, #a9d9de)"
                            ,
                            
                            color: "#ffffffff",
                            borderRadius: "50%",
                            p: 1,
                            boxShadow: "0 4px 10px rgba(42, 120, 255, 0.66)",
                        }}
                    >
                        {/*icon*/}
                        {value < 40?con[1]:con[0]}
                    </Box>
                </Box>    
                <Box sx={{ width: "100%", height: 150 }}>
                    <ResponsiveContainer>
                        <RadarChart data={data}>
                            <PolarGrid stroke="#444" />
                            <PolarAngleAxis dataKey="name" tick={false} />
                            <PolarRadiusAxis
                                tick={false}
                                axisLine={false}
                                domain={[0, 100]} // max
                            />

                            <Radar
                                dataKey="value"
                                stroke={color}
                                fill={color}
                                fillOpacity={0.6}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>

                {/* Valeur affichée au centre */}
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    textAlign="center"
                    color={chartColor}
                    sx={{ mt: -10 }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    )
}
