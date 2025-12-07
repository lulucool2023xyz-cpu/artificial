import { memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

/**
 * Culture Header Component
 * Purpose: Header section with title, tagline, and breadcrumb navigation
 */
export const CultureHeader = memo(function CultureHeader() {
    return (
        <header className="relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 batik-pattern-parang opacity-30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706]/5 rounded-full blur-3xl" />

            <div className="relative section-container py-8 lg:py-12">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    to="/"
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-[#FFD700] transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-[#FFD700] font-medium">
                                Culture
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Title Section */}
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D97706] flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm font-medium text-[#FFD700] uppercase tracking-wider">
                                Eksplorasi Budaya
                            </span>
                        </div>

                        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                            Jelajahi Kekayaan{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D97706]">
                                Budaya Indonesia
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Temukan keindahan warisan budaya Nusantara dari Sabang sampai Merauke.
                            Upload gambar atau dokumen untuk analisis AI tentang artefak budaya Indonesia.
                        </p>
                    </div>

                    {/* Back to Chat Button */}
                    <div className="flex-shrink-0">
                        <Button
                            asChild
                            variant="outline"
                            className={cn(
                                "gap-2 border-[#FFD700]/30 hover:border-[#FFD700]",
                                "hover:bg-[#FFD700]/10 hover:text-[#FFD700]",
                                "transition-all duration-300"
                            )}
                        >
                            <Link to="/chat">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Chat
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Decorative divider */}
            <div className="ornament-border">
                <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
            </div>
        </header>
    );
});
