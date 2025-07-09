import React from "react";
import { Table, Group, Text } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface TableColumn {
  title: string;
  key: string;
  align?: "left" | "center" | "right";
  width?: number;
  sortable?: boolean;
}

interface TableHeaderProps {
  columns: TableColumn[];
  align?: "left" | "center" | "right";
  onSort?: (column: TableColumn) => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc";
  virtualized?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  align,
  onSort,
  sortColumn,
  sortDirection,
  virtualized = false,
}) => {
  const { theme } = useTheme();

  if (virtualized) {
    return (
      <div
        style={{
          display: "flex",
          backgroundColor: theme.colors.backgroundSecondary,
          borderBottom: `2px solid ${theme.colors.border}`,
          fontWeight: 600,
        }}
      >
        {columns.map((column) => {
          const columnAlign = align || column.align || "left";
          return (
            <div
              key={column.key}
              style={{
                width: column.width || 150,
                padding: "14px",
                textAlign: columnAlign,
                cursor: column.sortable ? "pointer" : "default",
                borderRight: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.textPrimary,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: 
                  columnAlign === "center" ? "center" :
                  columnAlign === "right" ? "flex-end" : "flex-start",
              }}
              onClick={() => column.sortable && onSort?.(column)}
            >
              <span>{column.title}</span>
              {column.sortable && sortColumn === column.key && (
                <span style={{ marginLeft: "4px" }}>
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
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
              onClick={() => column.sortable && onSort?.(column)}
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
                {column.sortable && sortColumn === column.key && (
                  <Text size="sm">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </Text>
                )}
              </Group>
            </Table.Th>
          );
        })}
      </Table.Tr>
    </Table.Thead>
  );
};

export default TableHeader;
