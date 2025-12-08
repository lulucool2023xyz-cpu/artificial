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
import { getAccessToken, API_BASE_URL } from "@/lib/api";

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

    // Image Studio states
    const [imageCategory, setImageCategory] = useState("text-to-image");
    const [imageModel, setImageModel] = useState("imagen-4.0-generate-001");
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [outputCount, setOutputCount] = useState(2);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<{ url: string; timestamp: Date }[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Video Studio states
    const [videoCategory, setVideoCategory] = useState("text-to-video");
    const [videoModel, setVideoModel] = useState("veo-3.1-fast-generate-preview");
    const [videoPrompt, setVideoPrompt] = useState("");
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

    // Audio Studio states
    const [audioMode, setAudioMode] = useState<AudioMode>("tts");
    const [selectedVoice, setSelectedVoice] = useState("formal-male");
    const [ttsText, setTtsText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
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

        // Get token from sessionStorage via api.ts helper
        const token = getAccessToken();
        const authHeaders = token
            ? { 'Authorization': `Bearer ${token}` }
            : {};

        try {
            let endpoint = '';
            let body: Record<string, any> = {};

            switch (imageCategory) {
                case 'text-to-image':
                    // v2 API - Text to Image
                    endpoint = '/api/v2/image/generate';
                    body = {
                        prompt,
                        model: imageModel,
                        aspectRatio,
                        numberOfImages: outputCount,
                    };
                    toast.info(`Membuat gambar dengan ${imageModel}...`, { duration: 3000 });
                    break;

                case 'customize':
                    // v1 API - Customize Image
                    endpoint = '/api/v1/image/image-customize';
                    body = {
                        prompt,
                        referenceImages: [], // TODO: Add uploaded image references
                        sampleCount: outputCount,
                    };
                    toast.info("Mengkustomisasi gambar...", { duration: 3000 });
                    break;

                case 'image-to-image':
                    // v1 API - Image Edit
                    endpoint = '/api/v1/image/image-edit';
                    body = {
                        prompt,
                        referenceImages: [], // TODO: Add uploaded image references
                        editMode: 'EDIT_MODE_DEFAULT',
                        sampleCount: outputCount,
                    };
                    toast.info("Mengubah gambar...", { duration: 3000 });
                    break;

                case 'upscale':
                    // v1 API - Image Upscale
                    endpoint = '/api/v1/image/image-upscale';
                    body = {
                        image: '', // TODO: Add uploaded image base64
                        prompt: prompt || 'Upscale the image',
                        upscaleFactor: 'x2',
                    };
                    toast.info("Mengupscale gambar...", { duration: 3000 });
                    break;

                default:
                    endpoint = '/api/v2/image/generate';
                    body = { prompt, model: imageModel, aspectRatio, numberOfImages: outputCount };
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error?.message || 'Gagal generate gambar');
            }

            // Check response format and show appropriate message
            if (data.images && data.images.length > 0) {
                // Save images to state for display
                const newImages = data.images.map((img: any) => ({
                    url: img.url || img.gcsUrl || img,
                    timestamp: new Date()
                }));
                setGeneratedImages(prev => [...newImages, ...prev]);
                setSelectedImage(newImages[0].url);
                toast.success(`${data.images.length} gambar berhasil dibuat!`);
                console.log('Generated images:', data.images);
            } else if (data.url || data.gcsUrl) {
                // Single image response
                const imageUrl = data.url || data.gcsUrl;
                setGeneratedImages(prev => [{ url: imageUrl, timestamp: new Date() }, ...prev]);
                setSelectedImage(imageUrl);
                toast.success("Gambar berhasil dibuat!");
            } else if (data.success) {
                toast.success("Gambar berhasil dibuat!");
            } else {
                toast.success("Proses selesai!");
            }

            setPrompt(""); // Clear prompt after success
        } catch (error) {
            console.error('Image generation error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal generate gambar');
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, imageModel, aspectRatio, outputCount, imageCategory]);

    // Video Generation Handler
    const handleVideoGenerate = useCallback(async () => {
        if (!videoPrompt.trim()) {
            toast.error("Masukkan prompt terlebih dahulu");
            return;
        }
        setIsGeneratingVideo(true);

        // Get token from sessionStorage via api.ts helper
        const token = getAccessToken();
        const authHeaders = token
            ? { 'Authorization': `Bearer ${token}` }
            : {};

        try {
            let endpoint = '';
            let body: Record<string, any> = {};

            // Video only supports 16:9 and 9:16 (NOT 1:1)
            const videoAspectRatio = ['16:9', '9:16'].includes(aspectRatio) ? aspectRatio : '16:9';

            switch (videoCategory) {
                case 'text-to-video':
                    // v2 API - Text to Video
                    endpoint = '/api/v2/video/generate';
                    body = {
                        prompt: videoPrompt,
                        model: videoModel,
                        aspectRatio: videoAspectRatio,
                        durationSeconds: 8,
                    };
                    toast.info(`Generating video with ${videoModel}...`, { duration: 5000 });
                    break;

                case 'frames-to-video':
                    // v2 API - Frame Interpolation
                    endpoint = '/api/v2/video/interpolate';
                    body = {
                        prompt: videoPrompt,
                        firstFrame: { bytesBase64Encoded: '' }, // TODO: Add uploaded frame
                        lastFrame: { bytesBase64Encoded: '' }, // TODO: Add uploaded frame
                        durationSeconds: 8,
                        aspectRatio: videoAspectRatio,
                    };
                    toast.info("Interpolating frames to video...", { duration: 5000 });
                    break;

                case 'ingredients-to-video':
                    // v2 API - Video with References
                    endpoint = '/api/v2/video/with-references';
                    body = {
                        prompt: videoPrompt,
                        referenceImages: [], // TODO: Add uploaded references
                        durationSeconds: 8,
                        aspectRatio: videoAspectRatio,
                    };
                    toast.info("Creating video from ingredients...", { duration: 5000 });
                    break;

                default:
                    endpoint = '/api/v2/video/generate';
                    body = {
                        prompt: videoPrompt,
                        model: videoModel,
                        aspectRatio: videoAspectRatio,
                        durationSeconds: 8,
                    };
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error?.message || 'Gagal generate video');
            }

            // Check response format
            if (data.url) {
                toast.success("Video berhasil dibuat!");
                console.log('Generated video URL:', data.url);
            } else if (data.operationId) {
                // Async operation - video is still generating
                toast.success("Video sedang diproses. Cek status nanti.");
                console.log('Video operation ID:', data.operationId);
            } else {
                toast.success("Video generation started!");
            }

            setVideoPrompt(""); // Clear prompt after success
        } catch (error) {
            console.error('Video generation error:', error);
            toast.error(error instanceof Error ? error.message : 'Gagal generate video');
        } finally {
            setIsGeneratingVideo(false);
        }
    }, [videoPrompt, videoModel, aspectRatio, videoCategory]);

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
                            {/* Canvas - Theme aware */}
                            <div className="flex-1 bg-secondary/30 dark:bg-black/80 flex items-center justify-center overflow-auto p-4">
                                {generatedImages.length === 0 ? (
                                    <StudioEmptyState type="image" />
                                ) : (
                                    <div className="w-full h-full flex flex-col gap-4">
                                        {/* Main Selected Image */}
                                        {selectedImage && (
                                            <div className="flex-1 flex items-center justify-center min-h-0">
                                                <motion.img
                                                    key={selectedImage}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    src={selectedImage}
                                                    alt="Generated"
                                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                                    onError={(e) => {
                                                        console.error('Image load error:', selectedImage);
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text fill="%23C9A04F" x="50" y="55" text-anchor="middle" font-size="12">Image</text></svg>';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {/* Thumbnail Gallery */}
                                        {generatedImages.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 px-2">
                                                {generatedImages.slice(0, 10).map((img, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        onClick={() => setSelectedImage(img.url)}
                                                        className={cn(
                                                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                                                            selectedImage === img.url ? "border-[#C9A04F] ring-2 ring-[#C9A04F]/50" : "border-transparent hover:border-[#C9A04F]/50"
                                                        )}
                                                    >
                                                        <img src={img.url} alt={`Generated ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Actions */}
                                        {selectedImage && (
                                            <div className="flex justify-center gap-2 pb-16">
                                                <a
                                                    href={selectedImage}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-lg bg-[#C9A04F] text-white font-medium flex items-center gap-2 hover:bg-[#B8860B] transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedImage);
                                                        toast.success("URL disalin!");
                                                    }}
                                                    className="px-4 py-2 rounded-lg border border-[#C9A04F] text-[#C9A04F] font-medium hover:bg-[#C9A04F]/10 transition-colors"
                                                >
                                                    Copy URL
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Floating Chat Input at Bottom - overflow-visible for dropdowns */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-full px-3 sm:px-6 z-10 overflow-visible">
                                <StudioChatInput
                                    type="image"
                                    placeholder="Describe the image you're imagining..."
                                    value={prompt}
                                    onChange={setPrompt}
                                    onSubmit={handleGenerate}
                                    isLoading={isGenerating}
                                    aspectRatio={aspectRatio}
                                    onAspectRatioChange={setAspectRatio}
                                    imageCategory={imageCategory}
                                    onImageCategoryChange={setImageCategory}
                                    imageModel={imageModel}
                                    onImageModelChange={setImageModel}
                                    outputCount={outputCount}
                                    onOutputCountChange={setOutputCount}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* VIDEO STUDIO */}
                {studio === "video" && (
                    <div className="flex-1 flex flex-col relative">
                        {/* Video Preview - Theme aware */}
                        <div className="flex-1 bg-secondary/30 dark:bg-black/80 flex items-center justify-center overflow-auto">
                            <StudioEmptyState type="video" />
                        </div>

                        {/* Floating Chat Input - overflow-visible for dropdowns */}
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full px-3 sm:px-6 z-10 overflow-visible">
                            <StudioChatInput
                                type="video"
                                placeholder="Generate a video with text..."
                                value={videoPrompt}
                                onChange={setVideoPrompt}
                                onSubmit={handleVideoGenerate}
                                isLoading={isGeneratingVideo}
                                videoCategory={videoCategory}
                                onVideoCategoryChange={setVideoCategory}
                                videoModel={videoModel}
                                onVideoModelChange={setVideoModel}
                                aspectRatio={aspectRatio}
                                onAspectRatioChange={setAspectRatio}
                                outputCount={outputCount}
                                onOutputCountChange={setOutputCount}
                            />
                        </div>
                    </div>
                )}

                {/* AUDIO STUDIO */}
                {studio === "audio" && (
                    <div className="flex-1 flex flex-col relative">
                        {/* Audio Visualizer - Theme aware */}
                        <div className="flex-1 bg-secondary/30 dark:bg-black/80 flex items-center justify-center overflow-auto">
                            <StudioEmptyState type="audio" />
                        </div>

                        {/* Floating Chat Input - overflow-visible for dropdowns */}
                        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full px-3 sm:px-6 z-10 overflow-visible">
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
                                        toast.success("Audio generated! Lihat hasil di chat.");
                                        setTtsText("");
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
