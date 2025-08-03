import React, { useState, useMemo, useCallback } from "react";
import { Table, Paper } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import TableBody from "./TableBody";
import TablePagination from "../TablePagination";
import type { FilterConfig } from "./TableFilter";
import TableHeader from "./TableHeader";
import TableFilter from "./TableFilter";
import TableShimmer from "./TableShimmer";
import { TableControls } from "..";

// Enhanced column interface
interface TableColumn {
  title: string;
  key: string;
  align?: "left" | "center" | "right";
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
}

// DataTable props
interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRefresh?: () => void;
  loading?: boolean;
  title?: string;
  searchPlaceholder?: string;
  alternateRows?: boolean;
  align?: "left" | "center" | "right";
  filters?: FilterConfig[];
  showFilters?: boolean;
  onFiltersChange?: (filters: Record<string, any>) => void;
  // 🚀 Virtualization props
  virtualized?: boolean;
  virtualHeight?: number;
  itemHeight?: number;
  onRowClick?: (row: any, index: number) => void;
  // 🎯 API Integration props
  apiMode?: boolean;
  onApiSearch?: (query: string) => void;
  onApiFilter?: (filters: Record<string, any>) => void;
  onApiSort?: (column: string, direction: "asc" | "desc") => void;
  currentSearch?: string;
  currentFilters?: Record<string, any>;
  currentSort?: { column: string; direction: "asc" | "desc" };
}

const DataTable: React.FC<DataTableProps> = ({
  data = [], // Default to empty array
  columns,
  pagination: externalPagination,
  onPageChange: externalOnPageChange,
  onLimitChange: externalOnLimitChange,
  onRefresh,
  loading = false,
  title,
  searchPlaceholder = "Search...",
  alternateRows = true,
  align,
  filters = [],
  showFilters = false,
  onFiltersChange,
  virtualized = false,
  virtualHeight = 400,
  itemHeight = 50,
  onRowClick,
  // 🎯 API Integration props
  apiMode = false,
  onApiSearch,
  onApiFilter,
  onApiSort,
  currentSearch = "",
  currentFilters = {},
  currentSort,
}) => {
  const { theme } = useTheme();

  // 🎯 Local pagination state for frontend mode
  const [localPage, setLocalPage] = useState(externalPagination?.page || 1);
  const [localLimit, setLocalLimit] = useState(externalPagination?.limit || 10);

  // Determine pagination settings
  const isFrontendMode = !apiMode;
  const pagination = useMemo(() => {
    if (apiMode && externalPagination) {
      // API mode: Use external pagination
      return externalPagination;
    }
    // Frontend mode: Calculate pagination based on data
    const total = data.length;
    const totalPages = Math.ceil(total / localLimit);
    return {
      page: localPage,
      limit: localLimit,
      total,
      totalPages,
    };
  }, [apiMode, externalPagination, data, localPage, localLimit]);

  // 🎯 Smart event handlers for pagination
  const handlePageChange = useCallback(
    (page: number) => {
      if (isFrontendMode) {
        setLocalPage(page);
      }
      externalOnPageChange?.(page);
    },
    [isFrontendMode, externalOnPageChange]
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      if (isFrontendMode) {
        setLocalLimit(limit);
        setLocalPage(1); // Reset to page 1 when limit changes
      }
      externalOnLimitChange?.(limit);
    },
    [isFrontendMode, externalOnLimitChange]
  );

  // 🎯 Smart state management - API mode vs Frontend mode
  const [searchQuery, setSearchQuery] = useState(apiMode ? currentSearch : "");
  const [sortColumn, setSortColumn] = useState<string | null>(
    apiMode ? currentSort?.column || null : null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    apiMode ? currentSort?.direction || "asc" : "asc"
  );
  const [filterValues, setFilterValues] = useState<Record<string, any>>(
    apiMode ? currentFilters : {}
  );
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  // Detect if we're in API mode
  const isApiMode = apiMode && (onApiSearch || onApiFilter || onApiSort);

  // 🎯 Smart event handlers - API mode vs Frontend mode
  const handleSort = useCallback(
    (column: TableColumn) => {
      if (!column.sortable) return;

      const newDirection =
        sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";

      if (isApiMode && onApiSort) {
        // API mode: Call API handler
        onApiSort(column.key, newDirection);
      } else {
        // Frontend mode: Update local state
        setSortColumn(column.key);
        setSortDirection(newDirection);
      }
    },
    [sortColumn, sortDirection, isApiMode, onApiSort]
  );

  const handleSearch = useCallback(
    (query: string) => {
      if (isApiMode && onApiSearch) {
        // API mode: Call API handler
        onApiSearch(query);
      } else {
        // Frontend mode: Update local state
        setSearchQuery(query);
        setLocalPage(1); // Reset to page 1 on search
      }
    },
    [isApiMode, onApiSearch]
  );

  const handleFiltersChange = useCallback(
    (newFilters: Record<string, any>) => {
      if (isApiMode && onApiFilter) {
        // API mode: Call API handler
        onApiFilter(newFilters);
      } else {
        // Frontend mode: Update local state
        setFilterValues(newFilters);
        setLocalPage(1); // Reset to page 1 on filter change
      }
      onFiltersChange?.(newFilters);
    },
    [isApiMode, onApiFilter, onFiltersChange]
  );

  const toggleFilters = useCallback(() => {
    setFiltersVisible(!filtersVisible);
  }, [filtersVisible]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (virtualized) {
        setScrollTop(e.currentTarget.scrollTop);
      }
    },
    [virtualized]
  );

  const processedData = useMemo(() => {
    if (isApiMode) {
      return { data, totalCount: data.length };
    }

    let result = [...data];

    // Apply search
    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((column) =>
          String(row[column.key] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        result = result.filter((row) => {
          let rowValue = row[key];
          if (React.isValidElement(rowValue)) {
            return true;
          }
          if (typeof value === "string" && typeof rowValue === "string") {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }
          return String(rowValue) === String(value);
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    const totalCount = result.length;

    // Apply pagination
    if (!virtualized) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      result = result.slice(startIndex, endIndex);
    }

    return { data: result, totalCount };
  }, [
    isApiMode,
    data,
    searchQuery,
    filterValues,
    sortColumn,
    sortDirection,
    columns,
    pagination,
    virtualized,
  ]);

  const filteredAndSortedData = processedData.data;

  // Custom renderCell to handle image rendering
  const renderCell = useCallback(
    (column: TableColumn, row: any) => {
      const value = row[column.key];
      const isImageField = ["image", "photo", "avatar", "icon"].some((key) =>
        column.key.toLowerCase().includes(key)
      );

      if (
        isImageField &&
        typeof value === "string" &&
        (value.startsWith("data:image") || value.startsWith("http") || value.startsWith("/"))
      ) {
        return (
          <img
            src={value}
            alt="img"
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        );
      }

      return value; 
    },
    []
  );

  return (
    <Paper
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
      pos="relative"
    >
      <TableControls
        title={title}
        searchPlaceholder={searchPlaceholder}
        searchQuery={isApiMode ? currentSearch : searchQuery}
        onSearchChange={handleSearch}
        onRefresh={onRefresh}
        loading={loading}
        filters={filters}
        filterValues={isApiMode ? currentFilters : filterValues}
        onToggleFilters={toggleFilters}
      />
      {filters.length > 0 && (
        <TableFilter
          filters={filters}
          visible={filtersVisible || showFilters}
          onFiltersChange={handleFiltersChange}
          appliedFilters={isApiMode ? currentFilters : filterValues}
        />
      )}

      {/* Show shimmer effect when loading or no data */}
      {loading || (!data || data.length === 0) ? (
        <TableShimmer
          columns={columns.length}
          rows={6}
          showHeader={true}
        />
      ) : virtualized ? (
        <div>
          <TableHeader
            columns={columns}
            align={align}
            onSort={handleSort}
            sortColumn={isApiMode ? currentSort?.column || null : sortColumn}
            sortDirection={isApiMode ? currentSort?.direction || "asc" : sortDirection}
            virtualized={true}
          />
          <TableBody
            data={filteredAndSortedData}
            columns={columns}
            align={align}
            alternateRows={alternateRows}
            onRowClick={onRowClick}
            renderCell={renderCell}
            virtualized={true}
            virtualHeight={virtualHeight}
            itemHeight={itemHeight}
            scrollTop={scrollTop}
            onScroll={handleScroll}
          />
        </div>
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table
            striped={false}
            highlightOnHover
            styles={{
              th: {
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.textPrimary,
                borderBottom: `1px solid ${theme.colors.border}`,
              },
              td: {
                borderBottom: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary,
                backgroundColor: "transparent",
              },
              tr: {
                "&:nthOfType(even)": alternateRows
                  ? { backgroundColor: theme.colors.surface }
                  : {},
                "&:hover": {
                  backgroundColor: `${theme.colors.primary}15 !important`,
                },
              },
            }}
          >
            <TableHeader
              columns={columns}
              align={align}
              onSort={handleSort}
              sortColumn={isApiMode ? currentSort?.column || null : sortColumn}
              sortDirection={isApiMode ? currentSort?.direction || "asc" : sortDirection}
              virtualized={false}
            />
            <TableBody
              data={filteredAndSortedData}
              columns={columns}
              align={align}
              alternateRows={alternateRows}
              onRowClick={onRowClick}
              renderCell={renderCell}
              virtualized={false}
            />
          </Table>
        </Table.ScrollContainer>
      )}
      <TablePagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        filteredCount={processedData.totalCount}
        totalCount={data.length}
        virtualized={virtualized}
      />
    </Paper>
  );
};

export default DataTable;