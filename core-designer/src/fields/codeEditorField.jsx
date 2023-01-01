import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import MonacoEditor from "@uiw/react-monacoeditor";

export default function CodeEditorField({ prefix, value, property, onChange }) {
  return (
    <Grid item xs={12}>
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
        <MonacoEditor
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
