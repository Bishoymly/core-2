import { Box, Button, Typography } from "@mui/material";
import React, { Component } from "react";
import SimpleGrid from "./simpleGrid";
import CoreForm from "./coreForm";
import AddIcon from "@mui/icons-material/Add";
class CoreEntity extends Component {
  state = {
    mode: "list",
    value: {},
  };

  handleModeChange = (e) => {
    this.setState({ mode: e });
  };

  handleValueChange = (e) => {
    console.log(e);
    this.setState({ value: e });
  };

  handleEdit = (e) => {
    this.setState({ mode: "edit", value: e });
  };

  render() {
    if (this.props.type) {
      if (this.state.mode === "list") {
        return (
          <Box>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {this.props.type?.display ?? this.props.type?.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
              onClick={() => {
                this.setState({ mode: "add", value: {} });
              }}
            >
              Add
            </Button>

            <SimpleGrid
              type={this.props.type}
              onValueChange={this.handleEdit}
              backend={true}
            ></SimpleGrid>
          </Box>
        );
      } else {
        return (
          <CoreForm
            type={this.props.type}
            types={this.props.types}
            mode={this.state.mode}
            value={this.state.value}
            prefix=""
            onModeChange={this.handleModeChange}
            onChange={this.handleValueChange}
          ></CoreForm>
        );
      }
    } else {
      return (
        <Typography component="h2" variant="h6" color="primary">
          Welcome
        </Typography>
      );
    }
  }
}

export default CoreEntity;
