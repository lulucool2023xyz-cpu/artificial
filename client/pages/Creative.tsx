import { memo, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Upload,
    Camera,
    CameraOff,
    PhoneOff,
    MicOff,
    RotateCcw,
    Send,
    Image as ImageIcon,
    X,
    RefreshCw,
    Wand2,
    Settings,
    Clock,
    Loader2,
    Film
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AppLayout, type SidebarItem } from "@/components/layout/AppLayout";
import { StudioChatInput, StudioEmptyState } from "@/components/creative/StudioChatInput";
import { getAccessToken, API_BASE_URL } from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TtsGenerator } from "@/components/creative/TtsGenerator";
import { MusicGenerator } from "@/components/creative/MusicGenerator";
import { LiveChat } from "@/components/creative/LiveChat";
import { useLiveApi } from '@/hooks/useLiveApi';

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
    const [generatedImages, setGeneratedImages] = useState<{
        url: string;
        timestamp: Date;
        mimeType?: string;
        filename?: string;
        prompt?: string;
    }[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [showVideoHistory, setShowVideoHistory] = useState(false);

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant: 'default' | 'destructive';
    }>({
        open: false,
        title: '',
        description: '',
        onConfirm: () => { },
        variant: 'default'
    });

    // Video Studio states
    const [videoCategory, setVideoCategory] = useState("text-to-video");
    const [videoModel, setVideoModel] = useState("veo-3.1-fast-generate-preview");
    const [videoPrompt, setVideoPrompt] = useState("");
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    const [generatedVideos, setGeneratedVideos] = useState<{ url: string; timestamp: Date; prompt: string }[]>([]);
    const [videoReferenceImages, setVideoReferenceImages] = useState<{ base64: string; type: 'STYLE_REFERENCE' | 'SUBJECT_REFERENCE' }[]>([]);
    const [videoFirstFrame, setVideoFirstFrame] = useState<string>("");
    const [videoLastFrame, setVideoLastFrame] = useState<string>("");

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const savedImages = localStorage.getItem('creativeImageHistory');
            const savedVideos = localStorage.getItem('creativeVideoHistory');

            if (savedImages) {
                const parsed = JSON.parse(savedImages);
                // Filter out base64 images older than 24 hours to save storage
                const filtered = parsed.filter((img: any) => {
                    const age = Date.now() - new Date(img.timestamp).getTime();
                    return age < 24 * 60 * 60 * 1000 || !img.url.startsWith('data:');
                }).slice(0, 50); // Keep max 50 items
                setGeneratedImages(filtered.map((img: any) => ({
                    ...img,
                    timestamp: new Date(img.timestamp)
                })));
                if (filtered.length > 0) {
                    setSelectedImage(filtered[0].url);
                }
            }

            if (savedVideos) {
                const parsed = JSON.parse(savedVideos);
                setGeneratedVideos(parsed.slice(0, 20).map((vid: any) => ({
                    ...vid,
                    timestamp: new Date(vid.timestamp)
                })));
            }
        } catch (e) {
            console.error('Failed to load creative history:', e);
        }
    }, []);

    // Save to localStorage when images/videos change
    useEffect(() => {
        if (generatedImages.length > 0) {
            try {
                // Only save URL-based images to avoid storage issues with base64
                const toSave = generatedImages
                    .filter(img => !img.url.startsWith('data:') || img.url.length < 100000)
                    .slice(0, 50)
                    .map(img => ({
                        ...img,
                        timestamp: img.timestamp.toISOString()
                    }));
                localStorage.setItem('creativeImageHistory', JSON.stringify(toSave));
            } catch (e) {
                console.error('Failed to save image history:', e);
            }
        }
    }, [generatedImages]);

    useEffect(() => {
        if (generatedVideos.length > 0) {
            try {
                const toSave = generatedVideos.slice(0, 20).map(vid => ({
                    ...vid,
                    timestamp: vid.timestamp.toISOString()
                }));
                localStorage.setItem('creativeVideoHistory', JSON.stringify(toSave));
            } catch (e) {
                console.error('Failed to save video history:', e);
            }
        }
    }, [generatedVideos]);

    // Audio Studio states
    const [audioMode, setAudioMode] = useState<AudioMode>("tts");
    const [selectedVoice, setSelectedVoice] = useState("formal-male");
    const [ttsText, setTtsText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    // Script Writer states
    const [scriptPrompt, setScriptPrompt] = useState("");
    const [scriptType, setScriptType] = useState<"story" | "dialogue" | "narration" | "advertisement">("story");
    const [generatedScript, setGeneratedScript] = useState("");
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);

    // Live Tourism states
    const [cameraActive, setCameraActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [tourismTranscript, setTourismTranscript] = useState("");
    const tourismVideoRef = useRef<HTMLVideoElement>(null);
    const tourismStreamRef = useRef<MediaStream | null>(null);

    // Live API integration for Tourism
    const liveApiTourism = useLiveApi({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        systemInstruction: 'You are an enthusiastic virtual tour guide. You see what the user sees through their camera. Describe landmarks, answer questions, and provide historical facts about what is visible.',
        onError: (err) => toast.error('Tourism API Error', { description: err.message }),
    });

    const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Manage Live API connection for Tourism
    useEffect(() => {
        if (studio === 'tourism') {
            liveApiTourism.connect();
        } else {
            liveApiTourism.disconnect();
            if (videoIntervalRef.current) {
                clearInterval(videoIntervalRef.current);
                videoIntervalRef.current = null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studio]);

    // Start streaming when ready
    useEffect(() => {
        if (studio === 'tourism' && liveApiTourism.connectionState === 'ready' && cameraActive && tourismVideoRef.current) {
            liveApiTourism.startRecording();

            // Start video loop (1 FPS)
            videoIntervalRef.current = setInterval(() => {
                const video = tourismVideoRef.current;
                if (video && video.readyState >= 2) {
                    const canvas = document.createElement('canvas');
                    const scale = 0.5;
                    canvas.width = video.videoWidth * scale;
                    canvas.height = video.videoHeight * scale;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        try {
                            const base64 = canvas.toDataURL('image/jpeg', 0.5);
                            const data = base64.split(',')[1];
                            liveApiTourism.sendVideoFrame(data);
                        } catch (e) {
                            // Ignore canvas taint errors
                        }
                    }
                }
            }, 1000);

            return () => {
                if (videoIntervalRef.current) {
                    clearInterval(videoIntervalRef.current);
                    videoIntervalRef.current = null;
                }
                liveApiTourism.stopRecording();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studio, liveApiTourism.connectionState, cameraActive]);

    // Commercial Maker states
    const [commercialImages, setCommercialImages] = useState<File[]>([]);
    const [brandName, setBrandName] = useState("");
    const [productName, setProductName] = useState("");
    const [tagline, setTagline] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [commercialDuration, setCommercialDuration] = useState<"15" | "30" | "60">("30");
    const [isGeneratingCommercial, setIsGeneratingCommercial] = useState(false);
    const commercialFileInputRef = useRef<HTMLInputElement>(null);

    // Sidebar items for Creative
    const sidebarItems: SidebarItem[] = [
        { id: "image", label: "Image Studio", icon: <Palette className="w-5 h-5" />, active: studio === "image" },
        { id: "video", label: "Video Studio", icon: <Video className="w-5 h-5" />, active: studio === "video" },
        { id: "audio", label: "Audio Studio", icon: <Mic className="w-5 h-5" />, active: studio === "audio" },
        { id: "script", label: "Script Writer", icon: <FileText className="w-5 h-5" />, active: studio === "script" },
        { id: "tourism", label: "Live Tourism", icon: <Camera className="w-5 h-5" />, active: studio === "tourism" },
        { id: "commercial", label: "Commercial Maker", icon: <Tv className="w-5 h-5" />, active: studio === "commercial" },
        { id: "projects", label: "My Projects", icon: <FolderOpen className="w-5 h-5" />, active: studio === "projects", badge: "12" },
    ];

    // Live Tourism camera handlers
    const startTourismCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: true
            });
            tourismStreamRef.current = stream;
            if (tourismVideoRef.current) {
                tourismVideoRef.current.srcObject = stream;
            }
            setCameraActive(true);
            toast.success("Kamera aktif", { description: "Mulai eksplorasi wisata Anda" });
        } catch (error) {
            console.error("Camera error:", error);
            toast.error("Tidak dapat mengakses kamera", { description: "Pastikan izin kamera diberikan" });
        }
    };

    const stopTourismCamera = (showToast = true) => {
        if (tourismStreamRef.current) {
            tourismStreamRef.current.getTracks().forEach(track => track.stop());
            tourismStreamRef.current = null;
        }
        if (tourismVideoRef.current) {
            tourismVideoRef.current.srcObject = null;
        }
        setCameraActive(false);
        if (showToast) {
            toast.info("Kamera dimatikan");
        }
    };

    // Cleanup tourism camera when switching studios
    useEffect(() => {
        if (studio !== "tourism" && tourismStreamRef.current) {
            stopTourismCamera(false);
        }
    }, [studio]);

    const toggleMute = () => {
        if (tourismStreamRef.current) {
            tourismStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const switchCamera = async () => {
        if (tourismStreamRef.current) {
            const currentTrack = tourismStreamRef.current.getVideoTracks()[0];
            const currentFacingMode = currentTrack.getSettings().facingMode;

            // Stop current stream
            tourismStreamRef.current.getTracks().forEach(track => track.stop());

            // Start with opposite facing mode
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode === "user" ? "environment" : "user" },
                audio: true
            });

            tourismStreamRef.current = newStream;
            if (tourismVideoRef.current) {
                tourismVideoRef.current.srcObject = newStream;
            }
            toast.success("Kamera diubah");
        }
    };

    // Commercial image handler
    const handleCommercialImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            toast.error("Maksimal 5 gambar");
            return;
        }
        setCommercialImages(files);
        toast.success(`${files.length} gambar ditambahkan`);
    };

    const handleGenerateScript = async () => {
        if (!scriptPrompt.trim()) {
            toast.error("Masukkan deskripsi script");
            return;
        }
        setIsGeneratingScript(true);
        // Simulate API call
        setTimeout(() => {
            const mockScript = `# ${scriptType.toUpperCase()} SCRIPT

## Scene 1: Opening
${scriptPrompt}

[FADE IN]

INT. LOCATION - DAY

The scene opens with a wide shot establishing the atmosphere...

NARRATOR (V.O.)
"Selamat datang di pengalaman yang tak terlupakan..."

[CUT TO]

## Scene 2: Main Content

[Insert main content here based on your story]

## Scene 3: Closing

[FADE OUT]

---
Generated by Orenax AI Script Writer`;
            setGeneratedScript(mockScript);
            setIsGeneratingScript(false);
            toast.success("Script berhasil dibuat!");
        }, 3000);
    };

    const handleGenerateCommercial = async () => {
        if (!brandName || !productName) {
            toast.error("Lengkapi informasi brand dan produk");
            return;
        }
        setIsGeneratingCommercial(true);
        setTimeout(() => {
            setIsGeneratingCommercial(false);
            toast.success("Video commercial sedang diproses!", {
                description: "Estimasi selesai dalam 5-10 menit"
            });
        }, 2000);
    };

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
                // Process images - handle both URL and base64 formats
                const newImages = data.images.map((img: any) => {
                    let imageUrl: string;

                    // Check if image is a URL or base64
                    if (img.url) {
                        imageUrl = img.url;
                    } else if (img.gcsUrl) {
                        imageUrl = img.gcsUrl;
                    } else if (img.base64Data || img.bytesBase64Encoded) {
                        // Decode base64 - construct data URL
                        const base64 = img.base64Data || img.bytesBase64Encoded;
                        const mimeType = img.mimeType || 'image/png';
                        imageUrl = `data:${mimeType};base64,${base64}`;
                    } else if (typeof img === 'string') {
                        // Direct string - could be URL or base64
                        if (img.startsWith('http') || img.startsWith('data:')) {
                            imageUrl = img;
                        } else {
                            // Assume it's base64 without prefix
                            imageUrl = `data:image/png;base64,${img}`;
                        }
                    } else {
                        console.warn('Unknown image format:', img);
                        imageUrl = '';
                    }

                    return {
                        url: imageUrl,
                        timestamp: new Date(),
                        mimeType: img.mimeType || 'image/png',
                        filename: img.filename
                    };
                }).filter((img: any) => img.url); // Filter out empty URLs

                if (newImages.length > 0) {
                    setGeneratedImages(prev => [...newImages, ...prev]);
                    setSelectedImage(newImages[0].url);
                    toast.success(`${newImages.length} gambar berhasil dibuat!`);
                    console.log('Generated images:', newImages);
                } else {
                    toast.error("Tidak ada gambar yang valid dalam response");
                }
            } else if (data.url || data.gcsUrl || data.base64Data || data.bytesBase64Encoded) {
                // Single image response
                let imageUrl: string;

                if (data.url) {
                    imageUrl = data.url;
                } else if (data.gcsUrl) {
                    imageUrl = data.gcsUrl;
                } else if (data.base64Data || data.bytesBase64Encoded) {
                    const base64 = data.base64Data || data.bytesBase64Encoded;
                    const mimeType = data.mimeType || 'image/png';
                    imageUrl = `data:${mimeType};base64,${base64}`;
                } else {
                    imageUrl = '';
                }

                if (imageUrl) {
                    setGeneratedImages(prev => [{
                        url: imageUrl,
                        timestamp: new Date(),
                        mimeType: data.mimeType || 'image/png',
                        filename: data.filename
                    }, ...prev]);
                    setSelectedImage(imageUrl);
                    toast.success("Gambar berhasil dibuat!");
                }
            } else if (data.success) {
                toast.success("Gambar berhasil dibuat!");
            } else {
                console.log('Unexpected response format:', data);
                toast.success("Proses selesai!");
            }

            setPrompt(""); // Clear prompt after success
        } catch (error) {
            console.error('Image generation error:', error);

            // Enhanced error handling with specific messages
            let errorMessage = 'Gagal generate gambar';
            let errorDescription = 'Silakan coba lagi nanti';

            if (error instanceof Error) {
                if (error.message.includes('fetch') || error.message.includes('network')) {
                    errorMessage = 'Koneksi gagal';
                    errorDescription = 'Periksa koneksi internet Anda';
                } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
                    errorMessage = 'Sesi berakhir';
                    errorDescription = 'Silakan login ulang';
                } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                    errorMessage = 'Terlalu banyak request';
                    errorDescription = 'Tunggu beberapa saat sebelum mencoba lagi';
                } else if (error.message.includes('500') || error.message.includes('server')) {
                    errorMessage = 'Server error';
                    errorDescription = 'Tim kami sedang menangani masalah ini';
                } else if (error.message.includes('content') || error.message.includes('safety')) {
                    errorMessage = 'Konten tidak sesuai';
                    errorDescription = 'Prompt Anda mungkin mengandung konten yang tidak diizinkan';
                } else {
                    errorDescription = error.message;
                }
            }

            toast.error(errorMessage, {
                description: errorDescription,
                action: {
                    label: 'Coba Lagi',
                    onClick: () => handleGenerate()
                }
            });
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
                    if (!videoFirstFrame || !videoLastFrame) {
                        toast.error("Tambahkan frame awal dan akhir terlebih dahulu");
                        setIsGeneratingVideo(false);
                        return;
                    }
                    endpoint = '/api/v2/video/interpolate';
                    body = {
                        prompt: videoPrompt,
                        firstFrame: { bytesBase64Encoded: videoFirstFrame, mimeType: 'image/png' },
                        lastFrame: { bytesBase64Encoded: videoLastFrame, mimeType: 'image/png' },
                        durationSeconds: 8,
                        aspectRatio: videoAspectRatio,
                    };
                    toast.info("Interpolating frames to video...", { duration: 5000 });
                    break;

                case 'ingredients-to-video':
                    // v2 API - Video with References
                    if (videoReferenceImages.length === 0) {
                        toast.error("Tambahkan minimal satu referensi gambar");
                        setIsGeneratingVideo(false);
                        return;
                    }
                    endpoint = '/api/v2/video/with-references';
                    body = {
                        prompt: videoPrompt,
                        referenceImages: videoReferenceImages.map(ref => ({
                            image: { bytesBase64Encoded: ref.base64, mimeType: 'image/png' },
                            referenceType: ref.type
                        })),
                        durationSeconds: 8,
                        aspectRatio: videoAspectRatio,
                        generateAudio: true,
                    };
                    toast.info("Creating video from references...", { duration: 5000 });
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

            // Check response format and save video
            if (data.url) {
                setGeneratedVideos(prev => [{
                    url: data.url,
                    timestamp: new Date(),
                    prompt: videoPrompt
                }, ...prev]);
                toast.success("Video berhasil dibuat!");
                console.log('Generated video URL:', data.url);
            } else if (data.operationId) {
                // Async operation - start polling for status
                toast.info("Video sedang diproses...", {
                    description: `Operation ID: ${data.operationId}`,
                    duration: 10000
                });
                // Poll for completion
                pollVideoOperation(data.operationId);
            } else {
                toast.success("Video generation started!");
            }

            setVideoPrompt(""); // Clear prompt after success
            setVideoReferenceImages([]); // Clear references
            setVideoFirstFrame("");
            setVideoLastFrame("");
        } catch (error) {
            console.error('Video generation error:', error);

            // Enhanced error handling with specific messages
            let errorMessage = 'Gagal generate video';
            let errorDescription = 'Silakan coba lagi nanti';

            if (error instanceof Error) {
                if (error.message.includes('fetch') || error.message.includes('network')) {
                    errorMessage = 'Koneksi gagal';
                    errorDescription = 'Periksa koneksi internet Anda';
                } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
                    errorMessage = 'Sesi berakhir';
                    errorDescription = 'Silakan login ulang';
                } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                    errorMessage = 'Terlalu banyak request';
                    errorDescription = 'Video generation membutuhkan resource besar. Coba lagi dalam beberapa menit';
                } else if (error.message.includes('500') || error.message.includes('server')) {
                    errorMessage = 'Server error';
                    errorDescription = 'Tim kami sedang menangani masalah ini';
                } else if (error.message.includes('content') || error.message.includes('safety')) {
                    errorMessage = 'Konten tidak sesuai';
                    errorDescription = 'Prompt Anda mungkin mengandung konten yang tidak diizinkan';
                } else {
                    errorDescription = error.message;
                }
            }

            toast.error(errorMessage, {
                description: errorDescription,
                action: {
                    label: 'Coba Lagi',
                    onClick: () => handleVideoGenerate()
                }
            });
        } finally {
            setIsGeneratingVideo(false);
        }
    }, [videoPrompt, videoModel, aspectRatio, videoCategory]);

    // Poll for video operation status
    const pollVideoOperation = useCallback(async (operationId: string, attempt = 0) => {
        if (attempt > 60) { // Max 10 minutes (60 * 10s)
            toast.error("Video generation timeout");
            return;
        }

        const token = getAccessToken();
        try {
            const response = await fetch(`${API_BASE_URL}/api/v2/video/operation?id=${encodeURIComponent(operationId)}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            const data = await response.json();

            if (data.status === 'COMPLETED' && data.result?.url) {
                setGeneratedVideos(prev => [{
                    url: data.result.url,
                    timestamp: new Date(),
                    prompt: 'Video generated'
                }, ...prev]);
                toast.success("Video selesai!");
            } else if (data.status === 'FAILED') {
                toast.error(data.error || "Video generation gagal");
            } else {
                // Still processing, poll again in 10 seconds
                setTimeout(() => pollVideoOperation(operationId, attempt + 1), 10000);
            }
        } catch (error) {
            console.error('Poll error:', error);
            setTimeout(() => pollVideoOperation(operationId, attempt + 1), 10000);
        }
    }, []);

    const handleSaveToLibrary = () => toast.success("Disimpan ke Library");
    const handleDownload = () => toast.success("Mengunduh gambar...");
    const handleGenerateTTS = () => {
        if (!ttsText.trim()) { toast.error("Masukkan teks"); return; }
        toast.info("Generating audio...", { duration: 2000 });
        setTimeout(() => toast.success("Audio berhasil dibuat"), 2000);
    };

    // Handle video reference image upload
    const handleVideoReferenceUpload = useCallback(async (file: File, type: 'STYLE_REFERENCE' | 'SUBJECT_REFERENCE') => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(',')[1];
            setVideoReferenceImages(prev => [...prev, { base64, type }]);
            toast.success(`${type === 'STYLE_REFERENCE' ? 'Style' : 'Subject'} reference added`);
        };
        reader.readAsDataURL(file);
    }, []);

    // Handle frame upload for interpolation
    const handleFrameUpload = useCallback(async (file: File, frameType: 'first' | 'last') => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(',')[1];
            if (frameType === 'first') {
                setVideoFirstFrame(base64);
            } else {
                setVideoLastFrame(base64);
            }
            toast.success(`${frameType === 'first' ? 'First' : 'Last'} frame added`);
        };
        reader.readAsDataURL(file);
    }, []);

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
                            {/* Canvas - Theme aware - pb-32 for floating input space */}
                            <div className="flex-1 bg-secondary/20 dark:bg-[#0A0A0A] flex items-center justify-center overflow-auto p-4 pb-32 sm:pb-36">
                                {isGenerating ? (
                                    // Loading skeleton while generating
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center">
                                                <Loader2 className="w-10 h-10 text-[#C9A04F] animate-spin" />
                                            </div>
                                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9A04F] animate-spin" style={{ animationDuration: '1.5s' }} />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h3 className="text-lg font-medium text-foreground">Generating {outputCount} image{outputCount > 1 ? 's' : ''}...</h3>
                                            <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                                        </div>
                                        {/* Preview skeleton grid */}
                                        <div className={cn(
                                            "grid gap-3 mt-4",
                                            outputCount === 1 ? "grid-cols-1" : "grid-cols-2"
                                        )}>
                                            {Array.from({ length: outputCount }).map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-40 h-40 rounded-xl bg-secondary/50 animate-pulse overflow-hidden relative"
                                                >
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer-translate_2s_infinite]" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : generatedImages.length === 0 ? (
                                    <StudioEmptyState type="image" />
                                ) : (
                                    <div className="w-full h-full flex flex-col gap-4">
                                        {/* History Toggle Button */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={() => setShowHistory(!showHistory)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                                    showHistory
                                                        ? "bg-[#C9A04F] text-white"
                                                        : "bg-secondary/80 text-foreground hover:bg-secondary"
                                                )}
                                            >
                                                <Clock className="w-4 h-4" />
                                                {showHistory ? "Hide History" : `History (${generatedImages.length})`}
                                            </button>
                                        </div>

                                        {/* Main View or History Grid */}
                                        {showHistory ? (
                                            // History Grid View
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <h3 className="text-lg font-semibold text-foreground mb-4">Generation History</h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                                    {generatedImages.map((img, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.03 }}
                                                            onClick={() => {
                                                                setSelectedImage(img.url);
                                                                setShowHistory(false);
                                                            }}
                                                            className={cn(
                                                                "aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group relative",
                                                                selectedImage === img.url
                                                                    ? "border-[#C9A04F] ring-2 ring-[#C9A04F]/50"
                                                                    : "border-transparent hover:border-[#C9A04F]/50"
                                                            )}
                                                        >
                                                            <img
                                                                src={img.url}
                                                                alt={`Generated ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                                <span className="text-xs text-white truncate">
                                                                    {new Date(img.timestamp).toLocaleDateString('id-ID')}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {/* Clear History Button */}
                                                {generatedImages.length > 0 && (
                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    title: 'Hapus History Gambar',
                                                                    description: 'Apakah kamu yakin ingin menghapus semua history gambar? Tindakan ini tidak dapat dibatalkan.',
                                                                    variant: 'destructive',
                                                                    onConfirm: () => {
                                                                        setGeneratedImages([]);
                                                                        setSelectedImage(null);
                                                                        localStorage.removeItem('creativeImageHistory');
                                                                        toast.success("History dihapus");
                                                                    }
                                                                });
                                                            }}
                                                            className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 text-sm hover:bg-red-500/10 transition-colors"
                                                        >
                                                            Clear All History
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
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
                                                {/* Thumbnail Gallery - Responsive Grid */}
                                                {generatedImages.length > 1 && (
                                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 px-2 pb-2 max-h-24 overflow-y-auto">
                                                        {generatedImages.slice(0, 20).map((img, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                onClick={() => setSelectedImage(img.url)}
                                                                className={cn(
                                                                    "aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all",
                                                                    selectedImage === img.url
                                                                        ? "border-[#C9A04F] ring-2 ring-[#C9A04F]/50"
                                                                        : "border-transparent hover:border-[#C9A04F]/50"
                                                                )}
                                                            >
                                                                <img src={img.url} alt={`Generated ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {/* Actions Bar */}
                                        {selectedImage && (
                                            <div className="flex flex-wrap justify-center gap-2 pb-16">
                                                <button
                                                    onClick={() => {
                                                        // Handle download for both URL and base64
                                                        const selectedImg = generatedImages.find(img => img.url === selectedImage);
                                                        const filename = selectedImg?.filename || `orenax-image-${Date.now()}.png`;

                                                        if (selectedImage.startsWith('data:')) {
                                                            // Base64 image - create blob and download
                                                            const link = document.createElement('a');
                                                            link.href = selectedImage;
                                                            link.download = filename;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            toast.success("Mengunduh gambar...");
                                                        } else {
                                                            // URL - open in new tab or fetch and download
                                                            fetch(selectedImage)
                                                                .then(res => res.blob())
                                                                .then(blob => {
                                                                    const url = URL.createObjectURL(blob);
                                                                    const link = document.createElement('a');
                                                                    link.href = url;
                                                                    link.download = filename;
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    document.body.removeChild(link);
                                                                    URL.revokeObjectURL(url);
                                                                    toast.success("Gambar berhasil diunduh!");
                                                                })
                                                                .catch(() => {
                                                                    // Fallback: open in new tab
                                                                    window.open(selectedImage, '_blank');
                                                                    toast.info("Gambar dibuka di tab baru");
                                                                });
                                                        }
                                                    }}
                                                    className="px-4 py-2 rounded-lg bg-[#C9A04F] text-white font-medium flex items-center gap-2 hover:bg-[#B8860B] transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedImage);
                                                        toast.success("URL disalin ke clipboard!");
                                                    }}
                                                    className="px-4 py-2 rounded-lg border border-[#C9A04F] text-[#C9A04F] font-medium hover:bg-[#C9A04F]/10 transition-colors"
                                                >
                                                    Copy URL
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Save to localStorage library
                                                        const library = JSON.parse(localStorage.getItem('imageLibrary') || '[]');
                                                        library.unshift({ url: selectedImage, savedAt: new Date().toISOString() });
                                                        localStorage.setItem('imageLibrary', JSON.stringify(library.slice(0, 100)));
                                                        toast.success("Disimpan ke Library!");
                                                    }}
                                                    className="px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save to Library
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setGeneratedImages(prev => prev.filter(img => img.url !== selectedImage));
                                                        setSelectedImage(generatedImages.length > 1 ? generatedImages.find(img => img.url !== selectedImage)?.url || null : null);
                                                        toast.success("Gambar dihapus");
                                                    }}
                                                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Remove
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
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Main Area with Floating Chat Input */}
                        <div className="flex-1 flex flex-col min-h-0 relative">
                            {/* Video Preview - Theme aware - pb-32 for floating input space */}
                            <div className="flex-1 bg-secondary/20 dark:bg-[#0A0A0A] flex items-center justify-center overflow-auto p-4 pb-32 sm:pb-36">
                                {isGeneratingVideo ? (
                                    // Video generation loading state
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden bg-secondary/50 animate-pulse">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="relative">
                                                        <Video className="w-16 h-16 text-muted-foreground/50" />
                                                        <Loader2 className="absolute -bottom-2 -right-2 w-8 h-8 text-[#C9A04F] animate-spin" />
                                                    </div>
                                                    <div className="space-y-2 text-center">
                                                        <h3 className="text-lg font-medium text-foreground">Generating Video...</h3>
                                                        <p className="text-sm text-muted-foreground">This may take 1-3 minutes</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Animated progress line */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                                                <div className="h-full bg-[#C9A04F] animate-[progress_3s_ease-in-out_infinite]" style={{ width: '0%' }} />
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Video generation uses advanced AI models
                                        </p>
                                    </div>
                                ) : generatedVideos.length === 0 ? (
                                    <div className="flex flex-col items-center">
                                        <StudioEmptyState type="video" />

                                        {/* Reference Upload UI for ingredients-to-video */}
                                        {videoCategory === 'ingredients-to-video' && (
                                            <div className="mt-4 w-full max-w-md space-y-4">
                                                <h4 className="text-sm font-medium text-foreground text-center">Add Reference Images</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Style Reference Upload */}
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-muted-foreground text-center">Style Reference</p>
                                                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-[#C9A04F]/50 transition-colors">
                                                            <Plus className="w-6 h-6 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && handleVideoReferenceUpload(e.target.files[0], 'STYLE_REFERENCE')}
                                                            />
                                                        </label>
                                                    </div>
                                                    {/* Subject Reference Upload */}
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-muted-foreground text-center">Subject Reference</p>
                                                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-[#C9A04F]/50 transition-colors">
                                                            <Plus className="w-6 h-6 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && handleVideoReferenceUpload(e.target.files[0], 'SUBJECT_REFERENCE')}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                {videoReferenceImages.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {videoReferenceImages.map((ref, idx) => (
                                                            <div key={idx} className="relative group">
                                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#C9A04F]/30">
                                                                    <img
                                                                        src={`data:image/png;base64,${ref.base64}`}
                                                                        alt={`Ref ${idx + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => setVideoReferenceImages(prev => prev.filter((_, i) => i !== idx))}
                                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 truncate">
                                                                    {ref.type === 'STYLE_REFERENCE' ? 'Style' : 'Subject'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Frame Upload UI for frames-to-video */}
                                        {videoCategory === 'frames-to-video' && (
                                            <div className="mt-4 w-full max-w-md space-y-4">
                                                <h4 className="text-sm font-medium text-foreground text-center">Add First & Last Frames</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* First Frame */}
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-muted-foreground text-center">First Frame</p>
                                                        <label className={cn(
                                                            "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden",
                                                            videoFirstFrame ? "border-[#C9A04F]" : "border-border hover:border-[#C9A04F]/50"
                                                        )}>
                                                            {videoFirstFrame ? (
                                                                <img src={`data:image/png;base64,${videoFirstFrame}`} alt="First frame" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>
                                                                    <SkipBack className="w-6 h-6 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                                                </>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && handleFrameUpload(e.target.files[0], 'first')}
                                                            />
                                                        </label>
                                                    </div>
                                                    {/* Last Frame */}
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-muted-foreground text-center">Last Frame</p>
                                                        <label className={cn(
                                                            "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden",
                                                            videoLastFrame ? "border-[#C9A04F]" : "border-border hover:border-[#C9A04F]/50"
                                                        )}>
                                                            {videoLastFrame ? (
                                                                <img src={`data:image/png;base64,${videoLastFrame}`} alt="Last frame" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>
                                                                    <SkipForward className="w-6 h-6 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                                                </>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => e.target.files?.[0] && handleFrameUpload(e.target.files[0], 'last')}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex flex-col gap-4 relative">
                                        {/* History Toggle Button */}
                                        <div className="absolute top-4 right-4 z-10">
                                            <button
                                                onClick={() => setShowVideoHistory(!showVideoHistory)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                                    showVideoHistory
                                                        ? "bg-[#C9A04F] text-white"
                                                        : "bg-secondary/80 text-foreground hover:bg-secondary"
                                                )}
                                            >
                                                <Clock className="w-4 h-4" />
                                                {showVideoHistory ? "Hide" : `History (${generatedVideos.length})`}
                                            </button>
                                        </div>

                                        {showVideoHistory ? (
                                            // Video History Grid
                                            <div className="flex-1 overflow-y-auto p-4">
                                                <h3 className="text-lg font-semibold text-foreground mb-4">Video History</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {generatedVideos.map((vid, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            onClick={() => {
                                                                setSelectedVideo(vid.url);
                                                                setShowVideoHistory(false);
                                                            }}
                                                            className={cn(
                                                                "aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all group relative",
                                                                selectedVideo === vid.url
                                                                    ? "border-[#C9A04F] ring-2 ring-[#C9A04F]/50"
                                                                    : "border-transparent hover:border-[#C9A04F]/50"
                                                            )}
                                                        >
                                                            <video src={vid.url} className="w-full h-full object-cover" muted />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Play className="w-10 h-10 text-white" />
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                                                <p className="text-xs text-white truncate">{vid.prompt || 'Video'}</p>
                                                                <p className="text-[10px] text-white/70">{new Date(vid.timestamp).toLocaleDateString('id-ID')}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {generatedVideos.length > 0 && (
                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            onClick={() => {
                                                                setConfirmDialog({
                                                                    open: true,
                                                                    title: 'Hapus History Video',
                                                                    description: 'Apakah kamu yakin ingin menghapus semua history video? Tindakan ini tidak dapat dibatalkan.',
                                                                    variant: 'destructive',
                                                                    onConfirm: () => {
                                                                        setGeneratedVideos([]);
                                                                        setSelectedVideo(null);
                                                                        localStorage.removeItem('creativeVideoHistory');
                                                                        toast.success("History dihapus");
                                                                    }
                                                                });
                                                            }}
                                                            className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 text-sm hover:bg-red-500/10 transition-colors"
                                                        >
                                                            Clear All History
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Main Video Player */}
                                                <div className="flex-1 flex items-center justify-center min-h-0">
                                                    <motion.video
                                                        key={selectedVideo || generatedVideos[0]?.url}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        src={selectedVideo || generatedVideos[0]?.url}
                                                        controls
                                                        autoPlay
                                                        className="max-w-full max-h-full rounded-xl shadow-2xl"
                                                    />
                                                </div>
                                                {/* Video Thumbnails - Responsive Grid */}
                                                {generatedVideos.length > 1 && (
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 px-2 pb-2">
                                                        {generatedVideos.slice(0, 16).map((vid, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                onClick={() => setSelectedVideo(vid.url)}
                                                                className={cn(
                                                                    "aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all relative",
                                                                    (selectedVideo || generatedVideos[0]?.url) === vid.url
                                                                        ? "border-[#C9A04F] ring-2 ring-[#C9A04F]/50"
                                                                        : "border-transparent hover:border-[#C9A04F]/50"
                                                                )}
                                                            >
                                                                <video src={vid.url} className="w-full h-full object-cover" muted />
                                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                                                                    <Play className="w-4 h-4 text-white" />
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Floating Chat Input - overflow-visible for dropdowns */}
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full px-3 sm:px-6 z-10 overflow-visible">
                                <StudioChatInput
                                    type="video"
                                    placeholder="Describe your video..."
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
                    </div>
                )}

                {/* AUDIO STUDIO - Tabbed Interface */}
                {studio === "audio" && (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Audio Mode Tabs */}
                        <div className="px-4 sm:px-6 pt-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-3">
                                <button
                                    onClick={() => setAudioMode("tts")}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-h-[44px]",
                                        audioMode === "tts"
                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                    )}
                                >
                                    <Volume2 className="w-4 h-4" />
                                    Text-to-Speech
                                </button>
                                <button
                                    onClick={() => setAudioMode("record")}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-h-[44px]",
                                        audioMode === "record"
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                    )}
                                >
                                    <Mic className="w-4 h-4" />
                                    Live Chat
                                </button>
                                <button
                                    onClick={() => setAudioMode("upload")}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap min-h-[44px]",
                                        audioMode === "upload"
                                            ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg"
                                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                    )}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Music Generator
                                </button>
                            </div>
                        </div>

                        {/* Audio Content - Render based on mode */}
                        <div className="flex-1 min-h-0 overflow-hidden bg-secondary/20 dark:bg-[#0A0A0A]">
                            <AnimatePresence mode="wait">
                                {audioMode === "tts" && (
                                    <motion.div
                                        key="tts"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        <TtsGenerator className="h-full" />
                                    </motion.div>
                                )}
                                {audioMode === "record" && (
                                    <motion.div
                                        key="live"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        <LiveChat className="h-full" />
                                    </motion.div>
                                )}
                                {audioMode === "upload" && (
                                    <motion.div
                                        key="music"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        <MusicGenerator className="h-full" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

                {/* SCRIPT WRITER */}
                {studio === "script" && (
                    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                        {/* Input Panel */}
                        <div className="lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
                            <div className="max-w-xl mx-auto">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A04F] to-[#B8860B] flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Script Writer</h2>
                                        <p className="text-sm text-muted-foreground">AI-powered script generation</p>
                                    </div>
                                </div>

                                {/* Script Type Selection */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-2 block">Tipe Script</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "story", label: "Cerita", icon: "📖" },
                                            { id: "dialogue", label: "Dialog", icon: "💬" },
                                            { id: "narration", label: "Narasi", icon: "🎙️" },
                                            { id: "advertisement", label: "Iklan", icon: "📺" },
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setScriptType(type.id as any)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-left transition-all",
                                                    scriptType === type.id
                                                        ? "border-[#C9A04F] bg-[#C9A04F]/10 text-[#C9A04F]"
                                                        : "border-border hover:border-[#C9A04F]/50"
                                                )}
                                            >
                                                <span className="text-lg">{type.icon}</span>
                                                <span className="text-sm font-medium ml-2">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Script Prompt */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-2 block">Deskripsi Script</label>
                                    <textarea
                                        value={scriptPrompt}
                                        onChange={(e) => setScriptPrompt(e.target.value)}
                                        placeholder="Jelaskan script yang ingin Anda buat... Contoh: Script untuk video promosi wisata Bali dengan nuansa budaya dan alam"
                                        className="w-full h-32 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                                    />
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerateScript}
                                    disabled={isGeneratingScript || !scriptPrompt.trim()}
                                    className={cn(
                                        "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                        isGeneratingScript || !scriptPrompt.trim()
                                            ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white hover:shadow-lg hover:shadow-[#C9A04F]/30"
                                    )}
                                >
                                    {isGeneratingScript ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Membuat Script...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5" />
                                            Generate Script
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Output Panel */}
                        <div className="lg:w-1/2 flex-1 bg-secondary/30 dark:bg-black/50 p-4 sm:p-6 overflow-y-auto">
                            {generatedScript ? (
                                <div className="max-w-xl mx-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-foreground">Generated Script</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedScript);
                                                    toast.success("Script disalin!");
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground hover:bg-[#C9A04F]/10"
                                            >
                                                Copy
                                            </button>
                                            <button className="px-3 py-1.5 rounded-lg bg-[#C9A04F] text-black text-sm font-medium">
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
                                        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                                            {generatedScript}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">Script akan muncul di sini</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* LIVE TOURISM */}
                {studio === "tourism" && (
                    <div className="flex-1 flex flex-col">
                        {/* Camera View */}
                        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                            {/* Live API Status Overlay */}
                            {cameraActive && (
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                                    <div className={cn("w-2 h-2 rounded-full transition-colors",
                                        liveApiTourism.connectionState === 'ready' ? "bg-green-500 animate-pulse" :
                                            liveApiTourism.connectionState === 'connecting' ? "bg-yellow-500" : "bg-red-500"
                                    )} />
                                    <span className="text-white text-xs font-medium">
                                        {liveApiTourism.connectionState === 'ready' ? 'AI Guide Active' : liveApiTourism.connectionState}
                                    </span>
                                </div>
                            )}

                            {cameraActive ? (
                                <video
                                    ref={tourismVideoRef}
                                    autoPlay
                                    playsInline
                                    muted={isMuted}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-24 h-24 rounded-full bg-[#C9A04F]/20 flex items-center justify-center mx-auto mb-6">
                                        <Camera className="w-12 h-12 text-[#C9A04F]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3">Live Tourism</h2>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                        Aktifkan kamera untuk eksplorasi wisata dengan panduan AI realtime
                                    </p>
                                    <button
                                        onClick={startTourismCamera}
                                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A04F] to-[#B8860B] text-white font-semibold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-[#C9A04F]/30 transition-all"
                                    >
                                        <Camera className="w-6 h-6" />
                                        Mulai Eksplorasi
                                    </button>
                                </div>
                            )}

                            {/* Camera Overlay - Status */}
                            {cameraActive && (
                                <>
                                    {/* Top Status Bar */}
                                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-white text-sm font-medium">LIVE</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span>00:00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Response Overlay */}
                                    <AnimatePresence>
                                        {tourismTranscript && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="absolute bottom-24 left-4 right-4 p-4 rounded-xl bg-black/70 backdrop-blur-sm"
                                            >
                                                <p className="text-white text-sm">{tourismTranscript}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>

                        {/* Camera Controls */}
                        {cameraActive && (
                            <div className="p-4 sm:p-6 bg-card border-t border-border">
                                <div className="flex items-center justify-center gap-4">
                                    {/* Mute Button */}
                                    <button
                                        onClick={toggleMute}
                                        className={cn(
                                            "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                                            isMuted
                                                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                    </button>

                                    {/* End Call Button */}
                                    <button
                                        onClick={() => stopTourismCamera(true)}
                                        className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                                    >
                                        <PhoneOff className="w-7 h-7" />
                                    </button>

                                    {/* Switch Camera Button */}
                                    <button
                                        onClick={switchCamera}
                                        className="w-14 h-14 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-all"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-3">
                                    Tanyakan apapun tentang tempat wisata yang Anda lihat
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* COMMERCIAL MAKER */}
                {studio === "commercial" && (
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="max-w-3xl mx-auto">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                    <Tv className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Commercial Maker</h2>
                                    <p className="text-muted-foreground">Buat video iklan profesional dengan AI</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Gambar Produk</label>
                                    <div
                                        onClick={() => commercialFileInputRef.current?.click()}
                                        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-[#C9A04F]/50 transition-all"
                                    >
                                        {commercialImages.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {commercialImages.map((file, i) => (
                                                    <div key={i} className="w-20 h-20 rounded-lg bg-secondary overflow-hidden">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                                <p className="text-muted-foreground text-sm">Klik untuk upload gambar produk (max 5)</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        ref={commercialFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleCommercialImageSelect}
                                    />
                                </div>

                                {/* Brand & Product Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Nama Brand</label>
                                        <input
                                            type="text"
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            placeholder="Contoh: Tokopedia"
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Nama Produk</label>
                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            placeholder="Contoh: Flash Sale"
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                                        />
                                    </div>
                                </div>

                                {/* Tagline */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Tagline/Slogan</label>
                                    <input
                                        type="text"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        placeholder="Contoh: Selalu Ada, Selalu Bisa"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                                    />
                                </div>

                                {/* Target Audience */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Target Audience</label>
                                    <input
                                        type="text"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="Contoh: Milenial, pekerja kantoran, 25-35 tahun"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C9A04F]/50"
                                    />
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">Durasi Video</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: "15", label: "15 detik", desc: "Instagram Stories" },
                                            { id: "30", label: "30 detik", desc: "YouTube Pre-roll" },
                                            { id: "60", label: "60 detik", desc: "TV Commercial" },
                                        ].map((d) => (
                                            <button
                                                key={d.id}
                                                onClick={() => setCommercialDuration(d.id as any)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-center transition-all",
                                                    commercialDuration === d.id
                                                        ? "border-[#C9A04F] bg-[#C9A04F]/10"
                                                        : "border-border hover:border-[#C9A04F]/50"
                                                )}
                                            >
                                                <p className="font-semibold text-foreground">{d.label}</p>
                                                <p className="text-xs text-muted-foreground">{d.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerateCommercial}
                                    disabled={isGeneratingCommercial || !brandName || !productName}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                        isGeneratingCommercial || !brandName || !productName
                                            ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                            : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30"
                                    )}
                                >
                                    {isGeneratingCommercial ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Membuat Video...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Commercial Video
                                        </>
                                    )}
                                </button>

                                {/* Info Card */}
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                    <h4 className="font-medium text-foreground mb-2">💡 Tips untuk hasil terbaik:</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Upload gambar produk dengan kualitas tinggi</li>
                                        <li>• Gunakan tagline yang singkat dan mudah diingat</li>
                                        <li>• Jelaskan target audience dengan spesifik</li>
                                        <li>• Pilih durasi sesuai platform yang dituju</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
                title={confirmDialog.title}
                description={confirmDialog.description}
                confirmText="Hapus"
                cancelText="Batal"
                variant={confirmDialog.variant}
                onConfirm={confirmDialog.onConfirm}
            />
        </AppLayout>
    );
});

export default Creative;
