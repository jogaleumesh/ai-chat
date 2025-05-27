import { Box, IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export default function FileUpload() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log("Uploaded:", file.name, file.size, file.type);
    }
  };

  return (
    <Box>
      <IconButton component="label" color="primary">
        <UploadIcon />
        <input type="file" hidden multiple onChange={handleFileChange} />
      </IconButton>
    </Box>
  );
}
