import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Clapperboard, Play, Download, RefreshCw, Sparkles, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { animationStyles } from "@/lib/creativeData";

interface ImageToVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Image-to-Video Modal
 * Purpose: Modal for animating images into video
 */
export const ImageToVideoModal = memo(function ImageToVideoModal({
    isOpen,
    onClose,
}: ImageToVideoModalProps) {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [duration, setDuration] = useState([5]); // seconds per image
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

    const sampleImages = [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&h=200&fit=crop",
    ];

    const handleAddSampleImages = () => {
        setUploadedImages(sampleImages);
        toast.success("Sample images ditambahkan");
    };

    const handleRemoveImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        if (uploadedImages.length === 0) {
            toast.error("Upload minimal 1 gambar");
            return;
        }
        if (!selectedStyle) {
            toast.error("Pilih gaya animasi");
            return;
        }

        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 3500));
        setGeneratedVideo("demo-video-animation-123");
        setIsGenerating(false);

        toast.success("Video animasi berhasil dibuat!");
    };

    const resetModal = () => {
        setUploadedImages([]);
        setSelectedStyle(null);
        setDuration([5]);
        setGeneratedVideo(null);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-3xl max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto w-full h-full sm:h-auto sm:rounded-lg rounded-none">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Clapperboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading text-xl">Image Animation Studio</DialogTitle>
                            <DialogDescription>Hidupkan foto menjadi video sinematik</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!generatedVideo ? (
                    <div className="space-y-6 mt-4">
                        {/* Image upload area */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="font-medium">Upload Gambar</label>
                                <Button variant="ghost" size="sm" onClick={handleAddSampleImages}>
                                    Gunakan Sample
                                </Button>
                            </div>

                            {uploadedImages.length === 0 ? (
                                <div
                                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                                    onClick={handleAddSampleImages}
                                >
                                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                    <p className="text-muted-foreground mb-1">Drag & drop gambar atau klik untuk upload</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP (Max 10MB)</p>
                                </div>
                            ) : (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {uploadedImages.map((img, idx) => (
                                        <div key={idx} className="relative shrink-0 group">
                                            <img
                                                src={img}
                                                alt={`Uploaded ${idx + 1}`}
                                                className="w-32 h-24 rounded-lg object-cover"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            <div className="absolute bottom-1 left-1 bg-black/60 rounded px-1.5 py-0.5 text-xs text-white">
                                                {idx + 1}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleAddSampleImages}
                                        className="w-32 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-purple-500 transition-colors shrink-0"
                                    >
                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Animation style */}
                        <div>
                            <label className="font-medium mb-3 block">Gaya Animasi</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {animationStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={cn(
                                            "p-4 rounded-xl text-left transition-all",
                                            "border hover:border-purple-500",
                                            selectedStyle === style.id
                                                ? "bg-purple-500/20 border-purple-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        <span className="text-2xl block mb-2">{style.icon}</span>
                                        <p className="font-medium text-sm">{style.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {style.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration per image */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Durasi per Gambar</span>
                                <span className="text-muted-foreground">{duration[0]} detik</span>
                            </div>
                            <Slider value={duration} onValueChange={setDuration} min={2} max={10} step={1} />
                        </div>

                        {/* Info */}
                        <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                            <p>
                                Total durasi video: <strong>{uploadedImages.length * duration[0]} detik</strong>
                                ({uploadedImages.length} gambar × {duration[0]}s)
                            </p>
                        </div>

                        {/* Generate button */}
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || uploadedImages.length === 0}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
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
                        <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Button size="lg" className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                                <Play className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="text-center">
                            <h3 className="font-heading text-lg mb-1">Video Animasi Siap!</h3>
                            <p className="text-sm text-muted-foreground">
                                {animationStyles.find(s => s.id === selectedStyle)?.name} •
                                {uploadedImages.length} gambar • {uploadedImages.length * duration[0]}s
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={resetModal} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Buat Lagi
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500">
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
