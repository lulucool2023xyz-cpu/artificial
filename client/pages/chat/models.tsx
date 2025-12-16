import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * AI Models Page
 * Purpose: View and select AI models via AIChatbot component
 * 
 * Features:
 * - View available AI models
 * - Compare model capabilities
 * - Integrated with main chat interface
 */
const ChatModels = memo(function ChatModels() {
    return (
        <PageTransition>
            <AIChatbot initialView="models" />
        </PageTransition>
    );
});

export default ChatModels;
