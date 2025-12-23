/**
 * useTts Hook
 * React hook for Text-to-Speech functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ttsApi, TtsVoice, TtsResponse } from '@/lib/api';

export interface UseTtsOptions {
    voiceName?: string;
    onSynthesisStart?: () => void;
    onSynthesisComplete?: (response: TtsResponse) => void;
    onError?: (error: string) => void;
}

export interface UseTtsReturn {
    // State
    isLoading: boolean;
    isPlaying: boolean;
    voices: TtsVoice[];
    currentVoice: string;
    audioUrl: string | null;
    error: string | null;

    // Actions
    synthesize: (text: string) => Promise<void>;
    synthesizeMulti: (text: string, speakerConfigs: Array<{ speaker: string; voiceName: string }>) => Promise<void>;
    playAudio: () => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    setVoice: (voiceName: string) => void;
    loadVoices: () => Promise<void>;
}

export function useTts(options: UseTtsOptions = {}): UseTtsReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<TtsVoice[]>([]);
    const [currentVoice, setCurrentVoice] = useState(options.voiceName || 'Kore');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load available voices on mount
    useEffect(() => {
        loadVoices();
    }, []);

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
     * Load available TTS voices
     */
    const loadVoices = useCallback(async () => {
        try {
            const response = await ttsApi.getVoices();
            setVoices(response.voices || []);
        } catch (err) {
            console.error('[useTts] Failed to load voices:', err);
            // Provide default voices if API fails
            setVoices([
                { name: 'Kore', displayName: 'Kore' },
                { name: 'Aoede', displayName: 'Aoede' },
                { name: 'Charon', displayName: 'Charon' },
                { name: 'Fenrir', displayName: 'Fenrir' },
                { name: 'Puck', displayName: 'Puck' },
            ]);
        }
    }, []);

    /**
     * Synthesize speech from text (single voice)
     */
    const synthesize = useCallback(async (text: string) => {
        if (!text.trim()) {
            setError('Text is required');
            return;
        }

        setIsLoading(true);
        setError(null);
        options.onSynthesisStart?.();

        try {
            const response = await ttsApi.synthesizeSingle({
                text,
                voiceName: currentVoice,
            });

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.audioUrl) {
                // Cleanup previous URL
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }

                setAudioUrl(response.audioUrl);

                // Create new audio element
                audioRef.current = new Audio(response.audioUrl);

                options.onSynthesisComplete?.(response);
            } else {
                throw new Error('No audio URL in response');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Synthesis failed';
            setError(errorMessage);
            options.onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [currentVoice, audioUrl, options]);

    /**
     * Synthesize speech from text (multi-speaker)
     */
    const synthesizeMulti = useCallback(async (
        text: string,
        speakerConfigs: Array<{ speaker: string; voiceName: string }>
    ) => {
        if (!text.trim()) {
            setError('Text is required');
            return;
        }

        if (speakerConfigs.length === 0) {
            setError('Speaker configurations are required');
            return;
        }

        setIsLoading(true);
        setError(null);
        options.onSynthesisStart?.();

        try {
            const response = await ttsApi.synthesizeMulti({
                text,
                speakerConfigs,
            });

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.audioUrl) {
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }

                setAudioUrl(response.audioUrl);
                audioRef.current = new Audio(response.audioUrl);

                options.onSynthesisComplete?.(response);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Multi-speaker synthesis failed';
            setError(errorMessage);
            options.onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [audioUrl, options]);

    /**
     * Play audio
     */
    const playAudio = useCallback(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.play().catch((err) => {
                console.error('[useTts] Play failed:', err);
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
     * Set voice
     */
    const setVoice = useCallback((voiceName: string) => {
        setCurrentVoice(voiceName);
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
        voices,
        currentVoice,
        audioUrl,
        error,
        synthesize,
        synthesizeMulti,
        playAudio,
        pauseAudio,
        stopAudio,
        setVoice,
        loadVoices,
    };
}

export default useTts;
