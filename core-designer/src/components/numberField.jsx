import { Grid, TextField } from "@mui/material";
import React, { Component } from "react";

class NumberField extends Component {
  state = {
    value: this.props.value ?? "",
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  render() {
    return (
      <Grid item xs={12}>
        <TextField
          name={this.state.prefix + this.state.property.name}
          required={this.state.property.required}
          fullWidth
          id={this.state.prefix + this.state.property.name}
          label={this.state.property.display ?? this.state.property.name}
          placeholder={this.state.property.example ?? ""}
          helperText={this.props.error}
          error={this.props.error ? true : false}
        />
      </Grid>
    );
  }
}

export default NumberField;
