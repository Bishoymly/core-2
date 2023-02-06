import { Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React from "react";

export default function LabelField({
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
        disabled
        id={prefix + property.name}
        label={typeSystem.labelFor(property)}
        placeholder={property.example ?? ""}
        helperText={error ? error : property.helpText}
        value={typeSystem.display(value, property.type)}
      />
    </Grid>
  );
}
