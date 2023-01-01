import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
} from "@mui/material";
import React from "react";

export default function BooleanField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  return (
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            name={prefix + property.name}
            id={prefix + property.name}
            checked={value}
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
        }
        label={property.display ?? property.name}
        required={property.required}
      ></FormControlLabel>
      <FormHelperText>{error ? error : property.helpText}</FormHelperText>
    </Grid>
  );
}
