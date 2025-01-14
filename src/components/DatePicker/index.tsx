import React from "react";
import ReactDatePicker from "react-datepicker";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomDatePicker = styled(ReactDatePicker)({
  width: "100%",
  "& input": {
    padding: "10px",
    fontSize: "14px",
  },
});

interface MonthRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

const MonthRangePicker: React.FC<MonthRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const minDate = new Date(2000, 0, 31);
  const maxDate = new Date(2024, 1, 31);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        padding: 2,
        maxWidth: 400,
        mt: 2,
      }}
    >
      <Typography variant="body1" textAlign="left">
        Time Range:
      </Typography>

      <Box>
        <CustomDatePicker
          selected={startDate}
          onChange={(date) => onStartDateChange(date!)}
          showMonthYearPicker
          minDate={minDate}
          maxDate={endDate}
          dateFormat="MMM yyyy"
          customInput={
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              label="Start Month"
            />
          }
        />
      </Box>

      <Box>
        <CustomDatePicker
          selected={endDate}
          onChange={(date) => onEndDateChange(date!)}
          showMonthYearPicker
          minDate={startDate}
          maxDate={maxDate}
          dateFormat="MMM yyyy"
          customInput={
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              label="End Month"
            />
          }
        />
      </Box>
    </Box>
  );
};

export default MonthRangePicker;
