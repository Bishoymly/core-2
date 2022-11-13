import React, { Component } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

class CoreForm extends Component {
  state = {
    type: this.props.type,
  };

  renderProperty(p) {
    if (p.type === "String" || p.type === "Number")
      return (
        <Grid key={p.name} item xs={12}>
          <TextField
            name={p.name}
            required={p.required}
            fullWidth
            id={p.name}
            label={p.display ?? ""}
            placeholder={p.example}
          />
        </Grid>
      );

    if (p.type === "state")
      return (
        <Grid key={p.name} item xs={12}>
          <Autocomplete
            disablePortal
            required
            fullWidth
            id={p.name}
            name={p.name}
            options={[
              { label: "California", id: "CA" },
              { label: "New York", id: "NY" },
            ]}
            renderInput={(params) => (
              <TextField {...params} required label={p.display ?? ""} />
            )}
          />
        </Grid>
      );
  }

  render() {
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        street: data.get("street"),
      });
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
