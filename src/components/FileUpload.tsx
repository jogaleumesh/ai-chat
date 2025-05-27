import { Box, Button, Typography } from "@mui/material";

export default function FileUpload() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log("Uploaded:", file.name, file.size, file.type);
      // Extend: Save to chat as message with media preview
    }
  };

  return (
    <Box>
      <Button variant="outlined" component="label">
        Upload File
        <input type="file" hidden multiple onChange={handleFileChange} />
      </Button>
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Supported: PNG, JPG, PDF, DOCX
      </Typography>
    </Box>
  );
}
