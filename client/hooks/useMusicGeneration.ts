/**
 * useMusicGeneration Hook
 * React hook for AI Music Generation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { musicApi, MusicPrompt, MusicRequest, MusicResponse } from '@/lib/api';

export interface UseMusicGenerationOptions {
    onGenerationStart?: () => void;
    onGenerationComplete?: (response: MusicResponse) => void;
    onError?: (error: string) => void;
}

export interface MusicSettings {
    durationSeconds: number;
    bpm?: number;
    temperature: number;
    scale?: 'MAJOR' | 'MINOR' | 'PENTATONIC' | 'CHROMATIC';
    density?: 'LOW' | 'MEDIUM' | 'HIGH';
    brightness?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UseMusicGenerationReturn {
    // State
    isLoading: boolean;
    isPlaying: boolean;
    settings: MusicSettings;
    audioUrl: string | null;
    error: string | null;

    // Actions
    generate: (prompts: MusicPrompt[]) => Promise<void>;
    playAudio: () => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    updateSettings: (newSettings: Partial<MusicSettings>) => void;
}

const DEFAULT_SETTINGS: MusicSettings = {
    durationSeconds: 15,
    temperature: 1.0,
    bpm: undefined,
    scale: undefined,
    density: undefined,
    brightness: undefined,
};

export function useMusicGeneration(options: UseMusicGenerationOptions = {}): UseMusicGenerationReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [settings, setSettings] = useState<MusicSettings>(DEFAULT_SETTINGS);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Setup audio element events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);
        const handleError = () => {
            setIsPlaying(false);
            setError('Audio playback error');
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, [audioUrl]);

    /**
     * Generate music from prompts
     */
    const generate = useCallback(async (prompts: MusicPrompt[]) => {
        if (prompts.length === 0 || !prompts[0].text.trim()) {
            setError('At least one prompt is required');
            return;
        }

        setIsLoading(true);
        setError(null);
        options.onGenerationStart?.();

        try {
            const request: MusicRequest = {
                prompts: prompts.map(p => ({
                    text: p.text,
                    weight: p.weight ?? 1.0,
                })),
                durationSeconds: settings.durationSeconds,
                bpm: settings.bpm,
                temperature: settings.temperature,
                scale: settings.scale,
                density: settings.density,
                brightness: settings.brightness,
            };

            const response = await musicApi.generate(request);

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.audioUrl) {
                // Cleanup previous URL
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }

                setAudioUrl(response.audioUrl);
                audioRef.current = new Audio(response.audioUrl);

                options.onGenerationComplete?.(response);
            } else {
                throw new Error('No audio URL in response');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Music generation failed';
            setError(errorMessage);
            options.onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [settings, audioUrl, options]);

    /**
     * Play audio
     */
    const playAudio = useCallback(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.play().catch((err) => {
                console.error('[useMusicGeneration] Play failed:', err);
                setError('Failed to play audio');
            });
        }
    }, [audioUrl]);

    /**
     * Pause audio
     */
    const pauseAudio = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    /**
     * Stop audio
     */
    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    }, []);

    /**
     * Update settings
     */
    const updateSettings = useCallback((newSettings: Partial<MusicSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, []);

    return {
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
    };
}

export default useMusicGeneration;
