import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StringField from "./stringField";
import NumberField from "./numberField";
import DateField from "./dateField";
import AutoCompleteField from "./autoCompleteField";
import { Stack } from "@mui/material";

class CoreForm extends Component {
  state = {
    validationErrors: {},
  };

  renderProperty(p) {
    if (p.type === "String")
      return (
        <StringField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.state.validationErrors[this.props.prefix + p.name]}
          property={p}
        />
      );

    if (p.type === "Number")
      return (
        <NumberField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.state.validationErrors[this.props.prefix + p.name]}
          property={p}
        />
      );

    if (p.type === "Date")
      return (
        <DateField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.state.validationErrors[this.props.prefix + p.name]}
          property={p}
        />
      );

    if (p.type === "state")
      return (
        <AutoCompleteField
          key={this.props.prefix + p.name}
          value={this.props.value[p.name]}
          error={this.state.validationErrors[this.props.prefix + p.name]}
          property={p}
        />
      );
  }

  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const body = {};
      this.props.type.properties.forEach((p) => {
        body[p.name] = data.get(p.name);
      });
      const response = await fetch(
        "http://localhost:3000/" + this.props.type.name,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const body = await response.json();
        let errors = {};
        body.validationErrors.forEach((error) => {
          errors[error.field] = error.error;
        });
        this.setState({ validationErrors: errors });
        console.log(errors);
        throw Error(response.statusText);
      }
      this.setState({ validationErrors: {} });
      console.log(body);
      this.props.onModeChange("list");
    } catch (error) {
      console.log(error);
    }
  };

  handleCancel = (event) => {
    event.preventDefault();
    console.log("cancelled");
    this.props.onModeChange("list");
  };

  render() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Create {this.props.type?.display ?? ""}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={this.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            {this.props.type.properties.map((p) => this.renderProperty(p))}
          </Grid>
          <Stack direction="row" spacing={2} size="large" sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" size="large" variant="contained">
              Create
            </Button>
            <Button variant="outlined" onClick={this.handleCancel}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }
}

export default CoreForm;
