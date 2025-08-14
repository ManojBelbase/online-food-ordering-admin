import React, { useState } from "react";
import { Menu, ActionIcon, rem } from "@mantine/core";
import {
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconDownload,
  IconCopy,
  IconRefresh,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useTheme } from "../../contexts/ThemeContext";
import DeleteModal from "./DeleteModal";

export interface ActionItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface TableActionsProps {
  actions: ActionItem[];
  size?: "xs" | "sm" | "md" | "lg";
}



let setGlobalDeleteModalState: React.Dispatch<React.SetStateAction<any>> | null = null;

const TableActions: React.FC<TableActionsProps> = ({
  actions,
  size = "sm",
}) => {
  const { theme } = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const [deleteModalState, setDeleteModalState] = useState<{
    opened: boolean;
    itemName: string;
    onConfirm: () => void;
  } | null>(null);

  React.useEffect(() => {
    setGlobalDeleteModalState = setDeleteModalState;
  }, [deleteModalState]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <Menu
        shadow="md"
        width={isMobile ? 160 : 180}
        position="bottom-end"
      >
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            size={isMobile ? "xs" : size}
            style={{
              color: theme.colors.textSecondary,
            }}
          >
            <IconDots size={isMobile ? 14 : 16} />
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
                    fontSize: rem(isMobile ? 12 : 14),
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

      <DeleteModal
        opened={deleteModalState?.opened || false}
        itemName={deleteModalState?.itemName || ''}
        onClose={() => setDeleteModalState(null)}
        onConfirm={() => {
          deleteModalState?.onConfirm();
          setDeleteModalState(null);
        }}
      />


    </>
  );
};

// Pre-defined action creators for common actions
export const onView = (onClick: () => void): ActionItem => ({
  key: 'view',
  label: 'View Details',
  icon: <IconEye size={16} />,
  onClick,
});

export const onEdit = (onClick: () => void): ActionItem => ({
  key: 'edit',
  label: 'Edit',
  icon: <IconEdit size={16} />,
  onClick,
});

export const onDelete = (
  deleteFunction: (id: string) => Promise<any>,
  itemName: string,
  itemId: string
): ActionItem => ({
  key: 'delete',
  label: 'Delete',
  icon: <IconTrash size={16} />,
  color: 'red',
  onClick: () => {
    console.log('Delete clicked for item:', itemName);
    if (setGlobalDeleteModalState) {
      setGlobalDeleteModalState({
        opened: true,
        itemName,
        onConfirm: async () => {
          await deleteFunction(itemId);
        },
      });
    }
  },
});


export const createDeleteAction = (onClick: () => void): ActionItem => ({
  key: 'delete',
  label: 'Delete',
  icon: <IconTrash size={16} />,
  color: 'red',
  onClick,
});


export const onDownload = (onClick: () => void): ActionItem => ({
  key: 'download',
  label: 'Download',
  icon: <IconDownload size={16} />,
  onClick,
});

export const onCopy = (onClick: () => void): ActionItem => ({
  key: 'copy',
  label: 'Copy',
  icon: <IconCopy size={16} />,
  onClick,
});

export const onStatusChange = (onClick: () => void): ActionItem => ({
  key: 'status-change',
  label: 'Change Status',
  icon: <IconRefresh size={16} />,
  onClick,
});

export default TableActions;
