import { useState } from "react";
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
import TableHeader from "../Table/TableHeader";
import TableBody from "../Table/TableBody";
import TablePagination from "../Table/TablePagination";
import type { DataTableProps } from "../../types/ui";

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  pagination,
  onPageChange,
  onLimitChange,
  onSort,
  onRefresh,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  title,
  emptyMessage = "No data available",
  pageSize = 10,
  alternateRows = true,
}: DataTableProps<T>) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (!columns.find((col) => col.key === column)?.sortable) return;

    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

      {/* Header */}
      <div
        style={{
          padding: "16px",
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
            {onRefresh && (
              <ActionIcon
                variant="subtle"
                onClick={onRefresh}
                style={{ color: theme.colors.textSecondary }}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            )}
          </Group>
        </Flex>

        {searchable && (
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
                value={String(pagination?.limit || pageSize)}
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
        )}
      </div>

      {/* Table */}
      <Table.ScrollContainer minWidth={800}>
        <Table
          striped={alternateRows !== false}
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
              "&:nth-of-type(even)":
                alternateRows !== false
                  ? {
                      backgroundColor: theme.colors.backgroundTertiary,
                    }
                  : {},
              "&:hover": {
                backgroundColor: theme.colors.surfaceHover,
              },
            },
          }}
        >
          <TableHeader
            columns={columns}
            hasActions={actions && actions.length > 0}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody
            data={data}
            columns={columns}
            actions={actions}
            emptyMessage={emptyMessage}
            alternateRows={alternateRows}
          />
        </Table>
      </Table.ScrollContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </Paper>
  );
};

export default DataTable;
