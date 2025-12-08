import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Palette,
    Video,
    Mic,
    FileText,
    Plane,
    Tv,
    FolderOpen,
    Sparkles,
    Play,
    Pause,
    Square,
    SkipBack,
    SkipForward,
    Volume2,
    Maximize,
    Download,
    Plus,
    Save,
    Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AppLayout, type SidebarItem } from "@/components/layout/AppLayout";
import { StudioChatInput, StudioEmptyState } from "@/components/creative/StudioChatInput";

// MOCK DATA
const mockTemplates = [
    { id: "t1", name: "Batik Pattern", icon: "🎨", description: "Seamless patterns" },
    { id: "t2", name: "Tourism Poster", icon: "🏝️", description: "Hero image + text" },
    { id: "t3", name: "Cultural Banner", icon: "🏛️", description: "Web headers" },
    { id: "t4", name: "Social Media", icon: "📱", description: "Square 1:1" },
];

const mockVariants = [
    { id: "v1", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    { id: "v2", thumbnail: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=200&h=200&fit=crop" },
    { id: "v3", thumbnail: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=200&h=200&fit=crop" },
    { id: "v4", thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop" },
];

const mockProjects = [
    { id: "p1", name: "Batik Campaign", type: "Image", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", updated: "5 jam lalu" },
    { id: "p2", name: "Tourism Video", type: "Video", thumbnail: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=200&h=200&fit=crop", updated: "1 hari lalu" },
    { id: "p3", name: "Audio Guide", type: "Audio", thumbnail: null, updated: "3 hari lalu" },
];

const mockVideoScenes = [
    { id: "s1", label: "Intro", duration: "2.5s", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=60&fit=crop" },
    { id: "s2", label: "Main", duration: "3s", thumbnail: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=100&h=60&fit=crop" },
    { id: "s3", label: "Outro", duration: "2s", thumbnail: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=100&h=60&fit=crop" },
];

const voicePresets = [
    { id: "formal-male", name: "Formal Male" },
    { id: "formal-female", name: "Formal Female" },
    { id: "casual-male", name: "Casual Male" },
    { id: "casual-female", name: "Casual Female" },
];

type StudioType = "image" | "video" | "audio" | "script" | "tourism" | "commercial" | "projects";
type ImageMode = "template" | "from-image" | "from-prompt";
type AudioMode = "record" | "tts" | "upload";

const Creative = memo(function Creative() {
    const [studio, setStudio] = useState<StudioType>("image");
    // New image generation mode (text-to-image, image-to-image, upscale)
    const [imageGenerationMode, setImageGenerationMode] = useState("text-to-image");
    const [selectedModel, setSelectedModel] = useState("imagen-3");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVariants, setGeneratedVariants] = useState<typeof mockVariants>([]);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [audioMode, setAudioMode] = useState<AudioMode>("tts");
    const [selectedVoice, setSelectedVoice] = useState("formal-male");
    const [ttsText, setTtsText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoPrompt, setVideoPrompt] = useState("");
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    // Sidebar items for Creative
    const sidebarItems: SidebarItem[] = [
        { id: "image", label: "Image Studio", icon: <Palette className="w-5 h-5" />, active: studio === "image" },
        { id: "video", label: "Video Studio", icon: <Video className="w-5 h-5" />, active: studio === "video" },
        { id: "audio", label: "Audio Studio", icon: <Mic className="w-5 h-5" />, active: studio === "audio" },
        { id: "script", label: "Script Writer", icon: <FileText className="w-5 h-5" />, active: studio === "script" },
        { id: "tourism", label: "Tourism Kit", icon: <Plane className="w-5 h-5" />, active: studio === "tourism" },
        { id: "commercial", label: "Commercial Maker", icon: <Tv className="w-5 h-5" />, active: studio === "commercial" },
        { id: "projects", label: "My Projects", icon: <FolderOpen className="w-5 h-5" />, active: studio === "projects", badge: "12" },
    ];

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            toast.error("Masukkan prompt terlebih dahulu");
            return;
        }
        setIsGenerating(true);
        toast.info("Sedang membuat gambar...", { duration: 2000 });

        try {
            const response = await fetch('/api/v2/image/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth token if available
                    ...(localStorage.getItem('token') ? {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    } : {})
                },
                body: JSON.stringify({
                    prompt: prompt,
                    aspectRatio: aspectRatio,
                    numberOfImages: 4,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal generate gambar');
            }

            // Capture URL from response - handles both url and base64Data fallback
            if (data.images && data.images.length > 0) {
                const variants = data.images.map((img: { url?: string; base64Data?: string; mimeType: string }, index: number) => ({
                    id: `generated-${index}`,
                    // Use URL if available, otherwise create data URL from base64
                    thumbnail: img.url || (img.base64Data ? `data:${img.mimeType};base64,${img.base64Data}` : mockVariants[index % mockVariants.length].thumbnail),
                }));
                setGeneratedVariants(variants);
                setSelectedVariant(variants[0].id);
                toast.success(`${variants.length} gambar berhasil dibuat`);
            } else {
                // Fallback to mock if no images returned
                setGeneratedVariants(mockVariants);
                setSelectedVariant(mockVariants[0].id);
                toast.info("Menggunakan placeholder images");
            }
        } catch (error) {
            console.error('Image generation error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal generate gambar');
            // Fallback to mock data on error
            setGeneratedVariants(mockVariants);
            setSelectedVariant(mockVariants[0].id);
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, imageGenerationMode, aspectRatio]);

    const handleSaveToLibrary = () => toast.success("Disimpan ke Library");
    const handleDownload = () => toast.success("Mengunduh gambar...");
    const handleGenerateTTS = () => {
        if (!ttsText.trim()) { toast.error("Masukkan teks"); return; }
        toast.info("Generating audio...", { duration: 2000 });
        setTimeout(() => toast.success("Audio berhasil dibuat"), 2000);
    };

    return (
        <AppLayout
            title="Creative"
            sidebarItems={sidebarItems}
            activeSidebarItem={studio}
            onSidebarItemClick={(id) => setStudio(id as StudioType)}
            showNewButton
            newButtonLabel="New Project"
            onNewButtonClick={() => toast.info("Buat project baru")}
        >
            <div className="flex flex-col h-full min-h-0">

                {/* IMAGE STUDIO */}
                {studio === "image" && (
                    <div className="flex-1 flex flex-col min-h-0">

                        {/* Main Area with Floating Chat Input */}
                        <div className="flex-1 flex flex-col min-h-0 relative">
                            {/* Canvas */}
                            <div className="flex-1 bg-black flex items-center justify-center overflow-auto">
                                {generatedVariants.length > 0 && selectedVariant ? (
                                    <img src={generatedVariants.find(v => v.id === selectedVariant)?.thumbnail} alt="Generated" className="max-w-full max-h-full object-contain rounded-xl" />
                                ) : (
                                    <StudioEmptyState type="image" />
                                )}
                            </div>

                            {/* Floating Chat Input at Bottom */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-full px-3 sm:px-6 z-10">
                                <StudioChatInput
                                    type="image"
                                    placeholder="Describe the image you're imagining..."
                                    value={prompt}
                                    onChange={setPrompt}
                                    onSubmit={handleGenerate}
                                    isLoading={isGenerating}
                                    aspectRatio={aspectRatio}
                                    onAspectRatioChange={setAspectRatio}
                                    imageMode={imageGenerationMode}
                                    onImageModeChange={setImageGenerationMode}
                                    selectedModel={selectedModel}
                                    onModelChange={setSelectedModel}
                                />
                            </div>

                            {/* Side Actions (when generated) */}
                            {generatedVariants.length > 0 && (
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button onClick={handleSaveToLibrary} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                        <Save className="w-5 h-5 text-white" />
                                    </button>
                                    <button onClick={handleDownload} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                        <Download className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Variant Thumbnails */}
                        {generatedVariants.length > 0 && (
                            <div className="p-4 border-t border-border flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">Variants:</span>
                                {generatedVariants.map((v) => (
                                    <div key={v.id} onClick={() => setSelectedVariant(v.id)} className={cn("w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2", selectedVariant === v.id ? "border-[#C9A04F]" : "border-transparent hover:border-border")}>
                                        <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* VIDEO STUDIO */}
                {studio === "video" && (
                    <div className="flex-1 flex flex-col relative">
                        {/* Video Preview */}
                        <div className="flex-1 bg-black flex items-center justify-center overflow-auto">
                            <div className="w-full max-w-3xl p-8">
                                <div className="aspect-video bg-card/50 rounded-2xl flex items-center justify-center border border-white/10">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                            <Play className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Video Studio</h3>
                                        <p className="text-sm text-muted-foreground">Describe a video to generate</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Chat Input */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 z-10">
                            <StudioChatInput
                                type="video"
                                placeholder="Generate a video with text..."
                                value={videoPrompt}
                                onChange={setVideoPrompt}
                                onSubmit={() => {
                                    if (!videoPrompt.trim()) return;
                                    setIsGeneratingVideo(true);
                                    toast.info("Generating video...", { duration: 2000 });
                                    setTimeout(() => {
                                        setIsGeneratingVideo(false);
                                        toast.success("Video generated!");
                                    }, 3000);
                                }}
                                isLoading={isGeneratingVideo}
                            />
                        </div>
                    </div>
                )}

                {/* AUDIO STUDIO */}
                {studio === "audio" && (
                    <div className="flex-1 flex flex-col relative">
                        {/* Audio Visualizer */}
                        <div className="flex-1 bg-black flex items-center justify-center overflow-auto">
                            <div className="max-w-3xl mx-auto w-full p-8">
                                <div className="bg-card/50 rounded-2xl p-8 mb-6 border border-white/10">
                                    <div className="h-32 flex items-center justify-center gap-1">
                                        {[...Array(50)].map((_, i) => <div key={i} className="w-1 bg-[#C9A04F] rounded-full" style={{ height: `${Math.random() * 80 + 20}%`, opacity: 0.5 + Math.random() * 0.5 }} />)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    <button className="p-2 hover:bg-secondary rounded"><SkipBack className="w-5 h-5 text-foreground" /></button>
                                    <button className="p-3 bg-[#C9A04F] rounded-full"><Play className="w-6 h-6 text-white ml-0.5" /></button>
                                    <button className="p-2 hover:bg-secondary rounded"><Square className="w-5 h-5 text-foreground" /></button>
                                    {audioMode === "record" && (
                                        <button onClick={() => setIsRecording(!isRecording)} className={cn("ml-4 px-4 py-2 rounded-lg flex items-center gap-2", isRecording ? "bg-red-500 animate-pulse" : "bg-red-500/20")}>
                                            <div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-white text-sm">{isRecording ? "Recording..." : "REC"}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Floating Chat Input */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 z-10">
                            <StudioChatInput
                                type="audio"
                                placeholder="Enter text to convert to speech..."
                                value={ttsText}
                                onChange={setTtsText}
                                onSubmit={() => {
                                    if (!ttsText.trim()) return;
                                    setIsGeneratingAudio(true);
                                    toast.info("Generating audio...", { duration: 2000 });
                                    setTimeout(() => {
                                        setIsGeneratingAudio(false);
                                        toast.success("Audio generated!");
                                    }, 2000);
                                }}
                                isLoading={isGeneratingAudio}
                                voicePreset={selectedVoice}
                                onVoicePresetChange={setSelectedVoice}
                            />
                        </div>
                    </div>
                )}

                {/* MY PROJECTS */}
                {studio === "projects" && (
                    <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">My Creative Projects</h2>
                            <Input placeholder="Search..." className="w-64 bg-secondary border-border" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockProjects.map((p) => (
                                <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-[#C9A04F]/50 cursor-pointer group">
                                    <div className="aspect-video bg-secondary flex items-center justify-center">
                                        {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <Mic className="w-10 h-10 text-muted-foreground" />}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm text-foreground font-medium truncate">{p.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">{p.type}</span>
                                            <span className="text-[10px] text-muted-foreground">{p.updated}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PLACEHOLDER PAGES */}
                {(studio === "script" || studio === "tourism" || studio === "commercial") && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                                {studio === "script" && <FileText className="w-10 h-10 text-muted-foreground" />}
                                {studio === "tourism" && <Plane className="w-10 h-10 text-muted-foreground" />}
                                {studio === "commercial" && <Tv className="w-10 h-10 text-muted-foreground" />}
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">
                                {studio === "script" && "Script Writer"}
                                {studio === "tourism" && "Tourism Kit"}
                                {studio === "commercial" && "Commercial Maker"}
                            </h2>
                            <p className="text-muted-foreground">Fitur ini akan segera hadir</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
});

export default Creative;
