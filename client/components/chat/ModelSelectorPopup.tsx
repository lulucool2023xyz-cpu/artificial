import { memo, useState } from "react";
import { Sparkles, Zap, Brain, Check, Globe } from "lucide-react";
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
    icon: "sparkles" | "zap" | "brain" | "globe";
    color: string;
    recommended?: boolean;
    provider: "gemini" | "openrouter";
}

const models: AIModel[] = [
    // ====== Gemini Models ======
    {
        id: "gemini-2-flash",
        name: "Gemini 2.0 Flash",
        description: "Respon cepat untuk pertanyaan sederhana.",
        icon: "zap",
        color: "cyan",
        provider: "gemini",
    },
    {
        id: "gemini-2-5-flash",
        name: "Gemini 2.5 Flash",
        description: "Keseimbangan kecepatan dan kualitas.",
        icon: "sparkles",
        color: "blue",
        recommended: true,
        provider: "gemini",
    },
    {
        id: "gemini-2-5-pro",
        name: "Gemini 2.5 Pro",
        description: "Analisis mendalam untuk tugas kompleks.",
        icon: "brain",
        color: "purple",
        provider: "gemini",
    },
    {
        id: "gemini-3-pro",
        name: "Gemini 3 Pro",
        description: "Model terbaru dengan kemampuan thinking.",
        icon: "brain",
        color: "indigo",
        provider: "gemini",
    },

    // ====== OpenRouter Models ======
    {
        id: "anthropic/claude-sonnet-4",
        name: "Claude Sonnet 4",
        description: "Model Anthropic terbaru, analisis mendalam.",
        icon: "globe",
        color: "amber",
        provider: "openrouter",
    },
    {
        id: "openai/gpt-4o",
        name: "GPT-4o",
        description: "Model multimodal OpenAI, serbaguna.",
        icon: "globe",
        color: "emerald",
        provider: "openrouter",
    },
    {
        id: "google/gemini-2.5-pro",
        name: "Gemini 2.5 Pro (OpenRouter)",
        description: "Gemini Pro via OpenRouter, context 1M tokens.",
        icon: "globe",
        color: "sky",
        provider: "openrouter",
    },
    {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        description: "Model reasoning kuat dengan harga terjangkau.",
        icon: "globe",
        color: "rose",
        provider: "openrouter",
    },
    {
        id: "meta-llama/llama-4-maverick",
        name: "Llama 4 Maverick",
        description: "Model open-source terbaru dari Meta.",
        icon: "globe",
        color: "violet",
        provider: "openrouter",
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
    const [activeTab, setActiveTab] = useState<"gemini" | "openrouter">(
        selectedModel.includes("/") ? "openrouter" : "gemini"
    );

    const geminiModels = models.filter(m => m.provider === "gemini");
    const openRouterModels = models.filter(m => m.provider === "openrouter");

    const getIcon = (icon: AIModel["icon"]) => {
        switch (icon) {
            case "zap":
                return <Zap className="w-6 h-6" />;
            case "sparkles":
                return <Sparkles className="w-6 h-6" />;
            case "brain":
                return <Brain className="w-6 h-6" />;
            case "globe":
                return <Globe className="w-6 h-6" />;
        }
    };

    const getColorClasses = (color: string, isSelected: boolean) => {
        const baseColors: Record<string, string> = {
            cyan: isSelected ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "border-cyan-500/30 text-cyan-400/70 hover:border-cyan-500/50 hover:bg-cyan-500/10",
            blue: isSelected ? "bg-blue-500/20 border-blue-500 text-blue-400" : "border-blue-500/30 text-blue-400/70 hover:border-blue-500/50 hover:bg-blue-500/10",
            purple: isSelected ? "bg-purple-500/20 border-purple-500 text-purple-400" : "border-purple-500/30 text-purple-400/70 hover:border-purple-500/50 hover:bg-purple-500/10",
            indigo: isSelected ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/50 hover:bg-indigo-500/10",
            amber: isSelected ? "bg-amber-500/20 border-amber-500 text-amber-400" : "border-amber-500/30 text-amber-400/70 hover:border-amber-500/50 hover:bg-amber-500/10",
            emerald: isSelected ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-emerald-500/30 text-emerald-400/70 hover:border-emerald-500/50 hover:bg-emerald-500/10",
            sky: isSelected ? "bg-sky-500/20 border-sky-500 text-sky-400" : "border-sky-500/30 text-sky-400/70 hover:border-sky-500/50 hover:bg-sky-500/10",
            rose: isSelected ? "bg-rose-500/20 border-rose-500 text-rose-400" : "border-rose-500/30 text-rose-400/70 hover:border-rose-500/50 hover:bg-rose-500/10",
            violet: isSelected ? "bg-violet-500/20 border-violet-500 text-violet-400" : "border-violet-500/30 text-violet-400/70 hover:border-violet-500/50 hover:bg-violet-500/10",
        };
        return baseColors[color] || baseColors.blue;
    };

    const renderModelList = (modelsList: AIModel[]) => (
        <div className="space-y-3">
            {modelsList.map((model) => {
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
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-[#0A0A0A] border-2 border-[#FFD700]/20 p-0 overflow-hidden max-h-[85vh]">
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
                <div className="relative z-10 flex flex-col max-h-[85vh]">
                    <DialogHeader className="p-6 pb-4 border-b border-[#FFD700]/10">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                                Pilih Model AI
                            </DialogTitle>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                            Pilih model terbaik sesuai kebutuhanmu
                        </p>

                        {/* Tab Switcher */}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => setActiveTab("gemini")}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeTab === "gemini"
                                        ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                )}
                            >
                                <Sparkles className="w-4 h-4 inline mr-1.5" />
                                Gemini
                            </button>
                            <button
                                onClick={() => setActiveTab("openrouter")}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeTab === "openrouter"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                                )}
                            >
                                <Globe className="w-4 h-4 inline mr-1.5" />
                                OpenRouter
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="p-6 overflow-y-auto flex-1">
                        {activeTab === "gemini"
                            ? renderModelList(geminiModels)
                            : renderModelList(openRouterModels)
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});

export default ModelSelectorPopup;
