import React, { useState, useMemo, useCallback } from "react";
import { Table, Paper, LoadingOverlay } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import TableBody from "./TableBody";
import TablePagination from "../TablePagination";
import type { FilterConfig } from "./TableFilter";
import TableHeader from "./TableHeader";
import TableFilter from "./TableFilter";
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
  apiMode?: boolean; // Enable API-based operations
  onApiSearch?: (query: string) => void; // API search handler
  onApiFilter?: (filters: Record<string, any>) => void; // API filter handler
  onApiSort?: (column: string, direction: "asc" | "desc") => void; // API sort handler
  currentSearch?: string; // Current search from API
  currentFilters?: Record<string, any>; // Current filters from API
  currentSort?: { column: string; direction: "asc" | "desc" }; // Current sort from API
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pagination,
  onPageChange,
  onLimitChange,
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
  const handleSort = useCallback((column: TableColumn) => {
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
  }, [sortColumn, sortDirection, isApiMode, onApiSort]);

  const handleSearch = useCallback((query: string) => {
    if (isApiMode && onApiSearch) {
      // API mode: Call API handler
      onApiSearch(query);
    } else {
      // Frontend mode: Update local state
      setSearchQuery(query);
    }
  }, [isApiMode, onApiSearch]);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    if (isApiMode && onApiFilter) {
      // API mode: Call API handler
      onApiFilter(newFilters);
    } else {
      // Frontend mode: Update local state
      setFilterValues(newFilters);
    }
    onFiltersChange?.(newFilters);
  }, [isApiMode, onApiFilter, onFiltersChange]);

  const toggleFilters = useCallback(() => {
    setFiltersVisible(!filtersVisible);
  }, [filtersVisible]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (virtualized) {
      setScrollTop(e.currentTarget.scrollTop);
    }
  }, [virtualized]);

  const processedData = useMemo(() => {
    if (isApiMode) {
      return { data, totalCount: data.length };
    }

    let result = [...data];

    if (searchQuery) {
      result = result.filter((row) =>
        columns.some((column) =>
          String(row[column.key] || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
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

    if (pagination && !virtualized) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      result = result.slice(startIndex, endIndex);
    }

    return { data: result, totalCount };
  }, [isApiMode, data, searchQuery, filterValues, sortColumn, sortDirection, columns, pagination, virtualized]);

  const filteredAndSortedData = processedData.data;
  const renderCell = useCallback((column: TableColumn, row: any) => {
    const value = row[column.key];
    return value;
  }, []);

  return (
    <Paper
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
      pos="relative"
    >
      <LoadingOverlay visible={loading} />
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

      {virtualized ? (
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
                fontWeight: 600,
              },
              td: {
                borderBottom: `1px solid ${theme.colors.border}`,
                color: theme.colors.textPrimary,
                backgroundColor: "transparent",
              },
              tr: {
                "&:nth-of-type(even)": alternateRows
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
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        filteredCount={processedData.totalCount}
        totalCount={data.length}
        virtualized={virtualized}
      />
    </Paper>
  );
};

export default DataTable;
