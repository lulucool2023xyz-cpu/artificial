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
    const [imageMode, setImageMode] = useState<ImageMode>("from-prompt");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [stylePreset, setStylePreset] = useState("Traditional");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVariants, setGeneratedVariants] = useState<typeof mockVariants>([]);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [audioMode, setAudioMode] = useState<AudioMode>("tts");
    const [selectedVoice, setSelectedVoice] = useState("formal-male");
    const [ttsText, setTtsText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

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

    const handleGenerate = useCallback(() => {
        if (!prompt.trim() && imageMode === "from-prompt") {
            toast.error("Masukkan prompt terlebih dahulu");
            return;
        }
        setIsGenerating(true);
        toast.info("Sedang membuat varian...", { duration: 2000 });
        setTimeout(() => {
            setGeneratedVariants(mockVariants);
            setSelectedVariant(mockVariants[0].id);
            setIsGenerating(false);
            toast.success("4 varian berhasil dibuat");
        }, 3000);
    }, [prompt, imageMode]);

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
                        {/* Top Controls */}
                        <div className="p-4 border-b border-border flex flex-wrap items-center gap-4">
                            <div className="flex bg-secondary rounded-lg p-1">
                                {(["template", "from-image", "from-prompt"] as const).map((mode) => (
                                    <button key={mode} onClick={() => setImageMode(mode)} className={cn("px-4 py-2 rounded-lg text-sm transition-all", imageMode === mode ? "bg-[#C9A04F] text-white" : "text-muted-foreground hover:text-foreground")}>
                                        {mode === "template" ? "📄 Template" : mode === "from-image" ? "🖼️ From Image" : "✨ From Prompt"}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                {["1:1", "4:3", "16:9", "9:16"].map((ratio) => (
                                    <button key={ratio} onClick={() => setAspectRatio(ratio)} className={cn("px-3 py-1.5 rounded-lg text-xs border", aspectRatio === ratio ? "border-[#C9A04F] text-[#C9A04F]" : "border-border text-muted-foreground")}>{ratio}</button>
                                ))}
                            </div>
                            <select value={stylePreset} onChange={(e) => setStylePreset(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                                <option value="Traditional">Traditional</option>
                                <option value="Modern">Modern</option>
                                <option value="Tourism">Tourism</option>
                                <option value="Cinematic">Cinematic</option>
                            </select>
                        </div>

                        {/* Main Area */}
                        <div className="flex-1 flex min-h-0">
                            {/* Canvas */}
                            <div className="flex-1 bg-black p-8 flex items-center justify-center">
                                {generatedVariants.length > 0 && selectedVariant ? (
                                    <img src={generatedVariants.find(v => v.id === selectedVariant)?.thumbnail} alt="Generated" className="max-w-full max-h-full object-contain rounded-xl" />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10 text-muted-foreground" /></div>
                                        <h3 className="text-xl font-bold text-white mb-2">Generate Your First Image</h3>
                                        <p className="text-muted-foreground">Pilih mode dan masukkan prompt</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Panel */}
                            <div className="w-80 border-l border-border p-4 overflow-y-auto">
                                {imageMode === "from-prompt" && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">FROM PROMPT</h3>
                                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Landscape foto Candi Borobudur..." className="w-full bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none" />
                                        <button onClick={handleGenerate} disabled={isGenerating} className={cn("w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold", isGenerating ? "bg-muted cursor-not-allowed" : "bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white")}>
                                            {isGenerating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</> : <><Sparkles className="w-5 h-5" />Generate</>}
                                        </button>
                                        {generatedVariants.length > 0 && (
                                            <>
                                                <button onClick={handleSaveToLibrary} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground"><Save className="w-4 h-4" />Save to Library</button>
                                                <button onClick={handleDownload} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground"><Download className="w-4 h-4" />Download</button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {imageMode === "template" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {mockTemplates.map((t) => (
                                            <div key={t.id} className="bg-secondary border border-border rounded-lg p-3 cursor-pointer hover:border-[#C9A04F]/50">
                                                <div className="text-2xl mb-2">{t.icon}</div>
                                                <p className="text-xs text-foreground font-medium">{t.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{t.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {imageMode === "from-image" && (
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-[#C9A04F]/50 cursor-pointer">
                                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-xs text-muted-foreground">Upload Reference Image</p>
                                    </div>
                                )}
                            </div>
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
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-border flex items-center gap-4">
                            <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                                <option>Tourism Promo (10s)</option>
                                <option>Documentary (60s)</option>
                            </select>
                        </div>
                        <div className="p-4 border-b border-border flex items-center gap-3 overflow-x-auto">
                            {mockVideoScenes.map((scene, i) => (
                                <div key={scene.id} className="flex items-center">
                                    <div className="bg-card border border-border rounded-lg p-2 cursor-pointer hover:border-[#C9A04F]/50">
                                        <div className="w-24 h-14 rounded overflow-hidden mb-2"><img src={scene.thumbnail} alt="" className="w-full h-full object-cover" /></div>
                                        <p className="text-xs text-foreground">{scene.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{scene.duration}</p>
                                    </div>
                                    {i < mockVideoScenes.length - 1 && <span className="mx-2 text-muted-foreground">→</span>}
                                </div>
                            ))}
                            <button className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center"><Plus className="w-5 h-5 text-muted-foreground" /></button>
                        </div>
                        <div className="flex-1 bg-black flex items-center justify-center">
                            <div className="w-full max-w-2xl">
                                <div className="aspect-video bg-card rounded-xl flex items-center justify-center mb-4"><Play className="w-16 h-16 text-muted-foreground" /></div>
                                <div className="flex items-center gap-4">
                                    <button className="p-2 hover:bg-secondary rounded"><SkipBack className="w-5 h-5 text-foreground" /></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-[#C9A04F] rounded-full">{isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}</button>
                                    <button className="p-2 hover:bg-secondary rounded"><SkipForward className="w-5 h-5 text-foreground" /></button>
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">0:00</span>
                                        <div className="flex-1 h-1 bg-secondary rounded-full"><div className="w-1/4 h-full bg-[#C9A04F] rounded-full" /></div>
                                        <span className="text-xs text-muted-foreground">0:10</span>
                                    </div>
                                    <button className="p-2 hover:bg-secondary rounded"><Volume2 className="w-5 h-5 text-foreground" /></button>
                                    <button className="p-2 hover:bg-secondary rounded"><Maximize className="w-5 h-5 text-foreground" /></button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border flex justify-end gap-3">
                            <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Save Project</button>
                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white text-sm font-semibold">Render & Export</button>
                        </div>
                    </div>
                )}

                {/* AUDIO STUDIO */}
                {studio === "audio" && (
                    <div className="flex-1 flex flex-col">
                        <div className="p-4 border-b border-border flex items-center gap-4">
                            <div className="flex bg-secondary rounded-lg p-1">
                                {(["record", "tts", "upload"] as const).map((mode) => (
                                    <button key={mode} onClick={() => setAudioMode(mode)} className={cn("px-4 py-2 rounded-lg text-sm", audioMode === mode ? "bg-[#C9A04F] text-white" : "text-muted-foreground")}>
                                        {mode === "record" ? "🎤 Record" : mode === "tts" ? "🗣️ TTS" : "⬆️ Upload"}
                                    </button>
                                ))}
                            </div>
                            {audioMode === "tts" && (
                                <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                                    {voicePresets.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            )}
                        </div>
                        <div className="flex-1 bg-black p-8">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-card rounded-xl p-8 mb-6">
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
                        {audioMode === "tts" && (
                            <div className="border-t border-border p-4">
                                <div className="max-w-3xl mx-auto">
                                    <textarea value={ttsText} onChange={(e) => setTtsText(e.target.value)} placeholder="Selamat datang..." className="w-full bg-secondary border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none mb-4" />
                                    <div className="flex justify-end gap-3">
                                        <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Preview</button>
                                        <button onClick={handleGenerateTTS} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white text-sm font-semibold">Generate</button>
                                    </div>
                                </div>
                            </div>
                        )}
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
