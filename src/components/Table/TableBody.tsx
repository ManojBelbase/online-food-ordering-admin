import { Table, Text, Badge } from "@mantine/core";
import { useTheme } from "../../contexts/ThemeContext";
import TableActions from "./TableActions";
import type { TableColumn, TableAction } from "../../types/ui";

interface TableBodyProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  alternateRows?: boolean;
}

const TableBody = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  emptyMessage = "No data available",
  alternateRows = true,
}: TableBodyProps<T>) => {
  const { theme } = useTheme();

  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row, index);
    }

    // Default rendering based on value type
    if (typeof value === "boolean") {
      return (
        <Badge color={value ? "green" : "red"} variant="light">
          {value ? "Yes" : "No"}
        </Badge>
      );
    }

    if (value === null || value === undefined) {
      return <Text c="dimmed">-</Text>;
    }

    return <Text>{String(value)}</Text>;
  };

  return (
    <Table.Tbody>
      {data.length === 0 ? (
        <Table.Tr>
          <Table.Td
            colSpan={columns.length + (actions ? 1 : 0)}
            style={{
              textAlign: "center",
              padding: "40px",
              color: theme.colors.textSecondary,
            }}
          >
            <Text c="dimmed">{emptyMessage}</Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        data.map((row, index) => (
          <Table.Tr
            key={index}
            style={{
              backgroundColor:
                alternateRows && index % 2 === 1
                  ? theme.colors.backgroundTertiary
                  : "transparent",
              "&:hover": {
                backgroundColor: theme.colors.surfaceHover,
              },
            }}
          >
            {columns.map((column) => (
              <Table.Td
                key={column.key}
                style={{
                  textAlign: column.align || "left",
                  borderBottom: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textPrimary,
                }}
              >
                {renderCell(column, row, index)}
              </Table.Td>
            ))}
            {actions && actions.length > 0 && (
              <Table.Td
                style={{
                  textAlign: "center",
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                <TableActions actions={actions} row={row} index={index} />
              </Table.Td>
            )}
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  );
};

export default TableBody;
