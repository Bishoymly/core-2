import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import SimpleGrid from "../components/simpleGrid";
import { Link, useParams } from "react-router-dom";
import typeSystem from "core/type-system";

export default function List() {
  const type = typeSystem.types[useParams().type];
  return (
    <Box>
      <Typography component="h2" variant="h5" color="primary">
        {type?.display ?? type?.name}
        <IconButton
          aria-label="Edit Type"
          component={Link}
          to={"/type/" + type.id}
          fontSize="small"
          sx={{ ml: 1, mb: 1 }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2 }}>
        <Button
          component={Link}
          to="add"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add
        </Button>
        <Button
          component={Link}
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() =>
            window.open(
              `http://localhost:3000/api/${type.name}?output=csv`,
              "_blank"
            )
          }
        >
          Export
        </Button>
      </Stack>

      <SimpleGrid type={type} backend={true}></SimpleGrid>
    </Box>
  );
}
