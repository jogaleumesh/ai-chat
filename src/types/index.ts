export type Message = {
  id: string;
  sender: "user" | "assistant";
  content: string;
};

export type Agent = {
  id: string;
  name: string;
  systemPrompt: string;
  model: "gpt-3.5-turbo" | "gpt-4";
  temperature: number;
};

export type Chat = {
  id: string;
  agentId: string;
  messages: Message[];
  title: string;
  folderId?: string;
};

export type Folder = {
  id: string;
  name: string;
};
