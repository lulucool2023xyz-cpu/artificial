import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * Chat History Page
 * Purpose: Display list of all past conversations via AIChatbot component
 * 
 * Features:
 * - List of all past conversations
 * - Search functionality
 * - Delete conversations
 * - Integrated with main chat interface
 */
const ChatHistory = memo(function ChatHistory() {
  return (
    <PageTransition>
      <AIChatbot initialView="history" />
    </PageTransition>
  );
});

export default ChatHistory;
