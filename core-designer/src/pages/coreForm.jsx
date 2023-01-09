import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Alert, Grid, Stack } from "@mui/material";
import CoreFormContent from "../components/coreFormContent";
import typeSystem from "core/type-system";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

export async function loader({ params }) {
  if (!params.id) {
    return {};
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/${params.type}/${params.id}`
    );
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const item = await response.json();
    return { item };
  } catch (error) {
    console.warn(error);
  }
}

export default function CoreForm({ mode }) {
  const type = typeSystem.types[useParams().type];
  const [value, setValue] = useState(useLoaderData().item ?? {});
  const [error, setError] = useState(undefined);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

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
      return navigate(-1);
    } catch (error) {
      console.log(error);
    }
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
            mode={mode}
            defaultValue={value}
            validationErrors={validationErrors}
            prefix=""
            onChange={(v) => setValue(v)}
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
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
