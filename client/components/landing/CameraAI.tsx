"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Download, RotateCcw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraAIProps {
  className?: string;
  onCapture?: (imageDataUrl: string) => void;
}

type CameraState = 'idle' | 'loading' | 'active' | 'capturing' | 'preview' | 'error';

export function CameraAI({ className, onCapture }: CameraAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningLineRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [state, setState] = useState<CameraState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [hudData, setHudData] = useState({ confidence: 0, faces: 0, quality: 0 });

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setState('loading');
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setState('active');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setState('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('Kamera tidak ditemukan. Pastikan perangkat memiliki kamera yang terhubung.');
      } else {
        setError('Gagal mengakses kamera. Pastikan kamera tidak digunakan oleh aplikasi lain.');
      }
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState('idle');
    setCapturedImage(null);
    setScanProgress(0);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setState('capturing');
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simulate AI processing
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Simulate HUD data updates
    const hudInterval = setInterval(() => {
      setHudData({
        confidence: Math.min(95, Math.random() * 20 + 75),
        faces: Math.floor(Math.random() * 3) + 1,
        quality: Math.min(98, Math.random() * 15 + 85)
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      clearInterval(hudInterval);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      setState('preview');
      setScanProgress(100);
      
      if (onCapture) {
        onCapture(imageDataUrl);
      }
    }, 2000);
  }, [onCapture]);

  // Download captured image
  const downloadImage = useCallback(() => {
    if (!capturedImage) return;

    const link = document.createElement('a');
    link.download = `ai-capture-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage]);

  // Reset to camera view
  const resetCamera = useCallback(() => {
    setCapturedImage(null);
    setScanProgress(0);
    setState('active');
  }, []);

  // Scanning line animation
  useEffect(() => {
    if (state === 'active' && scanningLineRef.current) {
      const animate = () => {
        if (scanningLineRef.current) {
          const current = scanningLineRef.current.style.top || '0%';
          const next = (parseFloat(current) + 0.5) % 100;
          scanningLineRef.current.style.top = `${next}%`;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Camera Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-2 border-indonesian-gold/30">
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
                  <Camera className="w-20 h-20 text-indonesian-gold" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2"
              >
                AI Camera Ready
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center"
              >
                Klik tombol di bawah untuk memulai kamera
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Aktifkan Kamera
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
                {[...Array(20)].map((_, i) => (
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
                      scale: [0, 1.5, 0]
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

              {/* Light Rays */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px h-full bg-gradient-to-b from-transparent via-indonesian-gold/30 to-transparent"
                    style={{
                      left: `${20 + i * 15}%`,
                      transformOrigin: 'center'
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scaleX: [1, 3, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
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
                <Camera className="w-16 h-16 text-indonesian-gold relative z-10 animate-pulse" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indonesian-gold font-medium"
              >
                Mengaktifkan kamera...
              </motion.p>
            </motion.div>
          )}

          {/* Active Camera State */}
          {state === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0"
            >
              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scanning Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
                    {[...Array(100)].map((_, i) => (
                      <div
                        key={i}
                        className="border border-indonesian-gold/10"
                        style={{
                          animationDelay: `${i * 0.01}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Scanning Line */}
              <motion.div
                ref={scanningLineRef}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indonesian-gold to-transparent pointer-events-none z-10"
                style={{ top: '0%' }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(217, 119, 6, 0.5)',
                    '0 0 20px rgba(217, 119, 6, 0.8)',
                    '0 0 10px rgba(217, 119, 6, 0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Corner Brackets */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { top: '10%', left: '10%', borderTop: true, borderLeft: true },
                  { top: '10%', right: '10%', borderTop: true, borderRight: true },
                  { bottom: '10%', left: '10%', borderBottom: true, borderLeft: true },
                  { bottom: '10%', right: '10%', borderBottom: true, borderRight: true }
                ].map((corner, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 border-2 border-indonesian-gold"
                    style={{
                      top: corner.top,
                      left: corner.left,
                      right: corner.right,
                      bottom: corner.bottom,
                      borderTop: corner.borderTop ? '2px solid' : 'none',
                      borderLeft: corner.borderLeft ? '2px solid' : 'none',
                      borderRight: corner.borderRight ? '2px solid' : 'none',
                      borderBottom: corner.borderBottom ? '2px solid' : 'none',
                      borderColor: 'rgba(217, 119, 6, 0.8)'
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Pulse Glow Effect */}
              <motion.div
                className="absolute inset-0 border-4 border-indonesian-gold/30 pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-indonesian-gold/30">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-indonesian-gold">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Analysis</span>
                  </div>
                  <div className="text-white/80">
                    Confidence: <span className="text-indonesian-gold font-bold">{hudData.confidence.toFixed(0)}%</span>
                  </div>
                  <div className="text-white/80">
                    Quality: <span className="text-indonesian-gold font-bold">{hudData.quality.toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Color Overlay Gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  background: 'linear-gradient(45deg, rgba(217, 119, 6, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))'
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

              {/* Glitch Effect (Subtle) */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 48%, rgba(217, 119, 6, 0.3) 49%, rgba(217, 119, 6, 0.3) 51%, transparent 52%)'
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  x: ['-2px', '2px', '-2px']
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />

              {/* Control Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopCamera}
                  className="p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/80 transition-colors"
                  aria-label="Stop camera"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="p-4 bg-indonesian-gold rounded-full border-4 border-white/30 shadow-lg hover:bg-indonesian-gold/90 transition-colors relative"
                  aria-label="Capture photo"
                >
                  <Camera className="w-6 h-6 text-black" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-indonesian-gold"
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
            </motion.div>
          )}

          {/* Capturing State */}
          {state === 'capturing' && (
            <motion.div
              key="capturing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            >
              {/* Flash Effect */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />

              {/* Shutter Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 border-8 border-indonesian-gold rounded-full"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: [0, 1.2, 1], rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Processing Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-indonesian-gold/30 rounded-full blur-xl animate-pulse"></div>
                    <Sparkles className="w-12 h-12 text-indonesian-gold relative z-10 animate-spin" />
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-indonesian-gold font-medium"
                >
                  Memproses dengan AI...
                </motion.p>
                
                {/* Progress Bar */}
                <div className="mt-4 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indonesian-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview State */}
          {state === 'preview' && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />

              {/* Success Indicator */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm rounded-full p-2"
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </motion.div>

              {/* Action Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetCamera}
                  className="p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/80 transition-colors"
                  aria-label="Retake photo"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={downloadImage}
                  className="p-3 bg-indonesian-gold rounded-full text-black hover:bg-indonesian-gold/90 transition-colors"
                  aria-label="Download image"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
              </div>
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
                Gagal Mengakses Kamera
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center"
              >
                {error || 'Terjadi kesalahan saat mengakses kamera'}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors"
              >
                Coba Lagi
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

