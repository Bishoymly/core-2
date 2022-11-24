import { Grid, TextField } from "@mui/material";
import React, { Component } from "react";

class StringField extends Component {
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
        <TextField
          name={this.state.prefix + this.state.property.name}
          required={this.state.property.required}
          fullWidth
          multiline
          id={this.state.prefix + this.state.property.name}
          label={this.state.property.display ?? this.state.property.name}
          placeholder={this.state.property.example ?? ""}
          helperText={this.props.error}
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

export default StringField;
