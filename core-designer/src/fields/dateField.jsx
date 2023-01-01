import { Grid, TextField } from "@mui/material";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  return (
    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          id={prefix + property.name}
          label={property.display ?? property.name}
          placeholder={property.example ?? ""}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              fullWidth
              name={prefix + property.name}
              required={property.required}
              helperText={error ? error : property.helpText}
              error={error ? true : false}
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    </Grid>
  );
}
