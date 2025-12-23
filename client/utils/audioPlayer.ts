/**
 * Audio Player Utility
 * Handles playback of PCM audio data from Live API responses
 */

import { AUDIO_OUTPUT_CONFIG } from '@/lib/live-api.types';

export class AudioPlayer {
    private audioContext: AudioContext | null = null;
    private audioQueue: AudioBuffer[] = [];
    private isPlaying = false;
    private currentSource: AudioBufferSourceNode | null = null;
    private gainNode: GainNode | null = null;
    private onPlayStart?: () => void;
    private onPlayEnd?: () => void;

    constructor(options?: { onPlayStart?: () => void; onPlayEnd?: () => void }) {
        this.onPlayStart = options?.onPlayStart;
        this.onPlayEnd = options?.onPlayEnd;
    }

    /**
     * Initialize the audio context (must be called after user interaction)
     */
    async init(): Promise<void> {
        if (this.audioContext) return;

        try {
            this.audioContext = new AudioContext({
                sampleRate: AUDIO_OUTPUT_CONFIG.sampleRate,
            });

            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);

            // Resume if suspended (needed for iOS/Safari)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            console.log('[AudioPlayer] Initialized');
        } catch (error) {
            console.error('[AudioPlayer] Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * Convert base64 PCM data to AudioBuffer and queue for playback
     */
    async queueAudio(base64Data: string): Promise<void> {
        if (!this.audioContext) {
            console.warn('[AudioPlayer] Not initialized');
            return;
        }

        try {
            // Decode base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Convert PCM bytes to Int16Array
            const int16Array = new Int16Array(bytes.buffer);

            // Create AudioBuffer
            const audioBuffer = this.audioContext.createBuffer(
                AUDIO_OUTPUT_CONFIG.channels,
                int16Array.length,
                AUDIO_OUTPUT_CONFIG.sampleRate
            );

            // Convert Int16 to Float32 (Web Audio API format)
            const channelData = audioBuffer.getChannelData(0);
            for (let i = 0; i < int16Array.length; i++) {
                channelData[i] = int16Array[i] / 32768.0;
            }

            // Add to queue
            this.audioQueue.push(audioBuffer);

            // Start playback if not already playing
            if (!this.isPlaying) {
                this.playNext();
            }
        } catch (error) {
            console.error('[AudioPlayer] Failed to queue audio:', error);
        }
    }

    /**
     * Play the next buffer in queue
     */
    private playNext(): void {
        if (!this.audioContext || !this.gainNode) return;

        if (this.audioQueue.length === 0) {
            this.isPlaying = false;
            this.onPlayEnd?.();
            return;
        }

        this.isPlaying = true;

        if (this.audioQueue.length === 1 && !this.currentSource) {
            this.onPlayStart?.();
        }

        const buffer = this.audioQueue.shift()!;

        this.currentSource = this.audioContext.createBufferSource();
        this.currentSource.buffer = buffer;
        this.currentSource.connect(this.gainNode);

        this.currentSource.onended = () => {
            this.playNext();
        };

        this.currentSource.start(0);
    }

    /**
     * Stop playback and clear queue
     */
    stop(): void {
        if (this.currentSource) {
            try {
                this.currentSource.stop();
                this.currentSource.disconnect();
            } catch (e) {
                // Ignore errors from already stopped sources
            }
            this.currentSource = null;
        }

        this.audioQueue = [];
        this.isPlaying = false;
        this.onPlayEnd?.();
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    setVolume(volume: number): void {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(
                Math.max(0, Math.min(1, volume)),
                this.audioContext?.currentTime || 0
            );
        }
    }

    /**
     * Check if currently playing
     */
    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    /**
     * Cleanup resources
     */
    async dispose(): Promise<void> {
        this.stop();

        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }

        this.gainNode = null;
        console.log('[AudioPlayer] Disposed');
    }
}

export default AudioPlayer;
