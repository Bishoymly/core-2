import { Autocomplete, Grid, TextField } from "@mui/material";
import React, { Component } from "react";

class AutoCompleteField extends Component {
  state = {
    value: this.props.value ?? "- Select -",
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(value) {
    console.log(value);
    this.state.value = value;
    this.setState(this.state);
  }

  render() {
    return (
      <Grid item xs={12}>
        <Autocomplete
          id={this.state.prefix + this.state.property.name}
          value={this.state.value}
          onChange={(e, newValue) => {
            this.setValue(newValue);
          }}
          options={["- Select -", "California", "New York"]}
          renderInput={(params) => (
            <TextField
              fullWidth
              name={this.state.prefix + this.state.property.name}
              label={this.state.property.display ?? this.state.property.name}
              placeholder={this.state.property.example ?? ""}
              required={this.state.property.required}
              helperText={this.props.error}
              error={this.props.error ? true : false}
              {...params}
            />
          )}
        />
      </Grid>
    );
  }
}

export default AutoCompleteField;
