import { Autocomplete, Grid, TextField } from "@mui/material";
import React from "react";

export default function AutoCompleteField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  return (
    <Grid item xs={12}>
      <Autocomplete
        id={prefix + property.name}
        value={value}
        onChange={(e, newValue) => {
          onChange(newValue);
        }}
        options={["- Select -", "California", "New York"]}
        renderInput={(params) => (
          <TextField
            fullWidth
            name={prefix + property.name}
            label={property.display ?? property.name}
            placeholder={property.example ?? ""}
            required={property.required}
            helperText={error ? error : property.helpText}
            error={error ? true : false}
            {...params}
          />
        )}
      />
    </Grid>
  );
}
