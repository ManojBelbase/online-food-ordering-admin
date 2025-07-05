import { ActionIcon, Menu } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import type { TableAction } from "../../types/ui";

interface TableActionsProps<T = any> {
  actions: TableAction<T>[];
  row: T;
  index: number;
}

const TableActions = <T extends Record<string, any>>({
  actions,
  row,
  index,
}: TableActionsProps<T>) => {
  const { theme } = useTheme();

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="subtle" size="sm">
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {actions.map((action, actionIndex) => (
          <Menu.Item
            key={actionIndex}
            leftSection={action.icon}
            onClick={() => action.onClick(row, index)}
            disabled={action.disabled?.(row)}
            color={action.color}
            styles={{
              item: {
                color:
                  action.color === "red"
                    ? theme.colors.error
                    : theme.colors.textPrimary,
                "&:hover": {
                  backgroundColor: theme.colors.surfaceHover,
                },
              },
            }}
          >
            {action.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default TableActions;
