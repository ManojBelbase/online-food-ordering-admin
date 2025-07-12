// Performance configuration for high-scale applications
export const PERFORMANCE_CONFIG = {
  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    CACHE_TIME: 5 * 60 * 1000, // 5 minutes
    STALE_TIME: 2 * 60 * 1000, // 2 minutes
    BATCH_SIZE: 50, // Items per API call
  },

  // Virtual Scrolling
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 50,
    OVERSCAN: 5, // Extra items to render outside viewport
    BUFFER_SIZE: 10, // Items to keep in memory
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    MAX_PAGE_SIZE: 100,
    PREFETCH_PAGES: 1, // Number of pages to prefetch
  },

  // Debouncing
  DEBOUNCE: {
    SEARCH: 300, // ms
    RESIZE: 150, // ms
    SCROLL: 100, // ms
    INPUT: 200, // ms
  },

  // Memory Management
  MEMORY: {
    MAX_CACHE_SIZE: 100, // Maximum cached items
    CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
    MEMORY_THRESHOLD: 0.8, // 80% memory usage threshold
  },

  // Real-time Updates
  REALTIME: {
    WEBSOCKET_RECONNECT_DELAY: 3000, // 3 seconds
    HEARTBEAT_INTERVAL: 30000, // 30 seconds
    MAX_RECONNECT_ATTEMPTS: 5,
  },

  // Image Optimization
  IMAGES: {
    LAZY_LOAD_THRESHOLD: 100, // px from viewport
    PLACEHOLDER_BLUR: 10,
    QUALITY: 80,
    FORMATS: ['webp', 'jpg', 'png'],
  },

  // Bundle Optimization
  BUNDLE: {
    CHUNK_SIZE_WARNING: 500 * 1024, // 500KB
    ASSET_SIZE_WARNING: 250 * 1024, // 250KB
    ENABLE_TREE_SHAKING: true,
    ENABLE_CODE_SPLITTING: true,
  },
} as const;

// Environment-specific overrides
export const getPerformanceConfig = () => {
  const env = process.env.NODE_ENV;
  
  if (env === 'development') {
    return {
      ...PERFORMANCE_CONFIG,
      API: {
        ...PERFORMANCE_CONFIG.API,
        TIMEOUT: 60000, // Longer timeout for debugging
      },
      DEBOUNCE: {
        ...PERFORMANCE_CONFIG.DEBOUNCE,
        SEARCH: 100, // Faster feedback in dev
      },
    };
  }

  if (env === 'production') {
    return {
      ...PERFORMANCE_CONFIG,
      MEMORY: {
        ...PERFORMANCE_CONFIG.MEMORY,
        MAX_CACHE_SIZE: 200, // More cache in production
        CLEANUP_INTERVAL: 2 * 60 * 1000, // More frequent cleanup
      },
    };
  }

  return PERFORMANCE_CONFIG;
};

// Performance monitoring utilities
export const performanceUtils = {
  // Measure component render time
  measureRender: (componentName: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} render time: ${(end - start).toFixed(2)}ms`);
    }
  },

  // Measure API call time
  measureApiCall: async <T>(name: string, apiCall: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 API ${name} took: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`🚨 API ${name} failed after: ${(end - start).toFixed(2)}ms`, error);
      throw error;
    }
  },

  // Check memory usage
  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > PERFORMANCE_CONFIG.MEMORY.MEMORY_THRESHOLD * 100) {
        console.warn(`⚠️ High memory usage: ${usagePercent.toFixed(2)}%`);
        return { warning: true, usage: usagePercent };
      }
      
      return { warning: false, usage: usagePercent };
    }
    return null;
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },

  // Lazy load images
  lazyLoadImage: (src: string, _placeholder?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Preload critical resources
  preloadResource: (url: string, type: 'script' | 'style' | 'image' | 'font') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  },
};

// Bundle analyzer configuration
export const bundleConfig = {
  analyze: process.env.ANALYZE === 'true',
  generateReport: process.env.NODE_ENV === 'production',
  outputPath: './dist/bundle-analysis',
};
