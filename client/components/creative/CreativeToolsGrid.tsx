import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreativeToolCard } from "./CreativeToolCard";
import { creativeTools, type CreativeTool } from "@/lib/creativeData";
import { Sparkles } from "lucide-react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

interface CreativeToolsGridProps {
    onToolOpen: (tool: CreativeTool) => void;
}

/**
 * Creative Tools Grid Component - Enhanced Animations
 * Purpose: Grid layout for 5 creative tool cards with engaging motion effects
 */
export const CreativeToolsGrid = memo(function CreativeToolsGrid({
    onToolOpen,
}: CreativeToolsGridProps) {
    return (
        <section className="section-container py-12 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + (i * 10) % 60}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.4,
                        }}
                    />
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative"
            >
                {/* Section Header with gold theme */}
                <motion.div className="text-center mb-10" variants={headerVariants}>
                    <motion.div
                        className="flex items-center justify-center gap-2 mb-3"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-[#FFD700]" />
                        </motion.div>
                        <span className="text-sm font-medium text-[#FFD700] uppercase tracking-wider">
                            Tool Kreatif
                        </span>
                    </motion.div>
                    <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                        Pilih{" "}
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D97706] inline-block"
                            animate={{
                                backgroundPosition: ["0%", "100%", "0%"],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{ backgroundSize: "200%" }}
                        >
                            Kreasi Anda
                        </motion.span>
                    </h2>
                    <motion.p
                        className="text-muted-foreground max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Lima tool AI terkuat untuk mewujudkan ide kreatif Anda menjadi kenyataan
                    </motion.p>
                </motion.div>

                {/* Tools Grid with staggered animations */}
                <motion.div
                    className={cn(
                        "grid gap-6",
                        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    )}
                    variants={cardContainerVariants}
                >
                    {creativeTools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 },
                            }}
                            className="h-full"
                        >
                            <CreativeToolCard
                                tool={tool}
                                onOpen={onToolOpen}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
});
