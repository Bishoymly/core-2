import { Grid, TextField } from "@mui/material";
import React from "react";

export default function NumberField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  return (
    <Grid item xs={12}>
      <TextField
        name={prefix + property.name}
        required={property.required}
        fullWidth
        id={prefix + property.name}
        label={property.display ?? property.name}
        placeholder={property.example ?? ""}
        helperText={error ? error : property.helpText}
        error={error ? true : false}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </Grid>
  );
}
