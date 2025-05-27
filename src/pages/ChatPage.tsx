import { Box } from "@mui/material";

import { useChatContext } from "../contexts/ChatContext";

import ChatSidebar from "../components/ChatSidebar";
import ChatView from "../components/ChatView";
import AgentModal from "../components/AgentModal";

export default function ChatPage() {
  const { state, dispatch } = useChatContext();

  return (
    <Box display="flex" height="100vh">
      <ChatSidebar />
      <ChatView />
      {state.showAgentModal && (
        <AgentModal
          open={state.showAgentModal}
          onClose={() => dispatch({ type: "TOGGLE_AGENT_MODAL" })}
        />
      )}
    </Box>
  );
}
