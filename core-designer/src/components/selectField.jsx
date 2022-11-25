import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { Component } from "react";

class SelectField extends Component {
  state = {
    value: this.props.value ?? "",
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
        <FormControl fullWidth error={this.props.error ? true : false}>
          <InputLabel
            id={this.state.prefix + this.state.property.name + "-label"}
          >
            {this.state.property.display ?? this.state.property.name}
          </InputLabel>
          <Select
            labelId={this.state.prefix + this.state.property.name + "-label"}
            id={this.state.prefix + this.state.property.name}
            value={this.state.value}
            onChange={(e) => {
              this.setValue(e);
            }}
            label={this.state.property.display ?? this.state.property.name}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.props.property.values.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {this.props.error ? this.props.error : this.props.property.helpText}
          </FormHelperText>
        </FormControl>
      </Grid>
    );
  }
}

export default SelectField;
