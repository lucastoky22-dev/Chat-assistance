import { Card, CardContent, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { cardStyle } from "./chartStyle";


dayjs.extend(duration);

const StatValueCard = ({
  title,
  value,
  icon,
  iconBg,
  color = "#91c4c6", // Couleur par défaut ajustée à #91c4c6

  subtitle,
}) => {
  if( title == "Durée moyen d'un chat"){
      const seconds = value;

      const d = dayjs.duration(seconds, "seconds");

      const formatted = String(Math.floor(d.asHours())).padStart(2, "0")
          + ":" + String(d.minutes()).padStart(2, "0")
          + ":" + String(d.seconds()).padStart(2, "0");

      value = formatted;
  }
  return (
    <Card
      sx={cardStyle}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#212121ff",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            {title}
          </Typography>

          {icon && (
            <Box
              sx={{
                background:iconBg,
                  //"linear-gradient(135deg, #91c4c6, #a9d9de)",
                color: "#ffffffff",
                borderRadius: "50%",
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#212121ff",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {/* Optional subtitle */}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "#212121ff",
              opacity: 0.65,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatValueCard;
