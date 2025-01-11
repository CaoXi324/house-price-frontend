import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

interface BarChartComponentProps {
  data: any[];
  regions: string[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  regions,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Bar Chart for Selected Months
      </Typography>
      {data.length === 0 ? (
        <Typography variant="subtitle1" color="textSecondary">
          No data available. Select months to view the chart.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {regions.map((region) => (
              <Bar
                key={region}
                dataKey={region}
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default BarChartComponent;