import { memo, useState, useCallback } from "react";
import { PageTransition } from "@/components/PageTransition";
import { CreativeHero } from "@/components/creative/CreativeHero";
import { CreativeToolsGrid } from "@/components/creative/CreativeToolsGrid";
import { CreativeGallery } from "@/components/creative/CreativeGallery";
import { MyCreations } from "@/components/creative/MyCreations";
import { MusicGeneratorModal } from "@/components/creative/MusicGeneratorModal";
import { VideoGeneratorModal } from "@/components/creative/VideoGeneratorModal";
import { ImageGeneratorModal } from "@/components/creative/ImageGeneratorModal";
import { TTSModal } from "@/components/creative/TTSModal";
import { ImageToVideoModal } from "@/components/creative/ImageToVideoModal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { CreativeTool } from "@/lib/creativeData";

type ModalType = "music" | "video" | "image" | "tts" | "img2video" | null;

// Staggered animation variants for the whole page
const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren",
        },
    },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

/**
 * Creative Studio Page
 * Purpose: Main page for AI creative tools hub
 * 
 * Features:
 * - Hero section with search and quick access
 * - 5 creative tool cards with modals
 * - Community gallery showcase
 * - Personal creations dashboard
 */
const Creative = memo(function Creative() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    // Handle search
    const handleSearch = useCallback((query: string) => {
        if (query.trim()) {
            toast.info(`Mencari: "${query}"`, {
                description: "Fitur pencarian akan segera hadir",
            });
        }
    }, []);

    // Handle quick access button click
    const handleQuickAccess = useCallback((toolId: string) => {
        const modalMap: Record<string, ModalType> = {
            music: "music",
            video: "video",
            image: "image",
            voice: "tts",
            animate: "img2video",
        };
        setActiveModal(modalMap[toolId] || null);
    }, []);

    // Handle tool card click
    const handleToolOpen = useCallback((tool: CreativeTool) => {
        const modalMap: Record<string, ModalType> = {
            music: "music",
            video: "video",
            image: "image",
            tts: "tts",
            img2video: "img2video",
        };
        setActiveModal(modalMap[tool.id] || null);
    }, []);

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Hero Section */}
                    <motion.div variants={sectionVariants}>
                        <CreativeHero
                            onSearch={handleSearch}
                            onQuickAccess={handleQuickAccess}
                            totalCreations={1247}
                        />
                    </motion.div>

                    {/* Main Content */}
                    <main>
                        {/* Creative Tools Grid */}
                        <motion.div variants={sectionVariants}>
                            <CreativeToolsGrid onToolOpen={handleToolOpen} />
                        </motion.div>

                        {/* Divider */}
                        <motion.div
                            variants={sectionVariants}
                            className="section-container"
                        >
                            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
                        </motion.div>

                        {/* My Creations */}
                        <motion.div variants={sectionVariants}>
                            <MyCreations />
                        </motion.div>

                        {/* Divider */}
                        <motion.div
                            variants={sectionVariants}
                            className="section-container"
                        >
                            <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
                        </motion.div>

                        {/* Community Gallery */}
                        <motion.div variants={sectionVariants}>
                            <CreativeGallery />
                        </motion.div>
                    </main>
                </motion.div>

                {/* Footer spacing */}
                <div className="h-16" />

                {/* Modals */}
                <MusicGeneratorModal
                    isOpen={activeModal === "music"}
                    onClose={() => setActiveModal(null)}
                />
                <VideoGeneratorModal
                    isOpen={activeModal === "video"}
                    onClose={() => setActiveModal(null)}
                />
                <ImageGeneratorModal
                    isOpen={activeModal === "image"}
                    onClose={() => setActiveModal(null)}
                />
                <TTSModal
                    isOpen={activeModal === "tts"}
                    onClose={() => setActiveModal(null)}
                />
                <ImageToVideoModal
                    isOpen={activeModal === "img2video"}
                    onClose={() => setActiveModal(null)}
                />
            </div>
        </PageTransition>
    );
});

export default Creative;
