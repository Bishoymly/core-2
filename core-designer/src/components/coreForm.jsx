import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StringField from "./stringField";
import NumberField from "./numberField";
import DateField from "./dateField";
import AutoCompleteField from "./autoCompleteField";

class CoreForm extends Component {
  state = {
    type: this.props.type,
    prefix: this.props.prefix ?? "",
  };

  renderProperty(p) {
    if (p.type === "String")
      return <StringField key={this.state.prefix + p.name} property={p} />;

    if (p.type === "Number")
      return <NumberField key={this.state.prefix + p.name} property={p} />;

    if (p.type === "Date")
      return <DateField key={this.state.prefix + p.name} property={p} />;

    if (p.type === "state")
      return (
        <AutoCompleteField key={this.state.prefix + p.name} property={p} />
      );
  }

  render() {
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const body = {};
      this.state.type.properties.forEach((p) => {
        body[p.name] = data.get(p.name);
      });
      fetch("http://localhost:3000/address", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(body);
    };

    return (
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h3">
          Create {this.state.type?.display ?? ""}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {this.state.type.properties.map((p) => this.renderProperty(p))}
          </Grid>
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    );
  }
}

export default CoreForm;
