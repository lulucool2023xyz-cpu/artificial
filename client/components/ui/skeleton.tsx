import { cn } from "@/lib/utils";
import { ImageIcon, Video, Music, Loader2 } from "lucide-react";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Image Generation Loading Skeleton
function ImageGeneratingSkeleton({ 
  className,
  count = 1 
}: { 
  className?: string;
  count?: number;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <Loader2 className="w-5 h-5 animate-spin text-[#C9A04F]" />
        <span className="text-sm text-muted-foreground">Generating images...</span>
      </div>
      <div className={cn(
        "grid gap-4",
        count === 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
      )}>
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 animate-pulse"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                <div className="w-20 h-2 bg-muted rounded-full" />
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Video Generation Loading Skeleton
function VideoGeneratingSkeleton({ 
  className 
}: { 
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Video className="w-12 h-12 text-muted-foreground/50" />
              <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 animate-spin text-[#C9A04F]" />
            </div>
            <div className="space-y-2 text-center">
              <div className="w-32 h-3 bg-muted rounded-full mx-auto" />
              <div className="w-24 h-2 bg-muted/50 rounded-full mx-auto" />
            </div>
          </div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Video generation may take 1-3 minutes...
      </p>
    </div>
  );
}

// Audio Generation Loading Skeleton
function AudioGeneratingSkeleton({ 
  className 
}: { 
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-full max-w-md h-32 rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <Music className="w-8 h-8 text-muted-foreground/50" />
          {/* Audio wave bars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="w-1 bg-[#C9A04F]/50 rounded-full animate-pulse"
                style={{ 
                  height: `${20 + Math.sin(idx * 0.5) * 20}px`,
                  animationDelay: `${idx * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Generating audio...
      </p>
    </div>
  );
}

// Chat Message Loading Skeleton
function MessageSkeleton({ 
  className,
  isUser = false
}: { 
  className?: string;
  isUser?: boolean;
}) {
  return (
    <div className={cn(
      "py-4 px-4 sm:px-6 lg:px-8",
      isUser ? "flex justify-end" : "",
      className
    )}>
      {isUser ? (
        <div className="max-w-[75%] animate-pulse">
          <div className="bg-secondary px-4 py-3 rounded-2xl space-y-2">
            <div className="h-3 bg-muted rounded w-32" />
            <div className="h-3 bg-muted rounded w-24" />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      )}
    </div>
  );
}

// Card Loading Skeleton
function CardSkeleton({ 
  className 
}: { 
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse rounded-xl overflow-hidden bg-secondary/50", className)}>
      <div className="aspect-video bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted/50 rounded w-full" />
        <div className="h-3 bg-muted/50 rounded w-2/3" />
      </div>
    </div>
  );
}

export { 
  Skeleton, 
  ImageGeneratingSkeleton, 
  VideoGeneratingSkeleton, 
  AudioGeneratingSkeleton,
  MessageSkeleton,
  CardSkeleton
};
