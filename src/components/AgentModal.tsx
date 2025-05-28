import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Slider,
} from "@mui/material";

import { useChatContext } from "../contexts/ChatContext";

export default function AgentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useChatContext();
  const [agent, setAgent] = useState({
    name: "",
    systemPrompt: "",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const handleSubmit = () => {
    const newAgent = {
      ...agent,
      id: Date.now().toString(),
      model: agent.model as "gpt-3.5-turbo" | "gpt-4",
    };

    // 1. Add the new agent to state
    dispatch({
      type: "ADD_AGENT",
      payload: newAgent,
    });

    // 2. Attach the agent to the current chat
    dispatch({
      type: "SET_AGENT_FOR_CHAT",
      payload: {
        chatId: state.currentChatId!,
        agentId: newAgent.id,
      },
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Agent</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          value={agent.name}
          onChange={(e) => setAgent({ ...agent, name: e.target.value })}
          sx={{ mt: 1 }}
        />
        <TextField
          label="System Prompt"
          fullWidth
          multiline
          rows={3}
          value={agent.systemPrompt}
          onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          select
          label="Model"
          fullWidth
          value={agent.model}
          onChange={(e) => setAgent({ ...agent, model: e.target.value })}
          sx={{ mt: 2 }}
        >
          <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
          <MenuItem value="gpt-4">gpt-4</MenuItem>
        </TextField>
        <Slider
          value={agent.temperature}
          min={0}
          max={1}
          step={0.1}
          onChange={(_, val) =>
            setAgent({ ...agent, temperature: val as number })
          }
          sx={{ mt: 4 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
