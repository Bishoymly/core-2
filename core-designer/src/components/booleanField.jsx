import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import React, { Component } from "react";

class BooleanField extends Component {
  state = {
    value: this.props.value,
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(e) {
    this.setState({ value: e.target.value });
    if (this.props.onChange) this.props.onChange(e.target.value);
  }

  render() {
    return (
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name={this.state.prefix + this.state.property.name}
              id={this.state.prefix + this.state.property.name}
              value={this.state.value}
              onChange={(e) => {
                this.setValue(e);
              }}
            />
          }
          label={this.state.property.display ?? this.state.property.name}
          required={this.state.property.required}
          fullWidth
          helperText={this.props.error}
          error={this.props.error ? true : false}
        />
      </Grid>
    );
  }
}

export default BooleanField;
