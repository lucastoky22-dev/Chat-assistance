import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Box, Typography, Card, CardContent } from "@mui/material";

const AreaStatCard = ({
  title,
  data,
  dataKey,
  xKey = "date",
  color = "#676767ff",
  height = 200,
}) => {
  const gradientId = `${dataKey}-gradient`;

  return (
    <Card
      sx={{
        //background: "linear-gradient(135deg, #323232ff, #1f2022ff)",
        //background: "linear-gradient(135deg, #0d1338ff, #2d4a84ff)",
        background:"#f5fbffff",
        //borderRadius: 3,
        width: "100%",
        //border: "1px solid #3c3c3cbb",
      }}
    >
      <CardContent>
        {/* Title */}
        <Typography
          variant="body2"
          sx={{ color: "#5b5b5bff", mb: 1 }}
        >
          {title}
        </Typography>

        {/* Chart */}
        <Box sx={{ width: "100%", height}}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#9090905b"
              />

              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="75%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey={xKey}
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

              <Tooltip
                cursor={{ fill: `${color}22` }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  return (
                    <Box
                      sx={{
                        bgcolor: "#1f2022ff",
                        border: "1px solid #47474755",
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      <Typography fontSize={12} color="#f5f5f5dd">
                        {payload[0].value}
                      </Typography>
                    </Box>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AreaStatCard;
/*


*/