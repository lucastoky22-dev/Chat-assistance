import React from "react";

// Helper pour formatter les secondes en mm:ss ou hh:mm:ss
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Couleur dynamique selon la valeur
const getColor = (value) => {
  if (value < 30) return "#4caf50"; // vert
  if (value < 60) return "#ffc107"; // orange
  return "#f44336"; // rouge
};

const AverageLatency = ({ value, maxValue = 120 }) => {
  // Pourcentage de remplissage
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div
      style={{
        background: "#efefef", // gris clair uniforme
        padding: "20px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div style={{ color: "#555", marginBottom: 8, fontWeight: 500 }}>
        Latence moyenne : {formatDuration(Math.round(value))}
      </div>

      <div
        style={{
          backgroundColor: "#d0d0d0",
          height: 30,
          borderRadius: 15,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: getColor(value),
            height: "100%",
            borderRadius: 15,
            transition: "width 0.5s ease",
          }}
        />

        {/* graduations */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <div
            key={frac}
            style={{
              position: "absolute",
              top: 0,
              left: `${frac * 100}%`,
              width: 2,
              height: "100%",
              backgroundColor: "#888",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#888",
          fontSize: 12,
          marginTop: 4,
        }}
      >
        <span>0s</span>
        <span>{formatDuration(Math.round(maxValue * 0.25))}</span>
        <span>{formatDuration(Math.round(maxValue * 0.5))}</span>
        <span>{formatDuration(Math.round(maxValue * 0.75))}</span>
        <span>{formatDuration(maxValue)}</span>
      </div>
    </div>
  );
};

export default AverageLatency;
