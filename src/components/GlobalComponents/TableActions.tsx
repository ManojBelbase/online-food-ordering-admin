import React from "react";
import { Menu, ActionIcon, rem } from "@mantine/core";
import {
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconDownload,
  IconCopy,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

// Action item interface
export interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
  disabled?: boolean;
}

// TableActions props
interface TableActionsProps {
  actions: ActionItem[];
  size?: "xs" | "sm" | "md" | "lg";
}

const TableActions: React.FC<TableActionsProps> = ({
  actions,
  size = "sm",
}) => {
  const { theme } = useTheme();

  if (actions.length === 0) {
    return null;
  }

  return (
    <Menu shadow="md" width={180} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size={size}
          style={{
            color: theme.colors.textSecondary,
          }}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {actions.map((action, index) => {
          const isLastAction = index === actions.length - 1;
          const nextAction = !isLastAction ? actions[index + 1] : null;
          const shouldShowDivider = nextAction && nextAction.color === 'red';

          return (
            <React.Fragment key={action.key}>
              <Menu.Item
                leftSection={action.icon}
                onClick={action.onClick}
                disabled={action.disabled}
                color={action.color}
                style={{
                  color: action.color || theme.colors.textPrimary,
                  fontSize: rem(14),
                }}
              >
                {action.label}
              </Menu.Item>
              {/* Add divider before dangerous actions (red color) */}
              {shouldShowDivider && <Menu.Divider />}
            </React.Fragment>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

// Pre-defined action creators for common actions
export const createViewAction = (onClick: () => void): ActionItem => ({
  key: 'view',
  label: 'View Details',
  icon: <IconEye size={16} />,
  onClick,
});

export const createEditAction = (onClick: () => void): ActionItem => ({
  key: 'edit',
  label: 'Edit',
  icon: <IconEdit size={16} />,
  onClick,
});

export const createDeleteAction = (onClick: () => void): ActionItem => ({
  key: 'delete',
  label: 'Delete',
  icon: <IconTrash size={16} />,
  color: 'red',
  onClick,
});

export const createDownloadAction = (onClick: () => void): ActionItem => ({
  key: 'download',
  label: 'Download',
  icon: <IconDownload size={16} />,
  onClick,
});

export const createCopyAction = (onClick: () => void): ActionItem => ({
  key: 'copy',
  label: 'Copy',
  icon: <IconCopy size={16} />,
  onClick,
});

export default TableActions;
