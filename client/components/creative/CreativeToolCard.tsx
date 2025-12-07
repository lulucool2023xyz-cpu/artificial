import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { CreativeTool } from "@/lib/creativeData";

interface CreativeToolCardProps {
    tool: CreativeTool;
    onOpen: (tool: CreativeTool) => void;
}

/**
 * Creative Tool Card Component
 * Purpose: Eye-catching card for each creative tool
 */
export const CreativeToolCard = memo(function CreativeToolCard({
    tool,
    onOpen,
}: CreativeToolCardProps) {
    // Dynamically get icon from Lucide
    const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Sparkles;

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-500",
                "bg-card/50 backdrop-blur-sm border-border/50",
                "hover:scale-[1.02] hover:shadow-2xl",
                "cursor-pointer"
            )}
            onClick={() => onOpen(tool)}
            role="button"
            tabIndex={0}
            aria-label={`Buka ${tool.name}`}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(tool);
                }
            }}
        >
            {/* Gradient overlay on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(135deg, ${tool.gradientFrom}, ${tool.gradientTo})`,
                }}
            />

            {/* Badge */}
            {tool.badge && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge
                        className="text-white text-xs"
                        style={{
                            background: `linear-gradient(135deg, ${tool.gradientFrom}, ${tool.gradientTo})`,
                        }}
                    >
                        {tool.badge}
                    </Badge>
                </div>
            )}

            <CardContent className="p-6 relative z-10">
                {/* Icon with gradient background */}
                <div
                    className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-5",
                        "transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${tool.gradientFrom}, ${tool.gradientTo})`,
                        boxShadow: `0 8px 32px ${tool.gradientFrom}40`,
                    }}
                >
                    <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                    style={{
                        // Apply gradient on hover via style for dynamic colors
                    }}
                >
                    {tool.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-muted-foreground mb-4">
                    {tool.tagline}
                </p>

                {/* Features list */}
                <ul className="space-y-1.5 mb-6">
                    {tool.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Sample previews */}
                {tool.samples.length > 0 && (
                    <div className="flex gap-2 mb-6">
                        {tool.samples.slice(0, 3).map((sample) => (
                            <div
                                key={sample.id}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-lg",
                                    "bg-muted/30 border border-border/30",
                                    "text-xs text-muted-foreground",
                                    "flex items-center justify-center gap-1",
                                    "hover:bg-muted/50 transition-colors"
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Play className="w-3 h-3" />
                                <span className="truncate">{sample.duration || "Preview"}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Button */}
                <Button
                    className="w-full gap-2 font-semibold"
                    style={{
                        background: `linear-gradient(135deg, ${tool.gradientFrom}, ${tool.gradientTo})`,
                    }}
                >
                    Mulai Membuat
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardContent>

            {/* Bottom glow effect */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `linear-gradient(90deg, transparent, ${tool.gradientFrom}, ${tool.gradientTo}, transparent)`,
                }}
            />
        </Card>
    );
});
