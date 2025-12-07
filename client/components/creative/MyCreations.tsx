import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Grid3X3,
    List,
    Star,
    Music,
    Video,
    Image as ImageIcon,
    Mic,
    Clapperboard,
    Clock,
    Folder,
    Plus,
    Sparkles,
} from "lucide-react";
import { sampleCreations, formatCreationDate, getTypeColor, type Creation } from "@/lib/creativeData";
import * as LucideIcons from "lucide-react";

type TabType = "recent" | "music" | "videos" | "images" | "voice" | "favorites";

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
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -10,
        transition: { duration: 0.25 },
    },
};

const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: 0.25 },
    },
};

const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

/**
 * My Creations Component - Enhanced Animations
 * Purpose: Personal dashboard for user's creations with engaging motion effects
 */
export const MyCreations = memo(function MyCreations() {
    const [activeTab, setActiveTab] = useState<TabType>("recent");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: "recent", label: "Terbaru", icon: <Clock className="w-4 h-4" /> },
        { id: "music", label: "Musik", icon: <Music className="w-4 h-4" /> },
        { id: "videos", label: "Video", icon: <Video className="w-4 h-4" /> },
        { id: "images", label: "Gambar", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "voice", label: "Voice", icon: <Mic className="w-4 h-4" /> },
        { id: "favorites", label: "Favorit", icon: <Star className="w-4 h-4" /> },
    ];

    // Filter creations based on active tab
    const filteredCreations = sampleCreations.filter((creation) => {
        if (activeTab === "recent") return true;
        if (activeTab === "favorites") return creation.isFavorite;
        if (activeTab === "music") return creation.type === "music";
        if (activeTab === "videos") return creation.type === "video";
        if (activeTab === "images") return creation.type === "image";
        if (activeTab === "voice") return creation.type === "voice";
        return true;
    });

    return (
        <section className="section-container py-12 relative overflow-hidden">
            {/* Subtle batik pattern */}
            <div className="absolute inset-0 batik-pattern-parang opacity-10 pointer-events-none" />

            {/* Animated background glow */}
            <motion.div
                className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#FFD700]/5 to-transparent pointer-events-none"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 5,
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
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
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
                                Karya Budaya Saya
                            </span>
                        </motion.div>
                        <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                            Kreasi{" "}
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
                            Kelola dan akses semua hasil karya budaya Anda
                        </p>
                    </div>

                    {/* View mode toggle with gold accent */}
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex rounded-lg bg-muted/50 p-1 border border-border/50">
                            <motion.button
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-2 rounded-md transition-colors relative",
                                    viewMode === "grid"
                                        ? "text-black shadow"
                                        : "hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Grid view"
                            >
                                {viewMode === "grid" && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D97706] rounded-md -z-10"
                                        layoutId="viewMode"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Grid3X3 className="w-4 h-4 relative z-10" />
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-2 rounded-md transition-colors relative",
                                    viewMode === "list"
                                        ? "text-black shadow"
                                        : "hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="List view"
                            >
                                {viewMode === "list" && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D97706] rounded-md -z-10"
                                        layoutId="viewMode"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <List className="w-4 h-4 relative z-10" />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Tabs with gold active state and animated indicator */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#FFD700]/20">
                    {tabs.map((tab, index) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors relative",
                                activeTab === tab.id
                                    ? "text-black"
                                    : "text-muted-foreground hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                            )}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#D97706] rounded-lg -z-10"
                                    layoutId="activeTab"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.icon}</span>
                            <span className="relative z-10">{tab.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Creations Grid/List with AnimatePresence */}
                <AnimatePresence mode="popLayout">
                    {filteredCreations.length === 0 ? (
                        <motion.div
                            className="text-center py-16"
                            variants={emptyStateVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            key="empty"
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#D97706]/20 flex items-center justify-center"
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Folder className="w-10 h-10 text-[#FFD700]" />
                            </motion.div>
                            <h3 className="font-heading text-xl mb-2">Belum ada karya budaya</h3>
                            <p className="text-muted-foreground mb-6">
                                Mulai ciptakan karya budaya Nusantara pertama Anda
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className="gap-2 bg-gradient-to-r from-[#FFD700] to-[#D97706] text-black hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                        animate={{
                                            x: ["-200%", "200%"],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut",
                                        }}
                                    />
                                    <Plus className="w-4 h-4 relative z-10" />
                                    <span className="relative z-10">Buat Karya Baru</span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : viewMode === "grid" ? (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                            key="grid"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={containerVariants}
                        >
                            {filteredCreations.map((creation, index) => (
                                <motion.div
                                    key={creation.id}
                                    variants={cardVariants}
                                    custom={index}
                                >
                                    <CreationCard creation={creation} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="space-y-2"
                            key="list"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={containerVariants}
                        >
                            {filteredCreations.map((creation, index) => (
                                <motion.div
                                    key={creation.id}
                                    variants={listItemVariants}
                                    custom={index}
                                >
                                    <CreationListItem creation={creation} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Storage info with animated progress */}
                <motion.div
                    className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#FFD700]/5 to-[#D97706]/5 border border-[#FFD700]/20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#FFD700]">Penyimpanan Karya</span>
                        <span className="text-sm text-muted-foreground">2.4 GB / 10 GB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#FFD700] to-[#D97706]"
                            initial={{ width: 0 }}
                            whileInView={{ width: "24%" }}
                            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
});

// Creation Card (Grid View) with enhanced animations
const CreationCard = memo(function CreationCard({ creation }: { creation: Creation }) {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = (LucideIcons as any)[creation.type === "music" ? "Music" : creation.type === "video" ? "Video" : creation.type === "voice" ? "Mic" : creation.type === "animation" ? "Clapperboard" : "Image"] || LucideIcons.File;
    const typeColor = getTypeColor(creation.type);

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className={cn(
                    "overflow-hidden group cursor-pointer transition-all",
                    "hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:border-[#FFD700]/30"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative aspect-square overflow-hidden">
                    <motion.img
                        src={creation.thumbnail}
                        alt={creation.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.4 }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Type badge */}
                    <Badge
                        className="absolute top-2 left-2 text-white text-xs"
                        style={{ backgroundColor: typeColor }}
                    >
                        <IconComponent className="w-3 h-3 mr-1" />
                        {creation.type}
                    </Badge>

                    {/* Favorite with animated gold star */}
                    {creation.isFavorite && (
                        <motion.div
                            animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Star className="absolute top-2 right-2 w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                        </motion.div>
                    )}
                </div>
                <CardContent className="p-3 bg-gradient-to-b from-transparent to-[#FFD700]/5">
                    <p className="font-medium text-sm truncate group-hover:text-[#FFD700] transition-colors">{creation.title}</p>
                    <p className="text-xs text-muted-foreground">{formatCreationDate(creation.createdAt)}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
});

// Creation List Item (List View) with enhanced animations
const CreationListItem = memo(function CreationListItem({ creation }: { creation: Creation }) {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = (LucideIcons as any)[creation.type === "music" ? "Music" : creation.type === "video" ? "Video" : creation.type === "voice" ? "Mic" : creation.type === "animation" ? "Clapperboard" : "Image"] || LucideIcons.File;
    const typeColor = getTypeColor(creation.type);

    return (
        <motion.div
            className={cn(
                "flex items-center gap-4 p-3 rounded-xl bg-card border border-border transition-all cursor-pointer",
                "hover:bg-[#FFD700]/5 hover:border-[#FFD700]/30"
            )}
            whileHover={{ x: 5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.img
                src={creation.thumbnail}
                alt={creation.title}
                className="w-14 h-14 rounded-lg object-cover"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
            />
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{creation.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs" style={{ borderColor: typeColor, color: typeColor }}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {creation.type}
                    </Badge>
                    <span>{formatCreationDate(creation.createdAt)}</span>
                    {creation.duration && <span>{creation.duration}</span>}
                </div>
            </div>
            {creation.isFavorite && (
                <motion.div
                    animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700] shrink-0" />
                </motion.div>
            )}
        </motion.div>
    );
});
