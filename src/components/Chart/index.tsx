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
  Box, 
  Button
} from "@mui/material";

interface CsvChartProps {
  startDate: Date;
  endDate: Date;
  selectedStates: string[];
  selectedRegions: string[];
}

const CsvChart: React.FC<CsvChartProps> = ({startDate, endDate, selectedStates, selectedRegions}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data1.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          const rawData = result.data;

          const timeColumns = Object.keys(rawData[0]).filter((key) =>
            /\d{1,2}\/\d{1,2}\/\d{4}/.test(key)
          );

          const filteredTimeColumns = timeColumns.filter((date) => {
            const parsedDate = new Date(date);
            return parsedDate >= startDate && parsedDate <= endDate;
          });

          const filteredRawData = rawData.filter((row: any) => {
            return (
              (!selectedStates.length || selectedStates.includes(row.StateName)) &&
              (!selectedRegions.length || selectedRegions.includes(row.RegionName))
            );
          });

          const transformedData = filteredTimeColumns.map((date) => {
            const entry: { [key: string]: string | number } = { month: date };
            filteredRawData.forEach((row: any) => {
              entry[row.RegionName] = row[date];
            });
            return entry;
          });

          const regionNames = filteredRawData.map((row: any) => row.RegionName);

          setRegions(regionNames);
          setChartData(transformedData);
        },
      });
    };

    fetchData();
  }, [startDate, endDate, selectedStates, selectedRegions]);

  const handleDownload = () => {
    const csvString = Papa.unparse(chartData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          House Price Trends
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            sx={{ mb: 3 }}
          >
            Download Data
          </Button>
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