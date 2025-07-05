import React, { useState } from "react";
import {
  Table,
  TextInput,
  Select,
  Group,
  Text,
  Paper,
  Flex,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconRefresh } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import TableFilter, { type FilterConfig } from "./TableFilter";
import FilterButton from "./FilterButton";

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
  align?: "left" | "center" | "right"; // Global alignment for all columns
  filters?: FilterConfig[]; // Filter configurations
  showFilters?: boolean; // Whether to show filter section
  onFiltersChange?: (filters: Record<string, any>) => void; // Filter change callback
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
  align, // Global alignment prop
  filters = [], // Filter configurations
  showFilters = false, // Whether to show filter section
  onFiltersChange, // Filter change callback
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleSort = (column: TableColumn) => {
    if (!column.sortable) return;

    const newDirection =
      sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column.key);
    setSortDirection(newDirection);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilterValues(newFilters);
    onFiltersChange?.(newFilters);
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const renderCell = (column: TableColumn, row: any) => {
    const value = row[column.key];
    return value;
  };

  return (
    <Paper
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
      pos="relative"
    >
      <LoadingOverlay visible={loading} />

      <div
        style={{
          padding: "14px",
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <Flex justify="space-between" align="center" mb="md">
          {title && (
            <Text
              size="lg"
              fw={600}
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </Text>
          )}
          <Group gap="xs">
            {filters.length > 0 && (
              <FilterButton
                onClick={toggleFilters}
                activeFilterCount={Object.keys(filterValues).length}
              />
            )}
            {onRefresh && (
              <ActionIcon
                variant="light"
                onClick={onRefresh}
                style={{
                  color: theme.colors.primary,
                  backgroundColor: `${theme.colors.primary}15`,
                }}
                loading={loading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
        </Flex>

        <Group gap="md">
          <TextInput
            placeholder={searchPlaceholder}
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ flex: 1 }}
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
            }}
          />
          {onLimitChange && (
            <Select
              data={[
                { value: "10", label: "10 per page" },
                { value: "25", label: "25 per page" },
                { value: "50", label: "50 per page" },
                { value: "100", label: "100 per page" },
              ]}
              value={String(pagination?.limit || 10)}
              onChange={(value) => onLimitChange(Number(value))}
              w={140}
              styles={{
                input: {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
              }}
            />
          )}
        </Group>


      </div>

      {/* Filter Section */}
      {filters.length > 0 && (
        <TableFilter
          filters={filters}
          visible={filtersVisible || showFilters}
          onFiltersChange={handleFiltersChange}
          appliedFilters={filterValues}
        />
      )}

      {/* Table */}
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
                ? {
                    backgroundColor: theme.colors.surface,
                  }
                : {},
              "&:hover": {
                backgroundColor: `${theme.colors.primary}15 !important`,
              },
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => {
                const columnAlign = align || column.align || "left";
                return (
                  <Table.Th
                    key={column.key}
                    style={{
                      width: column.width,
                      textAlign: columnAlign,
                      cursor: column.sortable ? "pointer" : "default",
                      backgroundColor: theme.colors.backgroundSecondary,
                      color: theme.colors.textPrimary,
                      borderBottom: `1px solid ${theme.colors.border}`,
                      fontWeight: 600,
                      padding: "14px",
                    }}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <Group
                      gap="xs"
                      justify={
                        columnAlign === "center"
                          ? "center"
                          : columnAlign === "right"
                          ? "flex-end"
                          : "flex-start"
                      }
                    >
                      <Text fw={600}>{column.title}</Text>
                    </Group>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: theme.colors.textSecondary,
                    
                  }}
                >
                  <Text c="dimmed">No data available</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.map((row, index) => (
                <Table.Tr key={row.id || index}>
                  {columns.map((column) => {
                    const columnAlign = align || column.align || "left";
                    return (
                      <Table.Td
                        key={column.key}
                        style={{
                          textAlign: columnAlign,
                          borderBottom: `1px solid ${theme.colors.border}`,
                          color: theme.colors.textPrimary,
                          paddingInline: "14px",
                        }}
                      >
                        {renderCell(column, row)}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination */}
      {pagination && onPageChange && (
        <div style={{ padding: "16px", borderTop: `1px solid ${theme.colors.border}` }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} entries
            </Text>
            <Group gap="xs">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <ActionIcon
                  key={page}
                  variant={page === pagination.page ? "filled" : "subtle"}
                  onClick={() => onPageChange(page)}
                  size="sm"
                >
                  {page}
                </ActionIcon>
              ))}
            </Group>
          </Group>
        </div>
      )}
    </Paper>
  );
};

export default DataTable;
