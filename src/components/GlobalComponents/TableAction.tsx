import React from "react";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface TableActionProps {
  onShow?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const TableAction: React.FC<TableActionProps> = ({
  onShow,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  const { theme } = useTheme();

  return (
    <Group gap="xs" justify="center">
      {showView && onShow && (
        <Tooltip label="View Details">
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={onShow}
            style={{
              backgroundColor: theme.colors.primary + "20",
              color: theme.colors.primary,
            }}
          >
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
      )}

      {showEdit && onEdit && (
        <Tooltip label="Edit">
          <ActionIcon
            variant="light"
            color="green"
            size="sm"
            onClick={onEdit}
            style={{
              backgroundColor: "#28a745" + "20",
              color: "#28a745",
            }}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
      )}

      {showDelete && onDelete && (
        <Tooltip label="Delete">
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={onDelete}
            style={{
              backgroundColor: "#dc3545" + "20",
              color: "#dc3545",
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
};

export default TableAction;
