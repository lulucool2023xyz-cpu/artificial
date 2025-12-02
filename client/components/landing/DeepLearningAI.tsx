"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, AlertCircle, CheckCircle2, Layers, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeepLearningAIProps {
  className?: string;
  onPrediction?: (result: any) => void;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

type DeepLearningState = 'idle' | 'loading' | 'processing' | 'complete' | 'error';

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  layer: number;
  value: number;
  connections: number[];
}

export function DeepLearningAI({ className, onPrediction, onComplete, onError }: DeepLearningAIProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<DeepLearningState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    loss: 0,
    epochs: 0,
    learningRate: 0,
    neurons: 0
  });
  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const [activeConnections, setActiveConnections] = useState<number[][]>([]);

  // Initialize neural network visualization
  const initializeNeuralNetwork = useCallback(() => {
    const layers = 4;
    const nodesPerLayer = [3, 5, 4, 2];
    const nodes: NeuralNode[] = [];
    const connections: number[][] = [];

    let nodeId = 0;
    nodesPerLayer.forEach((count, layerIndex) => {
      for (let i = 0; i < count; i++) {
        const x = (layerIndex + 1) * (100 / (layers + 1));
        const y = ((i + 1) * 100) / (count + 1);
        
        nodes.push({
          id: nodeId++,
          x,
          y,
          layer: layerIndex,
          value: Math.random(),
          connections: []
        });
      }
    });

    // Create connections between layers
    nodes.forEach((node, index) => {
      if (node.layer < layers - 1) {
        const nextLayerNodes = nodes.filter(n => n.layer === node.layer + 1);
        nextLayerNodes.forEach(nextNode => {
          connections.push([node.id, nextNode.id]);
        });
      }
    });

    setNeuralNodes(nodes);
    setActiveConnections(connections);
  }, []);

  // Animate neural network
  useEffect(() => {
    if (state !== 'processing' && state !== 'complete') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const animate = () => {
      if (state !== 'processing' && state !== 'complete') {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw connections
      activeConnections.forEach(([fromId, toId]) => {
        const fromNode = neuralNodes.find(n => n.id === fromId);
        const toNode = neuralNodes.find(n => n.id === toId);
        
        if (!fromNode || !toNode) return;

        const fromX = (fromNode.x / 100) * width;
        const fromY = (fromNode.y / 100) * height;
        const toX = (toNode.x / 100) * width;
        const toY = (toNode.y / 100) * height;

        // Animate connection strength
        const strength = Math.abs(Math.sin(Date.now() / 1000 + fromId + toId));
        const opacity = 0.3 + strength * 0.4;

        ctx.strokeStyle = `rgba(217, 119, 6, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      });

      // Draw nodes
      neuralNodes.forEach((node) => {
        const x = (node.x / 100) * width;
        const y = (node.y / 100) * height;
        
        // Animate node value
        const value = Math.abs(Math.sin(Date.now() / 500 + node.id));
        const radius = 8 + value * 4;

        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, `rgba(217, 119, 6, ${0.6 + value * 0.4})`);
        gradient.addColorStop(1, 'rgba(217, 119, 6, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw node
        ctx.fillStyle = `rgba(217, 119, 6, ${0.8 + value * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = `rgba(217, 119, 6, ${0.9 + value * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [state, neuralNodes, activeConnections]);

  // Start processing
  const startProcessing = useCallback(() => {
    try {
      setState('loading');
      setError(null);
      setProgress(0);
      setPrediction(null);
      setMetrics({
        accuracy: 0,
        loss: 0,
        epochs: 0,
        learningRate: 0,
        neurons: 0
      });

      // Initialize neural network
      initializeNeuralNetwork();

      // Simulate loading
      setTimeout(() => {
        setState('processing');
        
        // Simulate processing
        let currentProgress = 0;
        let currentEpoch = 0;
        let currentAccuracy = 0;
        let currentLoss = 1;

        processingIntervalRef.current = setInterval(() => {
          currentProgress += Math.random() * 3;
          currentEpoch += 1;
          currentAccuracy = Math.min(99.8, currentAccuracy + Math.random() * 2);
          currentLoss = Math.max(0.01, currentLoss - Math.random() * 0.05);

          setProgress(Math.min(100, currentProgress));
          setMetrics({
            accuracy: currentAccuracy,
            loss: currentLoss,
            epochs: currentEpoch,
            learningRate: 0.001 * (1 - currentProgress / 100),
            neurons: neuralNodes.length
          });

          // Update node values
          setNeuralNodes(prev => prev.map(node => ({
            ...node,
            value: Math.abs(Math.sin(Date.now() / 500 + node.id + currentProgress))
          })));

          if (currentProgress >= 100) {
            if (processingIntervalRef.current) {
              clearInterval(processingIntervalRef.current);
              processingIntervalRef.current = null;
            }

            // Generate prediction
            const result = {
              prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
              confidence: currentAccuracy,
              timestamp: new Date().toISOString(),
              metrics: {
                accuracy: currentAccuracy,
                loss: currentLoss,
                epochs: currentEpoch
              }
            };

            setPrediction(result);
            setState('complete');

            if (onComplete) {
              onComplete(result);
            }
            if (onPrediction) {
              onPrediction(result);
            }
          }
        }, 100);
      }, 1500);
    } catch (err: any) {
      console.error('Processing error:', err);
      setState('error');
      setError('Gagal memulai deep learning processing. Silakan coba lagi.');
      if (onError) {
        onError(err.message || 'Unknown error');
      }
    }
  }, [initializeNeuralNetwork, neuralNodes.length, onPrediction, onComplete, onError]);

  // Stop processing
  const stopProcessing = useCallback(() => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState('idle');
    setProgress(0);
    setPrediction(null);
    setMetrics({
      accuracy: 0,
      loss: 0,
      epochs: 0,
      learningRate: 0,
      neurons: 0
    });
  }, []);

  // Reset
  const reset = useCallback(() => {
    stopProcessing();
    setError(null);
    setNeuralNodes([]);
    setActiveConnections([]);
  }, [stopProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main Deep Learning Container */}
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
                  <Brain className="w-20 h-20 text-indonesian-gold" />
                </div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white mb-2"
              >
                AI Deep Learning Ready
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center"
              >
                Klik tombol di bawah untuk memulai deep learning processing
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startProcessing}
                className="px-6 py-3 bg-indonesian-gold text-black font-semibold rounded-lg hover:bg-indonesian-gold/90 transition-colors flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Mulai Processing
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
                {[...Array(40)].map((_, i) => (
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
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Neural Network Preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-32 h-32 border-4 border-indonesian-gold rounded-full"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.6, 0, 0.6],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 1,
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
                <Layers className="w-16 h-16 text-indonesian-gold relative z-10 animate-pulse" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-indonesian-gold font-medium"
              >
                Menginisialisasi neural network...
              </motion.p>
            </motion.div>
          )}

          {/* Processing State */}
          {(state === 'processing' || state === 'complete') && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-6 sm:p-8"
            >
              {/* Neural Network Canvas */}
              <div className="absolute inset-0 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.05) 0%, transparent 70%)'
                  }}
                />
              </div>

              {/* Processing Waves */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-64 h-64 border-2 border-indonesian-gold rounded-full"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              {/* Central Processing Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-indonesian-gold/40 rounded-full blur-2xl"></div>
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(217, 119, 6, 0.5)',
                        '0 0 60px rgba(217, 119, 6, 0.8)',
                        '0 0 30px rgba(217, 119, 6, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative bg-indonesian-gold/20 backdrop-blur-sm rounded-full p-8 border-4 border-indonesian-gold"
                  >
                    <Cpu className="w-16 h-16 text-indonesian-gold" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Data Flow Visualization */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                <div className="flex items-center justify-center gap-2">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-indonesian-gold rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-indonesian-gold/30">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-indonesian-gold mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="font-semibold">AI Processing</span>
                  </div>
                  <div className="text-white/80">
                    Accuracy: <span className="text-indonesian-gold font-bold">{metrics.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="text-white/80">
                    Loss: <span className="text-indonesian-gold font-bold">{metrics.loss.toFixed(4)}</span>
                  </div>
                  <div className="text-white/80">
                    Epochs: <span className="text-indonesian-gold font-bold">{metrics.epochs}</span>
                  </div>
                  <div className="text-white/80">
                    Learning Rate: <span className="text-indonesian-gold font-bold">{metrics.learningRate.toFixed(6)}</span>
                  </div>
                  <div className="text-white/80">
                    Neurons: <span className="text-indonesian-gold font-bold">{metrics.neurons}</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-indonesian-gold/30">
                <motion.div
                  className="w-2 h-2 bg-indonesian-gold rounded-full"
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
                <span className="text-xs text-indonesian-gold font-medium">
                  {state === 'processing' ? 'Processing' : 'Complete'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-20 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-indonesian-gold/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">Processing Progress</span>
                    <span className="text-sm text-indonesian-gold font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indonesian-gold to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Results Display */}
              {state === 'complete' && prediction && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-32 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-green-500/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-green-400">Prediction Complete</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-white/80">
                      Prediction: <span className="text-indonesian-gold font-bold">{prediction.prediction}</span>
                    </div>
                    <div className="text-white/80">
                      Confidence: <span className="text-indonesian-gold font-bold">{prediction.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Control Button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                {state === 'processing' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={stopProcessing}
                    className="p-3 bg-red-500/90 rounded-full border-4 border-white/30 shadow-lg hover:bg-red-600 transition-colors"
                    aria-label="Stop processing"
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </motion.button>
                )}
                {state === 'complete' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={reset}
                    className="p-3 bg-indonesian-gold rounded-full text-black hover:bg-indonesian-gold/90 transition-colors"
                    aria-label="Reset"
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                )}
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
                Processing Error
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm mb-6 text-center max-w-md"
              >
                {error || 'Terjadi kesalahan saat processing. Silakan coba lagi.'}
              </motion.p>
              <div className="flex gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startProcessing}
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
                  onClick={reset}
                  className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                >
                  Reset
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}






