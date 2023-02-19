import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditorField({ prefix, value, property, onChange }) {
  if (!value) {
    value = "";
    onChange(value);
  }

  return (
    <Grid item xs={12} sm={property.layoutWidth}>
      <Typography component="h2" variant="h6" gutterBottom>
        {property.display ?? property.name}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: 400,
        }}
      >
        <Editor
          language="javascript"
          options={{
            lineNumbers: "off",
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
          }}
          name={prefix + property.name}
          id={prefix + property.name}
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
        />
      </Paper>
    </Grid>
  );
}
