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
    loading: false,
    value: this.props.value ?? "",
    property: this.props.property,
    prefix: this.props.prefix ?? "",
  };

  async componentDidMount() {
    if (
      this.props.property.lookupFromType !== undefined &&
      this.props.property.lookupFromType !== null &&
      this.props.property.lookupFromType !== ""
    ) {
      try {
        this.setState({ loading: true });
        console.log(
          "getting lookup from " + this.props.property.lookupFromType
        );
        const response = await fetch(
          "http://localhost:3000/api/" + this.props.property.lookupFromType
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const json = await response.json();
        this.setState({ lookup: json, loading: false });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ loading: false });
      }
    }
  }

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
            {this.props.property.values?.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
            {this.state.lookup?.map((v) => (
              <MenuItem key={v.name} value={v.name}>
                {v.name}
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
