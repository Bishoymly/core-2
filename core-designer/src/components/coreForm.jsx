import React, { Component } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Grid, Stack } from "@mui/material";
import CoreFormContent from "./coreFormContent";

class CoreForm extends Component {
  state = {
    value: this.props.value ?? {},
    validationErrors: {},
  };

  handleValueChange = (value) => {
    this.state.value = value;
    this.setState({ value: this.state.value });
    if (this.props.onChange) this.props.onChange(this.state.value);
  };

  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      this.setState({ validationErrors: {} });

      let body = this.state.value;
      let url = "http://localhost:3000/api/" + this.props.type.name;
      let method = "POST";
      if (this.props.mode === "edit") {
        url += "/" + body.id;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
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
          {this.props.mode === "add" ? "Create" : "Edit"}{" "}
          {this.props.type?.display ?? ""}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={this.handleSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <CoreFormContent
              type={this.props.type}
              types={this.props.types}
              mode={this.props.mode}
              value={this.props.value}
              validationErrors={this.state.validationErrors}
              prefix=""
              onChange={this.handleValueChange}
            ></CoreFormContent>
          </Grid>
          <Stack direction="row" spacing={2} size="large" sx={{ mt: 3, mb: 2 }}>
            <Button type="submit" size="large" variant="contained">
              {this.props.mode === "add" ? "Create" : "Save"}
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
