import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import typeSystem from "core/type-system";
import React, { useEffect, useState } from "react";

export default function SelectField({
  prefix,
  value: propsValue,
  property,
  error,
  onChange,
}) {
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState(null);

  const [value, setValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (property.lookupFromType) {
        try {
          setLoading(true);
          console.log("getting lookup from " + property.lookupFromType);
          const response = await fetch(
            "http://localhost:3000/api/" + property.lookupFromType
          );
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const json = await response.json();
          setLoading(false);
          setLookup(json);
          // Set the default value only after the lookup array is loaded
          setValue(propsValue || property.default || "");
          if (!propsValue && property.default) {
            onChange(property.default);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        // Set the default value immediately if there's no lookup array to fetch
        setValue(propsValue || property.default || "");
        if (!propsValue && property.default) {
          onChange(property.default);
        }
      }
    }
    fetchData();
  }, [property.lookupFromType, propsValue, property.default, onChange]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Grid item xs={12} sm={property.layoutWidth}>
      <FormControl fullWidth error={error ? true : false}>
        <InputLabel id={prefix + property.name + "-label"}>
          {typeSystem.labelFor(property)}
        </InputLabel>
        <Select
          labelId={prefix + property.name + "-label"}
          id={prefix + property.name}
          value={value}
          defaultValue=""
          onChange={handleChange}
          label={typeSystem.labelFor(property)}
          disabled={loading}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {property.values?.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
          {lookup?.map((v) => (
            <MenuItem
              key={typeSystem.id(v, property.lookupFromType)}
              value={typeSystem.id(v, property.lookupFromType)}
            >
              {typeSystem.display(v, property.lookupFromType)}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{error ? error : property.helpText}</FormHelperText>
      </FormControl>
    </Grid>
  );
}
