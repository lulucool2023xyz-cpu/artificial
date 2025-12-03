/**
 * Device Capability Detection Utility
 * Detects device performance capabilities to optimize rendering
 */

import { useState, useEffect } from 'react';

// Type definition for NetworkInformation (not available in all browsers)
interface NetworkInformation {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
}

export interface DeviceCapability {
  isLowEnd: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  hardwareConcurrency: number;
  deviceMemory: number;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  recommendedQuality: 'low' | 'medium' | 'high';
}

let cachedCapability: DeviceCapability | null = null;

/**
 * Detect device capabilities
 */
export function detectDeviceCapability(): DeviceCapability {
  if (cachedCapability) {
    return cachedCapability;
  }

  const nav = navigator as any;
  const connection = (nav.connection || nav.mozConnection || nav.webkitConnection) as NetworkInformation | null;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const deviceMemory = (nav.deviceMemory as number) || 4; // GB, default to 4GB
  
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const gl2 = canvas.getContext('webgl2');
  const supportsWebGL = !!gl;
  const supportsWebGL2 = !!gl2;

  // Determine connection type
  let connectionType: DeviceCapability['connectionType'] = 'unknown';
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      connectionType = effectiveType as 'slow-2g' | '2g';
    } else if (effectiveType === '3g') {
      connectionType = '3g';
    } else if (effectiveType === '4g') {
      connectionType = '4g';
    }
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  // Determine if low-end device
  // Low-end criteria (more lenient for mobile):
  // - Very low memory (< 2GB) - not just mobile
  // - Very low hardware concurrency (< 2 cores)
  // - Very slow connection (slow-2g or 2g)
  // - No WebGL support
  // Note: Mobile devices with WebGL support should be allowed to run with reduced quality
  const isLowEnd = 
    deviceMemory < 2 || // Only very low memory devices
    hardwareConcurrency < 2 || // Only very low core count
    connectionType === 'slow-2g' ||
    connectionType === '2g' ||
    !supportsWebGL; // Remove pixelRatio > 2 check - modern mobile can handle it with lower quality

  // Determine recommended quality
  // Mobile devices should get medium quality by default (not low) to allow animations
  let recommendedQuality: 'low' | 'medium' | 'high' = 'high';
  if (isLowEnd || connectionType === 'slow-2g' || connectionType === '2g') {
    recommendedQuality = 'low';
  } else if (isMobile) {
    // Mobile devices with WebGL support should get medium quality
    recommendedQuality = 'medium';
  } else if (connectionType === '3g' || deviceMemory < 4) {
    recommendedQuality = 'medium';
  }

  cachedCapability = {
    isLowEnd,
    isMobile,
    supportsWebGL,
    supportsWebGL2,
    hardwareConcurrency,
    deviceMemory,
    connectionType,
    pixelRatio,
    screenWidth,
    screenHeight,
    recommendedQuality,
  };

  return cachedCapability;
}

/**
 * Check if device can handle heavy animations
 */
export function canHandleHeavyAnimations(): boolean {
  const capability = detectDeviceCapability();
  return !capability.isLowEnd && capability.recommendedQuality !== 'low';
}

/**
 * Check if device can handle WebGL/Three.js
 * More lenient for mobile - allow if WebGL is supported, even on mobile
 */
export function canHandleWebGL(): boolean {
  const capability = detectDeviceCapability();
  // Allow WebGL if supported, even on mobile (will use lower quality settings)
  return capability.supportsWebGL;
}

/**
 * Get recommended frame rate for animations
 */
export function getRecommendedFrameRate(): number {
  const capability = detectDeviceCapability();
  if (capability.isLowEnd) {
    return 30; // 30 FPS for low-end devices
  } else if (capability.recommendedQuality === 'medium') {
    return 45; // 45 FPS for medium devices
  }
  return 60; // 60 FPS for high-end devices
}

/**
 * Get recommended WebGL quality settings
 */
export function getWebGLQualitySettings() {
  const capability = detectDeviceCapability();
  
  if (capability.recommendedQuality === 'low') {
    return {
      pixelRatio: Math.min(capability.pixelRatio, 1),
      antialias: false,
      shadowMap: false,
      toneMapping: false,
      bloom: false,
    };
  } else if (capability.recommendedQuality === 'medium') {
    return {
      pixelRatio: Math.min(capability.pixelRatio, 1.5),
      antialias: false,
      shadowMap: false,
      toneMapping: true,
      bloom: false,
    };
  }
  
  return {
    pixelRatio: capability.pixelRatio,
    antialias: true,
    shadowMap: true,
    toneMapping: true,
    bloom: true,
  };
}

/**
 * React hook for device capability
 */
export function useDeviceCapability() {
  const [capability, setCapability] = useState<DeviceCapability | null>(null);

  useEffect(() => {
    setCapability(detectDeviceCapability());
    
    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      const handleConnectionChange = () => {
        cachedCapability = null; // Reset cache
        setCapability(detectDeviceCapability());
      };
      
      connection.addEventListener('change', handleConnectionChange);
      return () => connection.removeEventListener('change', handleConnectionChange);
    }
  }, []);

  return capability || detectDeviceCapability();
}

