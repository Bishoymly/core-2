import { Box, Typography } from "@mui/material";
import React, { Component } from "react";
import SimpleGrid from "./simpleGrid";
class CoreEntity extends Component {
  state = {
    type: this.props.type,
    mode: "grid",
  };

  render() {
    return (
      <Box>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {this.state.type?.display ?? this.state.type?.name}
        </Typography>
        <SimpleGrid type={this.state.type}></SimpleGrid>
      </Box>
    );
  }
}

export default CoreEntity;
