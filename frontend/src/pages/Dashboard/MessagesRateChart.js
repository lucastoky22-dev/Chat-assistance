import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

/**
 * MessagesRateChart
 *
 * @param {Array} messages [{ timeStamp: string }]
 * @param {"second" | "minute"} interval
 * @param {string} title
 * @param {string} color
 */
const MessagesRateChart = ({
  messages = [],
  interval = "minute",
  title = "Messages rate",
  color = "#06b9fa",
}) => {
  const chartData = useMemo(() => {
    const format =
      interval === "second"
        ? "YYYY-MM-DD HH:mm:ss"
        : "YYYY-MM-DD HH:mm";

    const grouped = messages.reduce((acc, msg) => {
      const date = dayjs(msg.timeStamp);
      if (!date.isValid()) return acc;

      const key = date.format(format);

      if (!acc[key]) {
        acc[key] = {
          time: date.startOf(interval).valueOf(), // timestamp numérique
          count: 0,
        };
      }

      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.time - b.time);
  }, [messages, interval]);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #323232ff, #1f2022ff)",
        borderRadius: 3,
        border: "1px solid #3c3c3cbb",
        p: 2,
        height: 280,
      }}
    >
      {/* Title */}
      <Typography variant="body2" color="gray" mb={1}>
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" stroke="#48484880" />

          {/* Axe X */}
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={["auto", "auto"]}
            tickFormatter={(t) =>
              dayjs(t).format(interval === "second" ? "HH:mm:ss" : "HH:mm")
            }
            stroke="#bdbdbd"
            fontSize={11}
          />

          {/* Axe Y */}
          <YAxis
            allowDecimals={false}
            stroke="#bdbdbd"
            fontSize={11}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              background: "#1f2022ff",
              border: "1px solid #47474755",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelFormatter={(t) =>
              dayjs(t).format(
                interval === "second"
                  ? "DD/MM/YYYY HH:mm:ss"
                  : "DD/MM/YYYY HH:mm"
              )
            }
          />

          <Area
            dataKey="count"
            type="monotone"
            stroke={color}
            strokeWidth={2}
            fill={`${color}33`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MessagesRateChart;
/**utlsaton
 * <MessagesRateChart
  messages={messageData}
  interval="minute"
  title="Messages / minute ou seconde"
  color="#06b9fa"
/>
 */
