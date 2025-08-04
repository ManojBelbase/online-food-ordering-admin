import React from "react";
import { IconFilter } from "@tabler/icons-react";
import { ActionButton } from "../ui";
import { Tooltip } from "@mantine/core";

interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  activeFilterCount,
}) => {
  return (
    <ActionButton
      variant={activeFilterCount > 0 ? "primary" : "ghost"}
      onClick={onClick}
      size="sm"
      fontWeight={500}
    >
      <Tooltip label="Filter">
        <IconFilter size={16} style={{ marginRight: '8px' }}  />
      </Tooltip>
       {activeFilterCount > 0 && `(${activeFilterCount})`}

       
    </ActionButton>
  );
};

export default FilterButton;
