import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { useChatContext } from "../contexts/ChatContext";

export default function ChatSidebar() {
  const { state, dispatch } = useChatContext();
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  const filteredChats = state.chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box width="300px" p={2} borderRight="1px solid #ddd">
      <Typography variant="h6">Folders</Typography>

      <Box p={2}>
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
                folderId: selectedFolder || undefined,
                title: `Chat ${state.chats.length + 1}`,
              },
            })
          }
        >
          New Chat
        </Button>
      </Box>

      <Box p={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => dispatch({ type: "TOGGLE_AGENT_MODAL" })}
        >
          Create Agent
        </Button>
      </Box>

      <Select
        fullWidth
        sx={{ mt: 2 }}
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

      <List dense>
        {state.folders.map((folder) => (
          <ListItem key={folder.id} disablePadding>
            <ListItemButton
              selected={folder.id === selectedFolder}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <ListItemText primary={folder.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <TextField
        placeholder="Search chats..."
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <List>
        {filteredChats.map((chat) => (
          <ListItem key={chat.id} disablePadding>
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
  );
}
