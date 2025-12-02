import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * Chat Profile Page
 * Purpose: User profile management via AIChatbot component
 * 
 * Features:
 * - User information
 * - Profile editing
 * - Integrated with main chat interface
 */
const ChatProfile = memo(function ChatProfile() {
  return (
    <PageTransition>
      <AIChatbot initialView="profile" />
    </PageTransition>
  );
});

export default ChatProfile;
