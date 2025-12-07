import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CultureCategory } from "@/lib/cultureData";
import * as LucideIcons from "lucide-react";

interface CultureCategoryCardProps {
    category: CultureCategory;
    onClick: (category: CultureCategory) => void;
}

/**
 * Culture Category Card Component
 * Purpose: Reusable card for displaying culture categories
 */
export const CultureCategoryCard = memo(function CultureCategoryCard({
    category,
    onClick,
}: CultureCategoryCardProps) {
    // Dynamically get icon from Lucide
    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Sparkles;

    return (
        <Card
            onClick={() => onClick(category)}
            className={cn(
                "group cursor-pointer transition-all duration-300 overflow-hidden",
                "bg-card/50 backdrop-blur-sm border-border/50",
                "hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]",
                "hover:scale-[1.02] active:scale-[0.98]",
                "card-ornament-hover"
            )}
            role="button"
            tabIndex={0}
            aria-label={`Jelajahi ${category.nama}`}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick(category);
                }
            }}
        >
            <CardContent className="p-6">
                {/* Icon with gradient background */}
                <div
                    className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                        "transition-transform duration-300 group-hover:scale-110"
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${category.gradientFrom}, ${category.gradientTo})`,
                    }}
                >
                    <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Category Name */}
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-[#FFD700] transition-colors">
                    {category.nama}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.deskripsi}
                </p>

                {/* Content count badge */}
                <div className="flex items-center justify-between">
                    <Badge
                        variant="secondary"
                        className="bg-muted/50 text-muted-foreground"
                    >
                        {category.jumlahKonten} konten
                    </Badge>

                    {/* Arrow indicator */}
                    <div className="flex items-center text-muted-foreground group-hover:text-[#FFD700] transition-colors">
                        <span className="text-xs mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Jelajahi
                        </span>
                        <LucideIcons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Sub-categories preview */}
                <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex flex-wrap gap-1.5">
                        {category.subKategori.slice(0, 3).map((sub) => (
                            <span
                                key={sub}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground"
                            >
                                {sub}
                            </span>
                        ))}
                        {category.subKategori.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
                                +{category.subKategori.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
