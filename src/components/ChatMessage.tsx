import { Box, Typography, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";

import { Message } from "../types";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 1,
        backgroundColor: message.sender === "user" ? "#e0f7fa" : "#f1f8e9",
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
        {message.sender === "user" ? "You" : "Assistant"}
      </Typography>
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </Paper>
  );
}
