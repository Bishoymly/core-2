import { Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React from "react";

export default function StringField({
  prefix,
  property,
  error,
  value,
  onChange,
}) {
  if (!value && property.default) {
    value = property.default;
    onChange(value);
  }

  return (
    <Grid item xs={12}>
      <TextField
        name={prefix + property.name}
        required={property.required}
        fullWidth
        //multiline
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
