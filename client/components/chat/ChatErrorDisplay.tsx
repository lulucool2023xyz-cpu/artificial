import { memo } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ChatError {
  type: "network" | "api" | "validation" | "unknown";
  message: string;
  retry?: () => void;
}

interface ChatErrorDisplayProps {
  error: ChatError;
  onDismiss?: () => void;
}

/**
 * Chat Error Display Component
 * Purpose: Display user-friendly error messages
 * 
 * Error Types:
 * - network: Network connection errors
 * - api: API/server errors
 * - validation: Form validation errors
 * - unknown: Unknown errors
 */
export const ChatErrorDisplay = memo(function ChatErrorDisplay({
  error,
  onDismiss,
}: ChatErrorDisplayProps) {
  const getErrorColor = () => {
    switch (error.type) {
      case "network":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
      case "api":
        return "border-red-500/50 bg-red-500/10 text-red-400";
      case "validation":
        return "border-orange-500/50 bg-orange-500/10 text-orange-400";
      default:
        return "border-gray-500/50 bg-gray-500/10 text-gray-400";
    }
  };

  const getErrorMessage = () => {
    if (error.message) return error.message;
    
    switch (error.type) {
      case "network":
        return "Network error. Please check your connection and try again.";
      case "api":
        return "Server error. Please try again later.";
      case "validation":
        return "Please check your input and try again.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div
      className={cn(
        "mx-4 my-2 p-4 rounded-lg border",
        "flex items-start gap-3",
        getErrorColor()
      )}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{getErrorMessage()}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {error.retry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={error.retry}
            className="h-8 px-2 text-current hover:bg-current/20"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-8 px-2 text-current hover:bg-current/20"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
});

