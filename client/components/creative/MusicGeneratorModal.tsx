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
import { Slider } from "@/components/ui/slider";
import { Loader2, Music, Play, Download, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { musicGenres, musicInstruments, musicMoods } from "@/lib/creativeData";

interface MusicGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Music Generator Modal
 * Purpose: Full modal for AI music generation
 */
export const MusicGeneratorModal = memo(function MusicGeneratorModal({
    isOpen,
    onClose,
}: MusicGeneratorModalProps) {
    const [step, setStep] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [duration, setDuration] = useState([60]); // seconds
    const [bpm, setBpm] = useState([120]);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedTrack, setGeneratedTrack] = useState<string | null>(null);

    const toggleInstrument = (id: string) => {
        setSelectedInstruments((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStep(4);

        // Simulate generation
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setGeneratedTrack("demo-track-123");
        setIsGenerating(false);
        setStep(5);

        toast.success("Musik berhasil dibuat!", {
            description: "Track Anda siap didengarkan",
        });
    };

    const resetModal = () => {
        setStep(1);
        setSelectedGenre(null);
        setSelectedInstruments([]);
        setSelectedMood(null);
        setDuration([60]);
        setBpm([120]);
        setPrompt("");
        setGeneratedTrack(null);
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading text-xl">AI Music Studio</DialogTitle>
                            <DialogDescription>Buat musik original dengan AI</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Progress indicator */}
                <div className="flex gap-2 my-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "flex-1 h-1.5 rounded-full transition-colors",
                                step >= s ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-muted"
                            )}
                        />
                    ))}
                </div>

                {/* Step 1: Select Genre */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-medium">Pilih Genre Musik</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {musicGenres.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => setSelectedGenre(genre.id)}
                                    className={cn(
                                        "p-3 rounded-xl text-center transition-all",
                                        "border hover:border-purple-500",
                                        selectedGenre === genre.id
                                            ? "bg-purple-500/20 border-purple-500"
                                            : "bg-muted/30 border-border"
                                    )}
                                >
                                    <span className="text-2xl block mb-1">{genre.icon}</span>
                                    <span className="text-xs">{genre.name}</span>
                                </button>
                            ))}
                        </div>
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!selectedGenre}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                            Lanjutkan
                        </Button>
                    </div>
                )}

                {/* Step 2: Describe Music */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-medium">Jelaskan Musik yang Anda Inginkan</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Contoh: Musik yang energetik untuk video motivasi dengan nuansa elektronik..."
                            className="w-full h-32 p-4 rounded-xl bg-muted/30 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex flex-wrap gap-2">
                            {["Upbeat summer vibes", "Dramatic movie score", "Relaxing cafe ambiance"].map((suggestion) => (
                                <Badge
                                    key={suggestion}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-purple-500/20"
                                    onClick={() => setPrompt(suggestion)}
                                >
                                    {suggestion}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Kembali
                            </Button>
                            <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                                Lanjutkan
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Advanced Settings */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-3">Pilih Instrumen</h3>
                            <div className="flex flex-wrap gap-2">
                                {musicInstruments.map((inst) => (
                                    <button
                                        key={inst.id}
                                        onClick={() => toggleInstrument(inst.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm transition-all",
                                            selectedInstruments.includes(inst.id)
                                                ? "bg-purple-500 text-white"
                                                : "bg-muted/30 hover:bg-muted/50"
                                        )}
                                    >
                                        {inst.icon} {inst.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-3">Mood</h3>
                            <div className="flex flex-wrap gap-2">
                                {musicMoods.map((mood) => (
                                    <button
                                        key={mood.id}
                                        onClick={() => setSelectedMood(mood.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm transition-all",
                                            selectedMood === mood.id
                                                ? "text-white"
                                                : "bg-muted/30 hover:bg-muted/50"
                                        )}
                                        style={selectedMood === mood.id ? { backgroundColor: mood.color } : {}}
                                    >
                                        {mood.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Durasi</span>
                                <span className="text-muted-foreground">{Math.floor(duration[0] / 60)}:{(duration[0] % 60).toString().padStart(2, "0")}</span>
                            </div>
                            <Slider value={duration} onValueChange={setDuration} min={15} max={300} step={15} />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">BPM</span>
                                <span className="text-muted-foreground">{bpm[0]}</span>
                            </div>
                            <Slider value={bpm} onValueChange={setBpm} min={60} max={180} step={5} />
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                Kembali
                            </Button>
                            <Button onClick={handleGenerate} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Musik
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Generating */}
                {step === 4 && isGenerating && (
                    <div className="py-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                            <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                        <h3 className="font-heading text-xl mb-2">Membuat Musik...</h3>
                        <p className="text-muted-foreground mb-4">Composing melody... Adding harmony...</p>
                        <div className="h-2 bg-muted rounded-full max-w-xs mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                )}

                {/* Step 5: Result */}
                {step === 5 && generatedTrack && (
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-heading text-lg">{prompt || "Generated Track"}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {musicGenres.find(g => g.id === selectedGenre)?.name} • {Math.floor(duration[0] / 60)}:{(duration[0] % 60).toString().padStart(2, "0")} • {bpm[0]} BPM
                                    </p>
                                </div>
                                <Button size="icon" className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                    <Play className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Waveform placeholder */}
                            <div className="h-16 bg-muted/30 rounded-lg flex items-center justify-center gap-1">
                                {[...Array(40)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-purple-500 rounded-full"
                                        style={{ height: `${20 + Math.random() * 30}px` }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={resetModal} className="flex-1">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Buat Lagi
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
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
