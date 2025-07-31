import React, { useEffect, useState } from 'react';
import { Text, Group, Badge, Stack } from '@mantine/core';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  memoryUsage?: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsVisible(true);
      
      const measurePerformance = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Get paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        // Get LCP if available
        let lcp = 0;
        if ('PerformanceObserver' in window) {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Get memory usage if available
        const memory = (performance as any).memory;
        
        const performanceMetrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstContentfulPaint: fcp?.startTime || 0,
          largestContentfulPaint: lcp,
          memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : undefined, // MB
        };

        setMetrics(performanceMetrics);
      };

      // Wait for page to fully load
      if (document.readyState === 'complete') {
        measurePerformance();
      } else {
        window.addEventListener('load', measurePerformance);
        return () => window.removeEventListener('load', measurePerformance);
      }
    }
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceColor = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return 'green';
    if (value <= thresholds.fair) return 'yellow';
    return 'red';
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack gap="xs">
        <Text size="sm" fw={600}>Performance Metrics</Text>
        
        <Group gap="xs">
          <Text size="xs">Load Time:</Text>
          <Badge 
            size="xs" 
            color={getPerformanceColor(metrics.loadTime, { good: 1000, fair: 3000 })}
          >
            {Math.round(metrics.loadTime)}ms
          </Badge>
        </Group>

        <Group gap="xs">
          <Text size="xs">DOM Ready:</Text>
          <Badge 
            size="xs" 
            color={getPerformanceColor(metrics.domContentLoaded, { good: 800, fair: 2000 })}
          >
            {Math.round(metrics.domContentLoaded)}ms
          </Badge>
        </Group>

        {metrics.firstContentfulPaint > 0 && (
          <Group gap="xs">
            <Text size="xs">FCP:</Text>
            <Badge 
              size="xs" 
              color={getPerformanceColor(metrics.firstContentfulPaint, { good: 1800, fair: 3000 })}
            >
              {Math.round(metrics.firstContentfulPaint)}ms
            </Badge>
          </Group>
        )}

        {metrics.largestContentfulPaint > 0 && (
          <Group gap="xs">
            <Text size="xs">LCP:</Text>
            <Badge 
              size="xs" 
              color={getPerformanceColor(metrics.largestContentfulPaint, { good: 2500, fair: 4000 })}
            >
              {Math.round(metrics.largestContentfulPaint)}ms
            </Badge>
          </Group>
        )}

        {metrics.memoryUsage && (
          <Group gap="xs">
            <Text size="xs">Memory:</Text>
            <Badge 
              size="xs" 
              color={getPerformanceColor(metrics.memoryUsage, { good: 50, fair: 100 })}
            >
              {Math.round(metrics.memoryUsage)}MB
            </Badge>
          </Group>
        )}

        <Text size="xs" c="dimmed" mt="xs">
          🟢 Good | 🟡 Fair | 🔴 Poor
        </Text>
      </Stack>
    </div>
  );
};

export default PerformanceMonitor;
