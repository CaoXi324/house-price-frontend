import "./App.css";
import CsvLineChart from "./components/LineChart";
import StateAndRegionSelector from "./components/StateAndRegionSelector";
import DateRangePickerWithMonths from "./components/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { Box } from "@mui/material";

function App() {
  const [startDate, setStartDate] = useState(new Date(2000, 0, 31));
  const [endDate, setEndDate] = useState(new Date(2024, 0, 31));
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          mt: 2,
        }}
      >
        <DateRangePickerWithMonths
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <StateAndRegionSelector
          selectedStates={selectedStates}
          setSelectedStates={setSelectedStates}
          selectedRegions={selectedRegions}
          setSelectedRegions={setSelectedRegions}
        />
      </Box>
      <CsvLineChart
        selectedStates={selectedStates}
        selectedRegions={selectedRegions}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
}

export default App;
