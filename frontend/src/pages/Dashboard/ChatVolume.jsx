import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { areaGraphStyle } from './chartStyle';


export function ChatVolume({ title, messages }) {

  const color = "#91c4c6";
  const chartData = useMemo(() => {
    const dailyCounts = {};

    messages.forEach((msg) => {
      if (!msg.dateDeCreation) return;

      const dateObj = new Date(msg.dateDeCreation);
      if (isNaN(dateObj.getTime())) return;

      const day = dateObj.toISOString().split("T")[0];
      if (!dailyCounts[day]) dailyCounts[day] = 0;
      dailyCounts[day] += 1;
    });

    return Object.entries(dailyCounts).map(([date, mes]) => ({
      date: new Date(date),
      mes,
    }));
  }, [messages]);

  return (
    <Card
      sx={{
          background: "#f4f8ffff",
          //boxShadow: "0 10px 25px rgba(0, 0, 0, 0.41)",
          borderRadius: 3,
          width: "100%",
          height: "400px",
          border: "1px solid #9d9d9d5c",
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: "#5b5b5b", mb: 1, fontWeight: 600 }}
        >
          {title}
        </Typography>

        <Box sx={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />

              <XAxis
                dataKey="date"
                type="number"
                scale="time"
                domain={["auto", "auto"]}
                tickFormatter={(time) =>
                  new Date(time).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })
                }
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                allowDecimals={false}
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(145,196,198,0.15)" }}
                contentStyle={{
                  background: "#0f0f0f",
                  border: "1px solid rgba(145,196,198,0.3)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                labelFormatter={(time) =>
                  `Date : ${new Date(time).toLocaleDateString("fr-FR")}`
                }
              />

              <Bar
                dataKey="mes"
                radius={[8, 8, 0, 0]}
                fill={color}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
