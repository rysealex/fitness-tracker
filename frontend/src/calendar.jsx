import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { TextField } from '@mui/material';

function Calendar({ onChange, error, helperText }) {
  const [value, setValue] = useState(null);
  const handleChange = (newDate) => {
    setValue(newDate);
    onChange(newDate ? newDate.format('YYYY-MM-DD') : '');
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Birthday"
        value={value}
        onChange={handleChange}
        inputFormat="YYYY-MM-DD"
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}  // Displays error state when true
            helperText={helperText}  // Displays the helper text (error message) when there's an error
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  );
}

export default Calendar;