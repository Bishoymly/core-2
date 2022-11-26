import { Grid, Paper, Typography } from "@mui/material";
import React, { Component } from "react";
import MonacoEditor from "@uiw/react-monacoeditor";

class CodeEditorField extends Component {
  state = {
    value: this.props.value,
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(newValue) {
    this.setState({ value: newValue });
    if (this.props.onChange) this.props.onChange(newValue);
  }

  render() {
    return (
      <Grid item xs={12}>
        <Typography component="h2" variant="h6" gutterBottom>
          {this.state.property.display ?? this.state.property.name}
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
            name={this.state.prefix + this.state.property.name}
            id={this.state.prefix + this.state.property.name}
            value={this.state.value}
            onChange={(e) => {
              this.setValue(e);
            }}
          />
        </Paper>
      </Grid>
    );
  }
}

export default CodeEditorField;
