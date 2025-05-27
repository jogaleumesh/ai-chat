import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/ChatContext";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
