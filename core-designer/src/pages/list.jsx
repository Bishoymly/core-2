import { Box, Button, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
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
          aria-label="Settings"
          component={Link}
          to={"/type/" + type.id}
          fontSize="small"
          sx={{ ml: 1, mb: 1 }}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Typography>
      <Button
        component={Link}
        to="add"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
      >
        Add
      </Button>

      <SimpleGrid type={type} backend={true}></SimpleGrid>
    </Box>
  );
}
