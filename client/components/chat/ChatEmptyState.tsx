import { memo, useState } from "react";
import { 
  Sparkles, 
  Code, 
  BookOpen, 
  Lightbulb,
  Clock,
  TrendingUp,
  FileText,
  Languages,
  Calculator,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "1",
    title: "Creative Writing",
    description: "Get help with storytelling and creative content",
    icon: Sparkles,
    prompt: "Help me write a creative story about...",
  },
  {
    id: "2",
    title: "Code Assistance",
    description: "Debug, explain, and optimize your code",
    icon: Code,
    prompt: "Explain how to implement...",
  },
  {
    id: "3",
    title: "Learn Something",
    description: "Deep dive into any topic or concept",
    icon: BookOpen,
    prompt: "Explain the concept of...",
  },
  {
    id: "4",
    title: "Brainstorm Ideas",
    description: "Generate innovative solutions and concepts",
    icon: Lightbulb,
    prompt: "Help me brainstorm ideas for...",
  },
  {
    id: "5",
    title: "Document Summary",
    description: "Summarize and analyze documents",
    icon: FileText,
    prompt: "Summarize the key points from...",
  },
  {
    id: "6",
    title: "Translation",
    description: "Translate text between languages",
    icon: Languages,
    prompt: "Translate this to...",
  },
  {
    id: "7",
    title: "Math & Logic",
    description: "Solve problems and explain solutions",
    icon: Calculator,
    prompt: "Help me solve this problem...",
  },
  {
    id: "8",
    title: "Design Ideas",
    description: "Get creative design suggestions",
    icon: Palette,
    prompt: "Give me design ideas for...",
  },
];

const recentChats = [
  { id: "r1", title: "React Performance Optimization", time: "2 hours ago", icon: TrendingUp },
  { id: "r2", title: "Machine Learning Basics", time: "Yesterday", icon: BookOpen },
  { id: "r3", title: "Creative Story Ideas", time: "2 days ago", icon: Sparkles },
];

interface ChatEmptyStateProps {
  onPromptSelect?: (prompt: string) => void;
}

/**
 * Chat Empty State Component - Redesigned with Better Layout
 * Purpose: Optimized spacing and 2x4 grid for suggestion cards
 * 
 * Features:
 * - 2 rows x 4 columns grid (8 cards total)
 * - Reduced whitespace for better proportion
 * - Cards sized properly to show full text
 * - Balanced vertical distribution
 * - Responsive breakpoints
 */
export const ChatEmptyState = memo(function ChatEmptyState({
  onPromptSelect,
}: ChatEmptyStateProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handlePromptClick = (prompt: string) => {
    onPromptSelect?.(prompt);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] flex items-center">
      {/* Main Container - Max Width 1400px, Centered with proper padding */}
      <div className="w-full max-w-[1400px] mx-auto px-8 py-8">
        
        {/* Header Section - Reduced padding for better proportion */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome to AI Chat
          </h1>
          <p className="text-base text-[#B0B0B0] max-w-2xl mx-auto leading-relaxed">
            Start a conversation by selecting a prompt below or type your own message
          </p>
        </div>

        {/* Suggested Prompts Grid - 2 rows x 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {suggestedPrompts.map((prompt) => {
            const Icon = prompt.icon;
            const isHovered = hoveredCard === prompt.id;
            
            return (
              <Card
                key={prompt.id}
                onClick={() => handlePromptClick(prompt.prompt)}
                onMouseEnter={() => setHoveredCard(prompt.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={cn(
                  "relative p-6 cursor-pointer transition-all duration-300 ease-out",
                  "min-h-[180px] flex flex-col items-center justify-center",
                  "bg-white/5 backdrop-blur-sm border border-white/10",
                  "hover:bg-white/10 hover:border-[#FFB347]/50",
                  "hover:scale-105 active:scale-95",
                  "group overflow-hidden",
                  isHovered && "shadow-[0_0_40px_rgba(255,140,0,0.3)]"
                )}
              >
                {/* Glow effect on hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br from-[#FF8C00]/10 to-transparent opacity-0 transition-opacity duration-300",
                  isHovered && "opacity-100"
                )} />
                
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  {/* Icon - 56px */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    "bg-gradient-to-br from-[#FF8C00] to-[#FFB347]",
                    isHovered && "scale-110 rotate-3"
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Title - 20px semi-bold, better text handling */}
                  <h3 className="text-xl font-semibold text-white leading-tight line-clamp-2">
                    {prompt.title}
                  </h3>
                  
                  {/* Description - Smaller for better fit */}
                  <p className="text-xs text-[#B0B0B0] opacity-70 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {prompt.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Chats Section - More compact */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-5 h-5 text-[#FF8C00]" />
            <h2 className="text-xl font-semibold text-white">Recent Conversations</h2>
          </div>
          
          <div className="space-y-2.5">
            {recentChats.map((chat) => {
              const Icon = chat.icon;
              return (
                <Card
                  key={chat.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300 ease-out",
                    "bg-white/5 backdrop-blur-sm border border-white/10",
                    "hover:bg-white/10 hover:border-[#FFB347]/30",
                    "hover:translate-x-2",
                    "flex items-center gap-4"
                  )}
                  onClick={() => console.log('Open chat:', chat.id)}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF8C00]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#FF8C00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{chat.title}</h4>
                    <p className="text-sm text-[#B0B0B0]">{chat.time}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
});

