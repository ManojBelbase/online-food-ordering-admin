import React from 'react';
import { Pagination, Text, Flex } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';
import type { PaginationInfo } from '../../types/ui';

interface TablePaginationProps {
  pagination: PaginationInfo;
  onPageChange?: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { theme } = useTheme();

  return (
    <div 
      style={{ 
        padding: '16px', 
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Flex justify="space-between" align="center">
        <Text 
          size="sm" 
          style={{ color: theme.colors.textSecondary }}
        >
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} entries
        </Text>
        <Pagination
          value={pagination.page}
          onChange={onPageChange}
          total={pagination.totalPages}
          size="sm"
          styles={{
            control: {
              '&[data-active]': {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            },
          }}
        />
      </Flex>
    </div>
  );
};

export default TablePagination;
