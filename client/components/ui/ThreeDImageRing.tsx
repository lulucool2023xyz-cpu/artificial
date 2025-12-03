"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, easeOut } from "framer-motion";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";
import { detectDeviceCapability } from "@/utils/deviceCapability";

// Hook untuk responsive width
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
}: ThreeDImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotationY = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0);

  const [currentScale, setCurrentScale] = useState(1);
  const [showImages, setShowImages] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const deviceCapability = useMemo(() => detectDeviceCapability(), []);
  const responsiveWidth = useResponsiveWidth(width, mobileBreakpoint);
  
  // Reduce initial image count for low-end devices
  const visibleImages = useMemo(() => {
    if (deviceCapability.isLowEnd) {
      // Only show first 6 images initially for low-end devices
      return images.slice(0, Math.min(6, images.length));
    }
    return images;
  }, [images, deviceCapability.isLowEnd]);

  const angle = useMemo(() => 360 / visibleImages.length, [visibleImages.length]);

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
    
    // Initialize background position on mount
    if (ringRef.current) {
      Array.from(ringRef.current.children).forEach((imgElement, i) => {
        (imgElement as HTMLElement).style.backgroundPosition = getBgPos(
          i,
          initialRotation,
          currentScale
        );
      });
    }
    
    return () => unsubscribe();
  }, [rotationY, images.length, imageDistance, currentScale, angle, initialRotation]);

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

  useEffect(() => {
    setShowImages(true);
    // Ensure initial rotation is set immediately
    rotationY.set(initialRotation);
  }, [initialRotation, rotationY]);

  // Update background positions when images are shown and scale is ready
  useEffect(() => {
    if (showImages && ringRef.current) {
      const updatePositions = () => {
        if (ringRef.current) {
          Array.from(ringRef.current.children).forEach((imgElement, i) => {
            (imgElement as HTMLElement).style.backgroundPosition = getBgPos(
              i,
              rotationY.get(),
              currentScale
            );
          });
        }
      };
      
      // Update immediately
      updatePositions();
      
      // Also update after a short delay to ensure DOM is ready
      const timeout = setTimeout(updatePositions, 50);
      return () => clearTimeout(timeout);
    }
  }, [showImages, currentScale, images.length, imageDistance, angle, rotationY]);

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
        minHeight: deviceCapability.isMobile ? '300px' : '400px',
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: deviceCapability.isMobile ? '100%' : `${responsiveWidth}px`,
          maxWidth: deviceCapability.isMobile ? '100%' : `${responsiveWidth}px`,
          height: deviceCapability.isMobile ? '100%' : `${responsiveWidth * 1.2}px`,
          maxHeight: deviceCapability.isMobile ? '100%' : `${responsiveWidth * 1.2}px`,
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
            {showImages && visibleImages.map((imageUrl, index) => {
              const isLoaded = loadedImages.has(index);
              
              return (
                <motion.div
                  key={index}
                  className={cn(
                    "w-full h-full absolute",
                    imageClassName
                  )}
                  style={{
                    transformStyle: "preserve-3d",
                    backgroundImage: isLoaded ? `url(${imageUrl})` : 'none',
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backfaceVisibility: "hidden",
                    rotateY: index * -angle,
                    z: -imageDistance * currentScale,
                    transformOrigin: `50% 50% ${imageDistance * currentScale}px`,
                    backgroundPosition: getBgPos(index, initialRotation, currentScale),
                    willChange: "transform, opacity",
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={imageVariants}
                  custom={index}
                  transition={{
                    delay: index * staggerDelay,
                    duration: deviceCapability.isLowEnd ? animationDuration * 0.7 : animationDuration,
                    ease: easeOut,
                  }}
                  whileHover={!deviceCapability.isLowEnd ? { opacity: 1, transition: { duration: 0.15 } } : undefined}
                  onHoverStart={() => {
                    if (isDragging.current || deviceCapability.isLowEnd) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl, i) => {
                        if (i !== index) {
                          (imgEl as HTMLElement).style.opacity = `${hoverOpacity}`;
                        }
                      });
                    }
                  }}
                  onHoverEnd={() => {
                    if (isDragging.current || deviceCapability.isLowEnd) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl) => {
                        (imgEl as HTMLElement).style.opacity = `1`;
                      });
                    }
                  }}
                  onAnimationComplete={() => {
                    // Lazy load image after animation starts
                    if (!isLoaded) {
                      const img = new Image();
                      img.onload = () => {
                        setLoadedImages(prev => new Set([...prev, index]));
                      };
                      img.src = imageUrl;
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
