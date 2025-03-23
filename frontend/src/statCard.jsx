import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ title, value, unit, icon }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Title */}
          <Typography variant="h6" color="textSecondary" style={{ flex: 1 }}>
            {title}
          </Typography>

          {/* Icon */}
          <div style={{ fontSize: '24px' }}>{icon}</div>
        </div>

        {/* Value */}
        <Typography variant="h4" component="div" style={{ marginTop: '10px', fontWeight: 'bold' }}>
          {value}
        </Typography>

        {/* Unit */}
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
          {unit}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;