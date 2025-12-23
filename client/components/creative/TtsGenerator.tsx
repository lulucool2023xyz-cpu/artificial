/**
 * TtsGenerator Component
 * Text-to-Speech UI with voice selection and audio playback
 */

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2,
    Play,
    Pause,
    Square,
    Loader2,
    ChevronDown,
    Mic,
    Users,
    AlertCircle,
    Download,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTts } from '@/hooks/useTts';
import { toast } from 'sonner';

interface TtsGeneratorProps {
    className?: string;
}

// Available TTS voices from API documentation
const TTS_VOICES = [
    { id: 'Kore', name: 'Kore', description: 'Firm, professional voice' },
    { id: 'Aoede', name: 'Aoede', description: 'Warm, melodic voice' },
    { id: 'Charon', name: 'Charon', description: 'Deep, authoritative voice' },
    { id: 'Fenrir', name: 'Fenrir', description: 'Strong, confident voice' },
    { id: 'Puck', name: 'Puck', description: 'Playful, energetic voice' },
    { id: 'Orbit', name: 'Orbit', description: 'Calm, spacey voice' },
    { id: 'Zephyr', name: 'Zephyr', description: 'Light, airy voice' },
    { id: 'Leda', name: 'Leda', description: 'Elegant, refined voice' },
];

export const TtsGenerator = memo(function TtsGenerator({ className }: TtsGeneratorProps) {
    const [text, setText] = useState('');
    const [mode, setMode] = useState<'single' | 'multi'>('single');
    const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);

    // Multi-speaker state
    const [speakerConfigs, setSpeakerConfigs] = useState([
        { speaker: 'Speaker 1', voiceName: 'Kore' },
        { speaker: 'Speaker 2', voiceName: 'Aoede' },
    ]);

    const {
        isLoading,
        isPlaying,
        currentVoice,
        audioUrl,
        error,
        synthesize,
        synthesizeMulti,
        playAudio,
        pauseAudio,
        stopAudio,
        setVoice,
    } = useTts({
        onError: (err) => toast.error('TTS Error', { description: err }),
        onSynthesisComplete: () => toast.success('Audio generated!'),
    });

    const handleGenerate = useCallback(async () => {
        if (!text.trim()) {
            toast.error('Please enter text to synthesize');
            return;
        }

        if (mode === 'single') {
            await synthesize(text);
        } else {
            await synthesizeMulti(text, speakerConfigs);
        }
    }, [text, mode, synthesize, synthesizeMulti, speakerConfigs]);

    const handleDownload = useCallback(() => {
        if (audioUrl) {
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = `tts-audio-${Date.now()}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Audio downloaded!');
        }
    }, [audioUrl]);

    const currentVoiceData = TTS_VOICES.find(v => v.id === currentVoice) || TTS_VOICES[0];

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Text-to-Speech</h2>
                        <p className="text-sm text-muted-foreground">Convert text to natural speech</p>
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('single')}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                            mode === 'single'
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                    >
                        <Mic className="w-4 h-4" />
                        Single Voice
                    </button>
                    <button
                        onClick={() => setMode('multi')}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                            mode === 'multi'
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                    >
                        <Users className="w-4 h-4" />
                        Multi-Speaker
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Voice Selection (Single mode) */}
                {mode === 'single' && (
                    <div className="relative">
                        <label className="text-sm font-medium text-foreground mb-2 block">Voice</label>
                        <button
                            onClick={() => setShowVoiceDropdown(!showVoiceDropdown)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Mic className="w-4 h-4 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-foreground">{currentVoiceData.name}</p>
                                    <p className="text-xs text-muted-foreground">{currentVoiceData.description}</p>
                                </div>
                            </div>
                            <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showVoiceDropdown && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {showVoiceDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                                >
                                    <div className="max-h-64 overflow-y-auto p-2">
                                        {TTS_VOICES.map((voice) => (
                                            <button
                                                key={voice.id}
                                                onClick={() => {
                                                    setVoice(voice.id);
                                                    setShowVoiceDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left",
                                                    currentVoice === voice.id
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-secondary text-foreground"
                                                )}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <Mic className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{voice.name}</p>
                                                    <p className="text-xs text-muted-foreground">{voice.description}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Multi-Speaker Config */}
                {mode === 'multi' && (
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground block">Speaker Voices</label>
                        {speakerConfigs.map((config, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={config.speaker}
                                    onChange={(e) => {
                                        const newConfigs = [...speakerConfigs];
                                        newConfigs[idx].speaker = e.target.value;
                                        setSpeakerConfigs(newConfigs);
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Speaker name"
                                />
                                <select
                                    value={config.voiceName}
                                    onChange={(e) => {
                                        const newConfigs = [...speakerConfigs];
                                        newConfigs[idx].voiceName = e.target.value;
                                        setSpeakerConfigs(newConfigs);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {TTS_VOICES.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button
                            onClick={() => setSpeakerConfigs([...speakerConfigs, { speaker: `Speaker ${speakerConfigs.length + 1}`, voiceName: 'Kore' }])}
                            className="text-sm text-primary hover:underline"
                        >
                            + Add Speaker
                        </button>
                        <p className="text-xs text-muted-foreground">Use [Speaker Name]: before dialogue in your text</p>
                    </div>
                )}

                {/* Text Input */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Text to Speak</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={mode === 'multi'
                            ? "[Speaker 1]: Hello!\n[Speaker 2]: Hi there!"
                            : "Enter the text you want to convert to speech..."
                        }
                        className="w-full h-40 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {text.length} characters
                    </p>
                </div>

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
                            className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={isPlaying ? pauseAudio : playAudio}
                                        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                    </button>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Generated Audio</p>
                                        <p className="text-xs text-muted-foreground">Voice: {currentVoice}</p>
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
                    disabled={isLoading || !text.trim()}
                    className={cn(
                        "w-full py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2",
                        isLoading || !text.trim()
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 active:scale-[0.98]"
                    )}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Volume2 className="w-5 h-5" />
                            Generate Speech
                        </>
                    )}
                </button>
            </div>
        </div>
    );
});

export default TtsGenerator;
