import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * Chat Settings Page
 * Purpose: Application settings via AIChatbot component
 * 
 * Features:
 * - Settings management
 * - Preferences configuration
 * - Integrated with main chat interface
 */
const ChatSettings = memo(function ChatSettings() {
  return (
    <PageTransition>
      <AIChatbot initialView="settings" />
    </PageTransition>
  );
});

export default ChatSettings;
