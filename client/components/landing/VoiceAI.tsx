"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle2, Sparkles, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAIProps {
  className?: string;
  onTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onStart?: () => void;
  onStop?: () => void;
}

type VoiceState = 'idle' | 'loading' | 'listening' | 'processing' | 'error';

export function VoiceAI({ className, onTranscript, onFinalTranscript, onStart, onStop }: VoiceAIProps) {
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  const [confidence, setConfidence] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const wordCountRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Check if Speech Recognition is available
  const isSpeechRecognitionAvailable = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }, []);

  // Initialize Speech Recognition
  const initializeRecognition = useCallback(() => {
    if (!isSpeechRecognitionAvailable()) {
      setState('error');
      setError('Speech Recognition tidak didukung di browser ini. Gunakan Chrome, Edge, atau Safari.');
      return null;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'id-ID'; // Indonesian language

    recognition.onstart = () => {
      setState('listening');
      setIsListening(true);
      if (onStart) onStart();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence || 0.8;
        
        setConfidence(confidence * 100);

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          wordCountRef.current += transcript.split(' ').length;
          if (onFinalTranscript) {
            onFinalTranscript(finalTranscript.trim());
          }
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript + interimTranscript;
      setTranscript(fullTranscript.trim());
      if (onTranscript) {
        onTranscript(fullTranscript.trim());
      }

      // Calculate words per minute
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
        if (elapsed > 0) {
          setWordsPerMinute(Math.round(wordCountRef.current / elapsed));
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setState('error');
      
      switch (event.error) {
        case 'no-speech':
          setError('Tidak ada suara terdeteksi. Coba berbicara lebih keras.');
          break;
        case 'audio-capture':
          setError('Tidak dapat mengakses microphone. Pastikan microphone terhubung dan diizinkan.');
          break;
        case 'not-allowed':
          setError('Akses microphone ditolak. Silakan izinkan akses microphone di pengaturan browser.');
          break;
        case 'network':
          setError('Gagal terhubung ke layanan speech recognition. Periksa koneksi internet.');
          break;
        default:
          setError('Terjadi kesalahan saat menggunakan speech recognition.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Don't auto-restart to avoid infinite loops
      // User can manually start again if needed
    };

    return recognition;
  }, [isSpeechRecognitionAvailable, onTranscript, onFinalTranscript, onStart, state]);

  // Initialize audio analysis
  const initializeAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start audio analysis loop
      const analyzeAudio = () => {
        if (!analyserRef.current) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          return;
        }

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencyData(dataArray);

        // Calculate average audio level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average);

        // Update time elapsed for variation
        if (startTimeRef.current) {
          setTimeElapsed((Date.now() - startTimeRef.current) / 1000);
        }

        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };

      analyzeAudio();
    } catch (err: any) {
      console.error('Audio analysis error:', err);
      // Don't set error state, just continue without audio visualization
    }
  }, []);

  // Start listening
  const startListening = useCallback(async () => {
    try {
      setState('loading');
      setError(null);
      setTranscript('');
      wordCountRef.current = 0;
      startTimeRef.current = Date.now();

      // Initialize and start recognition first
      const recognition = initializeRecognition();
      if (!recognition) {
        return;
      }

      recognitionRef.current = recognition;
      
      // Initialize audio analysis (non-blocking)
      initializeAudioAnalysis().catch(err => {
        console.error('Audio analysis initialization failed:', err);
        // Continue without audio visualization
      });

      // Start recognition
      recognition.start();
    } catch (err: any) {
      console.error('Start listening error:', err);
      setState('error');
      setError('Gagal mengaktifkan voice recognition. Pastikan microphone tersedia dan diizinkan.');
    }
  }, [initializeRecognition, initializeAudioAnalysis]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState('idle');
    setIsListening(false);
    setAudioLevel(0);
    setFrequencyData(new Uint8Array(32));
    setConfidence(0);
    setWordsPerMinute(0);
    setTimeElapsed(0);

    if (onStop) onStop();
  }, [onStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Voice Container */}
      <div className="relative w-full min-h-[400px] bg-black rounded-xl overflow-hidden border-2 border-indonesian-gold/30">
        <AnimatePresence mode="wait">
          {/* Idle State */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indonesian-gold/20 rounded-full blur-xl animate-pulse"></div>
                  <Mic className="w-20 h-20 text-indonesian-gold" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2"
              >
                AI Voice Assistant Ready
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center"
              >
                Klik tombol di bawah untuk memulai voice recognition
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startListening}
                className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Mulai Mendengarkan
              </motion.button>
            </motion.div>
          )}

          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {/* Particle Effects */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-indonesian-gold rounded-full"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0
                    }}
                    animate={{
                      y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      opacity: [0, 1, 0],
                      scale: [0, 2, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Sound Waves */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-20 h-20 border-2 border-indonesian-gold rounded-full"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-indonesian-gold/30 rounded-full blur-2xl animate-pulse"></div>
                <Volume2 className="w-16 h-16 text-indonesian-gold relative z-10 animate-pulse" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indonesian-gold font-medium"
              >
                Mengaktifkan microphone...
              </motion.p>
            </motion.div>
          )}

          {/* Listening State */}
          {state === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-6 sm:p-8"
            >
              {/* Gemini-style Pulsing Waves */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-64 h-64 rounded-full border-4 border-indonesian-gold"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeOut"
                    }}
                    style={{
                      borderWidth: '4px',
                      borderColor: `rgba(217, 119, 6, ${0.8 - i * 0.2})`
                    }}
                  />
                ))}
              </div>

              {/* Central Mic Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-indonesian-gold/40 rounded-full blur-2xl"></div>
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(217, 119, 6, 0.5)',
                        '0 0 40px rgba(217, 119, 6, 0.8)',
                        '0 0 20px rgba(217, 119, 6, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative bg-indonesian-gold/20 backdrop-blur-sm rounded-full p-8 border-4 border-indonesian-gold"
                  >
                    <Mic className="w-16 h-16 text-indonesian-gold" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Voice Level Bars */}
              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-1.5 items-end h-20 pointer-events-none">
                {[...Array(20)].map((_, i) => {
                  const baseLevel = audioLevel > 0 
                    ? (audioLevel / 255) * 100
                    : 5;
                  // Add variation to bars for visual interest
                  const variation = Math.sin(timeElapsed * 2 + i * 0.3) * 20;
                  const level = Math.max(5, Math.min(100, baseLevel + variation));
                  
                  return (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-indonesian-gold to-cyan-400 rounded-full"
                      animate={{
                        height: `${level}%`,
                        opacity: level > 15 ? 1 : 0.4
                      }}
                      transition={{
                        duration: 0.05,
                        ease: "easeOut"
                      }}
                    />
                  );
                })}
              </div>

              {/* Frequency Visualization */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                <div className="flex items-end justify-center gap-1 h-16">
                  {Array.from(frequencyData.slice(0, 32)).map((value, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-indonesian-gold to-cyan-400 rounded-t"
                      animate={{
                        height: `${(value / 255) * 100}%`,
                        opacity: value > 50 ? 1 : 0.5
                      }}
                      transition={{
                        duration: 0.05,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-indonesian-gold/30">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-indonesian-gold">
                    <Waves className="w-3 h-3" />
                    <span>AI Listening</span>
                  </div>
                  <div className="text-white/80">
                    Confidence: <span className="text-indonesian-gold font-bold">{confidence.toFixed(0)}%</span>
                  </div>
                  <div className="text-white/80">
                    WPM: <span className="text-indonesian-gold font-bold">{wordsPerMinute}</span>
                  </div>
                  <div className="text-white/80">
                    Level: <span className="text-indonesian-gold font-bold">{Math.round((audioLevel / 255) * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-500/30">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-xs text-green-400 font-medium">Listening</span>
              </div>

              {/* Transcript Display */}
              <div className="absolute bottom-20 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-indonesian-gold/30 max-h-32 overflow-y-auto"
                >
                  {transcript ? (
                    <p className="text-white text-sm leading-relaxed">{transcript}</p>
                  ) : (
                    <p className="text-gray-400 text-sm italic">Mendengarkan... Silakan berbicara</p>
                  )}
                </motion.div>
              </div>

              {/* Control Button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopListening}
                  className="p-4 bg-red-500/90 rounded-full border-4 border-white/30 shadow-lg hover:bg-red-600 transition-colors relative"
                  aria-label="Stop listening"
                >
                  <MicOff className="w-6 h-6 text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-red-500"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </motion.button>
              </div>

              {/* Color Overlay Gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  background: 'linear-gradient(45deg, rgba(217, 119, 6, 0.1), rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.1))'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "linear"
                }}
              />
            </motion.div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/90"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2 text-center"
              >
                Gagal Mengakses Microphone
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center max-w-md"
              >
                {error || 'Terjadi kesalahan saat mengakses microphone'}
              </motion.p>
              <div className="flex gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors"
                >
                  Coba Lagi
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setState('idle')}
                  className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Kembali
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

