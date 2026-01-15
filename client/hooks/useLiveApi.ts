'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface UseLiveAPIOptions {
    wsUrl?: string;
    onAudioResponse?: (audioData: string, mimeType: string) => void;
    onTextResponse?: (text: string) => void;
    onInputTranscription?: (text: string) => void;
    onOutputTranscription?: (text: string) => void;
    onTurnComplete?: () => void;
    onInterrupted?: () => void;
    onError?: (error: string) => void;
    onSessionStarted?: () => void;
    onSessionClosed?: () => void;
}

interface UseLiveAPIReturn {
    isConnected: boolean;
    isSessionActive: boolean;
    clientId: string | null;
    connect: () => void;
    disconnect: () => void;
    startSession: () => void;
    endSession: () => void;
    sendAudio: (audioData: string, mimeType?: string) => void;
    sendVideo: (videoData: string, mimeType?: string) => void;
    sendText: (text: string) => void;
}

export function useLiveApi(options: UseLiveAPIOptions = {}): UseLiveAPIReturn {
    const {
        wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
        onAudioResponse,
        onTextResponse,
        onInputTranscription,
        onOutputTranscription,
        onTurnComplete,
        onInterrupted,
        onError,
        onSessionStarted,
        onSessionClosed,
    } = options;

    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [clientId, setClientId] = useState<string | null>(null);

    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data);
            console.log('Received message:', message.type);

            switch (message.type) {
                case 'connected':
                    setClientId(message.data.clientId);
                    console.log('Connected with clientId:', message.data.clientId);
                    break;

                case 'session-started':
                    setIsSessionActive(true);
                    onSessionStarted?.();
                    console.log('Session started');
                    break;

                case 'session-closed':
                case 'session-ended':
                    setIsSessionActive(false);
                    onSessionClosed?.();
                    console.log('Session closed');
                    break;

                case 'setup-complete':
                    console.log('Live API setup complete');
                    break;

                case 'audio-response':
                    onAudioResponse?.(message.data.audio, message.data.mimeType);
                    break;

                case 'text-response':
                    onTextResponse?.(message.data.text);
                    break;

                case 'input-transcription':
                    onInputTranscription?.(message.data.text);
                    break;

                case 'output-transcription':
                    onOutputTranscription?.(message.data.text);
                    break;

                case 'turn-complete':
                    onTurnComplete?.();
                    break;

                case 'interrupted':
                    onInterrupted?.();
                    break;

                case 'error':
                    console.error('Server error:', message.data.message);
                    onError?.(message.data.message);
                    break;
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    }, [onAudioResponse, onTextResponse, onInputTranscription, onOutputTranscription, onTurnComplete, onInterrupted, onError, onSessionStarted, onSessionClosed]);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log('Already connected');
            return;
        }

        console.log('Connecting to:', wsUrl);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.onmessage = handleMessage;

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            onError?.('WebSocket connection error');
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setIsSessionActive(false);
            setClientId(null);
        };

        wsRef.current = ws;
    }, [wsUrl, handleMessage, onError]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setIsSessionActive(false);
        setClientId(null);
    }, []);

    const sendMessage = useCallback((type: string, data?: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ event: type, data: data || {} });
            wsRef.current.send(message);
        }
    }, []);

    const startSession = useCallback((config?: { systemInstruction?: string }) => {
        console.log('Starting session...');
        sendMessage('start-session', config);
    }, [sendMessage]);

    const endSession = useCallback(() => {
        sendMessage('end-session');
        setIsSessionActive(false);
    }, [sendMessage]);

    const sendAudio = useCallback((audioData: string, mimeType: string = 'audio/pcm;rate=16000') => {
        if (isSessionActive) {
            sendMessage('send-audio', { audio: audioData, mimeType });
        }
    }, [sendMessage, isSessionActive]);

    const sendVideo = useCallback((videoData: string, mimeType: string = 'image/jpeg') => {
        if (isSessionActive) {
            sendMessage('send-video', { video: videoData, mimeType });
        }
    }, [sendMessage, isSessionActive]);

    const sendText = useCallback((text: string) => {
        if (isSessionActive) {
            sendMessage('send-text', { text });
        }
    }, [sendMessage, isSessionActive]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        isSessionActive,
        clientId,
        connect,
        disconnect,
        startSession,
        endSession,
        sendAudio,
        sendVideo,
        sendText,
    };
}
