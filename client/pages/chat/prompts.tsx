import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * My Prompts Page
 * Purpose: Manage saved prompts/templates via AIChatbot component
 * 
 * Features:
 * - View all saved prompts
 * - Search and categorize prompts
 * - Integrated with main chat interface
 */
const ChatPrompts = memo(function ChatPrompts() {
    return (
        <PageTransition>
            <AIChatbot initialView="prompts" />
        </PageTransition>
    );
});

export default ChatPrompts;
