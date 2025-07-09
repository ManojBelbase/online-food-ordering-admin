import React from "react";
import { TextInput, Group, Text, Flex, ActionIcon } from "@mantine/core";
import { IconSearch, IconRefresh } from "@tabler/icons-react";
import { useTheme } from "../../../contexts/ThemeContext";
import FilterButton from "../FilterButton";

interface TableControlsProps {
  title?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  loading?: boolean;
  filters?: any[];
  filterValues?: Record<string, any>;
  onToggleFilters?: () => void;
  showRefreshButton?: boolean;
  showSearchInput?: boolean;
}

const TableControls: React.FC<TableControlsProps> = ({
  title,
  searchPlaceholder = "Search...",
  searchQuery = "",
  onSearchChange,
  onRefresh,
  loading = false,
  filters = [],
  filterValues = {},
  onToggleFilters,
  showRefreshButton = true,
  showSearchInput = true,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: "14px",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <Flex justify="space-between" align="center" mb="md">
        {/* Title */}
        {title && (
          <Text
            size="lg"
            fw={600}
            style={{ color: theme.colors.textPrimary }}
          >
            {title}
          </Text>
        )}

        {/* Action Buttons */}
        <Group gap="xs">
          {/* Filter Button */}
          {filters.length > 0 && onToggleFilters && (
            <FilterButton
              onClick={onToggleFilters}
              activeFilterCount={Object.keys(filterValues).length}
            />
          )}

          {/* Refresh Button */}
          {showRefreshButton && onRefresh && (
            <ActionIcon
              variant="light"
              onClick={onRefresh}
              loading={loading}
              style={{
                color: theme.colors.primary,
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          )}
        </Group>
      </Flex>

      {/* Search Input */}
      {showSearchInput && onSearchChange && (
        <TextInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftSection={<IconSearch size={16} />}
          styles={{
            input: {
              backgroundColor: theme.colors.inputBackground,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.inputText,
            },
          }}
        />
      )}
    </div>
  );
};

export default TableControls;
