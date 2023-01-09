import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SimpleGrid from "./simpleGrid";
import CoreFormContent from "./coreFormContent";

export default function InlineGrid({
  type,
  validationErrors,
  onChange,
  defaultData,
}) {
  const [mode, setMode] = useState("list");
  const [value, setValue] = useState({});
  const [data, setData] = useState(defaultData ?? []);
  const [index, setIndex] = useState(1);

  const handleSave = (event) => {
    let newData;
    if (mode === "add") {
      newData = [...data, value];
    } else {
      data[index] = value;
      newData = [...data];
    }
    setData(newData);
    setMode("list");
    if (onChange) onChange(newData);
  };

  const handleDelete = (i) => {
    setMode("list");
    let newData = [...data];
    newData.splice(i, 1);
    setData(newData);
    if (onChange) onChange(newData);
  };

  return (
    <Box>
      {data.length > 0 ? (
        <SimpleGrid
          type={type}
          backend={false}
          defaultData={data}
          onEdit={(e) => {
            setMode("edit");
            setValue(e);
            setIndex(data.indexOf(e));
          }}
          onDelete={handleDelete}
        ></SimpleGrid>
      ) : null}

      {mode === "list" ? (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
          onClick={() => {
            setMode("add");
            setValue({});
          }}
        >
          Add
        </Button>
      ) : (
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 5,
            mr: 5,
            mt: 2,
          }}
        >
          <Box sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
            <Typography component="h2" variant="h6">
              {mode === "add" ? "Create" : "Edit"} {type?.display ?? ""}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <CoreFormContent
                type={type}
                mode={mode}
                defaultValue={value}
                validationErrors={validationErrors}
                prefix=""
                onChange={(value) => setValue(value)}
              ></CoreFormContent>
            </Grid>
            <Stack
              direction="row"
              spacing={2}
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              <Button size="medium" variant="contained" onClick={handleSave}>
                {mode === "add" ? "Add" : "Update"}
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  setMode("list");
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
