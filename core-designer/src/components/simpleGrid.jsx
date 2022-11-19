import React, { Component } from "react";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "rsuite-table/dist/css/rsuite-table.min.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";

const { Column, HeaderCell, Cell } = Table;

class SimpleGrid extends Component {
  state = {
    loading: true,
    type: this.props.type,
    data: [],
  };

  async componentDidMount() {
    try {
      const response = await fetch(
        "http://localhost:3000/" + this.state.type.name
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      this.setState({ data: json, loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Table height={400} data={this.state.data} loading={this.state.loading}>
        {this.state.type.properties?.map((p) => {
          return (
            <Column key={p.name} flexGrow={1}>
              <HeaderCell>{p.display ?? p.name}</HeaderCell>
              <Cell dataKey={p.name} />
            </Column>
          );
        })}
        <Column fixed="right" flexGrow={1}>
          <HeaderCell></HeaderCell>
          <Cell>
            {(item) => (
              <Stack direction="row" spacing={2} fontSize="small">
                <IconButton aria-label="edit" fontSize="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete" fontSize="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Cell>
        </Column>
      </Table>
    );
  }
}

export default SimpleGrid;
