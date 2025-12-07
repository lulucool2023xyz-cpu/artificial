import { memo, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { CultureNewsCard } from "./CultureNewsCard";
import { cultureNews } from "@/lib/cultureData";
import { Newspaper } from "lucide-react";

/**
 * Culture News Component
 * Purpose: Auto-scrolling carousel for Indonesian culture news
 */
export const CultureNews = memo(function CultureNews() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    // Auto-scroll every 5 seconds
    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    const scrollTo = useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api]
    );

    return (
        <section className="section-container py-8 lg:py-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Newspaper className="w-5 h-5 text-[#FFD700]" />
                        <span className="text-sm font-medium text-[#FFD700] uppercase tracking-wider">
                            Temuan Menarik
                        </span>
                    </div>
                    <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                        Berita Budaya Terkini
                    </h2>
                </div>

                {/* Carousel dots navigation */}
                <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: count }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                current === index
                                    ? "bg-[#FFD700] w-6"
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* News Carousel */}
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {cultureNews.map((news) => (
                        <CarouselItem
                            key={news.id}
                            className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                        >
                            <CultureNewsCard news={news} />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                <CarouselPrevious
                    className={cn(
                        "hidden lg:flex -left-4 xl:-left-6",
                        "border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10",
                        "text-muted-foreground hover:text-[#FFD700]"
                    )}
                />
                <CarouselNext
                    className={cn(
                        "hidden lg:flex -right-4 xl:-right-6",
                        "border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10",
                        "text-muted-foreground hover:text-[#FFD700]"
                    )}
                />
            </Carousel>

            {/* Mobile dots */}
            <div className="flex sm:hidden items-center justify-center gap-2 mt-6">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            current === index
                                ? "bg-[#FFD700] w-6"
                                : "bg-muted-foreground/30"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
});
