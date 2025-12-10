"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, animate, easeOut } from "framer-motion";
import { cn } from "@/lib/utils";

// Simple image preloader hook
function useImagePreloader(images: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loaded = new Set<string>();

    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (mounted) {
            loaded.add(src);
            setLoadedImages(new Set(loaded));
          }
          resolve();
        };
        img.onerror = () => resolve(); // Don't block on error
        img.src = src;
      });
    };

    // Load images with a small delay between each to avoid overwhelming the browser
    const loadSequentially = async () => {
      for (let i = 0; i < images.length; i++) {
        await loadImage(images[i]);
        // Small delay between images
        if (i < images.length - 1) {
          await new Promise(r => setTimeout(r, 50));
        }
      }
      if (mounted) {
        setIsLoading(false);
      }
    };

    loadSequentially();

    return () => {
      mounted = false;
    };
  }, [images]);

  return { loadedImages, isLoading };
}

export interface ThreeDImageRingProps {
  /** Array of image URLs to display in the ring */
  images: string[];
  /** Container width in pixels (will be scaled) */
  width?: number;
  /** 3D perspective value */
  perspective?: number;
  /** Distance of images from center (z-depth) */
  imageDistance?: number;
  /** Initial rotation of the ring */
  initialRotation?: number;
  /** Animation duration for entrance */
  animationDuration?: number;
  /** Stagger delay between images */
  staggerDelay?: number;
  /** Hover opacity for non-hovered images */
  hoverOpacity?: number;
  /** Custom container className */
  containerClassName?: string;
  /** Custom ring className */
  ringClassName?: string;
  /** Custom image className */
  imageClassName?: string;
  /** Background color of the stage */
  backgroundColor?: string;
  /** Enable/disable drag functionality */
  draggable?: boolean;
  /** Animation ease for entrance */
  ease?: string;
  /** Breakpoint for mobile responsiveness (e.g., 768 for iPad mini) */
  mobileBreakpoint?: number;
  /** Scale factor for mobile (e.g., 0.7 for 70% size) */
  mobileScaleFactor?: number;
  /** Power for the drag end inertia animation (higher means faster stop) */
  inertiaPower?: number;
  /** Time constant for the drag end inertia animation (duration of deceleration in ms) */
  inertiaTimeConstant?: number;
  /** Multiplier for initial velocity when drag ends (influences initial "spin") */
  inertiaVelocityMultiplier?: number;
  /** Enable auto-rotation when not dragging */
  autoRotate?: boolean;
  /** Speed of auto-rotation (degrees per frame) */
  autoRotateSpeed?: number;
  /** Image size as percentage of container (0-1, e.g., 0.8 = 80%) */
  imageScale?: number;
  /** Gap between images in pixels */
  imageGap?: number;
}

export function ThreeDImageRing({
  images,
  width = 300,
  perspective = 2000,
  imageDistance = 500,
  initialRotation = 180,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  containerClassName,
  ringClassName,
  imageClassName,
  backgroundColor,
  draggable = true,
  ease = "easeOut",
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.8,
  inertiaPower = 0.8,
  inertiaTimeConstant = 300,
  inertiaVelocityMultiplier = 20,
  autoRotate = false,
  autoRotateSpeed = 0.2,
  imageScale = 0.75,
  imageGap = 20,
}: ThreeDImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const rotationY = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0);

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const angle = useMemo(() => 360 / images.length, [images.length]);
  
  // Preload images when component is in view
  const { loadedImages, isLoading } = useImagePreloader(isInView ? images : []);

  const getBgPos = (imageIndex: number, currentRot: number, scale: number) => {
    const scaledImageDistance = imageDistance * scale;
    const effectiveRotation = currentRot - 180 - imageIndex * angle;
    const parallaxOffset = ((effectiveRotation % 360 + 360) % 360) / 360;
    return `${-(parallaxOffset * (scaledImageDistance / 1.5))}px 0px`;
  };

  useEffect(() => {
    const unsubscribe = rotationY.on("change", (latestRotation) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((imgElement, i) => {
          (imgElement as HTMLElement).style.backgroundPosition = getBgPos(
            i,
            latestRotation,
            currentScale
          );
        });
      }
      currentRotationY.current = latestRotation;
    });
    return () => unsubscribe();
  }, [rotationY, images.length, imageDistance, currentScale, angle]);

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

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Only show images after they're loaded and in view
    if (isInView && !isLoading) {
      setShowImages(true);
    }
  }, [isInView, isLoading]);

  // Auto-rotation effect with throttled updates (30fps instead of 60fps)
  useEffect(() => {
    if (!autoRotate || isDragging.current) return;

    // Use setInterval with 33ms (30fps) instead of requestAnimationFrame (60fps) for better performance
    const intervalId = setInterval(() => {
      if (!isDragging.current) {
        const current = rotationY.get();
        rotationY.set(current + autoRotateSpeed);
        currentRotationY.current = current + autoRotateSpeed;
      }
    }, 33); // 30fps

    return () => {
      clearInterval(intervalId);
    };
  }, [autoRotate, autoRotateSpeed, rotationY]);

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!draggable) return;
    isDragging.current = true;
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
    rotationY.stop();
    velocity.current = 0;
    if (ringRef.current) {
      (ringRef.current as HTMLElement).style.cursor = "grabbing";
    }
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!draggable || !isDragging.current) return;

    const clientX = "touches" in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    const deltaX = clientX - startX.current;

    velocity.current = -deltaX * 0.5;

    rotationY.set(currentRotationY.current + velocity.current);

    startX.current = clientX;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    if (ringRef.current) {
      ringRef.current.style.cursor = "grab";
      currentRotationY.current = rotationY.get();
    }

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", handleDragEnd);

    const initial = rotationY.get();
    const velocityBoost = velocity.current * inertiaVelocityMultiplier;
    const target = initial + velocityBoost;

    animate(initial, target, {
      type: "inertia",
      velocity: velocityBoost,
      power: inertiaPower,
      timeConstant: inertiaTimeConstant,
      restDelta: 0.5,
      modifyTarget: (target) => Math.round(target / angle) * angle,
      onUpdate: (latest) => {
        rotationY.set(latest);
      },
    });

    velocity.current = 0;
  };

  const imageVariants = {
    hidden: { y: 200, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden select-none relative",
        containerClassName
      )}
      style={{
        backgroundColor,
        transform: `scale(${currentScale})`,
        transformOrigin: "center center",
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      {/* Loading indicator */}
      {isInView && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indonesian-gold/30 border-t-indonesian-gold rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading {loadedImages.size}/{images.length}
            </span>
          </div>
        </div>
      )}
      <div
        style={{
          perspective: `${perspective}px`,
          width: `${width}px`,
          height: `${width * 1.33}px`,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          ref={ringRef}
          className={cn(
            "w-full h-full absolute",
            ringClassName
          )}
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages && images.map((imageUrl, index) => {
              // Calculate scaled dimensions
              const scaledWidth = width * imageScale;
              const scaledHeight = width * 1.33 * imageScale;
              const offsetX = (width - scaledWidth) / 2;
              const offsetY = (width * 1.33 - scaledHeight) / 2;

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "absolute rounded-2xl overflow-hidden shadow-2xl border border-white/10",
                    imageClassName
                  )}
                  style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    left: `${offsetX}px`,
                    top: `${offsetY}px`,
                    transformStyle: "preserve-3d",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backfaceVisibility: "hidden",
                    rotateY: index * -angle,
                    z: -imageDistance * currentScale,
                    transformOrigin: `50% 50% ${imageDistance * currentScale}px`,
                    backgroundPosition: "center",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.1)",
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={imageVariants}
                  custom={index}
                  transition={{
                    delay: index * staggerDelay,
                    duration: animationDuration,
                    ease: easeOut,
                  }}
                  whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                  onHoverStart={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl, i) => {
                        if (i !== index) {
                          (imgEl as HTMLElement).style.opacity = `${hoverOpacity}`;
                        }
                      });
                    }
                  }}
                  onHoverEnd={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl) => {
                        (imgEl as HTMLElement).style.opacity = `1`;
                      });
                    }
                  }}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default ThreeDImageRing;
