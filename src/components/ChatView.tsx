import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StopIcon from "@mui/icons-material/Stop";

import { v4 as uuidv4 } from "uuid";

import { useChatContext } from "../contexts/ChatContext";
import { useWebSocket } from "../hooks/useWebSocket";
import { Message } from "../types/index";

import ChatMessage from "./ChatMessage";
import FileUpload from "./FileUpload";

export default function ChatView() {
  const [input, setInput] = useState("");
  const [streamBuffer, setStreamBuffer] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { state, dispatch } = useChatContext();
  const currentChat = state.chats.find(
    (chat) => chat.id === state.currentChatId
  );

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

    // Copy messages and update currentChat
    const updatedMessages = [
      ...currentChat.messages,
      userMessage,
      assistantMessage,
    ];

    const updatedChat = {
      ...currentChat,
      messages: updatedMessages,
    };

    // Update global chat state
    const updatedChats = state.chats.map((chat) =>
      chat.id === currentChat.id ? updatedChat : chat
    );

    dispatch({ type: "SET_CHATS", payload: updatedChats });

    setInput("");
    setIsStreaming(true);
    sendMessage(input);

    const streamInterval = setInterval(() => {
      if (streamBuffer.length > 0) {
        assistantMessage.content += streamBuffer;

        // Update assistant message in chat state again (optional)
        const updatedChatsStream = state.chats.map((chat) => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: assistantMessage.content }
                  : msg
              ),
            };
          }
          return chat;
        });

        dispatch({ type: "SET_CHATS", payload: updatedChatsStream });
        setStreamBuffer("");
      }
    }, 500);

    setTimeout(() => {
      clearInterval(streamInterval);
      setIsStreaming(false);
    }, 5000);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100vw">
      {/* Sticky Header */}
      <Box
        p={2}
        position="sticky"
        top={0}
        bgcolor="background.paper"
        zIndex={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        boxShadow={1}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch({ type: "TOGGLE_AGENT_MODAL" })}
        >
          Create Agent
        </Button>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Chat Scrollable Area */}
      <Box
        flex={1}
        overflow="auto"
        p={2}
        sx={{
          bgcolor: "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          gap: 1,
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

      {/* Bottom Input Area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        p={2}
        display="flex"
        alignItems="flex-end"
        borderTop="1px solid #ccc"
        position="sticky"
        bottom={0}
        bgcolor="background.paper"
        zIndex={1}
      >
        {/* Upload Icon */}
        <Box mr={1}>
          <FileUpload />
        </Box>

        {/* Input */}
        <TextField
          fullWidth
          multiline
          minRows={1}
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

        {/* Send Button */}
        <Box ml={1}>
          <Button variant="contained" type="submit">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
