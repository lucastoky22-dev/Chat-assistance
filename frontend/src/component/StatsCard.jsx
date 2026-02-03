import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  color = 'primary' 
}) {
  const colorMap = {
    primary: '#06b6d4',
    success: '#10b981',
    secondary: '#8b5cf6',
    warning: '#f59e0b',
  };

  const bgColor = colorMap[color];

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: (theme) => `linear-gradient(135deg, ${alpha(bgColor, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: alpha(bgColor, 0.2),
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 40px ${alpha(bgColor, 0.3)}`,
          borderColor: alpha(bgColor, 0.4),
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(bgColor, 0.05)} 0%, transparent 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover::before': {
          opacity: 1,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: 600,
                mb: 1.5,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" gap={0.5}>
                {trendUp ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: trendUp ? 'success.main' : 'error.main',
                    fontWeight: 700,
                    mr: 0.5,
                  }}
                >
                  {trend}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  vs mois dernier
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${alpha(bgColor, 0.2)} 0%, ${alpha(bgColor, 0.1)} 100%)`,
              p: 2,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Icon sx={{ fontSize: 40, color: bgColor }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
