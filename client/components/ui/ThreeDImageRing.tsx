"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useAnimation, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { detectDeviceCapability } from "@/utils/deviceCapability";

function useResponsiveWidth(width: number, mobileBreakpoint: number) {
  const [responsiveWidth, setResponsiveWidth] = useState(width);

  useEffect(() => {
    const updateWidth = () => {
      const isMobile = window.innerWidth < mobileBreakpoint;
      if (isMobile) {
        setResponsiveWidth(Math.min(width, window.innerWidth - 40));
      } else {
        setResponsiveWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [width, mobileBreakpoint]);

  return responsiveWidth;
}

export interface ThreeDImageRingProps {
  images: string[];
  width?: number;
  perspective?: number;
  imageDistance?: number;
  initialRotation?: number;
  animationDuration?: number;
  staggerDelay?: number;
  containerClassName?: string;
  ringClassName?: string;
  imageClassName?: string;
  backgroundColor?: string;
  draggable?: boolean;
  mobileBreakpoint?: number;
  mobileScaleFactor?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function ThreeDImageRing({
  images,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 0,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.8,
  autoRotate = true,
  autoRotateSpeed = 0.2,
}: ThreeDImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Motion values
  const rotationY = useMotionValue(initialRotation);
  // Smooth spring for rotation updates
  const smoothRotation = useSpring(rotationY, { damping: 20, stiffness: 100, mass: 1 });

  const isDragging = useRef<boolean>(false);
  const autoRotateRef = useRef<number | null>(null);

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const deviceCapability = useMemo(() => detectDeviceCapability(), []);
  const responsiveWidth = useResponsiveWidth(width, mobileBreakpoint);

  // Reduce initial image count for mobile/low-end devices
  const visibleImages = useMemo(() => {
    if (deviceCapability.isMobile) {
      return images.slice(0, Math.min(3, images.length));
    }
    if (deviceCapability.isLowEnd) {
      return images.slice(0, Math.min(5, images.length));
    }
    return images;
  }, [images, deviceCapability.isLowEnd, deviceCapability.isMobile]);

  const angle = useMemo(() => 360 / visibleImages.length, [visibleImages.length]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const newScale = viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
      setCurrentScale(newScale);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  // Entrance Animation Trigger
  useEffect(() => {
    setShowImages(true);
    rotationY.set(initialRotation); // Reset rotation on mount/change
  }, [initialRotation, rotationY]);

  // Auto Rotation Logic
  useEffect(() => {
    if (!autoRotate || isDragging.current) return;

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const current = rotationY.get();
      // Rotate slowly: speed * delta time adjustment
      rotationY.set(current - (autoRotateSpeed * (delta / 16)));

      autoRotateRef.current = requestAnimationFrame(animate);
    };

    autoRotateRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [autoRotate, autoRotateSpeed, rotationY]);

  // Drag Handlers
  const handleDragStart = () => {
    isDragging.current = true;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
    if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";

    // Add momentum
    const velocity = info.velocity.x;
    const currentRotation = rotationY.get();

    // Simple momentum implementation
    // For a robust inertia, we'd use animate() with type: 'inertia' but since we have autoRotate,
    // we just let it resume auto-rotation or settle. 
    // Let's settle it to the nearest image face if stopped, OR resume spin if it was a fling.

    // If it was a fast fling, maybe spin a bit then resume auto rotate
    // Currently Framer Motion pan works well with updating motion values directly.
  };

  const handlePan = (event: Event, info: PanInfo) => {
    const current = rotationY.get();
    // Adjust sensitivity
    rotationY.set(current + info.delta.x * 0.5);
  };

  const imageVariants = {
    hidden: { y: 200, opacity: 0, scale: 0.5 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * staggerDelay,
        duration: animationDuration,
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }),
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden select-none relative flex items-center justify-center cursor-grab",
        containerClassName
      )}
      style={{
        backgroundColor,
        perspective: `${perspective}px`,
        minHeight: deviceCapability.isMobile ? '350px' : '500px',
      }}
    >
      <motion.div
        className="w-full h-full relative"
        onPanStart={draggable ? handleDragStart : undefined}
        onPanEnd={draggable ? handleDragEnd : undefined}
        onPan={draggable ? handlePan : undefined}
        style={{
          width: deviceCapability.isMobile ? '100%' : `${responsiveWidth}px`,
          height: deviceCapability.isMobile ? '100%' : `${responsiveWidth}px`,
          position: "relative",
          transformStyle: "preserve-3d",
          rotateY: smoothRotation, // Use smooth spring rotation
          scale: currentScale,
        }}
        ref={ringRef}
      >
        <AnimatePresence>
          {showImages && visibleImages.map((imageUrl, index) => {
            const isLoaded = loadedImages.has(index);

            return (
              <motion.div
                key={`${index}-${imageUrl}`}
                className={cn(
                  "absolute left-0 top-0",
                  imageClassName
                )}
                style={{
                  width: '100%',
                  height: '100%',
                  transformStyle: "preserve-3d",
                  rotateY: index * angle, // Each image rotated around center
                  translateZ: imageDistance, // Pushed out from center
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden", // Hide back face for better performance/look
                }}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover={{
                  scale: 1.05,
                  y: -20,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Image Content */}
                <div
                  className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 relative"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    background: "#1a1a1a",
                  }}
                >
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl animate-pulse">
                      <div className="w-10 h-10 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {/* Actual Image */}
                  <img
                    src={imageUrl}
                    alt={`Gallery item ${index}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-500",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setLoadedImages(prev => new Set([...prev, index]))}
                    draggable={false}
                  />

                  {/* Reflection/Sheen Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none mix-blend-overlay" />

                  {/* Darkness overlay for depth effect (simple approximation) */}
                  {/* Ideally we'd calculate this based on rotation, but simple gradient helps depth */}
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ThreeDImageRing;
