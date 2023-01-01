import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";
import typeSystem from "core/type-system";

const { Column, HeaderCell, Cell } = Table;

export default function SimpleGrid({
  type,
  defaultData,
  backend,
  onValueChange,
  onChange,
}) {
  const [data, setData] = useState(defaultData ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/" + type.name);
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const json = await response.json();
        setLoading(false);
        setData(json);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [backend, type.name]);

  const fetchData = async () => {
    if (backend === true) {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/" + type.name);
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const json = await response.json();
        setLoading(false);
        setData(json);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDelete = async (item) => {
    if (backend === true) {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/" + type.name + "/" + item.id,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw Error(response.statusText);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }

      fetchData();
    } else {
      const i = data.indexOf(item);
      data.splice(i, 1);
      setData(data);
      if (onChange) onChange(data);
    }
  };

  return (
    <Table autoHeight={true} data={data} loading={loading}>
      {type.calculatedProperties
        ?.filter((p) => p.hideFromGrid !== true)
        .map((p) => {
          return (
            <Column key={p.name} flexGrow={1} fullText>
              <HeaderCell>{p.display ?? p.name}</HeaderCell>
              <Cell>{(row) => typeSystem.display(row[p.name], p.type)}</Cell>
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
                onClick={async (item) => {
                  onValueChange(item);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                fontSize="small"
                onClick={async () => await handleDelete(item)}
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
