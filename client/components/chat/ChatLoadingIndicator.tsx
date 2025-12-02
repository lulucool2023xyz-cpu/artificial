import { memo } from "react";
import { cn } from "@/lib/utils";

interface ChatLoadingIndicatorProps {
  variant?: "typing" | "streaming" | "skeleton";
}

/**
 * Chat Loading Indicator Component
 * Purpose: Display loading states during chat interactions
 * 
 * Variants:
 * - typing: Animated typing indicator (three dots)
 * - streaming: Streaming response animation
 * - skeleton: Skeleton loader for messages
 */
export const ChatLoadingIndicator = memo(function ChatLoadingIndicator({
  variant = "typing",
}: ChatLoadingIndicatorProps) {
  if (variant === "typing") {
    return (
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-indonesian-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="text-indonesian-gold text-sm font-semibold">AI</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-indonesian-gold animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }}></div>
            <div className="w-2 h-2 rounded-full bg-indonesian-gold animate-bounce" style={{ animationDelay: "150ms", animationDuration: "1s" }}></div>
            <div className="w-2 h-2 rounded-full bg-indonesian-gold animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1s" }}></div>
          </div>
          <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
        </div>
      </div>
    );
  }

  if (variant === "streaming") {
    return (
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="w-8 h-8 rounded-full bg-indonesian-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="text-indonesian-gold text-sm font-semibold">AI</span>
        </div>
        <div className="flex-1">
          <div className="h-4 bg-muted rounded animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-muted rounded animate-pulse mb-2 w-1/2"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className="flex gap-4 px-4 py-6">
        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return null;
});

