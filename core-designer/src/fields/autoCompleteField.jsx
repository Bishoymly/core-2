import { Autocomplete, Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React, { useEffect, useState } from "react";

export default function AutoCompleteField({
  prefix,
  value,
  property,
  error,
  onChange,
}) {
  if (!value && property.default) {
    value = property.default;
    onChange(value);
  }

  const [lookup, setLookup] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (property.lookupFromType) {
        try {
          console.log("getting lookup from " + property.lookupFromType);
          const response = await fetch(
            "http://localhost:3000/api/" + property.lookupFromType
          );
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const json = await response.json();
          setLookup(json);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [property.lookupFromType]);

  return (
    <Grid item xs={12} sm={property.layoutWidth}>
      <Autocomplete
        id={prefix + property.name}
        value={value}
        onChange={(e, newValue) => {
          onChange(newValue);
        }}
        options={[
          "- Select -",
          ...lookup?.map((v) => typeSystem.display(v, property.lookupFromType)),
        ]}
        renderInput={(params) => (
          <TextField
            fullWidth
            name={prefix + property.name}
            label={typeSystem.labelFor(property)}
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
