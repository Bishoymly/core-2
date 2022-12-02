import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import { FormHelperText, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import InlineGrid from "./inlineGrid";
import Components from "./Components";
import InlineFormList from "./inlineFormList";

class CoreFormContent extends Component {
  state = {
    value: this.props.value ?? {},
  };

  handleValueChange = (p, value) => {
    this.state.value[p] = value;
    this.setState({ value: this.state.value });
    if (this.props.onChange) this.props.onChange(this.state.value);
  };

  renderProperty(property) {
    const t = this.props.types.find((t) => t.name === property.type);
    let p = property;
    if (t) {
      p = this.calculatePropertyFromType(property, t);

      if (p.type === "Object" || p.isArray) {
        return (
          <Grid container item key={this.props.prefix + p.name}>
            <Stack width={"100%"}>
              <Typography component="h2" variant="h6" gutterBottom>
                {p.display}
              </Typography>
              <FormHelperText>{p.helpText}</FormHelperText>
              {p.isArray ? (
                p.type === "Object" ? (
                  <InlineGrid
                    type={t}
                    types={this.props.types}
                    property={p}
                    data={this.props.value[p.name] ?? []}
                    onChange={(e) => this.handleValueChange(p.name, e)}
                  ></InlineGrid>
                ) : (
                  <InlineFormList
                    type={t}
                    types={this.props.types}
                    property={p}
                    data={this.props.value[p.name] ?? []}
                    onChange={(e) => this.handleValueChange(p.name, e)}
                  ></InlineFormList>
                )
              ) : (
                <CoreFormContent
                  type={t}
                  types={this.props.types}
                  mode={this.props.mode}
                  value={
                    p.name === ""
                      ? this.state.value
                      : this.state.value[p.name] ?? {}
                  }
                  prefix={this.props.prefix + p.name + "."}
                  validationErrors={this.props.validationErrors}
                  onChange={(e) => this.handleValueChange(p.name, e)}
                ></CoreFormContent>
              )}
            </Stack>
          </Grid>
        );
      }
    }

    const control = this.calculateUIControl(p);
    return React.createElement(Components[control], {
      key: this.props.prefix + p.name,
      value: p.name === "" ? this.state.value : this.state.value[p.name],
      error: this.props.validationErrors[this.props.prefix + p.name],
      property: p,
      onChange: (e) => this.handleValueChange(p.name, e),
    });
  }

  calculateUIControl(property) {
    if (property.uiControl && property.uiControl !== "") {
      return property.uiControl;
    }

    switch (property.type) {
      case "String":
        return "Text";
      case "Number":
        return "Number";
      case "Date":
        return "DatePicker";
      case "Boolean":
        return "Checkbox";
      default:
        return "Text";
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
        {this.props.type.properties && this.props.type.properties.length > 0
          ? this.props.type.properties
              .filter((p) => p.hideFromForm !== true)
              .map((p) => this.renderProperty(p))
          : this.renderProperty({
              name: "",
              display: "",
              type: this.props.type,
            })}
      </Grid>
    );
  }
}

export default CoreFormContent;
