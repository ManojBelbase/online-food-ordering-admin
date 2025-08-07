import React from "react";
import { Table, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../ui";

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

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

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
                width: column.width || (isMobile ? 100 : isTablet ? 120 : 150),
                padding: isMobile ? "8px" : isTablet ? "10px" : "14px",
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
                fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
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
                padding: isMobile ? "8px" : isTablet ? "10px" : "14px",
                fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
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
                <CustomText
                  fontWeight={600}
                  fontSize={isMobile ? "12px" : isTablet ? "13px" : "14px"}
                  responsive
                >
                  {column.title}
                </CustomText>
                {column.sortable && sortColumn === column.key && (
                  <CustomText size="sm">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </CustomText>
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
