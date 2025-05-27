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
  const { dispatch } = useChatContext();
  const [agent, setAgent] = useState({
    name: "",
    systemPrompt: "",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const handleSubmit = () => {
    dispatch({
      type: "ADD_AGENT",
      payload: {
        ...agent,
        id: Date.now().toString(),
        model: agent.model as "gpt-3.5-turbo" | "gpt-4",
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
        />
        <TextField
          label="System Prompt"
          fullWidth
          multiline
          rows={3}
          value={agent.systemPrompt}
          onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
        />
        <TextField
          select
          label="Model"
          fullWidth
          value={agent.model}
          onChange={(e) => setAgent({ ...agent, model: e.target.value })}
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
