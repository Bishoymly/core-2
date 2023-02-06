import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack } from "@mui/material";
import typeSystem from "core/type-system";
import { Link, useNavigate } from "react-router-dom";

const { Column, HeaderCell, Cell } = Table;

export default function SimpleGrid({
  type,
  backend,
  onEdit,
  onDelete,
  defaultData,
}) {
  //const data = useLoaderData().data ?? defaultData ?? [];
  const [data, setData] = useState(defaultData ?? []);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (backend) {
      setLoading(true);
      const loadData = async () => {
        try {
          let url = `http://localhost:3000/api/${type.name}`;
          if (sortColumn) {
            url += `?sort=${sortColumn}&dir=${sortType}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw Error(response.statusText);
          }
          setData(await response.json());
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [setSortColumn, setData, sortColumn, sortType, type.name, backend]);

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

  const handleSortColumn = async (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  return (
    <Table
      autoHeight={true}
      data={data}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
      loading={loading}
    >
      {type.calculatedProperties
        ?.filter((p) => p.hideFromGrid !== true)
        .map((p) => {
          return (
            <Column key={p.name} flexGrow={1} fullText sortable>
              <HeaderCell>{typeSystem.labelFor(p)}</HeaderCell>
              <Cell dataKey={p.name} align={typeSystem.align(p.type)}>
                {(row) => typeSystem.display(row[p.name], p.type)}
              </Cell>
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
