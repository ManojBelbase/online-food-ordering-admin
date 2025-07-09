import React, { useMemo, useCallback } from 'react';
import { Box, Text, LoadingOverlay } from '@mantine/core';
import { useTheme } from '../contexts/ThemeContext';

interface Column<T> {
  key: keyof T;
  header: string;
  width: number;
  render?: (value: any, item: T) => React.ReactNode;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  loading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

// Simple row component
const TableRow = React.memo<{
  item: any;
  index: number;
  columns: Column<any>[];
  onRowClick?: (item: any) => void;
  theme: any;
}>(({ item, index, columns, onRowClick, theme }) => {
  const handleClick = useCallback(() => {
    onRowClick?.(item);
  }, [item, onRowClick]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.border}`,
        cursor: onRowClick ? 'pointer' : 'default',
        backgroundColor: index % 2 === 0 ? theme.colors.surface : theme.colors.background,
        minHeight: '50px',
      }}
      onClick={handleClick}
    >
      {columns.map((column) => (
        <div
          key={String(column.key)}
          style={{
            width: column.width,
            padding: '8px 12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {column.render ? column.render(item[column.key], item) : String(item[column.key] || '')}
        </div>
      ))}
    </div>
  );
});

TableRow.displayName = 'TableRow';

export function OptimizedTable<T>({
  data,
  columns,
  height = 400,
  loading = false,
  onRowClick,
  className,
}: OptimizedTableProps<T>) {
  const { theme } = useTheme();



  if (loading) {
    return (
      <Box style={{ height, position: 'relative' }}>
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '8px',
        }}
      >
        <Text c="dimmed">No data available</Text>
      </Box>
    );
  }

  return (
    <Box className={className}>
      {/* Table Header */}
      <div
        style={{
          display: 'flex',
          backgroundColor: theme.colors.surface,
          borderBottom: `2px solid ${theme.colors.border}`,
          fontWeight: 600,
        }}
      >
        {columns.map((column: Column<T>) => (
          <div
            key={String(column.key)}
            style={{
              width: column.width,
              padding: '12px',
              borderRight: `1px solid ${theme.colors.border}`,
            }}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Table Body with Simple Scrolling */}
      <div
        style={{
          height: height - 50, // Account for header
          overflowY: 'auto',
          border: `1px solid ${theme.colors.border}`,
          borderTop: 'none',
        }}
      >
        {data.map((item, index) => (
          <TableRow
            key={index}
            item={item}
            index={index}
            columns={columns}
            onRowClick={onRowClick}
            theme={theme}
          />
        ))}
      </div>
    </Box>
  );
}

// Hook for optimized table data
export const useOptimizedTableData = <T,>(
  data: T[],
  searchTerm: string,
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' } | null
) => {
  return useMemo(() => {
    let filteredData = data;

    // Search filtering
    if (searchTerm) {
      filteredData = data.filter((item) =>
        Object.values(item as any).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sorting
    if (sortConfig) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig]);
};
