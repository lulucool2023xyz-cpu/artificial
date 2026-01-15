import { memo, useState, useMemo } from "react";
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
import { Loader2, Mic, Play, Download, RefreshCw, Sparkles, Pause, User } from "lucide-react";
import { toast } from "sonner";
import { ttsVoices, ttsEmotions } from "@/lib/creativeData";

interface TTSModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Text-to-Speech Modal
 * Purpose: Modal for AI voice generation
 */
export const TTSModal = memo(function TTSModal({
    isOpen,
    onClose,
}: TTSModalProps) {
    const [text, setText] = useState("");
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState("neutral");
    const [speed, setSpeed] = useState([100]); // percent
    const [pitch, setPitch] = useState([100]); // percent
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Memoize waveform bars to prevent recreation on every render
    const waveformBars = useMemo(() => {
        return Array.from({ length: 50 }, (_, i) => ({
            id: i,
            height: 10 + Math.random() * 20
        }));
    }, []);

    const handleGenerate = async () => {
        if (!text.trim()) {
            toast.error("Masukkan teks untuk diubah menjadi suara");
            return;
        }
        if (!selectedVoice) {
            toast.error("Pilih suara terlebih dahulu");
            return;
        }

        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        setGeneratedAudio("demo-audio-123");
        setIsGenerating(false);

        toast.success("Audio berhasil dibuat!");
    };

    const resetModal = () => {
        setText("");
        setSelectedVoice(null);
        setSelectedEmotion("neutral");
        setSpeed([100]);
        setPitch([100]);
        setGeneratedAudio(null);
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading text-xl">AI Voice Studio</DialogTitle>
                            <DialogDescription>Ubah teks menjadi suara natural</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    {/* Left: Input */}
                    <div className="space-y-5">
                        {/* Text input */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="font-medium">Masukkan Teks</label>
                                <span className="text-xs text-muted-foreground">{text.length}/1000</span>
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value.slice(0, 1000))}
                                placeholder="Ketik atau tempel teks yang ingin diubah menjadi suara..."
                                className="w-full h-32 p-3 rounded-xl bg-muted/30 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            />
                        </div>

                        {/* Emotion */}
                        <div>
                            <label className="font-medium mb-2 block">Emosi</label>
                            <div className="flex flex-wrap gap-2">
                                {ttsEmotions.map((emotion) => (
                                    <button
                                        key={emotion.id}
                                        onClick={() => setSelectedEmotion(emotion.id)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-sm transition-all",
                                            "border hover:border-orange-500",
                                            selectedEmotion === emotion.id
                                                ? "bg-orange-500/20 border-orange-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        {emotion.icon} {emotion.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Speed */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm">Kecepatan</span>
                                <span className="text-muted-foreground text-sm">{speed[0]}%</span>
                            </div>
                            <Slider value={speed} onValueChange={setSpeed} min={50} max={200} />
                        </div>

                        {/* Pitch */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm">Pitch</span>
                                <span className="text-muted-foreground text-sm">{pitch[0]}%</span>
                            </div>
                            <Slider value={pitch} onValueChange={setPitch} min={50} max={150} />
                        </div>
                    </div>

                    {/* Right: Voice selection & result */}
                    <div className="space-y-5">
                        {/* Voice selection */}
                        <div>
                            <label className="font-medium mb-2 block">Pilih Suara</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {ttsVoices.map((voice) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => setSelectedVoice(voice.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                            "border hover:border-orange-500",
                                            selectedVoice === voice.id
                                                ? "bg-orange-500/20 border-orange-500"
                                                : "bg-muted/30 border-border"
                                        )}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{voice.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {voice.accent} • {voice.description}
                                            </p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate button */}
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Suara
                                </>
                            )}
                        </Button>

                        {/* Result */}
                        {generatedAudio && (
                            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-medium">Audio Siap</span>
                                    <span className="text-xs text-muted-foreground">
                                        {ttsVoices.find(v => v.id === selectedVoice)?.name}
                                    </span>
                                </div>

                                {/* Waveform placeholder */}
                                <div className="h-12 bg-muted/30 rounded-lg flex items-center justify-center gap-0.5 mb-3">
                                    {waveformBars.map((bar) => (
                                        <div
                                            key={bar.id}
                                            className="w-1 bg-orange-500 rounded-full"
                                            style={{ height: `${bar.height}px` }}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                        {isPlaying ? "Pause" : "Play"}
                                    </Button>
                                    <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )}

                        {generatedAudio && (
                            <Button variant="outline" onClick={resetModal} className="w-full">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Buat Lagi
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
