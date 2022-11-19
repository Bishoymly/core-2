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
    loading: false,
    type: this.props.type,
    data: this.props.data ?? [],
    backend: this.props.backend ?? true,
  };

  async componentDidMount() {
    if (this.state.backend === true) {
      try {
        this.setState({ loading: true });
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
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  handleEdit = async (item) => {
    this.props.onValueChange(item);
  };

  handleDelete = async (id) => {
    try {
      console.log(id);
      this.setState({ loading: true });
      const response = await fetch(
        "http://localhost:3000/" + this.state.type.name + "/" + id,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }

    this.componentDidMount();
  };

  render() {
    return (
      <Table
        autoHeight={true}
        data={this.state.data}
        loading={this.state.loading}
      >
        {this.state.type.properties
          ?.filter(
            (p) =>
              p.type === "String" || p.type === "Number" || p.type === "Boolean"
          )
          .map((p) => {
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
                <IconButton
                  aria-label="edit"
                  fontSize="small"
                  onClick={async () => await this.handleEdit(item)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  fontSize="small"
                  onClick={async () => await this.handleDelete(item.id)}
                >
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
