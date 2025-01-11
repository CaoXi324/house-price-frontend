import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Chip } from "@mui/material";

interface Region {
  RegionID: string;
  SizeRank: number;
  RegionName: string;
  RegionType: string;
  StateName: string;
}

interface StateAndRegionSelectorProps {
  selectedStates: string[];
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
}

const StateAndRegionSelector: React.FC<StateAndRegionSelectorProps> = ({
  selectedStates,
  setSelectedStates,
  selectedRegions,
  setSelectedRegions,
}) => {
  const [stateRegionMap, setStateRegionMap] = useState<Record<string, Region[]>>({});
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch('/data1.csv'); // Replace with your actual CSV path
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const map: Record<string, Region[]> = {};

            results.data.forEach((row: any) => {
              const state = row.StateName;
              const region: Region = {
                RegionID: row.RegionID,
                SizeRank: row.SizeRank,
                RegionName: row.RegionName,
                RegionType: row.RegionType,
                StateName: row.StateName,
              };

              if (!map[state]) {
                map[state] = [];
              }
              map[state].push(region);
            });

            setStateRegionMap(map);

            // Set default state and regions
            const defaultState = Object.keys(map)[0];
            if (defaultState) {
              setSelectedStates([defaultState]);
              setRegions(map[defaultState]);
              setSelectedRegions(map[defaultState].map((region) => region.RegionName));
            }
          },
        });
      } catch (error) {
        console.error('Error loading or parsing CSV:', error);
      }
    };

    fetchAndParseCSV();
  }, []);

  useEffect(() => {
    if (selectedStates.length > 0) {
      const allRegions = selectedStates.flatMap((state) => stateRegionMap[state] || []);
      setRegions(allRegions);
      setSelectedRegions(allRegions.map((region) => region.RegionName)); // Auto-select all regions
    } else {
      setRegions([]);
      setSelectedRegions([]);
    }
  }, [selectedStates, stateRegionMap]);

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="state-selector-label">Select States</InputLabel>
          <Select
            labelId="state-selector-label"
            multiple
            value={selectedStates}
            onChange={(e) => setSelectedStates(e.target.value as string[])}
            input={<OutlinedInput label="Select States" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {Object.keys(stateRegionMap).map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={regions.length === 0}>
          <InputLabel id="region-selector-label">Select Regions</InputLabel>
          <Select
            labelId="region-selector-label"
            multiple
            value={selectedRegions}
            onChange={(e) => setSelectedRegions(e.target.value as string[])}
            input={<OutlinedInput label="Select Regions" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {regions.map((region) => (
              <MenuItem key={region.RegionID} value={region.RegionName}>
                {region.RegionName} (SizeRank: {region.SizeRank})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default StateAndRegionSelector;