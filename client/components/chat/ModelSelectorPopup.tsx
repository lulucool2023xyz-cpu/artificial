import { memo, useState } from "react";
import { X, Sparkles, Zap, Brain, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBubbleParticles } from "@/components/ui/AnimatedBubbleParticles";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AIModel {
    id: string;
    name: string;
    description: string;
    icon: "sparkles" | "zap" | "brain";
    color: string;
    recommended?: boolean;
}

const models: AIModel[] = [
    {
        id: "gemini-2-flash",
        name: "Gemini 2.0 Flash",
        description: "Fast responses for simple queries. Best for quick tasks.",
        icon: "zap",
        color: "cyan",
    },
    {
        id: "gemini-2-5-flash",
        name: "Gemini 2.5 Flash",
        description: "Balanced speed and capability. Good for most tasks.",
        icon: "sparkles",
        color: "blue",
        recommended: true,
    },
    {
        id: "gemini-2-5-pro",
        name: "Gemini 2.5 Pro",
        description: "Advanced reasoning and analysis. For complex queries.",
        icon: "brain",
        color: "purple",
    },
    {
        id: "gemini-3-pro",
        name: "Gemini 3 Pro",
        description: "Latest model with thinking capability. Most powerful.",
        icon: "brain",
        color: "indigo",
    },
];

interface ModelSelectorPopupProps {
    isOpen: boolean;
    onClose: () => void;
    selectedModel: string;
    onSelectModel: (modelId: string) => void;
}

export const ModelSelectorPopup = memo(function ModelSelectorPopup({
    isOpen,
    onClose,
    selectedModel,
    onSelectModel,
}: ModelSelectorPopupProps) {
    const getIcon = (icon: AIModel["icon"]) => {
        switch (icon) {
            case "zap":
                return <Zap className="w-6 h-6" />;
            case "sparkles":
                return <Sparkles className="w-6 h-6" />;
            case "brain":
                return <Brain className="w-6 h-6" />;
        }
    };

    const getColorClasses = (color: string, isSelected: boolean) => {
        const baseColors: Record<string, string> = {
            cyan: isSelected ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "border-cyan-500/30 text-cyan-400/70 hover:border-cyan-500/50 hover:bg-cyan-500/10",
            blue: isSelected ? "bg-blue-500/20 border-blue-500 text-blue-400" : "border-blue-500/30 text-blue-400/70 hover:border-blue-500/50 hover:bg-blue-500/10",
            purple: isSelected ? "bg-purple-500/20 border-purple-500 text-purple-400" : "border-purple-500/30 text-purple-400/70 hover:border-purple-500/50 hover:bg-purple-500/10",
            indigo: isSelected ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/50 hover:bg-indigo-500/10",
        };
        return baseColors[color] || baseColors.blue;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-[#0A0A0A] border-2 border-[#FFD700]/20 p-0 overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <AnimatedBubbleParticles
                        particleColor="#FFD700"
                        particleSize={15}
                        spawnInterval={300}
                        blurStrength={8}
                        scaleRange={{ min: 0.2, max: 1.0 }}
                        friction={{ min: 0.3, max: 1.0 }}
                        className="opacity-30"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <DialogHeader className="p-6 pb-4 border-b border-[#FFD700]/10">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                                Select AI Model
                            </DialogTitle>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            Choose the best model for your needs
                        </p>
                    </DialogHeader>

                    <div className="p-6 space-y-3">
                        {models.map((model) => {
                            const isSelected = selectedModel === model.id;
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onSelectModel(model.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative",
                                        getColorClasses(model.color, isSelected),
                                        isSelected && "shadow-lg"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            isSelected ? "bg-white/10" : "bg-white/5"
                                        )}>
                                            {getIcon(model.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white">{model.name}</span>
                                                {model.recommended && (
                                                    <span className="px-2 py-0.5 text-xs bg-[#FFD700]/20 text-[#FFD700] rounded-full font-medium">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">{model.description}</p>
                                        </div>
                                        {isSelected && (
                                            <div className="p-1 bg-white/10 rounded-full">
                                                <Check className="w-4 h-4 text-green-400" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

export default ModelSelectorPopup;
