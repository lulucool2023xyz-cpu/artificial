/**
 * Performance monitoring and metrics collection utility
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  loadTime?: number; // Page load time
}

let metrics: PerformanceMetrics = {};

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Measure FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = Math.round(entry.startTime);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.warn('FCP observer not supported', e);
  }

  // Measure LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      metrics.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP observer not supported', e);
  }

  // Measure FID (First Input Delay)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as any;
        metrics.fid = Math.round(fidEntry.processingStart - fidEntry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('FID observer not supported', e);
  }

  // Measure CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      metrics.cls = Math.round(clsValue * 1000) / 1000;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS observer not supported', e);
  }

  // Measure TTFB (Time to First Byte)
  if (performance.timing) {
    const timing = performance.timing;
    metrics.ttfb = timing.responseStart - timing.requestStart;
  }

  // Measure page load time
  window.addEventListener('load', () => {
    if (performance.timing) {
      const timing = performance.timing;
      metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    }
  });
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Log performance metrics to console (for debugging)
 */
export function logPerformanceMetrics() {
  console.group('📊 Performance Metrics');
  if (metrics.fcp) console.log(`First Contentful Paint: ${metrics.fcp}ms`);
  if (metrics.lcp) console.log(`Largest Contentful Paint: ${metrics.lcp}ms`);
  if (metrics.fid) console.log(`First Input Delay: ${metrics.fid}ms`);
  if (metrics.cls) console.log(`Cumulative Layout Shift: ${metrics.cls}`);
  if (metrics.ttfb) console.log(`Time to First Byte: ${metrics.ttfb}ms`);
  if (metrics.loadTime) console.log(`Page Load Time: ${metrics.loadTime}ms`);
  console.groupEnd();
}

/**
 * Check if performance is good based on Web Vitals thresholds
 */
export function isPerformanceGood(): boolean {
  const goodThresholds = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    ttfb: 800, // 800ms
  };

  if (metrics.fcp && metrics.fcp > goodThresholds.fcp) return false;
  if (metrics.lcp && metrics.lcp > goodThresholds.lcp) return false;
  if (metrics.fid && metrics.fid > goodThresholds.fid) return false;
  if (metrics.cls && metrics.cls > goodThresholds.cls) return false;
  if (metrics.ttfb && metrics.ttfb > goodThresholds.ttfb) return false;

  return true;
}







