import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Box, Typography } from "@mui/material";

export function RadarForQueue({ title, value, icon, color }) {

    const valueStyle = { color: "#ffffffc3" }

    const data = [
        {
            name: "Value",
            value: value,
        },
    ];

    const getColor = (value) => {
        if (value < 5) return "#4caf50";   // rouge
        if (value < 20) return "#43d6f7ff";
        if (value < 70) return "#ff9800";   // orange
        return "#f44336";                  // vert
    };

    const chartColor = getColor(value);
    return (

        <Card
            sx={{
                background: "linear-gradient(135deg, #323232ff, #1f2022ff)",
                borderRadius: 3,
                width: "200px",
                marginBottom: 2,
            }}
        >
            <CardContent>
                <Typography variant="body2" color="gray" textAlign="center">
                    {title}
                </Typography>

                <Box sx={{ width: "100%", height: 150 }}>
                    <ResponsiveContainer>
                        <RadarChart data={data}>
                            <PolarGrid stroke="#444" />
                            <PolarAngleAxis dataKey="name" tick={false} />
                            <PolarRadiusAxis
                                tick={false}
                                axisLine={false}
                                domain={[0, 100]} // adapte selon ton max
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
