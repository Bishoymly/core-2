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
  value,
  property,
  error,
  onChange,
}) {
  if (!value && property.default) {
    value = property.default;
    onChange(value);
  }

  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState(null);

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
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [property.lookupFromType]);

  return (
    <Grid item xs={12}>
      <FormControl fullWidth error={error ? true : false}>
        <InputLabel id={prefix + property.name + "-label"}>
          {property.display ?? property.name}
        </InputLabel>
        <Select
          labelId={prefix + property.name + "-label"}
          id={prefix + property.name}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          label={property.display ?? property.name}
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
