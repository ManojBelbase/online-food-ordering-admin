import React from 'react';
import { Table, Skeleton, Box } from '@mantine/core';
import { useTheme } from '../../../contexts/ThemeContext';

interface TableShimmerProps {
  columns: number;
  rows?: number;
  showHeader?: boolean;
}

const TableShimmer: React.FC<TableShimmerProps> = ({ 
  columns, 
  rows = 5, 
  showHeader = true 
}) => {
  const { theme } = useTheme();

  const shimmerRows = Array.from({ length: rows }, (_, index) => (
    <Table.Tr key={index}>
      {Array.from({ length: columns }, (_, colIndex) => (
        <Table.Td key={colIndex} style={{ padding: '12px 16px' }}>
          <Skeleton 
            height={20} 
            radius="sm"
            animate={true}
            style={{
              background: `linear-gradient(90deg, 
                ${theme.colors.surface} 0%, 
                ${theme.colors.surfaceHover} 50%, 
                ${theme.colors.surface} 100%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  const headerRow = showHeader ? (
    <Table.Tr>
      {Array.from({ length: columns }, (_, colIndex) => (
        <Table.Th key={colIndex} style={{ padding: '12px 16px' }}>
          <Skeleton 
            height={16} 
            radius="sm"
            animate={true}
            style={{
              background: `linear-gradient(90deg, 
                ${theme.colors.surfaceHover} 0%, 
                ${theme.colors.border} 50%, 
                ${theme.colors.surfaceHover} 100%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </Table.Th>
      ))}
    </Table.Tr>
  ) : null;

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <Box style={{ position: 'relative', overflow: 'hidden' }}>
        <Table
          striped
          highlightOnHover
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {showHeader && (
            <Table.Thead
              style={{
                backgroundColor: theme.colors.surfaceHover,
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              {headerRow}
            </Table.Thead>
          )}
          <Table.Tbody>
            {shimmerRows}
          </Table.Tbody>
        </Table>
      </Box>
    </>
  );
};

export default TableShimmer;
