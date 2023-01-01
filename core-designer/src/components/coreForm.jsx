import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Alert, Grid, Stack } from "@mui/material";
import CoreFormContent from "./coreFormContent";

export default function CoreForm({
  mode,
  type,
  types,
  onChange,
  onModeChange,
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue ?? {});
  const [error, setError] = useState(undefined);
  const [validationErrors, setValidationErrors] = useState({});

  const handleValueChange = (v) => {
    setValue(v);
    if (onChange) onChange(v);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setError(undefined);
      setValidationErrors({});

      let body = value;
      let url = "http://localhost:3000/api/" + type.name;
      let method = "POST";
      if (mode === "edit") {
        url += "/" + body.id;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const body = await response.json();
        let errors = {};
        let errorMessage = body.error;
        body.validationErrors?.forEach((error) => {
          if (error.field && error.field !== "") {
            errors[error.field] = error.error;
          } else {
            if (errorMessage) errorMessage += "<br />" + error.error;
            else errorMessage = error.error;
          }
        });
        setError(errorMessage);
        setValidationErrors(errors);
        console.log(errors);
        throw Error(response.statusText);
      }

      console.log(body);
      onModeChange("list");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    onModeChange("list");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {mode === "add" ? "Create" : "Edit"} {type?.display ?? ""}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <CoreFormContent
            type={type}
            types={types}
            mode={mode}
            defaultValue={value}
            validationErrors={validationErrors}
            prefix=""
            onChange={handleValueChange}
          ></CoreFormContent>
        </Grid>
        {error ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        ) : null}
        <Stack direction="row" spacing={2} size="large" sx={{ mt: 3, mb: 2 }}>
          <Button type="submit" size="large" variant="contained">
            {mode === "add" ? "Create" : "Save"}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
