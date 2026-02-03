import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";

// Helper pour formatter les secondes en hh:mm:ss ou mm:ss
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Couleur dynamique pour la zone en fonction de la latence max
const getAreaColor = (maxSeconds) => {
  if (maxSeconds < 30) return "#4caf50"; // vert
  if (maxSeconds < 60) return "#ffc107"; // orange
  return "#f44336"; // rouge
};

const LatencyGraph = ({ latency }) => {
  if (!latency || latency.length === 0) {
    return <Typography sx={{ color: "#e3e3e3e8" }}>Aucune donnée de latence</Typography>;
  }

  const maxLatency = Math.max(...latency.map((l) => l.responseTimeSec));

  // Transformation DTO → Recharts
  const data = latency.map((l) => ({
    matricule: l.matricule,
    responseTimeSec: l.responseTimeSec,
  }));

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #323232, #1f2022)", // même style QueueEvolutionCard
        borderRadius: 3,
        border: "1px solid #3c3c3cbb",
        padding: 16,
        width: "100%",
        height: 240, // même taille que QueueEvolutionCard
      }}
    >
      {/* Titre */}
      <div style={{ color: "#ccc", fontSize: 13, marginBottom: 6 }}>
        Temps de reponse
      </div>

      {/* Valeur max / info optionnelle */}
      <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        Max : {formatDuration(maxLatency)}
      </div>

      {/* Graphique */}
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getAreaColor(maxLatency)} stopOpacity={0.4} />
                <stop offset="80%" stopColor={getAreaColor(maxLatency)} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis dataKey="matricule" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e1e", border: "none", color: "#fff" }}
              formatter={(value) => formatDuration(value)}
            />
            <Area
              dataKey="responseTimeSec"
              type="monotone"
              stroke={getAreaColor(maxLatency)}
              strokeWidth={2}
              fill="url(#latencyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LatencyGraph;
