import { memo } from "react";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  onCopy?: (content: string) => void;
  onRegenerate?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
}

/**
 * Chat Message Component
 * Purpose: Display individual chat messages (user or AI)
 * 
 * Features:
 * - User message bubble (right aligned)
 * - AI response bubble (left aligned)
 * - Timestamp
 * - Copy button
 * - Regenerate button (for AI responses)
 * - Like/Dislike feedback
 * - Message actions menu
 */
export const ChatMessage = memo(function ChatMessage({
  id,
  role,
  content,
  timestamp,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
}: ChatMessageProps) {
  const isUser = role === "user";
  const formattedTime = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Message copied to clipboard",
      duration: 2000,
    });
    onCopy?.(content);
  };

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indonesian-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="text-indonesian-gold text-sm font-semibold">AI</span>
        </div>
      )}

      <div className={cn("flex flex-col gap-2 max-w-[85%] sm:max-w-[600px]", isUser && "items-end")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-3 transition-all duration-200",
            isUser
              ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
              : "bg-card text-card-foreground border border-border rounded-2xl rounded-bl-md shadow-sm"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* Actions Bar */}
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity",
            "opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100",
            "sm:opacity-100", // Always visible on mobile/tablet
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Timestamp */}
          <span className="text-xs text-muted-foreground px-2">{formattedTime}</span>

          {/* Action Buttons */}
          {!isUser && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="Copy message"
              >
                <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRegenerate?.(id)}
                className="h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="Regenerate response"
              >
                <RefreshCw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(id)}
                className="h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2 text-muted-foreground hover:text-green-400 hover:bg-accent"
                aria-label="Like response"
              >
                <ThumbsUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDislike?.(id)}
                className="h-8 w-8 p-0 sm:h-7 sm:w-auto sm:px-2 text-muted-foreground hover:text-red-400 hover:bg-accent"
                aria-label="Dislike response"
              >
                <ThumbsDown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </Button>
            </>
          )}

          {isUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Copy message"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          )}

          {/* More Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                aria-label="More actions"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isUser ? "end" : "start"}>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </DropdownMenuItem>
              {!isUser && (
                <DropdownMenuItem onClick={() => onRegenerate?.(id)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-indonesian-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="text-indonesian-gold text-sm font-semibold">U</span>
        </div>
      )}
    </div>
  );
});

