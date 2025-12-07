import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Play, ExternalLink, Sparkles } from "lucide-react";
import { sampleGalleryItems, type GalleryItem, getTypeColor } from "@/lib/creativeData";

type FilterType = "all" | "music" | "video" | "image" | "voice" | "animation";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
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
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transition: { duration: 0.3 },
    },
};

const filterVariants = {
    default: { scale: 1 },
    active: {
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    tap: { scale: 0.95 },
};

/**
 * Creative Gallery Component - Enhanced Animations
 * Purpose: Showcase of community creations with engaging motion effects
 */
export const CreativeGallery = memo(function CreativeGallery() {
    const [filter, setFilter] = useState<FilterType>("all");

    const filters: { id: FilterType; label: string }[] = [
        { id: "all", label: "Semua" },
        { id: "image", label: "Gambar" },
        { id: "music", label: "Musik" },
        { id: "video", label: "Video" },
        { id: "voice", label: "Voice" },
        { id: "animation", label: "Animasi" },
    ];

    const filteredItems = filter === "all"
        ? sampleGalleryItems
        : sampleGalleryItems.filter((item) => item.type === filter);

    return (
        <section className="section-container py-12 relative overflow-hidden">
            {/* Batik pattern background */}
            <div className="absolute inset-0 batik-pattern-kawung opacity-20 pointer-events-none" />

            {/* Animated background glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#FFD700]/5 to-transparent pointer-events-none"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {/* Section Header - Indonesian themed */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                    variants={headerVariants}
                >
                    <div>
                        <motion.div
                            className="flex items-center gap-2 mb-2"
                            whileHover={{ x: 5 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                            </motion.div>
                            <span className="text-sm font-medium text-[#FFD700] uppercase tracking-wider">
                                Galeri Kreasi Budaya
                            </span>
                        </motion.div>
                        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                            Karya Budaya{" "}
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D97706] inline-block"
                                animate={{
                                    backgroundPosition: ["0%", "100%", "0%"],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ backgroundSize: "200%" }}
                            >
                                Nusantara
                            </motion.span>
                        </h2>
                        <p className="text-muted-foreground">
                            Lihat karya-karya inspiratif dari komunitas kreator Indonesia
                        </p>
                    </div>

                    {/* Animated filter tabs with gold active state */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {filters.map((f) => (
                            <motion.button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors relative",
                                    filter === f.id
                                        ? "text-black"
                                        : "bg-muted/50 hover:bg-[#FFD700]/10 hover:text-[#FFD700] text-muted-foreground"
                                )}
                                variants={filterVariants}
                                initial="default"
                                animate={filter === f.id ? "active" : "default"}
                                whileTap="tap"
                                whileHover={{ y: -2 }}
                            >
                                {/* Active background with animation */}
                                {filter === f.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D97706] rounded-full -z-10"
                                        layoutId="activeFilter"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {f.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Masonry Grid with AnimatePresence */}
                <motion.div
                    className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <GalleryCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Load more with gold styling */}
                <motion.div
                    className="text-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-[#FFD700]/30 hover:border-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700] relative overflow-hidden group"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent -skew-x-12"
                                animate={{
                                    x: ["-200%", "200%"],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                    ease: "easeInOut",
                                }}
                            />
                            <span className="relative z-10">Lihat Lebih Banyak</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
});

// Gallery Card Component with enhanced hover animations
const GalleryCard = memo(function GalleryCard({ item }: { item: GalleryItem }) {
    const [isHovered, setIsHovered] = useState(false);
    const typeColor = getTypeColor(item.type as any);

    return (
        <motion.div
            whileHover={{
                y: -5,
                transition: { duration: 0.3 },
            }}
        >
            <Card
                className={cn(
                    "break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300",
                    "hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:border-[#FFD700]/30"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    {/* Overlay on hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {(item.type === "music" || item.type === "video" || item.type === "voice" || item.type === "animation") && (
                            <motion.div
                                initial={{ scale: 0, y: 20 }}
                                animate={{
                                    scale: isHovered ? 1 : 0,
                                    y: isHovered ? 0 : 20,
                                }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <Button
                                    size="icon"
                                    className="rounded-full bg-gradient-to-r from-[#FFD700] to-[#D97706] text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                                >
                                    <Play className="w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ scale: 0, y: 20 }}
                            animate={{
                                scale: isHovered ? 1 : 0,
                                y: isHovered ? 0 : 20,
                            }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                        >
                            <Button size="icon" variant="secondary" className="rounded-full">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Type badge with pulse effect */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Badge
                            className="absolute top-3 left-3 text-white text-xs"
                            style={{ backgroundColor: typeColor }}
                        >
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                    </motion.div>
                </div>

                <CardContent className="p-4 bg-gradient-to-b from-transparent to-[#FFD700]/5">
                    {/* Title */}
                    <h3 className="font-medium text-foreground mb-1 line-clamp-1 group-hover:text-[#FFD700] transition-colors">
                        {item.title}
                    </h3>

                    {/* Creator */}
                    <p className="text-sm text-muted-foreground mb-3">
                        oleh {item.creator}
                    </p>

                    {/* Stats with animated hearts */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <motion.span
                                className="flex items-center gap-1 group-hover:text-[#FFD700] transition-colors"
                                whileHover={{ scale: 1.1 }}
                            >
                                <motion.div
                                    animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Heart className="w-4 h-4" />
                                </motion.div>
                                {item.likes}
                            </motion.span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {item.views}
                            </span>
                        </div>
                        <span className="text-xs">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});
