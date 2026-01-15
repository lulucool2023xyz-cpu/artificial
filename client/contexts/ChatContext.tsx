import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { ChatMessageProps } from "@/components/chat/ChatMessage";

interface ChatContextType {
  messages: ChatMessageProps[];
  addMessage: (message: ChatMessageProps) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: ChatMessageProps) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      messages,
      addMessage,
      clearMessages,
      isLoading,
      setIsLoading,
    }),
    [messages, isLoading, addMessage, clearMessages]
  );

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

