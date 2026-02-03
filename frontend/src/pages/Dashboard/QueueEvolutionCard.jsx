 import React, { useMemo } from "react";
import { Box, Typography, Stack ,  Card, CardContent } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { areaGraphStyle, chartWrapper } from './chartStyle'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import dayjs from "dayjs";

/**
 * QueueEvolutionCard
 *
 * @param {Array} data [{ timeStamp: string, size: number }]
 */
const QueueEvolutionCard = ({ data = [] }) => {
  const { trend, delta, current } = useMemo(() => {
    if (data.length < 2) {
      return { trend: "stable", delta: 0, current: data[0]?.size || 0 };
    }

    const last = data[data.length - 1].size;
    const prev = data[data.length - 2].size;

    if (last > prev) return { trend: "up", delta: last - prev, current: last };
    if (last < prev) return { trend: "down", delta: prev - last, current: last };
    return { trend: "stable", delta: 0, current: last };
  }, [data]);

  const TrendIcon =
    trend === "up"
      ? TrendingUpIcon
      : trend === "down"
      ? TrendingDownIcon
      : TrendingFlatIcon;

  const trendColor =
    trend === "up"
      ? "#ff5252"
      : trend === "down"
      ? "#4caf50"
      : "#9e9e9e";

  return (
    <Card
      sx={areaGraphStyle}
    >
      <CardContent>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2"
        sx={{ color: "#5b5b5b", mb: 1, fontWeight: 600 }}
        >
          File d’attente
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <TrendIcon sx={{ color: trendColor }} />
          <Typography sx={{ color: trendColor, fontSize: 13 }}>
            {delta > 0 ? `${delta}` : "Stable"}
          </Typography>
        </Stack>
      </Stack>

      {/* Current value */}
      <Typography variant="h4" fontWeight={700} color="#000" mt={1}>
        {current}
      </Typography>

      {/* Chart */}
      <Box sx={{width:"100%", height:220, position:"relative"}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#9090905b"
            />
            <defs>
              <linearGradient id="queueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity={0.4} />
                <stop offset="80%" stopColor={trendColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timeStamp"
              tickFormatter={(t) => dayjs(t).format("HH:mm")}
              stroke="#5b5b5bff"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#5b5b5bff"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />

            <Area
              dataKey="size"
              type="monotone"
              stroke={trendColor}
              strokeWidth={2}
              fill="url(#queueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
      </CardContent>
    </Card>
  );
};

export default QueueEvolutionCard;
/**
 * const queueData = [
  { timeStamp: "2026-01-09T10:00:00Z", size: 3 },
  { timeStamp: "2026-01-09T10:01:00Z", size: 5 },
  { timeStamp: "2026-01-09T10:02:00Z", size: 4 },
];

<QueueEvolutionCard data={queueData} />;
 */