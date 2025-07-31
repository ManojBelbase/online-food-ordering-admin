import React, { useState } from 'react';
import { Modal, Text, Stack, Group, Badge, Alert } from '@mantine/core';
import {  IconBulb, IconRocket } from '@tabler/icons-react';

interface PerformanceTip {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'loading' | 'runtime' | 'network' | 'memory';
}

const performanceTips: PerformanceTip[] = [
  {
    id: 'lazy-loading',
    title: 'Use Lazy Loading',
    description: 'Load components only when needed to reduce initial bundle size.',
    impact: 'high',
    category: 'loading'
  },
  {
    id: 'image-optimization',
    title: 'Optimize Images',
    description: 'Use WebP format and appropriate sizes for better loading times.',
    impact: 'medium',
    category: 'network'
  },
  {
    id: 'code-splitting',
    title: 'Implement Code Splitting',
    description: 'Split your code into smaller chunks that load on demand.',
    impact: 'high',
    category: 'loading'
  },
  {
    id: 'memoization',
    title: 'Use React.memo and useMemo',
    description: 'Prevent unnecessary re-renders of expensive components.',
    impact: 'medium',
    category: 'runtime'
  },
  {
    id: 'bundle-analysis',
    title: 'Analyze Bundle Size',
    description: 'Regularly check what\'s in your bundle and remove unused code.',
    impact: 'medium',
    category: 'loading'
  },
  {
    id: 'cdn-usage',
    title: 'Use CDN for Assets',
    description: 'Serve static assets from a CDN for faster global delivery.',
    impact: 'medium',
    category: 'network'
  },
  {
    id: 'service-worker',
    title: 'Implement Service Worker',
    description: 'Cache resources for offline access and faster repeat visits.',
    impact: 'high',
    category: 'network'
  },
  {
    id: 'memory-leaks',
    title: 'Prevent Memory Leaks',
    description: 'Clean up event listeners and subscriptions in useEffect cleanup.',
    impact: 'medium',
    category: 'memory'
  }
];

interface PerformanceTipsProps {
  opened: boolean;
  onClose: () => void;
}

const PerformanceTips: React.FC<PerformanceTipsProps> = ({ opened, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTips = selectedCategory === 'all' 
    ? performanceTips 
    : performanceTips.filter(tip => tip.category === selectedCategory);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'loading': return 'blue';
      case 'runtime': return 'green';
      case 'network': return 'orange';
      case 'memory': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconRocket size={20} />
          <Text fw={600}>Performance Optimization Tips</Text>
        </Group>
      }
      size="lg"
      styles={{
        content: { maxHeight: '80vh' },
        body: { maxHeight: '70vh', overflow: 'auto' }
      }}
    >
      <Stack gap="md">
        <Alert icon={<IconBulb size={16} />} color="blue" variant="light">
          These tips can help improve your app's performance. The current app already implements many of these optimizations!
        </Alert>

        {/* Category Filter */}
        <Group gap="xs">
          <Text size="sm" fw={500}>Filter by category:</Text>
          {['all', 'loading', 'runtime', 'network', 'memory'].map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'filled' : 'light'}
              color={category === 'all' ? 'gray' : getCategoryColor(category)}
              style={{ cursor: 'pointer', textTransform: 'capitalize' }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </Group>

        {/* Tips List */}
        <Stack gap="sm">
          {filteredTips.map(tip => (
            <div
              key={tip.id}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Group justify="space-between" align="flex-start" mb="xs">
                <Text fw={500} size="sm">{tip.title}</Text>
                <Group gap="xs">
                  <Badge size="xs" color={getCategoryColor(tip.category)}>
                    {tip.category}
                  </Badge>
                  <Badge size="xs" color={getImpactColor(tip.impact)}>
                    {tip.impact} impact
                  </Badge>
                </Group>
              </Group>
              <Text size="xs" c="dimmed">
                {tip.description}
              </Text>
            </div>
          ))}
        </Stack>

        {filteredTips.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No tips found for the selected category.
          </Text>
        )}

        <Alert color="green" variant="light">
          <Text size="sm" fw={500} mb="xs">✅ Already Implemented in This App:</Text>
          <Text size="xs">
            • Lazy loading with React.lazy()<br/>
            • Code splitting with Vite<br/>
            • Bundle optimization<br/>
            • Performance monitoring<br/>
            • Optimized build configuration
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );
};

// Hook to show performance tips
export const usePerformanceTips = () => {
  const [opened, setOpened] = useState(false);

  const showTips = () => setOpened(true);
  const hideTips = () => setOpened(false);

  return {
    opened,
    showTips,
    hideTips,
    PerformanceTipsModal: () => (
      <PerformanceTips opened={opened} onClose={hideTips} />
    )
  };
};

export default PerformanceTips;
