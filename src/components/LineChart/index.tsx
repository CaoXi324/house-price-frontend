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
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import BarChartComponent from "../BarChart";

interface CsvLineChartProps {
  startDate: Date;
  endDate: Date;
  selectedStates: string[];
  selectedRegions: string[];
}

const CsvLineChart: React.FC<CsvLineChartProps> = ({
  startDate,
  endDate,
  selectedStates,
  selectedRegions,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [showForecastData, setShowForecastData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/combined_data.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (result: any) => {
          const rawData = result.data;

          let timeColumns: string[] = [];
          if (showForecastData) {
            timeColumns = Object.keys(rawData[0]).filter((key) =>
              /\d{1,2}\/\d{1,2}\/\d{4}/.test(key)
            );
          } else {
            timeColumns = Object.keys(rawData[0])
              .filter((key) => /\d{1,2}\/\d{1,2}\/\d{4}/.test(key))
              .slice(0, -5);
          }

          const filteredTimeColumns = timeColumns.filter((date) => {
            const parsedDate = new Date(date);
            return parsedDate >= startDate && parsedDate <= endDate;
          });

          const filteredRawData = rawData.filter((row: any) => {
            return (
              (!selectedStates.length ||
                selectedStates.includes(row.StateName)) &&
              (!selectedRegions.length ||
                selectedRegions.includes(row.RegionName))
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

  const toggleMonthSelection = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const handleXAxisClick = (event: any) => {
    const month = event?.activeLabel;
    if (month) {
      toggleMonthSelection(month);
    }
  };

  const filteredData = chartData.filter((data) =>
    selectedMonths.includes(data.month)
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          House Price Trends
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              mb: 2,
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download Data
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={showForecastData}
                  onChange={(e) => setShowForecastData(e.target.checked)}
                  name="showForecast"
                />
              }
              label="Show Forecast Data"
            />
          </Box>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData} onClick={handleXAxisClick}>
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
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <BarChartComponent data={filteredData} regions={regions} />
      </Box>
    </Container>
  );
};

export default CsvLineChart;
