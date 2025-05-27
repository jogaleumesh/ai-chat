import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";
import { v4 as uuidv4 } from "uuid";

import { useChatContext } from "../contexts/ChatContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { Message } from "../types/index";

import ChatMessage from "./ChatMessage";
import FileUpload from "./FileUpload";

export default function ChatView() {
  const { state } = useChatContext();
  const currentChat = state.chats.find(
    (chat) => chat.id === state.currentChatId
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");

  const { sendMessage } = useWebSocket((token) => {
    setStreamBuffer((prev) => prev + token);
  });

  const handleSend = () => {
    if (!input || !currentChat) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      content: input,
    };

    const assistantMessage: Message = {
      id: uuidv4(),
      sender: "assistant",
      content: "",
    };

    currentChat.messages.push(userMessage, assistantMessage);
    setInput("");
    setIsStreaming(true);
    sendMessage(input);

    const streamInterval = setInterval(() => {
      if (streamBuffer.length > 0) {
        assistantMessage.content += streamBuffer;
        setStreamBuffer("");
      }
    }, 500);

    setTimeout(() => {
      clearInterval(streamInterval);
      setIsStreaming(false);
    }, 5000);
  };

  return (
    <Box flex={1} p={3}>
      <Typography variant="h6">Chat</Typography>
      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          border: "1px solid #ddd",
          p: 2,
          mb: 2,
        }}
      >
        {currentChat?.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isStreaming && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="body2">Assistant typing...</Typography>
            <IconButton onClick={() => setIsStreaming(false)} size="small">
              <StopIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type your message..."
      />

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button variant="contained" onClick={handleSend} sx={{ mt: 1 }}>
          Send
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <FileUpload />
      </Box>
    </Box>
  );
}
