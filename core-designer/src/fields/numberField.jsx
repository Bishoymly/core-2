import { Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React from "react";

export default function NumberField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  if (!value) {
    value = 0;
  }

  return (
    <Grid item xs={12}>
      <TextField
        name={prefix + property.name}
        required={property.required}
        fullWidth
        id={prefix + property.name}
        label={typeSystem.labelFor(property)}
        placeholder={property.example ?? ""}
        helperText={error ? error : property.helpText}
        error={error ? true : false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Grid>
  );
}
