import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SimpleGrid from "../components/simpleGrid";
import { Link, useParams } from "react-router-dom";
import typeSystem from "core/type-system";

export default function List() {
  const type = typeSystem.types[useParams().type];
  return (
    <Box>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {type?.display ?? type?.name}
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

      <SimpleGrid type={type}></SimpleGrid>
    </Box>
  );
}
