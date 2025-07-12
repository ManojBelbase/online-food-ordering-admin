import React, { useMemo, useCallback } from "react";
import { Table, Text } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface TableColumn {
  title: string;
  key: string;
  align?: "left" | "center" | "right";
  width?: number;
  sortable?: boolean;
}

interface TableBodyProps {
  data: any[];
  columns: TableColumn[];
  align?: "left" | "center" | "right";
  alternateRows?: boolean;
  onRowClick?: (row: any, index: number) => void;
  renderCell?: (column: TableColumn, row: any) => React.ReactNode;
  virtualized?: boolean;
  virtualHeight?: number;
  itemHeight?: number;
  scrollTop?: number;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
  data,
  columns,
  align,
  alternateRows = true,
  onRowClick,
  renderCell,
  virtualized = false,
  virtualHeight = 400,
  itemHeight = 50,
  scrollTop = 0,
  onScroll,
}) => {
  const { theme } = useTheme();

  const defaultRenderCell = useCallback((column: TableColumn, row: any) => {
    const value = row[column.key];
    return value;
  }, []);

  const cellRenderer = renderCell || defaultRenderCell;

  // Virtual scrolling calculations
  const visibleItems = useMemo(() => {
    if (!virtualized) return data;

    const containerHeight = virtualHeight;
    const totalItems = data.length;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      totalItems
    );

    return data.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
      virtualTop: (startIndex + index) * itemHeight,
    }));
  }, [data, virtualized, scrollTop, virtualHeight, itemHeight]);

  // Handle row click
  const handleRowClick = useCallback((row: any, index: number) => {
    onRowClick?.(row, index);
  }, [onRowClick]);

  if (virtualized) {
    // Virtualized table body
    return (
      <div
        style={{
          height: virtualHeight,
          overflowY: "auto",
          border: `1px solid ${theme.colors.border}`,
          borderTop: "none",
        }}
        onScroll={onScroll}
      >
        {data.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: theme.colors.textSecondary,
            }}
          >
            <Text c="dimmed">No data available</Text>
          </div>
        ) : (
          <div
            style={{
              height: data.length * itemHeight,
              position: "relative",
            }}
          >
            {visibleItems.map((row: any) => (
              <div
                key={row.id || row.virtualIndex}
                style={{
                  position: "absolute",
                  top: row.virtualTop,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                  display: "flex",
                  alignItems: "center",
                  borderBottom: `1px solid ${theme.colors.border}`,
                  backgroundColor:
                    alternateRows && row.virtualIndex % 2 === 0
                      ? theme.colors.surface
                      : "transparent",
                  cursor: onRowClick ? "pointer" : "default",
                }}
                onClick={() => handleRowClick(row, row.virtualIndex)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    alternateRows && row.virtualIndex % 2 === 0
                      ? theme.colors.surface
                      : "transparent";
                }}
              >
                {columns.map((column) => {
                  const columnAlign = align || column.align || "left";
                  return (
                    <div
                      key={column.key}
                      style={{
                        width: column.width || 150,
                        padding: "0 14px",
                        textAlign: columnAlign,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: theme.colors.textPrimary,
                      }}
                    >
                      {cellRenderer(column, row)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular table body
  return (
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
          <Table.Tr
            key={row.id || index}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
            onClick={() => handleRowClick(row, index)}
          >
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
                  {cellRenderer(column, row)}
                </Table.Td>
              );
            })}
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  );
};

export default TableBody;
