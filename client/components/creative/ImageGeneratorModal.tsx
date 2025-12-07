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
import { Slider } from "@/components/ui/slider";
import { Loader2, Palette, Download, RefreshCw, Sparkles, ZoomIn, Trash } from "lucide-react";
import { toast } from "sonner";
import { imageStyles, imageAspectRatios } from "@/lib/creativeData";

interface ImageGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Image Generator Modal
 * Purpose: Modal for AI image generation
 */
export const ImageGeneratorModal = memo(function ImageGeneratorModal({
    isOpen,
    onClose,
}: ImageGeneratorModalProps) {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState("1:1");
    const [prompt, setPrompt] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [creativity, setCreativity] = useState([50]);
    const [numImages, setNumImages] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const sampleImages = [
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    ];

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Masukkan deskripsi gambar");
            return;
        }

        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setGeneratedImages(sampleImages.slice(0, numImages));
        setIsGenerating(false);

        toast.success(`${numImages} gambar berhasil dibuat!`);
    };

    const resetModal = () => {
        setSelectedStyle(null);
        setPrompt("");
        setNegativePrompt("");
        setGeneratedImages([]);
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading text-xl">AI Art Studio</DialogTitle>
                            <DialogDescription>Ciptakan gambar dengan AI</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Left: Controls */}
                    <div className="space-y-5">
                        {/* Prompt */}
                        <div>
                            <label className="font-medium mb-2 block">Deskripsikan Gambar</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Contoh: A majestic dragon flying over an ancient temple at sunset, digital art style..."
                                className="w-full h-24 p-3 rounded-xl bg-muted/30 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                        </div>

                        {/* Negative prompt */}
                        <div>
                            <label className="font-medium mb-2 block text-sm">Negative Prompt (Opsional)</label>
                            <input
                                type="text"
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="Apa yang tidak ingin muncul..."
                                className="w-full p-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                        </div>

                        {/* Style */}
                        <div>
                            <label className="font-medium mb-2 block">Gaya</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {imageStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={cn(
                                            "p-2 rounded-lg text-center transition-all text-xs",
                                            "border hover:border-amber-500",
                                            selectedStyle === style.id
                                                ? "bg-amber-500/20 border-amber-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        <span className="text-lg block">{style.thumbnail}</span>
                                        <span className="truncate block">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect ratio */}
                        <div>
                            <label className="font-medium mb-2 block">Aspect Ratio</label>
                            <div className="grid grid-cols-2 sm:flex gap-2">
                                {imageAspectRatios.slice(0, 4).map((ratio) => (
                                    <button
                                        key={ratio.id}
                                        onClick={() => setSelectedRatio(ratio.id)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-center transition-all text-xs",
                                            "border hover:border-amber-500",
                                            selectedRatio === ratio.id
                                                ? "bg-amber-500/20 border-amber-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        {ratio.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Creativity slider */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm">Kreativitas</span>
                                <span className="text-muted-foreground text-sm">{creativity[0]}%</span>
                            </div>
                            <Slider value={creativity} onValueChange={setCreativity} min={0} max={100} />
                        </div>

                        {/* Number of images */}
                        <div>
                            <label className="font-medium mb-2 block">Jumlah Gambar</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setNumImages(num)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-center transition-all",
                                            "border hover:border-amber-500",
                                            numImages === num
                                                ? "bg-amber-500/20 border-amber-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate button */}
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-amber-500 to-red-500"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate {numImages} Gambar
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Right: Preview */}
                    <div className="space-y-4">
                        <h3 className="font-medium">Hasil</h3>

                        {generatedImages.length === 0 ? (
                            <div className="aspect-square rounded-2xl bg-muted/20 border border-dashed border-border flex items-center justify-center">
                                <p className="text-muted-foreground text-sm text-center px-4">
                                    Gambar akan muncul di sini setelah generate
                                </p>
                            </div>
                        ) : (
                            <div className={cn(
                                "grid gap-3",
                                generatedImages.length === 1 ? "grid-cols-1" : "grid-cols-2"
                            )}>
                                {generatedImages.map((img, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden">
                                        <img
                                            src={img}
                                            alt={`Generated ${idx + 1}`}
                                            className="w-full aspect-square object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="icon" variant="secondary" className="rounded-full">
                                                <ZoomIn className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="secondary" className="rounded-full">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {generatedImages.length > 0 && (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={resetModal} className="flex-1">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Buat Lagi
                                </Button>
                                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-red-500">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Semua
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
