import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import {
    Sparkles,
    Search,
    Music,
    Video,
    Palette,
    Mic,
    Clapperboard,
    ArrowLeft,
    Home,
} from "lucide-react";

interface QuickAccessButton {
    id: string;
    label: string;
    icon: React.ReactNode;
    gradient: string;
}

const quickAccessButtons: QuickAccessButton[] = [
    { id: "music", label: "Musik", icon: <Music className="w-4 h-4" />, gradient: "from-purple-500 to-pink-500" },
    { id: "video", label: "Video", icon: <Video className="w-4 h-4" />, gradient: "from-blue-500 to-cyan-500" },
    { id: "image", label: "Gambar", icon: <Palette className="w-4 h-4" />, gradient: "from-amber-500 to-red-500" },
    { id: "voice", label: "Suara", icon: <Mic className="w-4 h-4" />, gradient: "from-orange-500 to-red-600" },
    { id: "animate", label: "Animasi", icon: <Clapperboard className="w-4 h-4" />, gradient: "from-violet-500 to-blue-500" },
];

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

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const floatingVariants = {
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const pulseVariants = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            delay: 0.5 + i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
    hover: {
        scale: 1.08,
        y: -3,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
    },
};

interface CreativeHeroProps {
    onSearch: (query: string) => void;
    onQuickAccess: (toolId: string) => void;
    totalCreations?: number;
}

/**
 * Creative Hero Component - Enhanced Animations
 * Purpose: Landing section with engaging motion effects
 */
export const CreativeHero = memo(function CreativeHero({
    onSearch,
    onQuickAccess,
    totalCreations = 0,
}: CreativeHeroProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <header className="relative overflow-hidden">
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"
                variants={pulseVariants}
                animate="animate"
            />
            <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706]/10 rounded-full blur-3xl"
                variants={pulseVariants}
                animate="animate"
                style={{ animationDelay: "1.5s" }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#FFD700]/5 to-transparent rounded-full"
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

            {/* Batik pattern background */}
            <div className="absolute inset-0 batik-pattern-parang opacity-20" />

            {/* Animated floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn(
                            "absolute rounded-full",
                            i % 3 === 0 ? "w-3 h-3 bg-[#FFD700]" : i % 3 === 1 ? "w-2 h-2 bg-[#D97706]" : "w-1.5 h-1.5 bg-[#FFD700]/60"
                        )}
                        style={{
                            left: `${5 + (i * 8) % 90}%`,
                            top: `${10 + (i * 13) % 80}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, i % 2 === 0 ? 10 : -10, 0],
                            opacity: [0.3, 0.7, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="relative section-container py-8 lg:py-12">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                                    Creative Studio
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </motion.div>

                <motion.div
                    className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Title Section */}
                    <div className="max-w-2xl">
                        <motion.div
                            className="flex items-center gap-3 mb-4"
                            variants={itemVariants}
                        >
                            <motion.div
                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#D97706] flex items-center justify-center shadow-lg shadow-[#FFD700]/30"
                                variants={floatingVariants}
                                animate="animate"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Sparkles className="w-7 h-7 text-white" />
                            </motion.div>
                            <span className="text-sm font-medium text-[#FFD700] uppercase tracking-wider">
                                Studio Kreatif AI
                            </span>
                        </motion.div>

                        <motion.h1
                            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight"
                            variants={itemVariants}
                        >
                            Wujudkan{" "}
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#D97706] inline-block"
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
                                Imajinasi Anda
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-lg text-muted-foreground leading-relaxed mb-6"
                            variants={itemVariants}
                        >
                            Ciptakan musik, video, gambar, dan lebih banyak lagi dengan kekuatan AI.
                            Ekspresikan kreativitas Anda dalam karya budaya digital.
                        </motion.p>

                        {/* Stats with counting animation */}
                        {totalCreations > 0 && (
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-sm"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                                </motion.div>
                                <span className="text-muted-foreground">
                                    <strong className="text-[#FFD700]">{totalCreations.toLocaleString()}</strong> kreasi telah dibuat
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Back to Chat Button */}
                    <motion.div
                        className="flex-shrink-0"
                        variants={itemVariants}
                    >
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
                    </motion.div>
                </motion.div>

                {/* Animated search bar */}
                <motion.form
                    onSubmit={handleSearch}
                    className="max-w-2xl mt-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Apa yang ingin Anda ciptakan hari ini?"
                            className={cn(
                                "w-full pl-12 pr-4 py-4 rounded-2xl",
                                "bg-card/80 backdrop-blur-sm border border-[#FFD700]/20",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50",
                                "transition-all duration-300"
                            )}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={{
                                boxShadow: [
                                    "0 0 0 0 rgba(255, 215, 0, 0)",
                                    "0 0 20px 2px rgba(255, 215, 0, 0.1)",
                                    "0 0 0 0 rgba(255, 215, 0, 0)",
                                ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.form>

                {/* Animated quick access buttons - colorful per category */}
                <div className="flex flex-wrap gap-3 mt-6">
                    {quickAccessButtons.map((btn, index) => (
                        <motion.button
                            key={btn.id}
                            onClick={() => onQuickAccess(btn.id)}
                            className={cn(
                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
                                `bg-gradient-to-r ${btn.gradient}`,
                                "text-white font-medium text-sm shadow-lg",
                                "relative overflow-hidden"
                            )}
                            custom={index}
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            {/* Shimmer effect */}
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
                            <span className="relative z-10 flex items-center gap-2">
                                {btn.icon}
                                {btn.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Animated decorative divider */}
            <motion.div
                className="ornament-border"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
            </motion.div>
        </header>
    );
});
