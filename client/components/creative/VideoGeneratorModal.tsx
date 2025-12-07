import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Video, Play, Download, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { videoStyles, videoAspectRatios } from "@/lib/creativeData";

interface VideoGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Video Generator Modal
 * Purpose: Modal for AI video generation
 */
export const VideoGeneratorModal = memo(function VideoGeneratorModal({
    isOpen,
    onClose,
}: VideoGeneratorModalProps) {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState("16:9");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Masukkan deskripsi video");
            return;
        }

        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        setGeneratedVideo("demo-video-123");
        setIsGenerating(false);

        toast.success("Video berhasil dibuat!");
    };

    const resetModal = () => {
        setSelectedStyle(null);
        setPrompt("");
        setGeneratedVideo(null);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto w-full h-full sm:h-auto sm:rounded-lg rounded-none">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading text-xl">AI Video Creator</DialogTitle>
                            <DialogDescription>Buat video dari teks dengan AI</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!generatedVideo ? (
                    <div className="space-y-6 mt-4">
                        {/* Prompt */}
                        <div>
                            <label className="font-medium mb-2 block">Deskripsikan Video Anda</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Contoh: Video produk dengan animasi smooth, menampilkan smartphone dari berbagai sudut dengan background futuristik..."
                                className="w-full h-32 p-4 rounded-xl bg-muted/30 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Style selection */}
                        <div>
                            <label className="font-medium mb-3 block">Pilih Gaya Visual</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {videoStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={cn(
                                            "p-3 rounded-xl text-center transition-all",
                                            "border hover:border-blue-500",
                                            selectedStyle === style.id
                                                ? "bg-blue-500/20 border-blue-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        <span className="text-2xl block mb-1">{style.thumbnail}</span>
                                        <span className="text-xs">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect ratio */}
                        <div>
                            <label className="font-medium mb-3 block">Aspect Ratio</label>
                            <div className="grid grid-cols-2 sm:flex gap-2">
                                {videoAspectRatios.map((ratio) => (
                                    <button
                                        key={ratio.id}
                                        onClick={() => setSelectedRatio(ratio.id)}
                                        className={cn(
                                            "flex-1 p-3 rounded-xl text-center transition-all",
                                            "border hover:border-blue-500",
                                            selectedRatio === ratio.id
                                                ? "bg-blue-500/20 border-blue-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        <span className="text-xl block mb-1">{ratio.icon}</span>
                                        <span className="text-xs">{ratio.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate button */}
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Video...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Video
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 mt-4">
                        {/* Video preview */}
                        <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                                <Play className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <h3 className="font-heading text-lg mb-1">Video Siap!</h3>
                            <p className="text-sm text-muted-foreground">
                                {videoStyles.find(s => s.id === selectedStyle)?.name || "Custom"} • {selectedRatio}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={resetModal} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Buat Lagi
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
});
