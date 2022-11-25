import { Box, Button, Grid, Paper, Stack } from "@mui/material";
import React, { Component } from "react";
import AddIcon from "@mui/icons-material/Add";
import CoreFormContent from "./coreFormContent";

class InlineFormList extends Component {
  state = {
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
        {this.props.data?.map((v) => (
          <Paper
            key={v}
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              ml: 0,
              mr: 2,
              mt: 2,
            }}
          >
            <Box sx={{ pt: 2, pb: 2, pl: 3, pr: 3 }}>
              <Grid container spacing={2} sx={{ mt: 0, mb: 0 }}>
                <CoreFormContent
                  type={this.state.type}
                  types={this.props.types}
                  mode={"edit"}
                  value={v}
                  validationErrors={this.state.validationErrors}
                  prefix=""
                  onChange={this.handleValueChange}
                ></CoreFormContent>
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                size="large"
                sx={{ mt: 1, mb: 0 }}
              >
                <Button size="medium" onClick={this.handleDelete}>
                  Delete
                </Button>
              </Stack>
            </Box>
          </Paper>
        ))}

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
      </Box>
    );
  }
}

export default InlineFormList;
