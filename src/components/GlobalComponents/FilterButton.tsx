import React from "react";
import { IconFilter } from "@tabler/icons-react";
import { ActionButton } from "../ui";

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
      <IconFilter size={16} style={{ marginRight: '8px' }} />
      Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
    </ActionButton>
  );
};

export default FilterButton;
