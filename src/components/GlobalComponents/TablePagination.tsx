import React from "react";
import { Group, ActionIcon, Select } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomText } from "../ui";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TablePaginationProps {
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  filteredCount?: number;
  totalCount?: number;
  virtualized?: boolean;
  showPageSizeSelector?: boolean;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
  filteredCount = 0,
  totalCount = 0,
  virtualized = false,
  showPageSizeSelector = true,
}) => {
  const { theme } = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  if (virtualized) {
    // Virtualized mode info
    return (
      <div style={{
        padding: isMobile ? "12px" : "16px",
        borderTop: `1px solid ${theme.colors.border}`
      }}>
        <CustomText
          size={isMobile ? "xs" : "sm"}
          color="secondary"
          responsive
        >
          Showing {filteredCount} of {totalCount} entries
          {filteredCount !== totalCount && " (filtered)"}
          {!isMobile && " • Virtualized mode for optimal performance"}
        </CustomText>
      </div>
    );
  }

  // If no pagination is provided, render nothing
  if (!pagination) {
    return (
      <div style={{
        padding: isMobile ? "12px" : "16px",
        borderTop: `1px solid ${theme.colors.border}`
      }}>
        <CustomText
          size={isMobile ? "xs" : "sm"}
          color="secondary"
          responsive
        >
          Showing {filteredCount} of {totalCount} entries
          {filteredCount !== totalCount && " (filtered)"}
        </CustomText>
      </div>
    );
  }

  const { page, limit, total, totalPages } = pagination;
  const startItem = total > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum visible page numbers

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (page <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      padding: isMobile ? "12px" : "16px",
      borderTop: `1px solid ${theme.colors.border}`
    }}>
      <Group
        justify="space-between"
        align="center"
        gap={isMobile ? "xs" : "md"}
      >
        {/* Info Text */}
        <CustomText size="sm" color="secondary">
          Showing {startItem} to {endItem} of {total} entries
          {filteredCount !== totalCount && totalCount !== undefined && (
            <span> (filtered from {totalCount} total)</span>
          )}
        </CustomText>

        {/* Controls */}
        <Group gap="sm">
          {/* Page Size Selector */}
          {showPageSizeSelector && onLimitChange && (
            <Group gap="xs">
              <CustomText size="sm" color="secondary">Show:</CustomText>
              <Select
                data={[
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
                value={String(limit)}
                onChange={(value) => onLimitChange(Number(value))}
                size="xs"
                w={70}
                styles={{
                  input: {
                    backgroundColor: theme.colors.inputBackground,
                    borderColor: theme.colors.inputBorder,
                    color: theme.colors.inputText,
                  },
                }}
              />
            </Group>
          )}

          {/* Pagination Controls */}
          {onPageChange && (
            <Group gap="xs">
              {/* Previous Button */}
              <ActionIcon
                variant="subtle"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                style={{
                  color: page === 1 ? theme.colors.textSecondary : theme.colors.textPrimary,
                }}
              >
                <IconChevronLeft size={14} />
              </ActionIcon>

              {/* Page Numbers */}
              {pageNumbers.map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === "..." ? (
                    <CustomText size="sm" color="secondary" padding="0 8px">
                      ...
                    </CustomText>
                  ) : (
                    <ActionIcon
                      variant={pageNum === page ? "filled" : "subtle"}
                      size="sm"
                      onClick={() => onPageChange(pageNum as number)}
                      style={{
                        backgroundColor: pageNum === page ? theme.colors.primary : "transparent",
                        color: pageNum === page ? "white" : theme.colors.textPrimary,
                      }}
                    >
                      {pageNum}
                    </ActionIcon>
                  )}
                </React.Fragment>
              ))}

              {/* Next Button */}
              <ActionIcon
                variant="subtle"
                size="sm"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                style={{
                  color: page === totalPages ? theme.colors.textSecondary : theme.colors.textPrimary,
                }}
              >
                <IconChevronRight size={14} />
              </ActionIcon>
            </Group>
          )}
        </Group>
      </Group>
    </div>
  );
};

export default TablePagination;