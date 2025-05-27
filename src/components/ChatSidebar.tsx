import { useState } from "react";
import {
  Box,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Delete, Chat } from "@mui/icons-material";

import { useChatContext } from "../contexts/ChatContext";

export default function ChatSidebar() {
  const { state, dispatch } = useChatContext();
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");

  const filteredChats = state.chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteChat = (id: string) => {
    dispatch({ type: "DELETE_CHAT", payload: id });
  };

  return (
    <Box
      width="300px"
      p={2}
      borderRight="1px solid #ddd"
      display="flex"
      flexDirection="column"
    >
      {/* Agent Select & New Chat */}
      <Select
        fullWidth
        sx={{ mt: 1 }}
        displayEmpty
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
      >
        <MenuItem value="">Select Agent</MenuItem>
        {state.agents.map((agent) => (
          <MenuItem key={agent.id} value={agent.id}>
            {agent.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() =>
          dispatch({
            type: "ADD_CHAT",
            payload: {
              id: Date.now().toString(),
              agentId: selectedAgent,
              messages: [],
              title: `Chat ${state.chats.length + 1}`,
            },
          })
        }
      >
        New Chat
      </Button>

      <Divider sx={{ my: 2 }} />

      {/* Search + Chat List */}
      <TextField
        placeholder="Search chats..."
        fullWidth
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Chat fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Box flex={1} overflow="auto" mt={1}>
        <List dense>
          {filteredChats.map((chat) => (
            <ListItem
              key={chat.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleDeleteChat(chat.id)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              }
            >
              <ListItemButton
                selected={chat.id === state.currentChatId}
                onClick={() =>
                  dispatch({ type: "SET_CURRENT_CHAT", payload: chat.id })
                }
              >
                <ListItemText primary={chat.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
