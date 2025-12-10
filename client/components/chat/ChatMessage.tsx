import { memo, useState } from "react";
import { Copy, RefreshCw, ThumbsUp, ThumbsDown, MoreHorizontal, Share, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  thoughts?: string[];
  images?: Array<{
    url?: string;
    base64Data?: string;
    mimeType?: string;
  }>;
  onCopy?: (content: string) => void;
  onRegenerate?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
}

/**
 * Chat Message Component - ChatGPT-like Clean Design
 * 
 * Features:
 * - Full-width AI responses (no bubble)
 * - Subtle user message styling
 * - Markdown rendering with code highlighting
 * - Clean action bar
 * - Like/Dislike feedback
 */
export const ChatMessage = memo(function ChatMessage({
  id,
  role,
  content,
  timestamp,
  thoughts,
  images,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  
  // Helper function to get image URL (handles both URL and base64)
  const getImageUrl = (img: { url?: string; base64Data?: string; mimeType?: string }) => {
    if (img.url) return img.url;
    if (img.base64Data) {
      const mimeType = img.mimeType || 'image/png';
      // Check if base64 already has the data URI prefix
      if (img.base64Data.startsWith('data:')) return img.base64Data;
      return `data:${mimeType};base64,${img.base64Data}`;
    }
    return '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      description: "Pesan disalin ke clipboard",
      duration: 2000,
    });
    onCopy?.(content);
  };

  const handleLike = () => {
    setFeedback("liked");
    onLike?.(id);
  };

  const handleDislike = () => {
    setFeedback("disliked");
    onDislike?.(id);
  };

  // User message - simple bubble style
  if (isUser) {
    return (
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex justify-end">
          <div className="max-w-[85%] sm:max-w-[75%]">
            <div className="bg-[#2A2A2A] dark:bg-[#2A2A2A] text-white px-4 py-3 rounded-2xl rounded-br-sm">
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI response - ChatGPT-like clean style
  return (
    <article 
      className="py-6 px-4 sm:px-6 lg:px-8 group"
      data-role="assistant"
    >
      <div className="max-w-3xl mx-auto">
        {/* AI Response Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-foreground mt-6 mb-3 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-foreground mt-5 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h3>
              ),
              // Paragraphs
              p: ({ children }) => (
                <p className="text-foreground leading-7 mb-4 last:mb-0">{children}</p>
              ),
              // Strong/Bold
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              // Emphasis/Italic
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground leading-7">{children}</li>
              ),
              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-3 border-[#C9A04F] pl-4 my-4 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              // Horizontal rule
              hr: () => (
                <hr className="my-6 border-border" />
              ),
              // Links
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#C9A04F] hover:text-[#B8860B] underline underline-offset-2"
                >
                  {children}
                </a>
              ),
              // Images in markdown
              img: ({ src, alt }) => {
                // Handle base64 images properly
                let imageSrc = src || '';
                
                // If src doesn't start with http or data:, it might be a base64 without prefix
                if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:') && !imageSrc.startsWith('/')) {
                  // Assume it's base64 PNG
                  imageSrc = `data:image/png;base64,${imageSrc}`;
                }
                
                return (
                  <div className="my-4 rounded-xl overflow-hidden border border-border">
                    <img 
                      src={imageSrc}
                      alt={alt || 'Generated image'}
                      className="w-full h-auto object-contain max-h-[500px]"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Markdown image load error');
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {alt && (
                      <div className="px-4 py-2 bg-secondary/30 text-xs text-muted-foreground">
                        {alt}
                      </div>
                    )}
                  </div>
                );
              },
              // Code blocks
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                
                if (isInline) {
                  return (
                    <code 
                      className="px-1.5 py-0.5 rounded bg-secondary text-[#C9A04F] text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                
                return (
                  <div className="my-4 rounded-xl overflow-hidden border border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                      <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                          toast({ description: "Kode disalin!", duration: 2000 });
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        background: 'transparent',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              },
              // Tables
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-lg border border-border">
                  <table className="min-w-full divide-y divide-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider bg-secondary/50">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-sm text-muted-foreground border-t border-border">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Display Generated Images */}
        {images && images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, idx) => {
              const imageUrl = getImageUrl(img);
              if (!imageUrl) return null;
              
              return (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-border">
                  <img 
                    src={imageUrl}
                    alt={`Generated image ${idx + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image load error:', imageUrl.substring(0, 100));
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Image Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-2">
                      <a
                        href={imageUrl}
                        download={`orenax-image-${Date.now()}-${idx}.png`}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (imageUrl.startsWith('data:')) {
                            // For base64, create download link
                            const link = document.createElement('a');
                            link.href = imageUrl;
                            link.download = `orenax-image-${Date.now()}-${idx}.png`;
                            link.click();
                            e.preventDefault();
                          }
                        }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Bar - ChatGPT style */}
        <div className={cn(
          "flex items-center gap-1 mt-4 pt-2",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "lg:opacity-0 lg:group-hover:opacity-100"
        )}>
          {/* Copy */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
            aria-label="Copy"
          >
            <Copy className="w-4 h-4" />
          </Button>

          {/* Like */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "h-8 w-8 p-0 rounded-lg",
              feedback === "liked" 
                ? "text-[#C9A04F] bg-[#C9A04F]/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            aria-label="Good response"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>

          {/* Dislike */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            className={cn(
              "h-8 w-8 p-0 rounded-lg",
              feedback === "disliked" 
                ? "text-red-400 bg-red-400/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
            aria-label="Bad response"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>

          {/* Regenerate */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRegenerate?.(id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
            aria-label="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                aria-label="More actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRegenerate?.(id)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
});
