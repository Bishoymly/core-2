import { Box, Button, Typography } from "@mui/material";
import React, { Component } from "react";
import SimpleGrid from "./simpleGrid";
import CoreForm from "./coreForm";
import AddIcon from "@mui/icons-material/Add";
class CoreEntity extends Component {
  state = {
    mode: "grid",
  };

  render() {
    if (this.props.type) {
      if (this.state.mode === "grid") {
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
                this.setState({ mode: "add" });
              }}
            >
              Add
            </Button>

            <SimpleGrid type={this.props.type}></SimpleGrid>
          </Box>
        );
      } else {
        return <CoreForm type={this.props.type}></CoreForm>;
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
