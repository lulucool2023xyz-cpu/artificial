"use client";

import { memo, useState, useRef, useEffect } from "react";
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
    Volume2,
    Mic,
    Video,
    Music,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

// Image generation modes
const imageModes = [
    { id: "text-to-image", label: "Text to Image", icon: Wand2, description: "Generate from text prompt" },
    { id: "image-to-image", label: "Image to Image", icon: ImageIcon, description: "Transform with reference" },
    { id: "upscale", label: "Image Upscale", icon: ArrowUpRight, description: "Enhance resolution" },
];

// Model options based on mode
const modelsByMode: Record<string, { id: string; name: string; provider: string }[]> = {
    "text-to-image": [
        { id: "imagen-3", name: "Imagen 3", provider: "Google Vertex AI" },
        { id: "imagen-2", name: "Imagen 2", provider: "Google Vertex AI" },
        { id: "gemini-image", name: "Gemini Image", provider: "Google AI" },
    ],
    "image-to-image": [
        { id: "imagen-edit", name: "Imagen Edit", provider: "Google Vertex AI" },
        { id: "gemini-vision", name: "Gemini Vision", provider: "Google AI" },
    ],
    "upscale": [
        { id: "upscaler-v1", name: "Upscaler 2x", provider: "Google Vertex AI" },
        { id: "upscaler-v2", name: "Upscaler 4x", provider: "Google Vertex AI" },
    ],
};

interface StudioChatInputProps {
    type: "image" | "video" | "audio";
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    // Image specific
    aspectRatio?: string;
    onAspectRatioChange?: (ratio: string) => void;
    onUploadClick?: () => void;
    imageMode?: string;
    onImageModeChange?: (mode: string) => void;
    selectedModel?: string;
    onModelChange?: (model: string) => void;
    // Video specific
    videoMode?: string;
    onVideoModeChange?: (mode: string) => void;
    // Audio specific
    voicePreset?: string;
    onVoicePresetChange?: (preset: string) => void;
}

const aspectRatios = ["1:1", "4:3", "16:9", "9:16"];
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
    aspectRatio = "1:1",
    onAspectRatioChange,
    onUploadClick,
    imageMode = "text-to-image",
    onImageModeChange,
    selectedModel = "imagen-3",
    onModelChange,
    voicePreset = "formal-male",
    onVoicePresetChange,
}: StudioChatInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const modeDropdownRef = useRef<HTMLDivElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
                setShowModeDropdown(false);
            }
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
                setShowModelDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading && value.trim()) {
            e.preventDefault();
            onSubmit();
        }
    };

    const currentImageMode = imageModes.find(m => m.id === imageMode) || imageModes[0];
    const availableModels = modelsByMode[imageMode] || modelsByMode["text-to-image"];
    const currentModel = availableModels.find(m => m.id === selectedModel) || availableModels[0];

    const typeConfig = {
        image: { icon: "🎨", label: "AI Image", color: "#C9A04F" },
        video: { icon: "🎬", label: "AI Video", color: "#8B5CF6" },
        audio: { icon: "🎵", label: "AI Audio", color: "#10B981" },
    };

    const config = typeConfig[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "w-full max-w-2xl mx-auto",
                "bg-gradient-to-b from-[#1A1A1A]/95 to-[#0D0D0D]/95",
                "backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-visible",
                "shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
                isFocused && "border-[#C9A04F]/40 shadow-[0_0_32px_rgba(201,160,79,0.15)]"
            )}
        >
            {/* Upload button for image modes that need reference */}
            {type === "image" && (imageMode === "image-to-image" || imageMode === "upscale") && (
                <div className="p-3 sm:p-4 pb-0">
                    <button
                        onClick={onUploadClick}
                        className={cn(
                            "group relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden",
                            "bg-white/5 border-2 border-dashed border-white/20",
                            "hover:border-[#C9A04F]/50 hover:bg-[#C9A04F]/5",
                            "transition-all duration-300 flex items-center justify-center"
                        )}
                    >
                        <Plus className="w-5 h-5 text-white/50 group-hover:text-[#C9A04F] transition-colors" />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </button>
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
                        "text-white placeholder:text-white/40",
                        "text-sm sm:text-base leading-relaxed",
                        "focus:outline-none focus:ring-0 border-none",
                        "caret-[#C9A04F]"
                    )}
                    style={{ outline: "none", border: "none" }}
                />
            </div>

            {/* Toolbar */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                {/* Mobile: Scrollable controls */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {/* Type/Mode Selector */}
                    {type === "image" && (
                        <div className="relative flex-shrink-0" ref={modeDropdownRef}>
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg",
                                    "bg-white/5 border border-white/10",
                                    "hover:bg-white/10 transition-colors",
                                    showModeDropdown && "bg-white/10 border-[#C9A04F]/30"
                                )}
                            >
                                <span className="text-sm">{config.icon}</span>
                                <span className="text-xs text-white/70 hidden sm:inline">{currentImageMode.label}</span>
                                <ChevronDown className={cn(
                                    "w-3 h-3 text-white/50 transition-transform",
                                    showModeDropdown && "rotate-180"
                                )} />
                            </button>

                            {/* Mode Dropdown */}
                            <AnimatePresence>
                                {showModeDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        className="absolute bottom-full mb-2 left-0 w-56 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-1.5">
                                            {imageModes.map((mode) => (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => {
                                                        onImageModeChange?.(mode.id);
                                                        setShowModeDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                                        imageMode === mode.id
                                                            ? "bg-[#C9A04F]/20 text-[#C9A04F]"
                                                            : "text-white/70 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    <mode.icon className="w-4 h-4" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium">{mode.label}</p>
                                                        <p className="text-[10px] text-white/40">{mode.description}</p>
                                                    </div>
                                                    {imageMode === mode.id && (
                                                        <Check className="w-4 h-4 text-[#C9A04F]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Video/Audio Type Badge */}
                    {type !== "image" && (
                        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                            <span className="text-sm">{config.icon}</span>
                            <span className="text-xs text-white/70">{config.label}</span>
                        </div>
                    )}

                    {/* Aspect Ratio - Image only */}
                    {type === "image" && imageMode === "text-to-image" && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => onAspectRatioChange?.(ratio)}
                                    className={cn(
                                        "px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-[10px] sm:text-xs transition-all",
                                        aspectRatio === ratio
                                            ? "bg-[#C9A04F] text-white font-medium"
                                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
                                    )}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Model Settings - Image */}
                    {type === "image" && (
                        <div className="relative flex-shrink-0" ref={modelDropdownRef}>
                            <button
                                onClick={() => setShowModelDropdown(!showModelDropdown)}
                                className={cn(
                                    "p-1.5 sm:p-2 rounded-lg transition-colors",
                                    "bg-white/5 hover:bg-white/10",
                                    showModelDropdown && "bg-white/10 ring-1 ring-[#C9A04F]/30"
                                )}
                                title="Select Model"
                            >
                                <Settings2 className="w-4 h-4 text-white/60" />
                            </button>

                            {/* Model Dropdown */}
                            <AnimatePresence>
                                {showModelDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        className="absolute bottom-full mb-2 right-0 w-60 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-2 border-b border-white/5">
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider px-2">Select Model</p>
                                        </div>
                                        <div className="p-1.5">
                                            {availableModels.map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => {
                                                        onModelChange?.(model.id);
                                                        setShowModelDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                                                        selectedModel === model.id
                                                            ? "bg-[#C9A04F]/20 text-[#C9A04F]"
                                                            : "text-white/70 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{model.name}</p>
                                                        <p className="text-[10px] text-white/40">{model.provider}</p>
                                                    </div>
                                                    {selectedModel === model.id && (
                                                        <Check className="w-4 h-4 text-[#C9A04F]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Audio: Voice Preset */}
                    {type === "audio" && (
                        <select
                            value={voicePreset}
                            onChange={(e) => onVoicePresetChange?.(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 text-xs text-white/70 outline-none flex-shrink-0"
                        >
                            {voicePresets.map((preset) => (
                                <option key={preset.id} value={preset.id} className="bg-[#1A1A1A]">
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 min-w-4" />

                    {/* Credits indicator */}
                    <div className="flex items-center gap-1.5 text-xs text-white/40 flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-[#C9A04F]" />
                        <span className="hidden sm:inline">2 credits</span>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={onSubmit}
                        disabled={isLoading || !value.trim()}
                        className={cn(
                            "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                            isLoading || !value.trim()
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white hover:shadow-[0_0_20px_rgba(201,160,79,0.4)] hover:scale-105 active:scale-95"
                        )}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

// Empty Template State Component - Updated to not overlap
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
            className="flex items-center justify-center p-8 pb-32" // Added padding bottom for chat input
        >
            <div className="text-center max-w-md">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl">{typeIcons[type]}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {typeLabels[type]} Studio
                </h2>
                <p className="text-sm sm:text-base text-white/50 mb-4 sm:mb-6 px-4">
                    Describe what you want to create using AI. Enter a prompt below to get started.
                </p>
            </div>
        </motion.div>
    );
});

export default StudioChatInput;
