import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
}

export const usePerformance = (componentName: string) => {
  const mountTime = useRef<number>(Date.now());
  const renderTime = useRef<number>(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    const metrics: PerformanceMetrics = {
      componentName,
      renderTime: endTime - renderTime.current,
      mountTime: endTime - mountTime.current,
    };

    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance [${componentName}]:`, metrics);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // sendToAnalytics(metrics);
    }
  });

  // Update render time on each render
  renderTime.current = Date.now();
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryInfo = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        };

        // Warn if memory usage is high
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn('⚠️ High memory usage detected:', usagePercent.toFixed(2) + '%');
        }

        return memoryInfo;
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};
