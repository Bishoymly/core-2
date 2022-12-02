import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import AddIcon from "@mui/icons-material/Add";
import SimpleGrid from "./simpleGrid";
import CoreFormContent from "./coreFormContent";

class InlineGrid extends Component {
  state = {
    mode: "list",
    type: this.props.type,
    value: {},
    validationErrors: {},
    data: this.props.data ?? [],
  };

  handleEdit = async (e) => {
    this.setState({ mode: "edit", value: e });
  };

  handleDelete = async (id) => {};

  handleSave = (event) => {
    if (this.state.mode === "add") {
      this.state.data.push(this.state.value);
    }

    this.setState({ mode: "list", data: this.state.data });
    if (this.props.onChange) this.props.onChange(this.state.data);
  };

  handleCancel = (event) => {
    this.setState({ mode: "list" });
  };

  render() {
    return (
      <Box>
        {this.state.data.length > 0 ? (
          <SimpleGrid
            type={this.props.type}
            types={this.props.types}
            backend={false}
            data={this.state.data}
            onValueChange={this.handleEdit}
          ></SimpleGrid>
        ) : null}

        {this.state.mode === "list" ? (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={() => {
              this.setState({ mode: "add", value: {} });
            }}
          >
            Add
          </Button>
        ) : (
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              ml: 5,
              mr: 5,
              mt: 2,
            }}
          >
            <Box sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
              <Typography component="h2" variant="h6">
                {this.state.mode === "add" ? "Create" : "Edit"}{" "}
                {this.state.type?.display ?? ""}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <CoreFormContent
                  type={this.state.type}
                  types={this.props.types}
                  mode={this.state.mode}
                  value={this.state.value}
                  validationErrors={this.state.validationErrors}
                  prefix=""
                  onChange={this.handleValueChange}
                ></CoreFormContent>
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  onClick={this.handleSave}
                >
                  {this.state.mode === "add" ? "Add" : "Update"}
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={this.handleCancel}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}
      </Box>
    );
  }
}

export default InlineGrid;
