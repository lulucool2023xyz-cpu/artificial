/**
 * MusicGenerator Component
 * AI Music Generation UI with configurable parameters
 */

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Music,
    Play,
    Pause,
    Square,
    Loader2,
    Plus,
    X,
    Settings2,
    AlertCircle,
    Download,
    Sliders
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { toast } from 'sonner';

interface MusicGeneratorProps {
    className?: string;
}

const SCALES = [
    { id: 'MAJOR', name: 'Major', description: 'Bright, happy' },
    { id: 'MINOR', name: 'Minor', description: 'Dark, moody' },
    { id: 'PENTATONIC', name: 'Pentatonic', description: 'Universal' },
    { id: 'CHROMATIC', name: 'Chromatic', description: 'Experimental' },
];

const DENSITIES = [
    { id: 'LOW', name: 'Low', description: 'Sparse, minimal' },
    { id: 'MEDIUM', name: 'Medium', description: 'Balanced' },
    { id: 'HIGH', name: 'High', description: 'Dense, complex' },
];

const BRIGHTNESSES = [
    { id: 'LOW', name: 'Low', description: 'Dark, warm' },
    { id: 'MEDIUM', name: 'Medium', description: 'Balanced' },
    { id: 'HIGH', name: 'High', description: 'Bright, airy' },
];

export const MusicGenerator = memo(function MusicGenerator({ className }: MusicGeneratorProps) {
    // Prompts state
    const [prompts, setPrompts] = useState([{ text: '', weight: 1.0 }]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const {
        isLoading,
        isPlaying,
        settings,
        audioUrl,
        error,
        generate,
        playAudio,
        pauseAudio,
        stopAudio,
        updateSettings,
    } = useMusicGeneration({
        onError: (err) => toast.error('Music Generation Error', { description: err }),
        onGenerationComplete: () => toast.success('Music generated!'),
    });

    const handleAddPrompt = useCallback(() => {
        if (prompts.length < 5) {
            setPrompts([...prompts, { text: '', weight: 1.0 }]);
        }
    }, [prompts]);

    const handleRemovePrompt = useCallback((idx: number) => {
        if (prompts.length > 1) {
            setPrompts(prompts.filter((_, i) => i !== idx));
        }
    }, [prompts]);

    const handleUpdatePrompt = useCallback((idx: number, field: 'text' | 'weight', value: string | number) => {
        const newPrompts = [...prompts];
        newPrompts[idx] = { ...newPrompts[idx], [field]: value };
        setPrompts(newPrompts);
    }, [prompts]);

    const handleGenerate = useCallback(async () => {
        const validPrompts = prompts.filter(p => p.text.trim());
        if (validPrompts.length === 0) {
            toast.error('Please enter at least one music description');
            return;
        }
        await generate(validPrompts);
    }, [prompts, generate]);

    const handleDownload = useCallback(() => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `music-${Date.now()}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Music downloaded!');
        }
    }, [audioUrl]);

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Music Generator</h2>
                        <p className="text-sm text-muted-foreground">AI-powered music creation</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Prompts */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Music Description</label>
                        {prompts.length < 5 && (
                            <button
                                onClick={handleAddPrompt}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Add Prompt
                            </button>
                        )}
                    </div>

                    {prompts.map((prompt, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2"
                        >
                            <div className="flex-1 relative">
                                <textarea
                                    value={prompt.text}
                                    onChange={(e) => handleUpdatePrompt(idx, 'text', e.target.value)}
                                    placeholder={idx === 0
                                        ? "Describe the music... e.g., 'Upbeat electronic dance track with synthesizers'"
                                        : "Additional style influence..."
                                    }
                                    className="w-full h-20 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                {prompts.length > 1 && (
                                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={prompt.weight}
                                            onChange={(e) => handleUpdatePrompt(idx, 'weight', parseFloat(e.target.value))}
                                            className="w-16 h-1 accent-primary"
                                            title={`Weight: ${prompt.weight}`}
                                        />
                                        <span className="text-xs text-muted-foreground w-8">{prompt.weight.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                            {prompts.length > 1 && (
                                <button
                                    onClick={() => handleRemovePrompt(idx)}
                                    className="p-2 h-fit rounded-lg bg-secondary hover:bg-red-500/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                    <p className="text-xs text-muted-foreground">
                        {prompts.length > 1 ? 'Adjust weights to control each prompt\'s influence' : 'Add multiple prompts to blend styles'}
                    </p>
                </div>

                {/* Duration Slider */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Duration</label>
                        <span className="text-sm text-muted-foreground">{settings.durationSeconds}s</span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={settings.durationSeconds}
                        onChange={(e) => updateSettings({ durationSeconds: parseInt(e.target.value) })}
                        className="w-full h-2 accent-primary rounded-full appearance-none bg-secondary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5s</span>
                        <span>30s</span>
                    </div>
                </div>

                {/* Advanced Settings Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Sliders className="w-4 h-4" />
                    Advanced Settings
                    <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }}>
                        <Settings2 className="w-3 h-3" />
                    </motion.div>
                </button>

                {/* Advanced Settings */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-5 overflow-hidden"
                        >
                            {/* BPM */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-foreground">BPM (Tempo)</label>
                                    <span className="text-sm text-muted-foreground">{settings.bpm || 'Auto'}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="range"
                                        min="60"
                                        max="200"
                                        step="5"
                                        value={settings.bpm || 120}
                                        onChange={(e) => updateSettings({ bpm: parseInt(e.target.value) })}
                                        className="flex-1 h-2 accent-primary"
                                    />
                                    <button
                                        onClick={() => updateSettings({ bpm: undefined })}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Auto
                                    </button>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-foreground">Creativity</label>
                                    <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={settings.temperature}
                                    onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                                    className="w-full h-2 accent-primary"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Conservative</span>
                                    <span>Creative</span>
                                </div>
                            </div>

                            {/* Scale */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Scale</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {SCALES.map((scale) => (
                                        <button
                                            key={scale.id}
                                            onClick={() => updateSettings({ scale: scale.id as typeof settings.scale })}
                                            className={cn(
                                                "p-3 rounded-xl text-left transition-all",
                                                settings.scale === scale.id
                                                    ? "bg-primary/20 border-2 border-primary"
                                                    : "bg-secondary border-2 border-transparent hover:border-primary/50"
                                            )}
                                        >
                                            <p className="text-sm font-medium text-foreground">{scale.name}</p>
                                            <p className="text-xs text-muted-foreground">{scale.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Density */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Density</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {DENSITIES.map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => updateSettings({ density: d.id as typeof settings.density })}
                                            className={cn(
                                                "p-3 rounded-xl text-center transition-all",
                                                settings.density === d.id
                                                    ? "bg-primary/20 border-2 border-primary"
                                                    : "bg-secondary border-2 border-transparent hover:border-primary/50"
                                            )}
                                        >
                                            <p className="text-sm font-medium text-foreground">{d.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brightness */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Brightness</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {BRIGHTNESSES.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => updateSettings({ brightness: b.id as typeof settings.brightness })}
                                            className={cn(
                                                "p-3 rounded-xl text-center transition-all",
                                                settings.brightness === b.id
                                                    ? "bg-primary/20 border-2 border-primary"
                                                    : "bg-secondary border-2 border-transparent hover:border-primary/50"
                                            )}
                                        >
                                            <p className="text-sm font-medium text-foreground">{b.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-500">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Audio Player */}
                <AnimatePresence>
                    {audioUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/10 border border-pink-500/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={isPlaying ? pauseAudio : playAudio}
                                        className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                    </button>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Generated Music</p>
                                        <p className="text-xs text-muted-foreground">{settings.durationSeconds}s • {settings.bpm || 'Auto'} BPM</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={stopAudio}
                                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                                        title="Stop"
                                    >
                                        <Square className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Generate Button */}
            <div className="p-4 sm:p-6 border-t border-border">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompts.some(p => p.text.trim())}
                    className={cn(
                        "w-full py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2",
                        isLoading || !prompts.some(p => p.text.trim())
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:opacity-90 active:scale-[0.98]"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Music...
                        </>
                    ) : (
                        <>
                            <Music className="w-5 h-5" />
                            Generate Music
                        </>
                    )}
                </button>
                {isLoading && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Music generation may take 30-60 seconds
                    </p>
                )}
            </div>
        </div>
    );
});

export default MusicGenerator;
