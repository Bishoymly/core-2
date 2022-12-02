import { Grid, TextField } from "@mui/material";
import React, { Component } from "react";

class NumberField extends Component {
  state = {
    value: this.props.value ?? "",
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(e) {
    const val = parseFloat(e.target.value);
    this.setState({ value: val });
    if (this.props.onChange) this.props.onChange(val);
  }

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
          helperText={
            this.props.error ? this.props.error : this.props.property.helpText
          }
          error={this.props.error ? true : false}
          value={this.state.value}
          onChange={(e) => {
            this.setValue(e);
          }}
        />
      </Grid>
    );
  }
}

export default NumberField;
