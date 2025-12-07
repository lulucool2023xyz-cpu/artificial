import { memo } from "react";
import { cn } from "@/lib/utils";
import { CultureCategoryCard } from "./CultureCategoryCard";
import { cultureCategories, type CultureCategory } from "@/lib/cultureData";

interface CultureCategoriesProps {
    onCategoryClick: (category: CultureCategory) => void;
}

/**
 * Culture Categories Component
 * Purpose: Grid display of 6 Indonesian culture categories
 */
export const CultureCategories = memo(function CultureCategories({
    onCategoryClick,
}: CultureCategoriesProps) {
    return (
        <section className="section-container py-8 lg:py-12">
            {/* Section Header */}
            <div className="mb-8">
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-3">
                    Kategori Budaya
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                    Pilih kategori untuk menjelajahi kekayaan budaya Indonesia atau
                    tanyakan langsung ke AI tentang topik spesifik.
                </p>
            </div>

            {/* Categories Grid */}
            <div
                className={cn(
                    "grid gap-6",
                    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}
            >
                {cultureCategories.map((category) => (
                    <CultureCategoryCard
                        key={category.id}
                        category={category}
                        onClick={onCategoryClick}
                    />
                ))}
            </div>
        </section>
    );
});
