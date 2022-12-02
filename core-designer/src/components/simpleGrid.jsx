import React, { Component } from "react";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
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
          "http://localhost:3000/api/" + this.state.type.name
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

  handleDelete = async (item) => {
    if (this.state.backend === true) {
      try {
        this.setState({ loading: true });
        const response = await fetch(
          "http://localhost:3000/api/" + this.state.type.name + "/" + item.id,
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
    } else {
      const i = this.state.data.indexOf(item);
      this.state.data.splice(i, 1);
      this.setState({ data: this.state.data });
      if (this.props.onChange) this.props.onChange(this.state.data);
    }
  };

  display(obj, type) {
    if (obj) {
      const t = this.props.types.find((t) => t.name === type);
      if (t && t.displayAsFunc) {
        try {
          return t.displayAsFunc.call(obj);
        } catch (error) {
          console.warn("Error calculating displayAs in ");
          console.warn(obj);
          console.warn(error);
        }
      } else if (typeof obj === "object") {
        return JSON.stringify(obj);
      } else {
        return obj.toString();
      }
    }
  }

  render() {
    return (
      <Table
        autoHeight={true}
        data={this.state.data}
        loading={this.state.loading}
      >
        {this.state.type.properties
          ?.filter((p) => p.hideFromGrid !== true)
          .map((p) => {
            return (
              <Column key={p.name} flexGrow={1}>
                <HeaderCell>{p.display ?? p.name}</HeaderCell>
                <Cell>{(row) => this.display(row[p.name], p.type)}</Cell>
              </Column>
            );
          })}
        <Column fixed="right" flexGrow={1}>
          <HeaderCell></HeaderCell>
          <Cell>
            {(item) => (
              <Stack direction="row" spacing={2} sx={{ mt: -1 }}>
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
                  onClick={async () => await this.handleDelete(item)}
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
