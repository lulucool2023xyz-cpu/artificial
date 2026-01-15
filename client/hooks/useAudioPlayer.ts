'use client';

import { useRef, useState, useCallback } from 'react';

interface UseAudioPlayerReturn {
    isPlaying: boolean;
    queueAudio: (base64Audio: string, mimeType?: string) => void;
    stopPlayback: () => void;
    clearQueue: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioQueueRef = useRef<AudioBuffer[]>([]);
    const isProcessingRef = useRef(false);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        }
        return audioContextRef.current;
    }, []);

    const playNextInQueue = useCallback(async () => {
        if (isProcessingRef.current || audioQueueRef.current.length === 0) {
            if (audioQueueRef.current.length === 0) {
                setIsPlaying(false);
            }
            return;
        }

        isProcessingRef.current = true;
        setIsPlaying(true);

        const buffer = audioQueueRef.current.shift();
        if (!buffer) {
            isProcessingRef.current = false;
            return;
        }

        const ctx = getAudioContext();

        // Resume context if suspended
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        currentSourceRef.current = source;

        source.onended = () => {
            currentSourceRef.current = null;
            isProcessingRef.current = false;
            playNextInQueue();
        };

        source.start(0);
    }, [getAudioContext]);

    const queueAudio = useCallback((base64Audio: string, mimeType: string = 'audio/pcm;rate=24000') => {
        try {
            // Decode base64 to binary
            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Convert to Int16Array (16-bit PCM)
            const int16Array = new Int16Array(bytes.buffer);

            // Convert to Float32Array for Web Audio API
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; i++) {
                float32Array[i] = int16Array[i] / 32768.0;
            }

            // Create audio buffer at 24kHz (output rate from Live API)
            const ctx = getAudioContext();
            const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
            audioBuffer.getChannelData(0).set(float32Array);

            // Add to queue
            audioQueueRef.current.push(audioBuffer);

            // Start playback if not already playing
            if (!isProcessingRef.current) {
                playNextInQueue();
            }
        } catch (error) {
            console.error('Error processing audio:', error);
        }
    }, [getAudioContext, playNextInQueue]);

    const stopPlayback = useCallback(() => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            currentSourceRef.current = null;
        }
        audioQueueRef.current = [];
        isProcessingRef.current = false;
        setIsPlaying(false);
    }, []);

    const clearQueue = useCallback(() => {
        audioQueueRef.current = [];
    }, []);

    return {
        isPlaying,
        queueAudio,
        stopPlayback,
        clearQueue,
    };
}
