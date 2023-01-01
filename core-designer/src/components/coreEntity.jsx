import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import SimpleGrid from "./simpleGrid";
import CoreForm from "./coreForm";
import AddIcon from "@mui/icons-material/Add";

export default function CoreEntity({ type, types }) {
  const [mode, setMode] = useState("list");
  const [value, setValue] = useState({});

  if (type) {
    if (mode === "list") {
      return (
        <Box>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {type?.display ?? type?.name}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mb: 2 }}
            onClick={() => {
              setMode("add");
              setValue({});
            }}
          >
            Add
          </Button>

          <SimpleGrid
            type={type}
            types={types}
            onValueChange={(v) => {
              setMode("edit");
              setValue(v);
            }}
          ></SimpleGrid>
        </Box>
      );
    } else {
      return (
        <CoreForm
          type={type}
          types={types}
          mode={mode}
          defaultValue={value}
          prefix=""
          onModeChange={(m) => setMode(m)}
          onChange={(e) => {
            setValue(e);
          }}
        ></CoreForm>
      );
    }
  } else {
    return (
      <Typography component="h2" variant="h6" color="primary">
        Welcome
      </Typography>
    );
  }
}
