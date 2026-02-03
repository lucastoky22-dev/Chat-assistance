import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
/**
 * MessagesAreaChart
 * @param {Array} messages - liste de messages [{timeStamp: string, content: string}]
 */

const MessagePerDay = ({ title, messages }) => {
    // Transformer les messages en données pour l'AreaChart
    
    const chartData = useMemo(() => {
        const dailyCounts = {};

        messages.forEach((msg) => {
            // Extraire la date "YYYY-MM-DD" à partir du timestamp
            
            if (!msg.timeStamp) return; // ignore si pas de timestamp
            
            const dateObj = new Date(msg.timeStamp);
            
            if (isNaN(dateObj.getTime())) return; // ignore si invalide
            
            const day = new Date(msg.timeStamp).toISOString().split("T")[0];
            
            if (!dailyCounts[day]) dailyCounts[day] = 0;
            
            dailyCounts[day] += 1;
        });

        // Convertir en tableau compatible Recharts
        return Object.entries(dailyCounts).map(([date, mes]) => ({
            date: new Date(date),
            mes,
        }));
        
    }, [messages]);
    const color = "#797979ff";
    return (
        <Card
            sx={{
                //background: "linear-gradient(135deg, #323232ff, #1f2022ff)",
                background: "linear-gradient(135deg, #0d1338ff, #2d4a84ff)",
                borderRadius: 3,
                width: "400px",
                border: "1px solid #3c3c3cbb",
            }}
        >
            <CardContent>
                {/* Title */}
                <Typography
                    variant="body2"
                    sx={{ color: "#c0c0c0ff", mb: 1 }}
                >
                    {title}
                </Typography>
                <Box sx={{ width: "100%", height:"200px"}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="4 4"
                                vertical={false}
                                stroke="#9090905b"
                            />
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                    <stop offset="75%" stopColor={color} stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            {/* Axe X : date */}
                            <XAxis
                                dataKey="date"
                                stroke="#909090dd"
                                fontSize={10}
                                tickLine={false}
                                type="number"
                                scale="time"
                                axisLine={false}
                                domain={["auto", "auto"]}
                                tickFormatter={(time) =>
                                    new Date(time).toLocaleDateString("fr-FR")
                                }
                            />

                            {/* Axe Y : nombre de messages */}
                            <YAxis
                                allowDecimals={false}
                                stroke="#909090dd"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}  
                            />

                            {/* Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    background: "#1f2022",
                                    border: "1px solid #47474755",
                                    borderRadius: 5,
                                    color: "#f5f5f5dd",
                                }}
                                labelFormatter={(time) =>
                                    `Date: ${new Date(time).toLocaleDateString("fr-FR")}`
                                }
                            />

                            {/* Area */}
                            <Area
                                dataKey="mes"
                                type="monotone"
                                stroke={color}
                                strokeWidth={2}
                                fill="url(#areaGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MessagePerDay;
