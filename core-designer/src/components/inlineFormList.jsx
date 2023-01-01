import { Box, Button, Grid, Paper, Stack } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import CoreFormContent from "./coreFormContent";
import { useState } from "react";

export default function InlineFormList({ propertyType, defaultData }) {
  const [type, setType] = useState(propertyType);
  const [value, setValue] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(defaultData ?? []);
  const [mode, setMode] = useState(undefined);

  return (
    <Box>
      {this.props.data?.map((v) => (
        <Paper
          key={v}
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 0,
            mr: 2,
            mt: 2,
          }}
        >
          <Box sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
            <Grid container spacing={2} sx={{ mt: 0, mb: 0 }}>
              <CoreFormContent
                type={this.state.type}
                types={this.props.types}
                mode={"edit"}
                value={v}
                validationErrors={this.state.validationErrors}
                prefix=""
                onChange={this.handleValueChange}
              ></CoreFormContent>
            </Grid>
            <Stack
              direction="row"
              spacing={2}
              size="large"
              sx={{ mt: 1, mb: 0 }}
            >
              <Button size="medium" onClick={async (id) => {}}>
                Delete
              </Button>
            </Stack>
          </Box>
        </Paper>
      ))}

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
    </Box>
  );
}
