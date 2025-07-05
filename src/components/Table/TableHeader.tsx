import { Table, Group, Text } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import type { TableColumn } from "../../types/ui";

interface TableHeaderProps<T = any> {
  columns: TableColumn<T>[];
  hasActions?: boolean;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
}

const TableHeader = <T extends Record<string, any>>({
  columns,
  hasActions = false,
  sortColumn,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) => {
  const { theme } = useTheme();

  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map((column) => (
          <Table.Th
            key={column.key}
            style={{
              width: column.width,
              textAlign: column.align || "left",
              cursor: column.sortable ? "pointer" : "default",
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.textPrimary,
              borderBottom: `1px solid ${theme.colors.border}`,
              fontWeight: 600,
            }}
            onClick={() => column.sortable && onSort?.(column.key)}
          >
            <Group
              gap="xs"
              justify={
                column.align === "center"
                  ? "center"
                  : column.align === "right"
                  ? "flex-end"
                  : "flex-start"
              }
            >
              <Text fw={600}>{column.label}</Text>
              {column.sortable &&
                sortColumn === column.key &&
                (sortDirection === "asc" ? (
                  <IconSortAscending size={14} />
                ) : (
                  <IconSortDescending size={14} />
                ))}
            </Group>
          </Table.Th>
        ))}
        {hasActions && (
          <Table.Th
            style={{
              width: 60,
              textAlign: "center",
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.textPrimary,
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <Text fw={600}>Actions</Text>
          </Table.Th>
        )}
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeader;
