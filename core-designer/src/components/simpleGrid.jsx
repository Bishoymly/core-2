import React, { useState } from "react";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";
import typeSystem from "core/type-system";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";

const { Column, HeaderCell, Cell } = Table;

export async function loader({ params }) {
  try {
    const response = await fetch("http://localhost:3000/api/" + params.type);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.log(error);
  }
}

export default function SimpleGrid({ backend, onEdit, onDelete, defaultData }) {
  const type = typeSystem.types[useParams().type];
  const data = useLoaderData().data ?? defaultData ?? [];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      navigate("/" + type.name, { replace: true });
    } else {
      const i = data.indexOf(item);
      onDelete(i);
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
              {backend ? (
                <IconButton
                  aria-label="edit"
                  fontSize="small"
                  component={Link}
                  to={`${item.id}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="edit"
                  fontSize="small"
                  onClick={() => onEdit(item)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
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
