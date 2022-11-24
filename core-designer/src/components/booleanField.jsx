import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import React, { Component } from "react";

class BooleanField extends Component {
  state = {
    value: this.props.value,
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(e) {
    let v = null;
    console.log(e.target.value);
    if (e.target.value === "on") {
      v = true;
    } else if (e.target.value === "off") {
      v = false;
    }
    this.setState({ value: v });
    if (this.props.onChange) this.props.onChange(v);
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
        />
      </Grid>
    );
  }
}

export default BooleanField;
