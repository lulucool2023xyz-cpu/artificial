import { memo, useState, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { ChatEmptyState } from "./ChatEmptyState";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ChatErrorDisplay, ChatError } from "./ChatErrorDisplay";
import { useChat } from "@/contexts/ChatContext";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/**
 * Chat Canvas Component
 * Purpose: Main chat message display area
 * 
 * Features:
 * - Full screen experience
 * - Clean, minimalist interface
 * - Chat messages display
 * - Empty state with suggested prompts
 * - Loading states
 */
export const ChatCanvas = memo(function ChatCanvas() {
  const { messages, isLoading, setIsLoading } = useChat();
  const [error, setError] = useState<ChatError | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !showScrollButton) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, showScrollButton]);

  // Handle scroll to detect if user scrolled up
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePromptSelect = (prompt: string) => {
    // TODO: Implement prompt selection logic
    console.log("Selected prompt:", prompt);
    // This will trigger message sending
    setError(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    // TODO: Show toast notification
  };

  const handleRegenerate = async (id: string) => {
    // TODO: Implement regenerate logic
    console.log("Regenerate message:", id);
    setError(null);
    setIsLoading(true);
    toast({
      description: "Regenerating response...",
      duration: 2000,
    });
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLike = (id: string) => {
    // TODO: Implement like logic
    console.log("Like message:", id);
    toast({
      description: "Thanks for your feedback!",
      duration: 2000,
    });
  };

  const handleDislike = (id: string) => {
    // TODO: Implement dislike logic
    console.log("Dislike message:", id);
    toast({
      description: "Thanks for your feedback. We'll improve!",
      duration: 2000,
    });
  };

  const handleRetry = () => {
    setError(null);
    // TODO: Implement retry logic
  };

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden transition-colors duration-300 relative">
      {/* Main Chat Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain pb-4"
      >
        {error && (
          <ChatErrorDisplay
            error={{
              ...error,
              retry: error.retry || handleRetry
            }}
            onDismiss={() => setError(null)}
          />
        )}

        {messages.length === 0 && !isLoading ? (
          <ChatEmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            ))}
            {isLoading && (
              <ChatLoadingIndicator variant="typing" />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-20 right-4 p-3 rounded-full shadow-lg transition-all",
            "bg-primary text-primary-foreground hover:opacity-90",
            "border-2 border-background"
          )}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

