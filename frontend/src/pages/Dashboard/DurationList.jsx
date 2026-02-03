import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { areaGraphStyle, chartWrapper } from './chartStyle';

export default function DurationList({ data = [] }) {
  if (!data.length) return null;

  const formattedData = data.map((d) => ({
    label: dayjs(d.timeStamp).format("HH:mm"),
    value: d.seconds,
  }));

  const totalSeconds = data.reduce((acc, d) => acc + d.seconds, 0);

  const COLORS = [
    "#91c4c6",
    "#216c89",
    "#4caf50",
    "#ff9800",
    "#f44336",
    "#9c27b0",
  ];

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <Card sx={areaGraphStyle}>
      <CardContent>
        <Typography
          variant="body2"
          sx={{ color: "#5b5b5b", mb: 1, fontWeight: 600 }}
        >
          Chat duration (répartition)
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Donut */}
          <Box sx={chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {formattedData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [`${value} s`, "Durée"]}
                  contentStyle={{
                    background: "#0f0f0f",
                    borderRadius: 8,
                    border: "1px solid rgba(145,196,198,0.3)",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                {Math.floor(totalSeconds / 60)}m
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#6b6b6b" }}>
                total
              </Typography>
            </Box>
          </Box>

          {/* Légende */}
          <Stack spacing={1}>
            {formattedData.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: COLORS[index % COLORS.length],
                  }}
                />
                <Typography sx={{ fontSize: 12, color: "#333" }}>
                  {item.label} — {formatDuration(item.value)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
