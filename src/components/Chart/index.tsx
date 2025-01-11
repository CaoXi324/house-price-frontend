import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  Container, 
  Typography, 
  Paper,
  Box 
} from "@mui/material";

const CsvChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    // Load CSV data
    const fetchData = async () => {
      const response = await fetch("/data1.csv");
      const csvText = await response.text();

      // Parse CSV
      Papa.parse(csvText, {
        header: true, // Use the first row as headers
        dynamicTyping: true, // Convert numeric strings to numbers
        complete: (result) => {
          const rawData = result.data;

          // Extract time columns
          const timeColumns = Object.keys(rawData[0]).filter((key) =>
            /\d{1,2}\/\d{1,2}\/\d{4}/.test(key)
          );

          // Transform data for Recharts
          const transformedData = timeColumns.map((date) => {
            const entry: { [key: string]: string | number } = { month: date };
            rawData.forEach((row: any) => {
              entry[row.RegionName] = row[date];
            });
            return entry;
          });

          // Extract region names
          const regionNames = rawData.map((row: any) => row.RegionName);

          setRegions(regionNames);
          setChartData(transformedData);
        },
      });
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          House Price Trends
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {regions.map((region) => (
                <Line
                  key={region}
                  type="monotone"
                  dataKey={region}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default CsvChart;