"use client";

import { memo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Sparkles,
    ArrowUp,
    Settings2,
    ChevronDown,
    Image as ImageIcon,
    Wand2,
    ArrowUpRight,
    Palette,
    Volume2,
    Video,
    Film,
    Layers,
    Check,
    X,
    Maximize2,
    Square,
    RectangleHorizontal,
    RectangleVertical,
    Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== IMAGE STUDIO DATA ====================
const imageCategories = [
    {
        id: "text-to-image",
        label: "Text to Image",
        icon: Wand2,
        description: "Generate from prompt",
        showUpload: false
    },
    {
        id: "customize",
        label: "Customize Image",
        icon: Palette,
        description: "Edit with reference",
        showUpload: true
    },
    {
        id: "image-to-image",
        label: "Image to Image",
        icon: ImageIcon,
        description: "Transform existing image",
        showUpload: true
    },
    {
        id: "upscale",
        label: "Image Upscale",
        icon: ArrowUpRight,
        description: "Enhance resolution",
        showUpload: true
    },
];

const imageModelsByCategory: Record<string, { id: string; name: string; description: string }[]> = {
    "text-to-image": [
        { id: "imagen-4.0-generate-001", name: "Imagen 4.0", description: "Latest generation model" },
        { id: "imagen-4.0-ultra-generate-001", name: "Imagen 4.0 Ultra", description: "Highest quality output" },
        { id: "imagen-4.0-fast-generate-001", name: "Imagen 4.0 Fast", description: "Quick generation" },
        { id: "imagen-3.0-generate-002", name: "Imagen 3.0", description: "Stable quality" },
        { id: "gemini-2.5-flash-image", name: "Gemini 2.5 Flash", description: "Fast multimodal AI" },
        { id: "gemini-3-pro-image-preview", name: "Gemini 3.0 Pro", description: "Advanced image generation" },
    ],
    "customize": [
        { id: "imagen-3.0-capability-001", name: "Imagen 3.0 Edit", description: "Powerful editing capabilities" },
    ],
    "image-to-image": [
        { id: "gemini-2.5-flash-image", name: "Gemini 2.5 Flash", description: "Fast transformation" },
        { id: "gemini-3-pro-image-preview", name: "Gemini 3.0 Pro", description: "Advanced transformation" },
    ],
    "upscale": [
        { id: "imagen-4.0-upscale-preview", name: "Imagen 4.0 Upscale", description: "Up to 4x resolution" },
    ],
};

// ==================== VIDEO STUDIO DATA ====================
const videoCategories = [
    {
        id: "text-to-video",
        label: "Text to Video",
        icon: Video,
        description: "Generate from prompt",
        showUpload: false
    },
    {
        id: "frames-to-video",
        label: "Frames to Video",
        icon: Film,
        description: "Animate image sequence",
        showUpload: true
    },
    {
        id: "ingredients-to-video",
        label: "Ingredients to Video",
        icon: Layers,
        description: "Combine elements",
        showUpload: true
    },
];

const videoModels = [
    { id: "veo-3.1-generate-preview", name: "Veo 3.1", description: "Latest quality" },
    { id: "veo-3.1-fast-generate-preview", name: "Veo 3.1 Fast", description: "Quick generation" },
    { id: "veo-3.0-generate-001", name: "Veo 3.0", description: "Stable output" },
    { id: "veo-3.0-fast-generate-001", name: "Veo 3.0 Fast", description: "Faster processing" },
    { id: "veo-2.0-generate-001", name: "Veo 2.0", description: "Classic quality" },
];

// ==================== ASPECT RATIOS ====================
// Image supports all ratios
const aspectRatios = [
    { id: "1:1", label: "Square", icon: Square },
    { id: "16:9", label: "Landscape", icon: RectangleHorizontal },
    { id: "9:16", label: "Portrait", icon: RectangleVertical },
    { id: "4:3", label: "Standard", icon: Monitor },
    { id: "21:9", label: "Cinematic", icon: Maximize2 },
];

// Video only supports 16:9 and 9:16
const videoAspectRatios = [
    { id: "16:9", label: "Landscape", icon: RectangleHorizontal },
    { id: "9:16", label: "Portrait", icon: RectangleVertical },
];

// ==================== MAIN COMPONENT ====================
interface StudioChatInputProps {
    type: "image" | "video" | "audio";
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    // Image
    imageCategory?: string;
    onImageCategoryChange?: (cat: string) => void;
    imageModel?: string;
    onImageModelChange?: (model: string) => void;
    // Video
    videoCategory?: string;
    onVideoCategoryChange?: (cat: string) => void;
    videoModel?: string;
    onVideoModelChange?: (model: string) => void;
    // Common
    aspectRatio?: string;
    onAspectRatioChange?: (ratio: string) => void;
    outputCount?: number;
    onOutputCountChange?: (count: number) => void;
    // Audio
    voicePreset?: string;
    onVoicePresetChange?: (preset: string) => void;
}

const voicePresets = [
    { id: "formal-male", name: "Formal Male" },
    { id: "formal-female", name: "Formal Female" },
    { id: "casual-male", name: "Casual Male" },
    { id: "casual-female", name: "Casual Female" },
];

export const StudioChatInput = memo(function StudioChatInput({
    type,
    placeholder = "Describe what you want to create...",
    value,
    onChange,
    onSubmit,
    isLoading = false,
    imageCategory = "text-to-image",
    onImageCategoryChange,
    imageModel = "imagen-4.0-generate-001",
    onImageModelChange,
    videoCategory = "text-to-video",
    onVideoCategoryChange,
    videoModel = "veo-3.1-fast-generate-preview",
    onVideoModelChange,
    aspectRatio = "1:1",
    onAspectRatioChange,
    outputCount = 2,
    onOutputCountChange,
    voicePreset = "formal-male",
    onVoicePresetChange,
}: StudioChatInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const [categoryBtnPos, setCategoryBtnPos] = useState({ top: 0, left: 0 });
    const [settingsBtnPos, setSettingsBtnPos] = useState({ top: 0, left: 0, right: 0 });
    const categoryRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const categoryBtnRef = useRef<HTMLButtonElement>(null);
    const settingsBtnRef = useRef<HTMLButtonElement>(null);

    // Calculate position when opening dropdowns
    const openCategoryDropdown = () => {
        if (categoryBtnRef.current) {
            const rect = categoryBtnRef.current.getBoundingClientRect();
            setCategoryBtnPos({ top: rect.top, left: rect.left });
        }
        setShowCategoryDropdown(true);
    };

    const openSettingsPanel = () => {
        if (settingsBtnRef.current) {
            const rect = settingsBtnRef.current.getBoundingClientRect();
            setSettingsBtnPos({ top: rect.top, left: rect.left, right: window.innerWidth - rect.right });
        }
        setShowSettingsPanel(true);
    };

    // Outside click is handled by Portal backdrop, no need for document listener

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading && value.trim()) {
            e.preventDefault();
            onSubmit();
        }
    };

    // Get current category info
    const currentImageCat = imageCategories.find(c => c.id === imageCategory) || imageCategories[0];
    const currentVideoCat = videoCategories.find(c => c.id === videoCategory) || videoCategories[0];
    const currentAspect = aspectRatios.find(r => r.id === aspectRatio) || aspectRatios[0];

    const availableImageModels = imageModelsByCategory[imageCategory] || imageModelsByCategory["text-to-image"];
    const currentImageModel = availableImageModels.find(m => m.id === imageModel) || availableImageModels[0];
    const currentVideoModel = videoModels.find(m => m.id === videoModel) || videoModels[0];

    const showUpload = type === "image" ? currentImageCat.showUpload :
        type === "video" ? currentVideoCat.showUpload : false;

    const categories = type === "image" ? imageCategories : type === "video" ? videoCategories : [];
    const currentCategory = type === "image" ? currentImageCat : currentVideoCat;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "w-full max-w-2xl mx-auto",
                "bg-card/95 dark:bg-gradient-to-b dark:from-[#1A1A1A]/95 dark:to-[#0D0D0D]/95",
                "backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl",
                "shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                "overflow-visible", // IMPORTANT: Allow dropdowns to overflow
                isFocused && "border-primary/40 dark:border-[#C9A04F]/40 shadow-xl"
            )}
        >
            {/* Upload Area - Only for modes that need reference image */}
            {showUpload && (
                <div className="p-3 sm:p-4 pb-0">
                    <div className="flex gap-2">
                        <button
                            className={cn(
                                "group relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden",
                                "bg-secondary/50 border-2 border-dashed border-border",
                                "hover:border-primary/50 hover:bg-primary/5",
                                "transition-all duration-300 flex items-center justify-center"
                            )}
                        >
                            <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </button>
                        <div className="flex-1 flex items-center">
                            <p className="text-xs text-muted-foreground">
                                Upload reference image for {currentCategory.label.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Input Area */}
            <div className="p-3 sm:p-4">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    rows={2}
                    className={cn(
                        "w-full bg-transparent resize-none",
                        "text-foreground placeholder:text-muted-foreground/60",
                        "text-sm sm:text-base leading-relaxed",
                        "focus:outline-none focus:ring-0 border-none",
                        "caret-primary dark:caret-[#C9A04F]"
                    )}
                />
            </div>

            <div className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-visible">
                <div className="flex items-center gap-2 sm:gap-2 overflow-x-auto scrollbar-hide pb-1 overflow-y-visible">
                    {/* Category Dropdown */}
                    {(type === "image" || type === "video") && (
                        <div className="relative flex-shrink-0 overflow-visible" ref={categoryRef}>
                            <button
                                ref={categoryBtnRef}
                                onClick={() => showCategoryDropdown ? setShowCategoryDropdown(false) : openCategoryDropdown()}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-xl",
                                    "bg-secondary/80 border border-border",
                                    "hover:bg-secondary active:bg-secondary/70 transition-colors",
                                    showCategoryDropdown && "bg-secondary border-primary/30"
                                )}
                            >
                                <currentCategory.icon className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium text-foreground max-w-[80px] sm:max-w-none truncate">
                                    {currentCategory.label}
                                </span>
                                <ChevronDown className={cn(
                                    "w-3 h-3 text-muted-foreground transition-transform flex-shrink-0",
                                    showCategoryDropdown && "rotate-180"
                                )} />
                            </button>

                            {/* Category Dropdown - Positioned above button */}
                            {showCategoryDropdown && typeof document !== 'undefined' && createPortal(
                                <div className="fixed inset-0 z-[99999]" onClick={() => setShowCategoryDropdown(false)}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'fixed',
                                            bottom: `${window.innerHeight - categoryBtnPos.top + 8}px`,
                                            left: `${Math.max(8, Math.min(categoryBtnPos.left, window.innerWidth - 280))}px`,
                                        }}
                                        className="w-[calc(100vw-16px)] sm:w-72 max-w-72 bg-card border border-border rounded-xl shadow-2xl"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-2 border-b border-border">
                                            <p className="text-xs text-muted-foreground px-2">Select Mode</p>
                                        </div>
                                        <div className="p-1.5 max-h-60 overflow-y-auto">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        if (type === "image") {
                                                            onImageCategoryChange?.(cat.id);
                                                        } else {
                                                            onVideoCategoryChange?.(cat.id);
                                                        }
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-lg text-left transition-colors",
                                                        (type === "image" ? imageCategory : videoCategory) === cat.id
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-foreground hover:bg-secondary active:bg-secondary/70"
                                                    )}
                                                >
                                                    <cat.icon className="w-5 h-5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium">{cat.label}</p>
                                                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                                                    </div>
                                                    {(type === "image" ? imageCategory : videoCategory) === cat.id && (
                                                        <Check className="w-5 h-5 text-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>,
                                document.body
                            )}
                        </div>
                    )}

                    {/* Model & Aspect Ratio Badge */}
                    {type === "video" && (
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-secondary/50 flex-shrink-0">
                            <Volume2 className="w-3 h-3 text-primary" />
                            <span className="text-[10px] text-muted-foreground">{currentVideoModel.name}</span>
                        </div>
                    )}

                    {/* Aspect Ratio Compact */}
                    <button
                        onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                        className="flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-secondary/50 hover:bg-secondary active:bg-secondary/70 transition-colors flex-shrink-0"
                    >
                        <currentAspect.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{aspectRatio}</span>
                    </button>

                    {/* Output Count */}
                    <div className="flex items-center gap-1 px-3 py-2 min-h-[40px] rounded-lg bg-secondary/50 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">x{outputCount}</span>
                    </div>

                    {/* Settings Button */}
                    <div className="relative flex-shrink-0 overflow-visible" ref={settingsRef}>
                        <button
                            ref={settingsBtnRef}
                            onClick={() => showSettingsPanel ? setShowSettingsPanel(false) : openSettingsPanel()}
                            className={cn(
                                "p-2.5 min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center",
                                "bg-secondary/50 hover:bg-secondary active:bg-secondary/70",
                                showSettingsPanel && "bg-secondary ring-1 ring-primary/30"
                            )}
                            title="Settings"
                        >
                            <Settings2 className="w-5 h-5 text-muted-foreground" />
                        </button>

                        {/* Settings Panel - Positioned above button */}
                        {showSettingsPanel && typeof document !== 'undefined' && createPortal(
                            <div className="fixed inset-0 z-[99999]" onClick={() => setShowSettingsPanel(false)}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    style={{
                                        position: 'fixed',
                                        bottom: `${window.innerHeight - settingsBtnPos.top + 8}px`,
                                        right: `${Math.max(8, settingsBtnPos.right)}px`,
                                    }}
                                    className="w-[calc(100vw-16px)] sm:w-80 max-w-80 bg-card border border-border rounded-xl shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-3 border-b border-border flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground">Settings</span>
                                        <button onClick={() => setShowSettingsPanel(false)} className="p-1 hover:bg-secondary rounded">
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="p-3 sm:p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                                        {/* Aspect Ratio */}
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-3">Aspect Ratio</p>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {aspectRatios.map((ratio) => (
                                                    <button
                                                        key={ratio.id}
                                                        onClick={() => onAspectRatioChange?.(ratio.id)}
                                                        className={cn(
                                                            "flex flex-col items-center gap-1.5 p-2.5 min-h-[56px] rounded-lg transition-colors",
                                                            aspectRatio === ratio.id
                                                                ? "bg-primary/10 text-primary border border-primary/30"
                                                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary/70"
                                                        )}
                                                    >
                                                        <ratio.icon className="w-5 h-5" />
                                                        <span className="text-[10px] font-medium">{ratio.id}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Output Count */}
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-3">Outputs per prompt</p>
                                            <div className="flex gap-2">
                                                {[1, 2, 4].map((count) => (
                                                    <button
                                                        key={count}
                                                        onClick={() => onOutputCountChange?.(count)}
                                                        className={cn(
                                                            "flex-1 py-3 min-h-[48px] rounded-lg text-sm font-medium transition-colors",
                                                            outputCount === count
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary/70"
                                                        )}
                                                    >
                                                        {count}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Model Selection */}
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-3">Model</p>
                                            <div className="space-y-1.5">
                                                {(type === "image" ? availableImageModels : videoModels).map((model) => (
                                                    <button
                                                        key={model.id}
                                                        onClick={() => {
                                                            if (type === "image") {
                                                                onImageModelChange?.(model.id);
                                                            } else {
                                                                onVideoModelChange?.(model.id);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-3 py-3 min-h-[52px] rounded-lg text-left transition-colors",
                                                            (type === "image" ? imageModel : videoModel) === model.id
                                                                ? "bg-primary/10 border border-primary/30"
                                                                : "bg-secondary/50 hover:bg-secondary active:bg-secondary/70"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{model.name}</p>
                                                            <p className="text-xs text-muted-foreground">{model.description}</p>
                                                        </div>
                                                        {(type === "image" ? imageModel : videoModel) === model.id && (
                                                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>,
                            document.body
                        )}
                    </div>

                    {/* Audio: Voice Preset */}
                    {type === "audio" && (
                        <select
                            value={voicePreset}
                            onChange={(e) => onVoicePresetChange?.(e.target.value)}
                            className="bg-secondary border border-border rounded-lg px-2 py-1.5 text-xs text-foreground outline-none flex-shrink-0"
                        >
                            {voicePresets.map((preset) => (
                                <option key={preset.id} value={preset.id}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 min-w-4" />

                    {/* Credits indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="hidden sm:inline">2 credits</span>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={onSubmit}
                        disabled={isLoading || !value.trim()}
                        className={cn(
                            "w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                            isLoading || !value.trim()
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95"
                        )}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-current rounded-full animate-spin" />
                        ) : (
                            <ArrowUp className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

// Empty Template State Component
export const StudioEmptyState = memo(function StudioEmptyState({
    type,
}: {
    type: "image" | "video" | "audio";
}) {
    const typeLabels = {
        image: "Image",
        video: "Video",
        audio: "Audio"
    };

    const typeIcons = {
        image: "🎨",
        video: "🎬",
        audio: "🎵"
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center p-8 pb-36"
        >
            <div className="text-center max-w-md">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">{typeIcons[type]}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                    {typeLabels[type]} Studio
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
                    Describe what you want to create. Results will appear in the chat.
                </p>
            </div>
        </motion.div>
    );
});

export default StudioChatInput;
