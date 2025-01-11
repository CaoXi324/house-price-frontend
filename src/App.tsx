import './App.css'
import CsvLineChart from './components/LineChart'
import StateAndRegionSelector from './components/StateAndRegionSelector'
import DateRangePickerWithMonths from './components/DatePicker'
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

function App() {
  const [startDate, setStartDate] = useState(new Date(2000, 0, 31));
  const [endDate, setEndDate] = useState(new Date(2023, 8, 30));
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  return (
    <>
      <StateAndRegionSelector 
        selectedStates={selectedStates}
        setSelectedStates={setSelectedStates}
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
      />
      <DateRangePickerWithMonths 
        startDate={startDate} 
        endDate={endDate} 
        onStartDateChange={setStartDate} 
        onEndDateChange={setEndDate}
      />
      <CsvLineChart 
        selectedStates={selectedStates}
        selectedRegions={selectedRegions}
        startDate={startDate}
        endDate={endDate}
      />
    </>
  )
}

export default App
