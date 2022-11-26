import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
} from "@mui/material";
import React, { Component } from "react";

class BooleanField extends Component {
  state = {
    value: this.props.value,
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(e) {
    this.setState({ value: e.target.checked });
    if (this.props.onChange) this.props.onChange(e.target.checked);
  }

  render() {
    return (
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name={this.state.prefix + this.state.property.name}
              id={this.state.prefix + this.state.property.name}
              checked={this.state.value}
              onChange={(e) => {
                this.setValue(e);
              }}
            />
          }
          label={this.state.property.display ?? this.state.property.name}
          required={this.state.property.required}
        ></FormControlLabel>
        <FormHelperText>
          {this.props.error ? this.props.error : this.props.property.helpText}
        </FormHelperText>
      </Grid>
    );
  }
}

export default BooleanField;
