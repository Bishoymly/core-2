import { Grid, TextField } from "@mui/material";
import React, { Component } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

class DateField extends Component {
  state = {
    value: this.props.value ?? "",
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  setValue(value) {
    this.state.value = value;
    this.setState(this.state);
  }

  render() {
    return (
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            id={this.state.prefix + this.state.property.name}
            label={this.state.property.display ?? this.state.property.name}
            placeholder={this.state.property.example ?? ""}
            value={this.state.value}
            onChange={(newValue) => {
              this.setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                name={this.state.prefix + this.state.property.name}
                required={this.state.property.required}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    );
  }
}

export default DateField;
