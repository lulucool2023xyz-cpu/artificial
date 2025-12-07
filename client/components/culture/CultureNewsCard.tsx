import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";
import type { CultureNews } from "@/lib/cultureData";
import { formatTanggal } from "@/lib/cultureData";

interface CultureNewsCardProps {
    news: CultureNews;
}

/**
 * Culture News Card Component
 * Purpose: Reusable card for displaying culture news items
 */
export const CultureNewsCard = memo(function CultureNewsCard({
    news,
}: CultureNewsCardProps) {
    return (
        <Card
            className={cn(
                "group h-full transition-all duration-300 overflow-hidden",
                "bg-card/50 backdrop-blur-sm border-border/50",
                "hover:border-[#FFD700]/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]"
            )}
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={news.thumbnail}
                    alt={news.judul}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Category badges overlay */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {news.kategori.slice(0, 2).map((cat) => (
                        <Badge
                            key={cat}
                            className="bg-[#FFD700]/90 text-black text-xs"
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>
            </div>

            <CardContent className="p-5">
                {/* Date and source */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatTanggal(news.tanggal)}</span>
                    </div>
                    <span className="text-border">•</span>
                    <span>{news.sumber}</span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                    {news.judul}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {news.excerpt}
                </p>

                {/* Read more link */}
                <a
                    href={news.link}
                    className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-medium",
                        "text-[#FFD700] hover:text-[#FFA500] transition-colors"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Baca Selengkapnya
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </CardContent>
        </Card>
    );
});
