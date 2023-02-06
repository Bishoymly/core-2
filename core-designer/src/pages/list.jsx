import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PublishIcon from "@mui/icons-material/Publish";
import EditIcon from "@mui/icons-material/Edit";
import SimpleGrid from "../components/simpleGrid";
import { Link, useNavigate, useParams } from "react-router-dom";
import typeSystem from "core/type-system";
import { useState } from "react";

export default function List() {
  const type = typeSystem.types[useParams().type];
  const [openImport, setOpenImport] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`http://localhost:3000/api/${type.name}/import`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      setOpenImport(false);
      return navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <Typography component="h2" variant="h5" color="primary">
        {typeSystem.labelForType(type.name)}
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
        <Button
          variant="outlined"
          startIcon={<PublishIcon />}
          onClick={() => setOpenImport(true)}
        >
          Import
        </Button>
        <Dialog open={openImport} onClose={() => setOpenImport(false)}>
          <DialogTitle>Import</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select a csv file to import data to this list.
            </DialogContentText>
            <TextField
              id="file"
              type="file"
              onChange={(e) => {
                setFileName(e.target.files[0].name);
                setFile(e.target.files[0]);
              }}
              InputProps={{
                style: { display: "none" },
              }}
            />
            <label htmlFor="file">
              <Stack direction="row" spacing={2} sx={{ mt: 1, mb: 1 }}>
                <Button variant="outlined" component="span">
                  Select File
                </Button>
                <DialogContentText sx={{ pt: 0.5 }}>
                  {fileName}
                </DialogContentText>
              </Stack>
            </label>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenImport(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>

      <SimpleGrid type={type} backend={true}></SimpleGrid>
    </Box>
  );
}
