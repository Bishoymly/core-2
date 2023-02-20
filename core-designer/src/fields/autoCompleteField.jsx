import { Autocomplete, Grid, TextField } from "@mui/material";
import typeSystem from "core/type-system";
import React, { useEffect, useState } from "react";

export default function AutoCompleteField({
  prefix,
  value: propsValue,
  property,
  error,
  onChange,
}) {
  const [lookup, setLookup] = useState(null);
  const [value, setValue] = useState(null);

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

          // Set the default value only after the lookup array is loaded
          setValue(propsValue || property.default || null);
          if (!propsValue && property.default) {
            onChange(property.default);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [property.lookupFromType, onChange, property.default, propsValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Grid item xs={12} sm={property.layoutWidth}>
      <Autocomplete
        id={prefix + property.name}
        value={value}
        defaultValue=""
        onChange={handleChange}
        options={[
          ...(Array.isArray(lookup)
            ? lookup.map((v) => ({
                label: typeSystem.display(v, property.lookupFromType),
                value: v.id,
              }))
            : []),
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
