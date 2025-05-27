import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";

import { Message } from "../types";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <Box
      display="flex"
      justifyContent={message.sender === "user" ? "flex-end" : "flex-start"}
    >
      <Box
        maxWidth="70%"
        bgcolor={message.sender === "user" ? "primary.main" : "grey.300"}
        color={message.sender === "user" ? "white" : "black"}
        px={2}
        py={1}
        borderRadius={2}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </Box>
    </Box>
  );
}
