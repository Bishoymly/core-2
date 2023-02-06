import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
} from "@mui/material";
import typeSystem from "core/type-system";
import React from "react";

export default function BooleanField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  if (value === undefined || value === null) {
    if (property.default) {
      value = property.default;
    } else {
      value = false;
    }
    onChange(value);
  }

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
        label={typeSystem.labelFor(property)}
        required={property.required}
      ></FormControlLabel>
      <FormHelperText>{error ? error : property.helpText}</FormHelperText>
    </Grid>
  );
}
