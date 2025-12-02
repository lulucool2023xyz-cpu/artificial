import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * Main Chat Interface Page - New AI Chatbot
 * Purpose: Modern AI interaction hub with voice, camera, and multi-mode support
 * 
 * Features:
 * - Voice input (Mic)
 * - Camera input
 * - Multiple AI modes (Fast, Balance, Deep Learning)
 * - Chat history management
 * - Profile & Settings integration
 * - Monochrome theme with Indonesian cultural touch
 */
const Chat = memo(function Chat() {
  return (
    <PageTransition>
      <AIChatbot />
    </PageTransition>
  );
});

export default Chat;

