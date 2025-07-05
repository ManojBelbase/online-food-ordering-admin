import React from "react";
import { Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";

interface FilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  activeFilterCount,
}) => {
  return (
    <Button
      variant={activeFilterCount > 0 ? "filled" : "light"}
      leftSection={<IconFilter size={16} />}
      onClick={onClick}
      size="sm"
      color={activeFilterCount > 0 ? "blue" : "gray"}
      style={{
        fontWeight: 500,
      }}
    >
      Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
    </Button>
  );
};

export default FilterButton;
