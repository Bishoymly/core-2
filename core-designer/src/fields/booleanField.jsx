import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
} from "@mui/material";
import typeSystem from "core/type-system";
import React, { useState } from "react";

export default function BooleanField({
  prefix,
  value: propsValue,
  property,
  error,
  onChange,
}) {
  const [value, setValue] = useState(propsValue || property.default || false);

  const handleChange = (event) => {
    const newValue = event.target.checked;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Grid item xs={12} sm={property.layoutWidth}>
      <FormControlLabel
        control={
          <Checkbox
            name={prefix + property.name}
            id={prefix + property.name}
            checked={value}
            onChange={handleChange}
          />
        }
        label={typeSystem.labelFor(property)}
        required={property.required}
      ></FormControlLabel>
      <FormHelperText>{error ? error : property.helpText}</FormHelperText>
    </Grid>
  );
}
