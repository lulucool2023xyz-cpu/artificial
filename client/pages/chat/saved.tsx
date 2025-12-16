import { memo } from "react";
import { PageTransition } from "@/components/PageTransition";
import AIChatbot from "@/components/chat/AIChatbot";

/**
 * Saved Chats Page
 * Purpose: View and manage bookmarked conversations via AIChatbot component
 * 
 * Features:
 * - View all saved/bookmarked chats
 * - Search and organize saved chats
 * - Integrated with main chat interface
 */
const ChatSaved = memo(function ChatSaved() {
    return (
        <PageTransition>
            <AIChatbot initialView="saved" />
        </PageTransition>
    );
});

export default ChatSaved;
