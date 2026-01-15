'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseMediaStreamOptions {
    video?: boolean;
    audio?: boolean;
}

interface UseMediaStreamReturn {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    stream: MediaStream | null;
    isCapturing: boolean;
    error: string | null;
    startCapture: () => Promise<void>;
    stopCapture: () => void;
    captureVideoFrame: () => string | null;
    startAudioCapture: (onAudioData: (base64Data: string) => void) => void;
    stopAudioCapture: () => void;
}

export function useMediaStream(options: UseMediaStreamOptions = { video: true, audio: true }): UseMediaStreamReturn {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Audio capture refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const startCapture = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: options.video ? {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                } : false,
                audio: options.audio ? {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true
                } : false,
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsCapturing(true);
            setError(null);
        } catch (err) {
            console.error('Error accessing media devices:', err);
            setError('Could not access camera/microphone');
        }
    }, [options.video, options.audio]);

    const stopCapture = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCapturing(false);
    }, [stream]);

    const captureVideoFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get base64 data (remove prefix)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        return dataUrl.split(',')[1];
    }, []);

    const startAudioCapture = useCallback((onAudioData: (base64Data: string) => void) => {
        if (!stream) return;

        try {
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

            // Buffer size 4096 = ~256ms at 16kHz
            processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // Convert Float32 to Int16
                const int16Array = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    const s = Math.max(-1, Math.min(1, inputData[i]));
                    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                // Convert to base64
                // Efficient conversion using FileReader is async, using simple approach here for now
                let binary = '';
                const bytes = new Uint8Array(int16Array.buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);

                onAudioData(base64);
            };

            sourceRef.current.connect(processorRef.current);
            // Mute output to prevent feedback (only connect via gain node)
            const gainNode = audioContextRef.current.createGain();
            gainNode.gain.value = 0;
            processorRef.current.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            // NOTE: We REMOVED the direct connection `processorRef.current.connect(audioContextRef.current.destination)`
            // which was causing the user to hear their own voice (echo/callback).
            // The ScriptProcessorNode still runs as long as it's connected to destination (even with 0 gain).

        } catch (e) {
            console.error('Error starting audio capture:', e);
        }
    }, [stream]);

    const stopAudioCapture = useCallback(() => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            stopCapture();
            stopAudioCapture();
        };
    }, []);

    return {
        videoRef,
        canvasRef,
        stream,
        isCapturing,
        error,
        startCapture,
        stopCapture,
        captureVideoFrame,
        startAudioCapture,
        stopAudioCapture
    };
}
