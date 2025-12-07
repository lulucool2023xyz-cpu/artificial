import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { CultureHeader } from "@/components/culture/CultureHeader";
import { CultureUpload } from "@/components/culture/CultureUpload";
import { CultureCategories } from "@/components/culture/CultureCategories";
import { CultureNews } from "@/components/culture/CultureNews";
import { toast } from "sonner";
import type { CultureCategory, UploadedCultureFile } from "@/lib/cultureData";
import { categorySuggestions } from "@/lib/cultureData";

/**
 * Culture Page
 * Purpose: Main page for exploring Indonesian culture
 * 
 * Features:
 * - Header with breadcrumb navigation
 * - File upload for AI cultural artifact analysis
 * - 6 culture category cards
 * - News carousel with cultural updates
 * - Integration with AI chat for category-specific questions
 */
const Culture = memo(function Culture() {
    const navigate = useNavigate();

    // Handle category click - navigate to chat with context
    const handleCategoryClick = useCallback(
        (category: CultureCategory) => {
            // Get suggested questions for this category
            const suggestions = categorySuggestions[category.id] || [];
            const firstSuggestion = suggestions[0] || `Ceritakan tentang ${category.nama}`;

            // Store category context for chat
            sessionStorage.setItem(
                "cultureChatContext",
                JSON.stringify({
                    categoryId: category.id,
                    categoryName: category.nama,
                    suggestedQuestion: firstSuggestion,
                })
            );

            toast.info(`Menjelajahi ${category.nama}`, {
                description: "Membuka AI Chat untuk diskusi budaya",
            });

            // Navigate to chat with category context
            navigate("/chat", {
                state: {
                    initialMessage: firstSuggestion,
                    context: `budaya-${category.id}`,
                },
            });
        },
        [navigate]
    );

    // Handle file analysis
    const handleAnalyze = useCallback(
        async (files: UploadedCultureFile[]) => {
            // Store files for analysis in chat
            const fileNames = files.map((f) => f.name).join(", ");

            toast.info("Memulai analisis...", {
                description: `Menganalisis: ${fileNames}`,
            });

            // Navigate to chat with analysis context
            navigate("/chat", {
                state: {
                    initialMessage: `Tolong analisis artefak budaya berikut: ${fileNames}. Jelaskan sejarah, makna, dan konteks budayanya.`,
                    context: "budaya-analisis",
                    uploadedFiles: files,
                },
            });
        },
        [navigate]
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <CultureHeader />

                {/* Main Content */}
                <main>
                    {/* Upload Section */}
                    <CultureUpload onAnalyze={handleAnalyze} />

                    {/* Decorative divider */}
                    <div className="section-container">
                        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                    </div>

                    {/* Categories Section */}
                    <CultureCategories onCategoryClick={handleCategoryClick} />

                    {/* Decorative divider */}
                    <div className="section-container">
                        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                    </div>

                    {/* News Carousel Section */}
                    <CultureNews />
                </main>

                {/* Footer spacing */}
                <div className="h-16" />
            </div>
        </PageTransition>
    );
});

export default Culture;
