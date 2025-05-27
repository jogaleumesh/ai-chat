import React, { createContext, useReducer, useContext, useEffect } from "react";
import { Agent, Chat } from "../types";
import { saveToStorage, loadFromStorage } from "../utils/storage";

const CHAT_STORAGE_KEY = "ai-chat";

type State = {
  chats: Chat[];
  agents: Agent[];
  selectedAgentId: string | null;
  selectedChatId: string | null;
  showAgentModal: boolean;
  currentChatId?: string;
};

const initialState: State = {
  chats: loadFromStorage<Chat[]>(CHAT_STORAGE_KEY, []),
  agents: [],
  selectedAgentId: null,
  selectedChatId: null,
  showAgentModal: false,
};

type Action =
  | { type: "ADD_CHAT"; payload: Chat }
  | { type: "DELETE_CHAT"; payload: string }
  | { type: "SET_CURRENT_CHAT"; payload: string }
  | { type: "ADD_AGENT"; payload: Agent }
  | { type: "TOGGLE_AGENT_MODAL" }
  | { type: "SET_CHATS"; payload: Chat[] }
  | {
      type: "SET_AGENT_FOR_CHAT";
      payload: { chatId: string; agentId: string };
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_CHAT":
      return { ...state, chats: [...state.chats, action.payload] };
    case "DELETE_CHAT":
      return {
        ...state,
        chats: state.chats.filter((chat) => chat.id !== action.payload),
      };
    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload,
      };
    case "SET_CURRENT_CHAT":
      return { ...state, currentChatId: action.payload };
    case "ADD_AGENT":
      return { ...state, agents: [...state.agents, action.payload] };
    case "TOGGLE_AGENT_MODAL":
      return {
        ...state,
        showAgentModal: !state.showAgentModal,
      };

    case "SET_AGENT_FOR_CHAT":
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? { ...chat, agentId: action.payload.agentId }
            : chat
        ),
      };
    default:
      return state;
  }
}

const ChatContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveToStorage(CHAT_STORAGE_KEY, state.chats);
  }, [state.chats]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};
