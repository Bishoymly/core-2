import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import StringField from "./stringField";
import BooleanField from "./booleanField";
import NumberField from "./numberField";
import DateField from "./dateField";
import AutoCompleteField from "./autoCompleteField";
import { Typography } from "@mui/material";

class CoreFormContent extends Component {
  state = {
    value: this.props.value ?? {},
  };

  handleValueChange = (p, value) => {
    this.state.value[p] = value;
    this.setState({ value: this.state.value });
    if (this.props.onChange) this.props.onChange(this.state.value);
  };

  renderProperty(p) {
    if (p.type === "String")
      return (
        <StringField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.props.validationErrors[this.props.prefix + p.name]}
          property={p}
          onChange={(e) => this.handleValueChange(p.name, e)}
        />
      );

    if (p.type === "Boolean")
      return (
        <BooleanField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.props.validationErrors[this.props.prefix + p.name]}
          property={p}
          onChange={(e) => this.handleValueChange(p.name, e)}
        />
      );

    if (p.type === "Number")
      return (
        <NumberField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.props.validationErrors[this.props.prefix + p.name]}
          property={p}
          onChange={(e) => this.handleValueChange(p.name, e)}
        />
      );

    if (p.type === "Date")
      return (
        <DateField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.props.validationErrors[this.props.prefix + p.name]}
          property={p}
          onChange={(e) => this.handleValueChange(p.name, e)}
        />
      );

    if (p.type === "state")
      return (
        <AutoCompleteField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.props.validationErrors[this.props.prefix + p.name]}
          property={p}
          onChange={(e) => this.handleValueChange(p.name, e)}
        />
      );

    const t = this.props.types.find((t) => t.name === p.type);
    if (t) {
      if (t.type === "Object") {
        return (
          <Grid container item key={this.props.prefix + p.name}>
            <Typography component="h2" variant="h6" gutterBottom>
              {p.display}
            </Typography>
            <CoreFormContent
              type={t}
              types={this.props.types}
              mode={this.props.mode}
              value={this.props.value[p.name] ?? {}}
              prefix={this.props.prefix + p.name + "."}
              validationErrors={this.props.validationErrors}
              onChange={(e) => this.handleValueChange(p.name, e)}
            ></CoreFormContent>
          </Grid>
        );
      } else {
        return this.renderProperty(this.calculatePropertyFromType(p, t));
      }
    }
  }

  calculatePropertyFromType(p, t) {
    const result = {};
    for (const key in t) {
      result[key] = t[key];
    }
    for (const key in p) {
      if (key !== "type") result[key] = p[key];
    }

    return result;
  }

  render() {
    return (
      <Grid container item spacing={2}>
        {this.props.type.properties.map((p) => this.renderProperty(p))}
      </Grid>
    );
  }
}

export default CoreFormContent;
