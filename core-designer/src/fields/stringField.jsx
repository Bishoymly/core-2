import { Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React, { useState } from "react";

export default function StringField({
  prefix,
  property,
  error,
  value: propsValue,
  onChange,
}) {
  const [value, setValue] = useState(propsValue || property.default || "");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Grid item sm={property.layoutWidth} xs={12}>
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
        onChange={handleChange}
      />
    </Grid>
  );
}
